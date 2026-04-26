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

function localPathForUrl(url) {
  if (!url || !url.startsWith('/')) return null;
  const clean = url.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return path.join(root, 'index.html');
  return clean.endsWith('/')
    ? path.join(root, clean.replace(/^\/+/, ''), 'index.html')
    : path.join(root, clean.replace(/^\/+/, ''));
}

const context = { window: {}, console };
context.window.window = context.window;

loadBrowserScript('assets/js/guide-data.js', context);

const data = context.window.MONAIDE_GUIDE_DATA || { items: [] };
const items = data.items || [];
const errors = [];
const seen = new Set();

items.forEach((item, index) => {
  const label = item && item.id ? item.id : `guide#${index + 1}`;
  if (!item || typeof item !== 'object') {
    errors.push(`${label}: fiche guide invalide`);
    return;
  }

  ['id', 'label', 'title', 'summary', 'href'].forEach((field) => {
    if (!hasText(item[field])) errors.push(`${label}: champ "${field}" manquant ou vide`);
  });

  if (seen.has(item.id)) errors.push(`${label}: id en doublon`);
  seen.add(item.id);

  const target = localPathForUrl(item.href);
  if (target && !fs.existsSync(target)) {
    errors.push(`${label}: page guide introuvable "${item.href}"`);
  }
});

if (!items.length) errors.push('Aucune fiche guide trouvée');

console.log(`Guides: ${items.length} fiches contrôlées`);

if (errors.length) {
  console.error(`Erreurs: ${errors.length}`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Guides OK: données essentielles et liens internes valides.');
