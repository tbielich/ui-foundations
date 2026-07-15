import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Accordion CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/accordion.css");

  for (const className of ["accordion", "accordion-item", "accordion-item-content"]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${className}, \\.${className}\\)`));
  }
  assert.match(css, /var\(--uif-accordion-/);
  assert.doesNotMatch(css, /var\(--accordion-/);
  assert.doesNotMatch(css, /\.uif-accordion(?:__|--)/);
});

test("Accordion Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  const canonical = tokenExport.match(/var\(--uif-accordion-/g) ?? [];

  assert.equal(canonical.length, 8);
  assert.doesNotMatch(tokenExport, /var\(--accordion-/);
});

test("Accordion-owned emitters produce canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-accordion.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-accordion.figma.ts"),
  ]);

  for (const source of sources) {
    assert.match(source, /uif-accordion/);
  }
  assert.doesNotMatch(sources[0], /class="accordion(?:[\s"])/);
  assert.doesNotMatch(sources[3], /class="accordion(?:[\s"])/);
});

test("Accordion documentation explains migration while registrations stay stable", async () => {
  const [documentation, element] = await Promise.all([
    read("site/patterns/accordion.md"),
    read("src/elements/ui-accordion.js"),
  ]);

  assert.match(documentation, /legacy\s+`--accordion-\*` token aliases are not provided/);
  assert.match(element, /define\("ui-accordion", UIAccordion\)/);
  assert.match(element, /define\("ui-accordion-item", UIAccordionItem\)/);
});
