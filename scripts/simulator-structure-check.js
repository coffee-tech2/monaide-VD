#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');

function loadBrowserScript(file, context) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  vm.runInNewContext(source, context, { filename: file });
}

const context = { window: {}, console };
context.window.window = context.window;

loadBrowserScript('assets/js/simulator-rules.js', context);

const rules = context.window.MONAIDE_SIMULATION_RULES || [];
const errors = [];
const seen = new Set();
const allowedWhen = new Set([
  'always',
  'urgenceActive',
  'permisN',
  'permisS',
  'permisF',
  'permisL',
  'permisG',
  'sansStatut',
  'needsLamal',
  'needsRi',
  'needsPc',
  'needsAllocationsFamiliales',
  'needsChomageActif',
  'needsLaci',
  'needsOcbe',
  'needsAi',
  'needsJetService',
  'needsRuptureApprentissage',
  'needsViolenceProtection',
  'needsSeparationSupport',
  'needsProchesAidants',
  'needsProInfirmis',
  'needsProSenectute',
  'needsCms',
  'needsPrestationsCommunales',
  'needsGardeMalade',
  'needsDettes',
  'needsAideAlimentaire',
  'needsAidesLogement',
  'needsFallback'
]);

rules.forEach((rule, index) => {
  const label = rule && rule.id ? rule.id : `rule#${index + 1}`;
  if (!rule || typeof rule !== 'object') {
    errors.push(`${label}: règle invalide`);
    return;
  }
  if (!rule.id || !rule.handler || !rule.when) {
    errors.push(`${label}: id, handler ou when manquant`);
  }
  if (seen.has(rule.id)) errors.push(`${label}: id en doublon`);
  seen.add(rule.id);
  if (!allowedWhen.has(rule.when)) {
    errors.push(`${label}: condition inconnue "${rule.when}"`);
  }
});

if (!rules.length) errors.push('Aucune règle simulateur trouvée');
if (rules[rules.length - 1] && rules[rules.length - 1].id !== 'fallback') {
  errors.push('La règle de fallback devrait rester en dernière position');
}

console.log(`Simulateur: ${rules.length} règles contrôlées`);

if (errors.length) {
  console.error(`Erreurs: ${errors.length}`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Structure simulateur OK: règles ordonnées et conditions reconnues.');
