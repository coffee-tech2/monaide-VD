#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const desktop = path.join(process.env.HOME || '', 'Desktop');

function findCsv(fragment) {
  return fs.readdirSync(desktop)
    .filter((name) => name.endsWith('.csv') && name.normalize('NFD').includes(fragment))
    .map((name) => path.join(desktop, name))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
}

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

function readGaCsv(file) {
  const lines = fs.readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#'));
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => {
      const raw = cells[index] || '';
      const numeric = raw !== '' && !Number.isNaN(Number(raw)) ? Number(raw) : raw;
      return [header, numeric];
    }));
  });
}

function num(row, key) {
  return Number(row[key] || 0);
}

function numValue(row, candidates) {
  return Number(value(row, candidates) || 0);
}

function value(row, candidates) {
  for (const key of candidates) {
    if (Object.prototype.hasOwnProperty.call(row, key)) return row[key];
  }
  return '';
}

const queryFile = findCsv('Requêtes_');
const landingFile = findCsv('Trafic_issu');
const eventFile = findCsv('Événements_');
const pageFile = findCsv('Pages_et_écrans');

if (!queryFile || !landingFile || !eventFile || !pageFile) {
  console.error('Exports Analytics/Search Console manquants sur le Desktop.');
  process.exit(1);
}

const queries = readGaCsv(queryFile);
const landings = readGaCsv(landingFile);
const events = readGaCsv(eventFile);
const pages = readGaCsv(pageFile);

const topLandings = landings
  .filter((row) => row['Page de destination + chaîne de requête'])
  .sort((a, b) => num(b, 'Impressions dans la recherche naturelle Google') - num(a, 'Impressions dans la recherche naturelle Google'))
  .slice(0, 8);

const opportunities = queries
  .filter((row) => (
    num(row, 'Impressions dans la recherche naturelle Google') >= 5 &&
    num(row, 'Clics dans la recherche naturelle Google') === 0 &&
    num(row, 'Position moyenne dans la recherche naturelle Google') <= 12
  ))
  .sort((a, b) => num(b, 'Impressions dans la recherche naturelle Google') - num(a, 'Impressions dans la recherche naturelle Google'))
  .slice(0, 12);

const eventNameKeys = ['Nom de l’événement', 'Nom de l\'événement'];
const eventCountKeys = ['Nombre d’événements', 'Nombre d\'événements'];
const simulatorStarts = events.find((row) => value(row, eventNameKeys) === 'simulator_start') || {};
const simulatorSubmits = events.find((row) => value(row, eventNameKeys) === 'simulator_submit') || {};
const resultViews = events.find((row) => value(row, eventNameKeys) === 'simulator_results_view') || {};
const validationErrors = events.find((row) => value(row, eventNameKeys) === 'simulator_validation_error') || {};

console.log('Analytics/Search Console snapshot');
console.log('--------------------------------');
console.log(`Pages GA visibles: ${pages.length}`);
console.log(`Requêtes Search Console visibles: ${queries.length}`);
console.log('');
console.log('Tunnel simulateur');
console.log(`- Départs: ${numValue(simulatorStarts, eventCountKeys)}`);
console.log(`- Soumissions: ${numValue(simulatorSubmits, eventCountKeys)}`);
console.log(`- Vues résultats: ${numValue(resultViews, eventCountKeys)}`);
console.log(`- Erreurs validation: ${numValue(validationErrors, eventCountKeys)}`);
console.log('');
console.log('Pages organiques principales');
topLandings.forEach((row) => {
  console.log(`- ${row['Page de destination + chaîne de requête']}: ${num(row, 'Clics dans la recherche naturelle Google')} clics / ${num(row, 'Impressions dans la recherche naturelle Google')} impressions, CTR ${(num(row, 'Taux de clics dans la recherche naturelle Google') * 100).toFixed(2)}%, pos ${num(row, 'Position moyenne dans la recherche naturelle Google').toFixed(1)}`);
});
console.log('');
console.log('Requêtes à optimiser');
opportunities.forEach((row) => {
  console.log(`- ${row['Requête de recherche naturelle Google']}: ${num(row, 'Impressions dans la recherche naturelle Google')} impressions, pos ${num(row, 'Position moyenne dans la recherche naturelle Google').toFixed(1)}, 0 clic`);
});
