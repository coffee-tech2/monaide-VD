#!/usr/bin/env node

// Vérifie que tous les liens externes référencés sur le site répondent (200/3xx).
// Contrairement aux autres scripts de scripts/run-quality-suite.js, celui-ci fait
// de vraies requêtes réseau (lent, dépend de la disponibilité de sites tiers) :
// il n'est donc PAS branché sur la suite qualité automatique. À lancer à la main,
// périodiquement (ex: avant une passe de contenu, ou une fois par mois) :
//
//   node scripts/check-external-links.js
//
// Sortie: liste des liens qui ne répondent pas 200/3xx, avec les fichiers qui
// les référencent. Code de sortie 1 si au moins un lien est mort, sinon 0.

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const root = path.resolve(__dirname, '..');
const ignoredDirs = new Set(['.git', 'node_modules', 'scripts']);
const ignoredHostFragments = [
  'monaide-vaud.ch',
  'googletagmanager.com',
  'google-analytics.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'schema.org',
  'w3.org'
];
const urlPattern = /https?:\/\/[^\s"'\\<>)]+/g;
const CONCURRENCY = 8;
const TIMEOUT_MS = 10000;
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) walk(path.join(dir, entry.name), files);
      continue;
    }
    if (entry.isFile() && /\.(html|js)$/.test(entry.name)) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

function collectUrls() {
  const files = walk(root);
  const urlToFiles = new Map();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(urlPattern) || [];
    for (const raw of matches) {
      const url = raw.replace(/[.,;:]+$/, '');
      if (ignoredHostFragments.some((fragment) => url.includes(fragment))) continue;
      if (!urlToFiles.has(url)) urlToFiles.set(url, new Set());
      urlToFiles.get(url).add(path.relative(root, file));
    }
  }

  return urlToFiles;
}

function checkUrl(url) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    let req;
    try {
      const lib = url.startsWith('https:') ? https : http;
      req = lib.request(url, { method: 'GET', headers: { 'User-Agent': USER_AGENT }, timeout: TIMEOUT_MS }, (res) => {
        finish({ status: res.statusCode });
        res.resume();
        req.destroy();
      });
    } catch (error) {
      finish({ status: null, error: error.message });
      return;
    }

    req.on('timeout', () => {
      finish({ status: null, error: 'timeout' });
      req.destroy();
    });
    req.on('error', (error) => {
      finish({ status: null, error: error.message });
    });
    req.end();
  });
}

async function runWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let index = 0;

  async function next() {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await worker(items[current], current);
    }
  }

  await Promise.all(new Array(Math.min(limit, items.length)).fill(0).map(next));
  return results;
}

async function main() {
  const urlToFiles = collectUrls();
  const urls = Array.from(urlToFiles.keys());
  console.log(`Vérification de ${urls.length} liens externes uniques...`);

  const results = await runWithConcurrency(urls, CONCURRENCY, async (url) => {
    const result = await checkUrl(url);
    return { url, ...result };
  });

  const dead = results.filter((r) => !r.status || r.status >= 400);

  if (dead.length) {
    console.error(`\n${dead.length} lien(s) externe(s) mort(s) ou en erreur:\n`);
    dead.forEach(({ url, status, error }) => {
      const files = Array.from(urlToFiles.get(url)).join(', ');
      console.error(`- [${status || error}] ${url}`);
      console.error(`  référencé dans: ${files}`);
    });
    process.exitCode = 1;
  } else {
    console.log('Tous les liens externes répondent (200/3xx).');
  }
}

main();
