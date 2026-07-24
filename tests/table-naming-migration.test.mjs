import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Table CSS exposes canonical UIF naming and component tokens", async () => {
  const css = await read("src/ui/patterns/table.css");

  assert.match(css, /:is\(\.uif-table-wrapper, \.table-wrapper\)/);
  assert.match(css, /:is\(\.uif-table, \.table\)/);
  assert.match(css, /uif-table-th/);
  assert.match(css, /uif-table-tr/);
  assert.match(css, /uif-table-td/);
  assert.match(css, /:is\(\.uif-table-empty, \.table-empty\)/);

  assert.match(css, /var\(--uif-table-/);
  assert.match(css, /var\(--runtime-table-col-width, auto\)/);
});

test("Table Figma export defines the expected canonical component tokens", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");

  for (const token of [
    "--uif-table-header-background",
    "--uif-table-header-text-color",
    "--uif-table-header-border-color",
    "--uif-table-row-background",
    "--uif-table-row-background-hover",
    "--uif-table-row-background-selected",
    "--uif-table-row-border-color",
    "--uif-table-row-text-color",
    "--uif-table-padding-block-default",
    "--uif-table-padding-block-compact",
    "--uif-table-padding-block-spacious",
    "--uif-table-padding-inline-default",
    "--uif-table-padding-inline-compact",
    "--uif-table-font-family",
    "--uif-table-font-size",
    "--uif-table-border-radius",
  ]) {
    assert.match(tokenExport, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(tokenExport, /var\(--table-/);
});

test("Table-owned emitters produce canonical classes", async () => {
  const [macro, renderer, documentation, playground, schema, indexPage, indexCss] = await Promise.all([
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("site/patterns/table.md"),
    read("site/patterns/table-playground.md"),
    read("schemas/web-table.figma.ts"),
    read("site/patterns/index.md"),
    read("src/ui/index.css"),
  ]);
  const generator = await read("site/assets/playground/code-generators.js");

  for (const source of [macro, renderer, documentation, schema]) {
    assert.match(source, /uif-table/);
  }

  assert.match(macro, /macro table\(/);
  assert.match(macro, /uif-table-th/);
  assert.match(renderer, /table: renderVanillaTable/);
  assert.match(generator, /table: function \(state\)/);
  assert.match(generator, /uif\.table/);
  assert.match(playground, /renderer: table/);
  assert.match(playground, /components\/table\.js/);
  assert.match(indexPage, /href="\/patterns\/table\/"/);
  assert.match(indexPage, /uif\.table/);
  assert.match(indexCss, /patterns\/table\.css/);
});

test("Table progressive enhancement exposes sort, selection, resize, and auto-init hooks", async () => {
  const source = await read("src/ui/components/table.js");

  assert.match(source, /const TABLE_SELECTOR = ":is\(\.uif-table, \.table\)"/);
  assert.match(source, /export function enhanceTable/);
  assert.match(source, /export function observeTable/);
  assert.match(source, /CustomEvent\("uif:sort"/);
  assert.match(source, /CustomEvent\("uif:select"/);
  assert.match(source, /th\[data-resizable\]/);
  assert.match(source, /window\.__TABLE_NO_AUTO/);
});
