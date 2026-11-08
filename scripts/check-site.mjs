// Run after `hugo --minify`. Uses only built-in Node modules.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL('../public/', import.meta.url));
const failures = [];
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]);
}
const htmlFiles = files(root).filter(file => file.endsWith('.html'));
let checked = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const pagePath = relative(root, file).replaceAll('\\', '/');
  const base = new URL(pagePath, 'https://xtxuthomas.github.io/');
  if (!/<title>\s*[^<]+<\/title>/.test(html)) failures.push(`${pagePath}: missing title`);
  if (/von Igelfeld|Lorem ipsum|Unusual Uses For Olive Oil|under construction/i.test(html)) {
    failures.push(`${pagePath}: template placeholder remains`);
  }
  for (const match of html.matchAll(/\b(?:href|src)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    const raw = (match[1] ?? match[2] ?? match[3]).replaceAll('&amp;', '&');
    const url = new URL(raw, base);
    if (!['http:', 'https:'].includes(url.protocol)) continue;
    if (!['xtxuthomas.github.io', 'localhost', '127.0.0.1'].includes(url.hostname)) continue;
    let target = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    checked++;
    if (!existsSync(target)) failures.push(`${pagePath}: missing ${raw}`);
  }
}
for (const route of ['index.html','research/index.html','papers/index.html','courses/index.html','data/index.html','links/index.html']) {
  if (!existsSync(join(root, route))) failures.push(`Missing required page: ${route}`);
}
const papers = readFileSync(join(root, 'papers/index.html'), 'utf8');
const home = readFileSync(join(root, 'index.html'), 'utf8');
// Compare rendered entries with the editable data without requiring a YAML library.
const source = readFileSync(fileURLToPath(new URL('../data/publications.yaml', import.meta.url)), 'utf8');
const expectedPapers = (source.match(/^- title:/gm) ?? []).length;
const expectedSelected = (source.match(/^  selected: true\s*$/gm) ?? []).length;
if ((papers.match(/class=["']?paper-title/g) ?? []).length !== expectedPapers) failures.push('Some publication records did not render.');
if ((home.match(/class=["']?paper-title/g) ?? []).length !== expectedSelected) failures.push('Homepage selections do not match the publication data.');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Passed: ${htmlFiles.length} HTML pages, ${checked} local link/asset references, ${expectedPapers} papers, ${expectedSelected} selections; no demo text.`);
}
