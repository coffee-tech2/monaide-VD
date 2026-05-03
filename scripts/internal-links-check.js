#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ignoredDirs = new Set(['.git', 'node_modules', 'scripts']);
const externalPattern = /^(https?:|mailto:|tel:|sms:|javascript:|data:|blob:|\/\/)/i;
const dynamicAnchorPatterns = [/^groupe-/];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) walk(path.join(dir, entry.name), files);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

function stripQuery(value) {
  return value.split('?')[0];
}

function normalizeLocalTarget(fromFile, href) {
  const [rawPath, rawFragment] = href.split('#');
  const fragment = rawFragment ? decodeURIComponent(rawFragment) : '';
  const cleanPath = stripQuery(rawPath || '');

  if (!cleanPath) {
    return { targetPath: fromFile, fragment };
  }

  let targetPath;
  if (cleanPath.startsWith('/')) {
    targetPath = path.join(root, cleanPath.slice(1));
  } else {
    targetPath = path.resolve(path.dirname(fromFile), cleanPath);
  }

  if (cleanPath.endsWith('/') || !path.extname(targetPath)) {
    const asDirIndex = path.join(targetPath, 'index.html');
    if (fs.existsSync(asDirIndex)) return { targetPath: asDirIndex, fragment };
  }

  return { targetPath, fragment };
}

function collectAnchors(file) {
  const html = fs.readFileSync(file, 'utf8');
  const anchors = new Set(['top']);
  const idPattern = /\sid=["']([^"']+)["']/g;
  const namePattern = /\sname=["']([^"']+)["']/g;
  let match;
  while ((match = idPattern.exec(html)) !== null) anchors.add(match[1]);
  while ((match = namePattern.exec(html)) !== null) anchors.add(match[1]);
  return anchors;
}

const htmlFiles = walk(root);
const anchorsByFile = new Map(htmlFiles.map((file) => [file, collectAnchors(file)]));
const failures = [];
let checkedLinks = 0;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const hrefPattern = /\shref=["']([^"']+)["']/g;
  let match;

  while ((match = hrefPattern.exec(html)) !== null) {
    const href = match[1].trim();
    if (!href || externalPattern.test(href)) continue;

    checkedLinks += 1;

    if (href === '#') {
      failures.push(`${path.relative(root, file)}: lien vide href="#"`);
      continue;
    }

    const { targetPath, fragment } = normalizeLocalTarget(file, href);
    if (!fs.existsSync(targetPath)) {
      failures.push(`${path.relative(root, file)}: cible introuvable "${href}"`);
      continue;
    }

    if (fragment && targetPath.endsWith('.html')) {
      const anchors = anchorsByFile.get(targetPath) || collectAnchors(targetPath);
      const isDynamicAnchor = dynamicAnchorPatterns.some((pattern) => pattern.test(fragment));
      if (!anchors.has(fragment) && !isDynamicAnchor) {
        failures.push(`${path.relative(root, file)}: ancre introuvable "${href}"`);
      }
    }
  }
}

if (failures.length) {
  console.error('Liens internes cassés détectés:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Liens internes OK (${checkedLinks} liens vérifiés sur ${htmlFiles.length} pages HTML).`);
