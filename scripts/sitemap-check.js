#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const siteUrl = 'https://monaide-vaud.ch';
const sitemapPath = path.join(root, 'sitemap.xml');

function collectHtmlPages(dir, pages = []) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    if (entry.name.startsWith('.')) return;
    if (entry.name === 'assets' || entry.name === 'scripts') return;

    const current = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlPages(current, pages);
      return;
    }

    if (entry.name !== 'index.html') return;
    const relativeDir = path.relative(root, path.dirname(current));
    const urlPath = relativeDir ? `/${relativeDir.replace(/\\/g, '/')}/` : '/';
    pages.push(`${siteUrl}${urlPath}`);
  });
  return pages;
}

function extractSitemapUrls(xml) {
  const urls = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

if (!fs.existsSync(sitemapPath)) {
  console.error('sitemap.xml introuvable');
  process.exit(1);
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const expected = collectHtmlPages(root).sort();
const listed = extractSitemapUrls(sitemap).sort();
const missing = expected.filter((url) => !listed.includes(url));
const extra = listed.filter((url) => !expected.includes(url));

console.log(`Sitemap: ${listed.length} URL listées, ${expected.length} pages HTML attendues`);

if (missing.length || extra.length) {
  if (missing.length) {
    console.error('Pages absentes du sitemap:');
    missing.forEach((url) => console.error(`- ${url}`));
  }
  if (extra.length) {
    console.error('URL listées sans page HTML locale:');
    extra.forEach((url) => console.error(`- ${url}`));
  }
  process.exit(1);
}

console.log('Sitemap OK: toutes les pages HTML publiables sont listées.');
