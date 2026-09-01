// Fails (with --strict) if the static export still references /stock/ assets.
// Run non-strict in CI as a visible reminder; run --strict in the pre-launch gate.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = fileURLToPath(new URL("../out/", import.meta.url));
const strict = process.argv.includes("--strict");

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

let hits = [];
try {
  hits = walk(OUT_DIR)
    .filter((f) => /\.(html|js|css|txt|xml)$/.test(f))
    .filter((f) => readFileSync(f, "utf8").includes("/stock/"));
} catch (err) {
  console.error(`check-no-stock: could not read ${OUT_DIR} — run \`next build\` first.`);
  process.exit(strict ? 1 : 0);
}

if (hits.length === 0) {
  console.log("check-no-stock: no /stock/ references in build output. ✅");
  process.exit(0);
}

console.warn("check-no-stock: build output still references stock assets:");
for (const f of hits) console.warn(`  - ${f.replace(OUT_DIR, "out/")}`);
console.warn(
  strict
    ? "check-no-stock: --strict → failing. Swap in real photos before launch."
    : "check-no-stock: reminder only (non-strict). These must not ship.",
);
process.exit(strict ? 1 : 0);
