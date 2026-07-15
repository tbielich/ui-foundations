import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Icon CSS exposes canonical UIF naming with only the v1 class alias", async () => {
  const css = await read("src/ui/patterns/icon.css");

  assert.match(css, /:is\(\.uif-icon, \.icon\)/);
  assert.match(css, /var\(--uif-icon-src\)/);
  assert.doesNotMatch(css, /var\(--icon-src\)/);
  assert.doesNotMatch(css, /\.uif-icon(?:__|--)/);
});

test("Icon-owned emitters produce only the canonical public API", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-icon.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/_includes/macros/calendar.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-icon.figma.ts"),
    read("schemas/web-link.figma.ts"),
    read("packages/mcp-server/src/resources/components.ts"),
  ]);

  for (const source of sources) {
    assert.match(source, /uif-icon/);
    assert.doesNotMatch(source, /--icon-src/);
    assert.doesNotMatch(source, /class="icon(?:\s|")/);
  }
});

test("the MCP pattern generator resolves canonical selectors before legacy aliases", async () => {
  const generator = await read("packages/mcp-server/src/resources/components.ts");

  assert.match(generator, /const canonicalClassName = `uif-\$\{componentName\}`/);
  assert.match(generator, /cssContent\.includes\(`\.\$\{canonicalClassName\}`\)/);
  assert.match(generator, /--uif-icon-src/);
});

test("shared pattern selectors accept canonical and legacy Icon classes", async () => {
  const patterns = await Promise.all(
    ["badge", "button", "input", "label", "link"].map((name) =>
      read(`src/ui/patterns/${name}.css`),
    ),
  );

  for (const css of patterns) {
    assert.match(css, /:is\(\.uif-icon, \.icon\)/);
  }
});

test("the namespaced runtime input remains code-only rather than a Figma token", async () => {
  const [validator, tokenExport, documentation] = await Promise.all([
    read("scripts/validate-token-usage.mjs"),
    read("figma/exports/Patterns (UI).tokens.json"),
    read("site/patterns/icon.md"),
  ]);

  assert.match(validator, /"--uif-icon-src"/);
  assert.doesNotMatch(validator, /"--icon-src"/);
  assert.doesNotMatch(tokenExport, /--uif-icon-src/);
  assert.match(documentation, /legacy\s+`--icon-src` custom property has no library-owned alias/);
});
