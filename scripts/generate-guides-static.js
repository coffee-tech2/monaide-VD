#!/usr/bin/env node
// Écrit la liste des guides (sommaire + thèmes) en HTML simple dans guides/index.html,
// pour que les liens existent sans JavaScript. guides.js la remplace par la même liste au chargement.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, 'assets', 'js', f), 'utf8');

const listRoot = { innerHTML: '' };
const noop = () => {};
const doc = {
  readyState: 'complete',
  getElementById: (id) => (id === 'guide-list-root' ? listRoot : null),
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: (ev, fn) => { if (ev === 'DOMContentLoaded') fn(); },
  body: { classList: { contains: () => false } }
};
const win = { document: doc, addEventListener: noop, location: { pathname: '/guides/', search: '', hash: '' } };
win.window = win;
const ctx = vm.createContext(Object.assign(win, { document: doc, console }));
['config.js', 'core.js', 'utils.js', 'catalog-data.js', 'guide-data.js', 'content-store.js', 'guides.js'].forEach((f) => {
  try { vm.runInContext(read(f), ctx, { filename: f }); } catch (e) { if (process.env.DEBUG_GEN) console.error(f + ' : ' + e.message); }
});

if (!listRoot.innerHTML) {
  console.error('Liste non générée : guides.js n’a rien rendu.');
  process.exit(1);
}

const file = path.join(root, 'guides', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const re = /(<div class="gs-prose" id="guide-list-root">)([\s\S]*?)(<\/div>\s*<\/main>)/;
if (!re.test(html)) { console.error('Conteneur guide-list-root introuvable'); process.exit(1); }
html = html.replace(re, (m, a, inner, c) => a + '\n' + listRoot.innerHTML + '\n  ' + c);
if (process.argv.includes('--check')) {
  const current = fs.readFileSync(file, 'utf8');
  if (current !== html) { console.error('guides/index.html : liste statique pas à jour (lancer node scripts/generate-guides-static.js)'); process.exit(1); }
  console.log('Liste statique des guides à jour.');
} else {
  fs.writeFileSync(file, html);
  console.log('Liste statique écrite :', (listRoot.innerHTML.match(/<li data-guide-id/g) || []).length, 'guides');
}
