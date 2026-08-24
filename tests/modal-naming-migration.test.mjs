import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Modal CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const [css, layout] = await Promise.all([
    read("src/ui/patterns/modal.css"),
    read("src/core/recipes/layout.css"),
  ]);

  for (const className of ["modal-root", "modal-overlay", "modal"]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${className}, \\.${className}\\)`));
  }
  assert.match(layout, /:is\(\.uif-modal-overlay, \.modal-overlay\)/);
  assert.match(layout, /:is\(\.uif-modal, \.modal\)/);
  assert.match(css, /var\(--uif-modal-/);
  assert.doesNotMatch(css, /var\(--modal-/);
  assert.doesNotMatch(css, /\.uif-modal(?:__|--)/);
});

test("Modal Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  const canonical = tokenExport.match(/var\(--uif-modal-/g) ?? [];

  assert.equal(canonical.length, 3);
  assert.doesNotMatch(tokenExport, /var\(--modal-/);
});

test("Modal-owned emitters produce canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-modal.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-modal.figma.ts"),
  ]);

  for (const source of sources) assert.match(source, /uif-modal/);
  assert.doesNotMatch(sources[0], /class="modal(?:[\s"])/);
  assert.doesNotMatch(sources[3], /class="modal(?:[\s"])/);
});

test("Modal migration guide and registration use the canonical namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-modal.js"),
  ]);

  assert.match(documentation, /\| Modal \|.*`--uif-modal-\*`/);
  assert.match(element, /define\("uif-modal", UIModal\)/);
});
