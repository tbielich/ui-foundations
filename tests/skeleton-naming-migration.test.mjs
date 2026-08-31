import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Skeleton CSS exposes canonical UIF naming with a v1 class alias", async () => {
  const css = await read("src/ui/patterns/skeleton.css");
  assert.match(css, /:is\(\.uif-skeleton, \.skeleton\)/);
  assert.match(css, /var\(--uif-skeleton-/);
  assert.doesNotMatch(css, /var\(--skeleton-/);
  assert.doesNotMatch(css, /\.uif-skeleton(?:__|--)/);
});

test("Skeleton Figma export contains canonical tokens", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.match(tokenExport, /var\(--uif-skeleton-background\)/);
  assert.match(tokenExport, /var\(--uif-skeleton-background-highlight\)/);
});

test("Skeleton-owned emitters use canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-skeleton.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-skeleton.figma.ts"),
  ]);
  for (const source of sources) assert.match(source, /uif-skeleton/);
  assert.doesNotMatch(sources[0], /class="skeleton(?:[-\s"])/);
});

test("Skeleton migration guide and registration use the canonical namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-skeleton.js"),
  ]);
  assert.match(documentation, /\| Skeleton \|.*`--uif-skeleton-\*`/);
  assert.match(element, /define\("uif-skeleton", UISkeleton\)/);
});
