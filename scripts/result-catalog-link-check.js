#!/usr/bin/env node

// Vérifie que chaque résultat que le simulateur peut produire (chaque valeur `nom:`
// dans assets/js/engine.js) retrouve bien sa fiche dans le répertoire via le même
// mécanisme que le bouton "Fiche du répertoire" (window.getCatalogStoreItem, utilisé
// par openCatalogForAid dans catalog.js). Sans ce contrôle, un résultat dont le
// texte `nom:` ne correspond plus exactement (ou par un texte contenu) à aucune
// fiche du répertoire ferait échouer silencieusement ce bouton pour l'utilisateur
// final — sans jamais faire planter le simulateur ni la suite qualité existante.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');

function load(file, context) {
  const code = fs.readFileSync(path.join(root, file), 'utf8');
  vm.runInContext(code, context, { filename: file });
}

const context = { window: {}, console, document: { querySelectorAll: () => [] } };
vm.createContext(context);
[
  'assets/js/config.js',
  'assets/js/utils.js',
  'assets/js/catalog-data.js',
  'assets/js/content-store.js'
].forEach((file) => load(file, context));

const getCatalogStoreItem = context.window.getCatalogStoreItem;
if (typeof getCatalogStoreItem !== 'function') {
  throw new Error('getCatalogStoreItem introuvable — vérifier assets/js/content-store.js');
}

// Réplique la partie de findCatalogCardForAid (utils.js) qui ne dépend pas du DOM :
// recherche par alias, puis correspondance exacte ou partielle sur titre/résumé/objectif.
// C'est le filet de secours utilisé par openCatalogForAid quand getCatalogStoreItem
// échoue — s'il rattrape aussi le résultat, le bouton "Fiche du répertoire" marche
// quand même dans le vrai navigateur, même si la correspondance directe échoue.
const normalizeAidText = context.normalizeAidText;
if (typeof normalizeAidText !== 'function') {
  throw new Error('normalizeAidText introuvable dans le contexte chargé — vérifier assets/js/utils.js');
}

function findCatalogItemForAidNoDom(query, catalogStore, aliasMap) {
  const normalizedQuery = normalizeAidText(query);
  if (!normalizedQuery) return null;
  const candidateQueries = [normalizedQuery].concat(aliasMap[normalizedQuery] || []);
  for (const candidate of candidateQueries) {
    const item = catalogStore.byId[candidate] ||
      catalogStore.byNormalizedTitle[candidate] ||
      catalogStore.items.find((i) => normalizeAidText(i.title) === candidate || normalizeAidText(i.summary) === candidate || normalizeAidText(i.id) === candidate) ||
      catalogStore.items.find((i) => normalizeAidText(i.title).indexOf(candidate) !== -1 || normalizeAidText(i.summary).indexOf(candidate) !== -1 || normalizeAidText(i.purpose).indexOf(candidate) !== -1);
    if (item) return item;
  }
  return null;
}

// Extrait chaque bloc `nom: '...'` (+ catalogAidId: '...' s'il suit juste après) de
// engine.js, pour reproduire exactement ce que data-aid-query recevra dans le bouton
// "Fiche du répertoire" (results.js : result.catalogAidId || result.nom).
const engineSource = fs.readFileSync(path.join(root, 'assets/js/engine.js'), 'utf8');
const resultPattern = /nom:\s*'((?:[^'\\]|\\.)*)',\s*\n\s*(?:catalogAidId:\s*'((?:[^'\\]|\\.)*)'|hideRepertoireLink:\s*true)?/g;
const results = new Map(); // query effective -> nom d'origine (pour l'affichage)
let match;
while ((match = resultPattern.exec(engineSource)) !== null) {
  const nom = match[1].replace(/\\'/g, '\'');
  const catalogAidId = match[2];
  const isHidden = match[0].indexOf('hideRepertoireLink') !== -1;
  if (isHidden) continue; // ce résultat n'affiche volontairement pas de bouton "Fiche du répertoire"
  results.set(catalogAidId || nom, nom);
}

if (!results.size) {
  throw new Error('Aucune valeur nom: trouvée dans engine.js — le pattern d\'extraction a peut-être besoin d\'être ajusté.');
}

const catalogStore = context.window.MONAIDE_CATALOG_STORE;
const aliasMap = (context.window.MONAIDE_SEARCH_CONFIG || {}).aliasMap || {};
const unresolved = [];
results.forEach((nom, query) => {
  const direct = getCatalogStoreItem(query);
  const viaFallback = direct || findCatalogItemForAidNoDom(query, catalogStore, aliasMap);
  if (!viaFallback) unresolved.push(nom);
});

if (unresolved.length) {
  console.error(`${unresolved.length} résultat(s) du simulateur ne retrouvent aucune fiche du répertoire (bouton "Fiche du répertoire" cassé pour eux) :\n`);
  unresolved.forEach((nom) => console.error(`- "${nom}"`));
  process.exitCode = 1;
} else {
  console.log(`Les ${results.size} résultats possibles du simulateur retrouvent tous une fiche du répertoire.`);
}
