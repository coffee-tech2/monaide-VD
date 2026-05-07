#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');

function loadBrowserScript(file, context) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  vm.runInNewContext(source, context, { filename: file });
}

function hasMatch(html, regex) {
  return regex.test(html);
}

function readHtml(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function normalize(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTagContent(html, regex) {
  const match = html.match(regex);
  return normalize(match && match[1]);
}

function checkMetaBasics(label, html, expectedCanonical, errors, warnings) {
  const title = extractTagContent(html, /<title>([^<]+)<\/title>/i);
  const description = extractTagContent(html, /<meta\s+name="description"\s+content="([^"]+)"/i);

  if (!title || title.length < 10) {
    errors.push(`${label}: balise <title> absente ou trop courte`);
  }
  if (title && title.length > 65) {
    warnings.push(`${label}: title potentiellement trop long (${title.length} caractères)`);
  }
  if (!description || description.length < 40) {
    errors.push(`${label}: meta description absente ou trop courte`);
  }
  if (description && description.length > 160) {
    warnings.push(`${label}: meta description potentiellement trop longue (${description.length} caractères)`);
  }
  if (!hasMatch(html, /<link\s+rel="canonical"\s+href="[^"]+"/i)) {
    errors.push(`${label}: canonical absente`);
  } else if (expectedCanonical && !html.includes(`href="${expectedCanonical}"`)) {
    warnings.push(`${label}: canonical différente de l’URL attendue`);
  }
  if (!hasMatch(html, /<meta\s+property="og:title"\s+content="[^"]+"/i)) {
    warnings.push(`${label}: og:title absent`);
  }
  if (!hasMatch(html, /<meta\s+property="og:description"\s+content="[^"]+"/i)) {
    warnings.push(`${label}: og:description absent`);
  }
  if (!hasMatch(html, /<script\s+type="application\/ld\+json">/i)) {
    warnings.push(`${label}: aucun JSON-LD détecté`);
  }
}

function extractGuideItemListInfo(html) {
  const match = html.match(/"@type":\s*"ItemList"[\s\S]*?"itemListElement":\s*\[([\s\S]*?)\]\s*}/);
  if (!match) return [];
  const block = match[1];
  const items = [];
  const regex = /"url":\s*"([^"]+)"[\s\S]*?"name":\s*"([^"]+)"/g;
  let current;
  while ((current = regex.exec(block)) !== null) {
    items.push({
      url: current[1],
      name: current[2]
    });
  }
  return items;
}

const context = { window: {}, console };
context.window.window = context.window;

loadBrowserScript('assets/js/guide-data.js', context);

const guideData = (context.window.MONAIDE_GUIDE_DATA || {}).items || [];
const errors = [];
const warnings = [];

const homePath = path.join(root, 'index.html');
const guidesIndexPath = path.join(root, 'guides', 'index.html');

checkMetaBasics('accueil', readHtml(homePath), 'https://monaide-vaud.ch/', errors, warnings);
checkMetaBasics('guides/index', readHtml(guidesIndexPath), 'https://monaide-vaud.ch/guides/', errors, warnings);

guideData.forEach((guide) => {
  const relative = guide.href.replace(/^\/+/, '').replace(/\/+$/, '');
  const filePath = path.join(root, relative, 'index.html');
  if (!fs.existsSync(filePath)) {
    errors.push(`${guide.id}: page guide manquante pour contrôle métadonnées`);
    return;
  }
  checkMetaBasics(guide.id, readHtml(filePath), `https://monaide-vaud.ch${guide.href}`, errors, warnings);
});

const guideIndexHtml = readHtml(guidesIndexPath);
const itemList = extractGuideItemListInfo(guideIndexHtml);
if (!itemList.length) {
  errors.push('guides/index: impossible de lire la liste ItemList JSON-LD');
} else {
  guideData.forEach((guide) => {
    const expectedUrl = `https://monaide-vaud.ch${guide.href}`;
    const found = itemList.find((item) => item.url === expectedUrl);
    if (!found) {
      errors.push(`guides/index: ${guide.id} absent de l’ItemList JSON-LD`);
      return;
    }
    if (normalize(found.name) !== normalize(guide.title)) {
      warnings.push(`guides/index: titre JSON-LD différent pour ${guide.id}`);
    }
  });
}

console.log(`Métadonnées: ${guideData.length + 2} pages contrôlées`);

if (warnings.length) {
  console.log(`Avertissements: ${warnings.length}`);
  warnings.slice(0, 25).forEach((warning) => console.log(`- ${warning}`));
  if (warnings.length > 25) console.log(`- ... ${warnings.length - 25} autres avertissements`);
}

if (errors.length) {
  console.error(`Erreurs: ${errors.length}`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Métadonnées OK: base SEO et cohérence guides/index validées.');
