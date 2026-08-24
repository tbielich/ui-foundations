import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Illustrated Message CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/illustrated-message.css");

  for (const className of [
    "illustrated-message",
    "illustrated-message-illustration",
    "illustrated-message-content",
    "illustrated-message-heading",
    "illustrated-message-description",
    "illustrated-message-actions",
  ]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${className}, \\.${className}\\)`));
  }

  assert.match(css, /var\(--uif-illustrated-message-/);
  assert.doesNotMatch(css, /var\(--illustrated-message-/);
});

test("Illustrated Message Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");

  for (const tokenName of [
    "--uif-illustrated-message-gap",
    "--uif-illustrated-message-content-gap",
    "--uif-illustrated-message-heading-text-color",
    "--uif-illustrated-message-description-text-color",
    "--uif-illustrated-message-illustration-color",
    "--uif-illustrated-message-illustration-size",
  ]) {
    assert.match(tokenExport, new RegExp(tokenName.replaceAll("-", "\\-")));
  }
  assert.doesNotMatch(tokenExport, /var\(--illustrated-message-/);
});

test("Illustrated Message-owned emitters produce canonical classes and preset support", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-illustrated-message.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-illustrated-message.figma.ts"),
  ]);

  for (const source of sources) {
    assert.match(source, /uif-illustrated-message/);
    assert.match(source, /empty/);
    assert.match(source, /error/);
    assert.match(source, /no-results/);
  }

  assert.match(sources[0], /slot="illustration"/);
  assert.match(sources[0], /slot="action"/);
  assert.doesNotMatch(sources[0], /class="illustrated-message(?:[\s"])/);
  assert.doesNotMatch(sources[3], /["']illustrated-message["']/);
});

test("Illustrated Message public registration and package export use the canonical namespace", async () => {
  const [elementIndex, declarations, packageJson] = await Promise.all([
    read("src/elements/index.js"),
    read("src/elements/index.d.ts"),
    read("package.json"),
  ]);

  assert.match(elementIndex, /UIIllustratedMessage/);
  assert.match(declarations, /"uif-illustrated-message": UIIllustratedMessage/);
  assert.equal(JSON.parse(packageJson).exports["./elements/ui-illustrated-message"], "./dist/elements/ui-illustrated-message.js");
});
