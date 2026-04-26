#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');

function loadBrowserScript(file, context) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  vm.runInNewContext(source, context, { filename: file });
}

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function readGuideHtml(href) {
  const relative = href.replace(/^\/+/, '').replace(/\/+$/, '');
  return fs.readFileSync(path.join(root, relative, 'index.html'), 'utf8');
}

const context = { window: {}, console };
context.window.window = context.window;

loadBrowserScript('assets/js/guide-data.js', context);

const guides = (context.window.MONAIDE_GUIDE_DATA || {}).items || [];
const warnings = [];
const errors = [];

guides.forEach((guide) => {
  const html = readGuideHtml(guide.href);
  const normalizedHtml = normalize(html);

  if (!normalizedHtml.includes(normalize(guide.title))) {
    warnings.push(`${guide.id}: le titre structuré n'apparaît pas clairement dans la page`);
  }

  if (!/<title>[^<]+<\/title>/i.test(html)) {
    errors.push(`${guide.id}: balise <title> absente`);
  }

  if (!/meta name="description"/i.test(html)) {
    errors.push(`${guide.id}: meta description absente`);
  }

  if (!/https:\/\/www\.vd\.ch|https:\/\/www\.caisseavsvaud\.ch|https:\/\/www\.ahv-iv\.ch|https:\/\/csp\.ch|https:\/\/www\.prosenectute\.ch|https:\/\/www\.proinfirmis\.ch|https:\/\/www\.evam\.ch/i.test(html)) {
    warnings.push(`${guide.id}: aucune source officielle évidente détectée dans la page`);
  }

  if (/dettes-budget|revenu-insertion|plus-assez-pour-vivre|separation-vaud|permis-sejour-vaud/.test(guide.id)) {
    if (!/ne reste pas seul|n hesite pas a demander de l aide|garde .*papiers|garde .*courriers/i.test(normalizedHtml)) {
      warnings.push(`${guide.id}: rappel humain/documentaire sensible non détecté`);
    }
  }
});

console.log(`Éditorial guides: ${guides.length} pages contrôlées`);

if (warnings.length) {
  console.log(`Avertissements: ${warnings.length}`);
  warnings.slice(0, 30).forEach((warning) => console.log(`- ${warning}`));
  if (warnings.length > 30) console.log(`- ... ${warnings.length - 30} autres avertissements`);
}

if (errors.length) {
  console.error(`Erreurs: ${errors.length}`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Éditorial OK: base SEO et repères de qualité présents.');
