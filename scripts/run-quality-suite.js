#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

const checks = [
  { label: 'Catalogue', cmd: ['node', path.join(root, 'scripts/catalog-quality-check.js')] },
  { label: 'Guides data', cmd: ['node', path.join(root, 'scripts/guide-quality-check.js')] },
  { label: 'Guides éditorial', cmd: ['node', path.join(root, 'scripts/guide-editorial-check.js')] },
  { label: 'Métadonnées site', cmd: ['node', path.join(root, 'scripts/site-metadata-check.js')] },
  { label: 'Structure simulateur', cmd: ['node', path.join(root, 'scripts/simulator-structure-check.js')] },
  { label: 'Smoke simulateur', cmd: ['node', path.join(root, 'scripts/simulator-smoke-test.js')] },
  { label: 'Régression simulateur', cmd: ['node', path.join(root, 'scripts/simulator-regression-test.js')] },
  { label: 'git diff --check', cmd: ['git', '-C', root, 'diff', '--check'] }
];

let failures = 0;

checks.forEach((check) => {
  console.log(`\n=== ${check.label} ===`);
  const result = spawnSync(check.cmd[0], check.cmd.slice(1), { encoding: 'utf8' });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    failures += 1;
    console.error(`→ Échec: ${check.label}`);
  } else {
    console.log(`→ OK: ${check.label}`);
  }
});

if (failures) {
  console.error(`\nSuite qualité: ${failures} contrôle(s) en échec.`);
  process.exit(1);
}

console.log('\nSuite qualité complète OK.');
