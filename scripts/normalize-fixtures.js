/**
 * Normalize fixture files into Duffel wire format.
 * - Bare array of offers  -> { meta, data: [...] }   (offers list response)
 * - Bare offer object     -> { data: {...} }          (single offer response)
 * - Already has "data"    -> left alone (idempotent: safe to run repeatedly)
 *
 * Usage:
 *   node scripts/normalize-fixtures.js            # apply changes
 *   node scripts/normalize-fixtures.js --dry-run  # preview only, write nothing
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const LIST_META = { limit: 50, before: null, after: null };

// Collect every .json file under a directory (recursive)
function jsonFilesIn(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { recursive: true })
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.join(dir, f));
}

const files = [
  ...jsonFilesIn(path.join('tests', 'fixtures', 'offers')),
  ...jsonFilesIn(path.join('tests', 'fixtures', 'selectedOffer')),
];

let changed = 0;

function rewrite(file, obj, note) {
  console.log(`  ${DRY_RUN ? '[dry-run] would rewrite' : 'rewrote'}: ${file}  (${note})`);
  if (!DRY_RUN) fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n');
  changed++;
}

for (const file of files) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));

  if (Array.isArray(json)) {
    rewrite(file, { meta: LIST_META, data: json }, 'bare array -> list envelope');
  } else if (json.data !== undefined) {
    console.log(`  ok: ${file}`);
  } else if (json.id) {
    rewrite(file, { data: json }, 'bare offer -> data envelope');
  } else {
    console.warn(`  !! unrecognized shape, skipped: ${file}`);
  }
}

console.log(`\n${changed} file(s) ${DRY_RUN ? 'would be ' : ''}changed.`);