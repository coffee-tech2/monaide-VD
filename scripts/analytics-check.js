#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const gtmId = 'GTM-NFQRW574';

const expectedEvents = [
  'simulator_start',
  'simulator_step_view',
  'simulator_step_complete',
  'simulator_validation_error',
  'simulator_edit_answers',
  'simulator_edit_field',
  'simulator_submit',
  'simulator_restart',
  'simulator_abandon',
  'simulator_results_view',
  'result_detail_open',
  'result_catalog_open',
  'result_guide_open',
  'catalog_search',
  'catalog_filter',
  'catalog_card_open',
  'catalog_direct_open',
  'catalog_note_close',
  'catalog_link_click',
  'catalog_guide_open',
  'guide_card_click',
  'guide_detail_view',
  'guide_detail_link_click',
  'site_search',
  'site_search_suggestion'
];

function collectFiles(dir, predicate, files = []) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    if (entry.name === '.git' || entry.name === 'node_modules') return;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, predicate, files);
      return;
    }
    if (predicate(fullPath)) files.push(fullPath);
  });
  return files;
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

const htmlFiles = collectFiles(root, (file) => file.endsWith('.html'));
const jsFiles = collectFiles(path.join(root, 'assets', 'js'), (file) => file.endsWith('.js'));
const errors = [];

const navigationJs = read(path.join(root, 'assets', 'js', 'navigation.js'));

[
  [navigationJs.includes('window.MONAIDE_GTM_ID'), 'navigation.js: reference a MONAIDE_GTM_ID absente'],
  [navigationJs.includes("host === 'monaide-vaud.ch'"), 'navigation.js: garde-fou production absent'],
  [navigationJs.includes('monaide-analytics-consent'), 'navigation.js: cle de consentement absente'],
  [navigationJs.includes('cookie-consent-banner'), 'navigation.js: banniere de consentement absente']
].forEach(([ok, message]) => {
  if (!ok) errors.push(message);
});

htmlFiles.forEach((file) => {
  const html = read(file);
  const rel = path.relative(root, file);

  if (rel === '404.html') return;

  [
    [html.includes(gtmId), 'GTM ID absent'],
    [html.includes('window.dataLayer = window.dataLayer || []'), 'initialisation dataLayer absente'],
    [html.includes("window.MONAIDE_GTM_ID = 'GTM-NFQRW574'"), 'MONAIDE_GTM_ID absent'],
    [html.includes('/confidentialite/'), 'lien vers /confidentialite/ absent du footer']
  ].forEach(([ok, message]) => {
    if (!ok) errors.push(`${rel}: ${message}`);
  });
});

const allJs = jsFiles.map(read).join('\n');
expectedEvents.forEach((eventName) => {
  if (!allJs.includes(eventName)) {
    errors.push(`Evenement analytics absent: ${eventName}`);
  }
});

const indexHtml = read(path.join(root, 'index.html'));
const analyticsPos = indexHtml.indexOf('assets/js/analytics.js');
['assets/js/simulator.js', 'assets/js/results.js', 'assets/js/catalog.js', 'assets/js/navigation.js'].forEach((scriptPath) => {
  const pos = indexHtml.indexOf(scriptPath);
  if (pos === -1) {
    errors.push(`index.html: script absent: ${scriptPath}`);
  } else if (analyticsPos === -1 || analyticsPos > pos) {
    errors.push(`index.html: analytics.js doit etre charge avant ${scriptPath}`);
  }
});

if (errors.length) {
  console.error('Controle analytics en echec:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Analytics OK: ${htmlFiles.length} pages HTML, ${expectedEvents.length} evenements suivis.`);
console.log('Regex GTM recommandee:');
console.log(`^(${expectedEvents.join('|')})$`);
