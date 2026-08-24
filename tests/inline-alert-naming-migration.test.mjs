import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("InlineAlert CSS exposes canonical UIF naming", async () => {
  const css = await read("src/ui/patterns/inline-alert.css");
  assert.match(css, /\.uif-inline-alert/);
  assert.match(css, /var\(--uif-inline-alert-/);
  assert.doesNotMatch(css, /var\(--inline-alert-/);
  assert.doesNotMatch(css, /\.uif-inline-alert(?:__|--)/);
});

test("InlineAlert CSS defines info, positive, negative, notice variants", async () => {
  const css = await read("src/ui/patterns/inline-alert.css");
  assert.match(css, /\.uif-inline-alert\.info/);
  assert.match(css, /\.uif-inline-alert\.positive/);
  assert.match(css, /\.uif-inline-alert\.negative/);
  assert.match(css, /\.uif-inline-alert\.notice/);
});

test("InlineAlert CSS includes dismiss and is-hidden support", async () => {
  const css = await read("src/ui/patterns/inline-alert.css");
  assert.match(css, /\.uif-inline-alert-dismiss/);
  assert.match(css, /\.uif-inline-alert\.is-hidden/);
});

test("InlineAlert Figma token export contains canonical tokens", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.match(tokenExport, /var\(--uif-inline-alert-/);
  assert.doesNotMatch(tokenExport, /var\(--inline-alert-/);
});

test("InlineAlert-owned emitters use canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-inline-alert.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-inline-alert.figma.ts"),
  ]);
  for (const source of sources) assert.match(source, /uif-inline-alert/);
});

test("InlineAlert element is exported from the elements index", async () => {
  const index = await read("src/elements/index.js");
  assert.match(index, /UIInlineAlert/);
  assert.match(index, /ui-inline-alert\.js/);
});

test("InlineAlert migration entry uses the canonical namespace", async () => {
  const [migration, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-inline-alert.js"),
  ]);
  assert.match(migration, /\| InlineAlert \|.*`--uif-inline-alert-\*`/);
  assert.match(element, /define\("uif-inline-alert", UIInlineAlert\)/);
});

test("InlineAlert docs and playground pages exist", async () => {
  const [docs, playground] = await Promise.all([
    read("site/patterns/inline-alert.md"),
    read("site/patterns/inline-alert-playground.md"),
  ]);
  assert.match(docs, /uif-inline-alert/);
  assert.match(playground, /renderer: inline-alert/);
});
