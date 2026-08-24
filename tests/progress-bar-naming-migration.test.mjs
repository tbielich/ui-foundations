import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Progress Bar CSS exposes canonical UIF naming with a v1 class alias", async () => {
  const css = await read("src/ui/patterns/progress-bar.css");
  assert.match(css, /:is\(\.uif-progress-bar, \.progress-bar\)/);
  assert.match(css, /var\(--uif-progress-bar-/);
  assert.doesNotMatch(css, /var\(--progress-bar-/);
  assert.doesNotMatch(css, /\.uif-progress-bar(?:__|--)/);
});

test("Progress Bar Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.equal((tokenExport.match(/var\(--uif-progress-bar-/g) ?? []).length, 10);
  assert.doesNotMatch(tokenExport, /var\(--progress-bar-/);
});

test("Progress Bar-owned emitters use canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-progress-bar.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-progress-bar.figma.ts"),
  ]);
  for (const source of sources) assert.match(source, /uif-progress-bar/);
});

test("Progress Bar migration guide and registration use the canonical namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-progress-bar.js"),
  ]);
  assert.match(documentation, /\| Progress Bar \|.*`--uif-progress-bar-\*`/);
  assert.match(element, /define\("uif-progress-bar", UIProgressBar\)/);
});
