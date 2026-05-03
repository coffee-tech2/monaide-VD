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
  'simulator_results_view',
  'result_detail_open',
  'result_catalog_open',
  'catalog_search',
  'catalog_filter',
  'catalog_card_open',
  'catalog_direct_open',
  'catalog_note_close',
  'catalog_link_click',
  'guide_card_click',
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

htmlFiles.forEach((file) => {
  const html = read(file);
  const rel = path.relative(root, file);

  [
    [html.includes(gtmId), 'GTM ID absent'],
    [html.includes('Google Tag Manager: production only'), 'snippet GTM head absent'],
    [html.includes("host !== 'monaide-vaud.ch'"), 'garde-fou production absent'],
    [html.includes('Google Tag Manager (noscript): production only'), 'snippet GTM noscript absent']
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
