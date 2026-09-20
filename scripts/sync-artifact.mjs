/**
 * Regenerates ../aura-data.js from lib/quiz-data.js.
 *
 * The Next.js app imports lib/quiz-data.js as an ES module. The published
 * Artifact loads aura-data.js as a plain <script>, where `export` is a
 * syntax error — so the only difference between the two files is that
 * keyword. Edit lib/quiz-data.js, run `npm run sync:artifact`, and the
 * two stay identical.
 *
 * Run from the repo root.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "lib", "quiz-data.js");
const TARGET = join(root, "aura-data.js");

const src = await readFile(SOURCE, "utf8");

const exportCount = (src.match(/^export const /gm) || []).length;
if (exportCount === 0) {
  console.error("No `export const` declarations found in lib/quiz-data.js — refusing to write.");
  process.exit(1);
}

const banner =
  "/* GENERATED FILE — do not edit.\n" +
  "   Source: lib/quiz-data.js   ·   Regenerate: npm run sync:artifact\n" +
  "   This is the copy the published Artifact loads as a plain script. */\n\n";

const out = banner + src.replace(/^export const /gm, "const ");

// Guard against shipping a module keyword the Artifact's <script> can't parse.
if (/^\s*(export|import)\s/m.test(out)) {
  console.error("Module syntax survived the transform — refusing to write aura-data.js.");
  process.exit(1);
}

await writeFile(TARGET, out, "utf8");
console.log(`aura-data.js regenerated — ${exportCount} declarations, ${out.length} bytes.`);
console.log("Republish the Artifact to push this to your players.");
