import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Divider CSS exposes canonical UIF naming with a v1 class alias", async () => {
  const css = await read("src/ui/patterns/divider.css");

  assert.match(css, /:is\(\.uif-divider, \.divider\)/);
  assert.match(css, /--uif-divider-color/);
  assert.doesNotMatch(css, /--divider-color/);
  assert.doesNotMatch(css, /\.uif-divider(?:__|--)/);
});

test("Divider-owned emitters produce the canonical class", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-divider.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-divider.figma.ts"),
  ]);

  for (const source of sources) assert.match(source, /uif-divider/);
  assert.doesNotMatch(sources[0], /class="divider(?:[\s"])/);
  assert.doesNotMatch(sources[3], /["']divider["']/);
});

test("Divider runtime input stays code-only rather than becoming a Figma token", async () => {
  const [validator, tokenExport] = await Promise.all([
    read("scripts/validate-token-usage.mjs"),
    read("figma/exports/Patterns (UI).tokens.json"),
  ]);

  assert.match(validator, /"--uif-divider-color"/);
  assert.doesNotMatch(validator, /"--divider-color"/);
  assert.equal(JSON.parse(tokenExport).Divider, undefined);
  assert.doesNotMatch(tokenExport, /--uif-divider-color/);
});

test("Divider migration guide explains its boundary and canonical registration", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-divider.js"),
  ]);

  assert.match(documentation, /code-only `--uif-divider-color`; no component-scoped Figma variables/);
  assert.match(documentation, /No library-owned legacy token aliases or fallbacks/);
  assert.match(element, /define\("uif-divider", UIDivider\)/);
});
