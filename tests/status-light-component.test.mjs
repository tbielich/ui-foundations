import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Status Light CSS uses canonical UIF naming and tokens", async () => {
  const css = await read("src/ui/patterns/status-light.css");
  assert.match(css, /\.uif-status-light/);
  assert.match(css, /var\(--uif-status-light-/);
  assert.doesNotMatch(css, /var\(--status-light-/);
});

test("Status Light token export contains canonical component variables", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.equal((tokenExport.match(/var\(--uif-status-light-/g) ?? []).length, 20);
  assert.doesNotMatch(tokenExport, /var\(--status-light-/);
});

test("Status Light integration surfaces emit canonical classes and tag registration", async () => {
  const [element, macros, renderers, schema, elementsIndex, packageJson] = await Promise.all([
    read("src/elements/ui-status-light.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-status-light.figma.ts"),
    read("src/elements/index.js"),
    read("package.json"),
  ]);

  for (const source of [element, macros, renderers, schema]) {
    assert.match(source, /uif-status-light/);
  }
  assert.match(element, /define\("uif-status-light", UIStatusLight\)/);
  assert.match(elementsIndex, /UIStatusLight/);
  assert.match(packageJson, /\"\.\/elements\/ui-status-light\"/);
});
