#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');

function loadBrowserScript(file, context) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  vm.runInNewContext(source, context, { filename: file });
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isExternal(url) {
  return /^(https?:)?\/\//.test(url) || /^(mailto|tel):/.test(url);
}

function localPathForUrl(url) {
  if (!url || isExternal(url) || url.startsWith('#')) return null;
  const clean = url.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return null;
  const relative = clean.replace(/^\/+/, '');
  if (!relative) return path.join(root, 'index.html');
  if (relative.endsWith('/')) return path.join(root, relative, 'index.html');
  return path.join(root, relative);
}

function checkInternalLink(item, link, errors) {
  const target = localPathForUrl(link && link.url);
  if (!target) return;
  if (!fs.existsSync(target)) {
    errors.push(`${item.id}: lien interne introuvable "${link.url}"`);
  }
}

const context = {
  window: {},
  console
};
context.window.window = context.window;

loadBrowserScript('assets/js/config.js', context);
loadBrowserScript('assets/js/catalog-data.js', context);

const items = context.window.MONAIDE_CATALOG_ITEMS || [];
const errors = [];
const warnings = [];
const seen = new Set();

items.forEach((item, index) => {
  const label = item && item.id ? item.id : `item#${index + 1}`;

  if (!item || typeof item !== 'object') {
    errors.push(`${label}: fiche invalide`);
    return;
  }

  if (!hasText(item.id)) errors.push(`${label}: id manquant`);
  if (seen.has(item.id)) errors.push(`${label}: id en doublon`);
  seen.add(item.id);

  ['title', 'category', 'summary', 'audience', 'purpose', 'bodyIntro'].forEach((field) => {
    if (!hasText(item[field])) errors.push(`${label}: champ "${field}" manquant ou vide`);
  });

  ['highlights', 'firstSteps', 'sections', 'links'].forEach((field) => {
    if (!Array.isArray(item[field]) || item[field].length === 0) {
      errors.push(`${label}: liste "${field}" manquante ou vide`);
    }
  });

  (item.sections || []).forEach((section, sectionIndex) => {
    if (!hasText(section.title)) errors.push(`${label}: section ${sectionIndex + 1} sans titre`);
    if (!Array.isArray(section.items) || section.items.length === 0) {
      errors.push(`${label}: section "${section.title || sectionIndex + 1}" sans éléments`);
    }
  });

  (item.links || []).forEach((link, linkIndex) => {
    if (!hasText(link.label) || !hasText(link.url)) {
      errors.push(`${label}: lien ${linkIndex + 1} incomplet`);
      return;
    }
    checkInternalLink(item, link, errors);
  });

  if (!hasText(item.reviewedAt)) warnings.push(`${label}: reviewedAt absent`);
  if (!hasText(item.decisionBy)) warnings.push(`${label}: decisionBy absent`);
});

if (!items.length) errors.push('Aucune fiche catalogue trouvée');

console.log(`Catalogue: ${items.length} fiches contrôlées`);

if (warnings.length) {
  console.log(`Avertissements: ${warnings.length}`);
  warnings.slice(0, 20).forEach((warning) => console.log(`- ${warning}`));
  if (warnings.length > 20) console.log(`- ... ${warnings.length - 20} autres avertissements`);
}

if (errors.length) {
  console.error(`Erreurs: ${errors.length}`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Catalogue OK: champs essentiels, doublons et liens internes valides.');
