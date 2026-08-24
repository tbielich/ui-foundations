import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Segmented Control CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/segmented-control.css");
  for (const name of ["segmented-control", "segmented-control-item"]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${name}, \\.${name}\\)`));
  }
  assert.match(css, /var\(--uif-segmented-control-/);
  assert.doesNotMatch(css, /var\(--segmented-control-/);
  assert.doesNotMatch(css, /\.uif-segmented-control(?:__|--)/);
});

test("Segmented Control Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.ok(
    (tokenExport.match(/var\(--uif-segmented-control-/g) ?? []).length >= 8,
    "Expected at least 8 segmented-control tokens"
  );
  assert.doesNotMatch(tokenExport, /var\(--segmented-control-/);
});

test("Segmented Control-owned emitters produce canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-segmented-control.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
  ]);
  for (const source of sources) assert.match(source, /uif-segmented-control/);
  assert.doesNotMatch(sources[0], /class="segmented-control(?:[-\s"])/);
});

test("Segmented Control migration guide and registrations use the canonical public namespace", async () => {
  const [documentation, elements] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-segmented-control.js"),
  ]);
  assert.match(documentation, /\| Segmented Control \|.*`--uif-segmented-control-\*`/);
  for (const tag of ["uif-segmented-control", "uif-segmented-control-item"]) {
    assert.match(elements, new RegExp(`define\\("${tag}"`));
  }
});
