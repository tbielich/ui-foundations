import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Progress Circle CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/progress-circle.css");

  for (const className of [
    "progress-circle",
    "progress-circle-svg",
    "progress-circle-track",
    "progress-circle-indicator",
  ]) {
    assert.match(css, new RegExp(`uif-${className}`));
    assert.match(css, new RegExp(className));
  }
  assert.match(css, /var\(--uif-progress-circle-/);
  assert.doesNotMatch(css, /var\(--progress-circle-/);
  assert.doesNotMatch(css, /\.uif-progress-circle(?:__|--)/);
});

test("Progress Circle Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.equal((tokenExport.match(/var\(--uif-progress-circle-/g) ?? []).length, 6);
  assert.doesNotMatch(tokenExport, /var\(--progress-circle-/);
});

test("Progress Circle-owned emitters produce canonical classes and progressbar semantics", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-progress-circle.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-progress-circle.figma.ts"),
  ]);

  for (const source of sources) {
    assert.match(source, /uif-progress-circle/);
    assert.match(source, /progressbar/);
  }
  assert.doesNotMatch(sources[0], /class="progress-circle(?:[-\s"])/);
  assert.doesNotMatch(sources[3], /["']progress-circle["']/);
});

test("Progress Circle migration guide and registration use the canonical public namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-progress-circle.js"),
  ]);

  assert.match(documentation, /\| Progress Circle \|.*`--uif-progress-circle-\*`/);
  assert.match(element, /define\("uif-progress-circle", UIProgressCircle\)/);
});
