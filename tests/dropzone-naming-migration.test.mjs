import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Dropzone CSS exposes canonical UIF naming and component tokens", async () => {
  const css = await read("src/ui/patterns/dropzone.css");

  for (const className of ["dropzone", "dropzone-input", "dropzone-label", "dropzone-hint", "dropzone-button", "dropzone-files"]) {
    assert.match(css, new RegExp(`\\.uif-${className}`));
  }

  assert.match(css, /var\(--uif-dropzone-/);
  assert.doesNotMatch(css, /\.dropzone(?:[\s.{:#])/);
  assert.doesNotMatch(css, /var\(--dropzone-/);
});

test("Dropzone Figma export contains canonical component tokens", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  const expectedTokens = [
    "--uif-dropzone-text-color-default",
    "--uif-dropzone-text-color-subtle",
    "--uif-dropzone-text-color-disabled",
    "--uif-dropzone-text-color-dragover",
    "--uif-dropzone-border-color-default",
    "--uif-dropzone-border-color-dragover",
    "--uif-dropzone-border-color-filled",
    "--uif-dropzone-border-color-disabled",
    "--uif-dropzone-border-size-default",
    "--uif-dropzone-border-radius",
    "--uif-dropzone-container-background-default",
    "--uif-dropzone-container-background-dragover",
    "--uif-dropzone-container-background-filled",
    "--uif-dropzone-container-background-disabled",
    "--uif-dropzone-padding-inline",
    "--uif-dropzone-padding-block",
    "--uif-dropzone-gap",
  ];

  for (const token of expectedTokens) {
    assert.match(tokenExport, new RegExp(`var\\(${token}\\)`));
  }
  assert.doesNotMatch(tokenExport, /var\(--dropzone-/);
});

test("Dropzone-owned emitters and docs use canonical classes and multiple/accept support", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-dropzone.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-dropzone.figma.ts"),
  ]);

  for (const source of sources) {
    assert.match(source, /uif-dropzone/);
  }

  const docs = await read("site/patterns/dropzone.md");
  const playground = await read("site/patterns/dropzone-playground.md");
  assert.match(docs, /uif\.dropzone/);
  assert.match(playground, /renderer:\s*dropzone/);
  assert.match(playground, /tokenCssPath:\s*src\/ui\/patterns\/dropzone\.css/);

  assert.match(sources[0], /define\("uif-dropzone", UIDropzone\)/);
  assert.match(sources[0], /accept/);
  assert.match(sources[0], /multiple/);
  assert.match(sources[0], /is-dragover/);
  assert.match(sources[0], /is-filled/);
  assert.match(sources[1], /uif-dropzone-button/);
  assert.match(sources[2], /renderVanillaDropzone/);
  assert.match(sources[3], /uif-dropzone-input/);
});
