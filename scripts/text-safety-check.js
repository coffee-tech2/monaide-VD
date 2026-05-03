#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const includedExtensions = new Set(['.html', '.js']);
const ignoredDirs = new Set(['.git', 'node_modules', 'scripts']);

const forbiddenTexts = [
  {
    label: 'badge trop affirmatif "Confirmé"',
    pattern: /\bconfirm[ée]s?\b/i
  },
  {
    label: 'date de relecture visible',
    pattern: /derni[eè]re\s+relecture/i
  },
  {
    label: 'contrôle interne visible',
    pattern: /contr[oô]le\s+interne|date\s+de\s+contr[oô]le/i
  },
  {
    label: 'ancien libellé anxiogène "Lire vite"',
    pattern: /\blire\s+vite\b/i
  },
  {
    label: 'bouton ambigu "Voir la fiche pratique"',
    pattern: /voir\s+la\s+fiche\s+pratique/i
  },
  {
    label: 'formulation site trop communautaire',
    pattern: /(version\s+b[eê]ta\s+communautaire|outil\s+communautaire|projet\s+communautaire)/i
  },
  {
    label: 'ancienne section "Partager le projet"',
    pattern: /partager\s+le\s+projet/i
  }
];

function collectFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) return [];
      return collectFiles(fullPath);
    }

    if (!entry.isFile()) return [];
    return includedExtensions.has(path.extname(entry.name)) ? [fullPath] : [];
  });
}

function lineForIndex(content, index) {
  return content.slice(0, index).split('\n').length;
}

const failures = [];

collectFiles(root).forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  forbiddenTexts.forEach(({ label, pattern }) => {
    const match = pattern.exec(content);
    if (!match) return;

    failures.push({
      label,
      file: path.relative(root, filePath),
      line: lineForIndex(content, match.index),
      value: match[0]
    });
  });
});

if (failures.length) {
  console.error('Textes sensibles détectés:');
  failures.forEach((failure) => {
    console.error(
      `- ${failure.label}: ${failure.file}:${failure.line} (${JSON.stringify(failure.value)})`
    );
  });
  process.exit(1);
}

console.log('Textes sensibles: OK');
