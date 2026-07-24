// Regenerate public/words.json — a flat array of lowercase six-letter words —
// from the Supabase seed (supabase/seeds/six_letter_words.sql). This documents
// the provenance of the static word list for SPEC-002 and lets the file be
// regenerated; run it BEFORE the supabase/ directory is deleted.
//
//   node scripts/generate-words.mjs
//
// The list is both the answer pool and the guess-validation dictionary.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const SEED = resolve(here, "../supabase/seeds/six_letter_words.sql");
const OUT = resolve(here, "../public/words.json");

const sql = readFileSync(SEED, "utf8");

// Seed rows look like:  ('abacas'),  ...  ('zyrian');
const seen = new Set();
const words = [];
let skipped = 0;
for (const [, token] of sql.matchAll(/\(\s*'([^']*)'\s*\)/g)) {
  const word = token.toLowerCase();
  if (!/^[a-z]{6}$/.test(word)) {
    skipped++;
    continue;
  }
  if (!seen.has(word)) {
    seen.add(word);
    words.push(word);
  }
}

if (words.length === 0) {
  console.error(`No words extracted from ${SEED} — is it present and formatted as expected?`);
  process.exit(1);
}

writeFileSync(OUT, JSON.stringify(words) + "\n");
console.log(`Wrote ${words.length} unique six-letter words to ${OUT}` + (skipped ? ` (skipped ${skipped} non-conforming tokens)` : ""));
