import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

async function loadComboBoxModule() {
  if (!globalThis.HTMLElement) globalThis.HTMLElement = class {};
  if (!globalThis.customElements) {
    const registry = new Map();
    globalThis.customElements = {
      define(name, ctor) {
        registry.set(name, ctor);
      },
      get(name) {
        return registry.get(name);
      },
    };
  }

  return import(new URL("../src/elements/ui-combobox.js", import.meta.url));
}

test("ComboBox CSS exposes canonical UIF naming with a v1 class alias", async () => {
  const css = await read("src/ui/patterns/combobox.css");
  assert.match(css, /:is\(\.uif-combobox, \.combobox\)/);
  assert.match(css, /var\(--uif-combobox-/);
  assert.doesNotMatch(css, /var\(--combobox-/);
  assert.doesNotMatch(css, /\.uif-combobox(?:__|--)/);
});

test("ComboBox Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.equal((tokenExport.match(/var\(--uif-combobox-/g) ?? []).length, 41);
  assert.doesNotMatch(tokenExport, /var\(--combobox-/);
});

test("ComboBox-owned emitters use canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-combobox.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("site/assets/playground/code-generators.js"),
    read("schemas/web-combobox.figma.ts"),
  ]);
  for (const source of sources) assert.match(source, /uif-combobox/);
});

test("ComboBox macro and schema stay aligned with runtime filtering and public props", async () => {
  const [macro, schema] = await Promise.all([
    read("site/_includes/macros/ui.njk"),
    read("schemas/web-combobox.ts"),
  ]);

  assert.match(macro, /set visibleOptions = \[\]/);
  assert.match(macro, /normalizedQuery in haystack/);
  assert.match(macro, /for opt in visibleOptions/);
  assert.match(schema, /allowCustomValue\?: boolean;/);
  assert.match(schema, /ariaLabel\?: string;/);
  assert.match(schema, /ariaLabelledby\?: string;/);
  assert.match(schema, /invalid\?: boolean;/);
  assert.match(schema, /loading\?: boolean;/);
  assert.match(schema, /name\?: string;/);
});

test("ComboBox registration and migration guide use the canonical namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-combobox.js"),
  ]);
  assert.match(documentation, /\| ComboBox \|.*`--uif-combobox-\*`/);
  assert.match(element, /define\("uif-combobox", UIComboBox\)/);
});

test("ComboBox filtering helpers normalize grouped options and skip disabled items during navigation", async () => {
  const {
    normalizeComboBoxOptions,
    filterComboBoxOptions,
    getNextComboBoxActiveIndex,
  } = await loadComboBoxModule();

  const options = normalizeComboBoxOptions([
    {
      group: "Islands",
      items: [
        { value: "pmi", label: "Palma", description: "Spain" },
        { value: "her", label: "Heraklion", description: "Greece", disabled: true },
      ],
    },
    { value: "fue", label: "Fuerteventura", keywords: ["canary"] },
  ]);

  assert.equal(options[0].group, "Islands");
  assert.equal(filterComboBoxOptions(options, "canary")[0].value, "fue");
  assert.equal(getNextComboBoxActiveIndex(options, -1, 1), 0);
  assert.equal(getNextComboBoxActiveIndex(options, 0, 1), 2);
});
