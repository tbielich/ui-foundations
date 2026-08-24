import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Meter CSS exposes canonical UIF naming with a v1 class alias", async () => {
  const css = await read("src/ui/patterns/meter.css");
  assert.match(css, /:is\(\.uif-meter, \.meter\)/);
  assert.match(css, /var\(--uif-meter-/);
  assert.doesNotMatch(css, /var\(--meter-/);
  assert.doesNotMatch(css, /\.uif-meter(?:__|--)/);
});

test("Meter Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.match(tokenExport, /var\(--uif-meter-track-background-default\)/);
  assert.match(tokenExport, /var\(--uif-meter-fill-background-positive\)/);
  assert.doesNotMatch(tokenExport, /var\(--meter-/);
});

test("Meter-owned emitters use canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-meter.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-meter.figma.ts"),
  ]);
  for (const source of sources) assert.match(source, /uif-meter/);
  assert.doesNotMatch(sources[0], /class="meter(?:[-\s"])/);
});

test("Meter registration uses the canonical namespace", async () => {
  const element = await read("src/elements/ui-meter.js");
  assert.match(element, /define\("uif-meter", UIMeter\)/);
});
