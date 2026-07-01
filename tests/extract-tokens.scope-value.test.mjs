import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  buildTokenKey,
  classifyTokenGroup,
  formatTokenValue,
  resolveTokenOutputValue,
  toNumericFontWeight,
} = require("../scripts/extract-tokens.value.js");
const {
  parseScopeKey,
  selectorForScope,
  normalizePerFileBase,
} = require("../scripts/extract-tokens.scope.js");

test("buildTokenKey creates kebab-case keys", () => {
  assert.equal(buildTokenKey(["Button", "Text", "Color", "Default"]), "button-text-color-default");
});

test("classifyTokenGroup maps tokens by path/prefix", () => {
  assert.equal(
    classifyTokenGroup({ pathSegments: ["Color", "Text"], cssVar: "--color-text-default" }),
    "colors",
  );
  assert.equal(
    classifyTokenGroup({ pathSegments: ["Breakpoint", "100"], cssVar: "--breakpoint-100" }),
    "breakpoints",
  );
  assert.equal(
    classifyTokenGroup({ pathSegments: ["Input", "Text"], cssVar: "--input-text-color" }),
    "components",
  );
});

test("formatTokenValue preserves layout columns and z-index numbers", () => {
  assert.equal(
    formatTokenValue(
      { type: "number" },
      12,
      "layout-columns",
      ["Layout", "Columns"],
    ),
    12,
  );
  assert.equal(
    formatTokenValue({ type: "number" }, 30, "zindex-toast", ["zIndex", "toast"]),
    30,
  );
});

test("scope helpers normalize and resolve selectors", () => {
  assert.deepEqual(parseScopeKey("brand:a"), { bucket: "brand", id: "a" });
  assert.equal(selectorForScope({ bucket: "mode", id: "dark" }), ':root[data-mode="dark"]');
  assert.equal(normalizePerFileBase("mode-light.tokens"), "color.light.tokens");
});

test("toNumericFontWeight maps named and numeric weights", () => {
  assert.equal(toNumericFontWeight("semi-bold"), 600);
  assert.equal(toNumericFontWeight("700"), 700);
  assert.equal(toNumericFontWeight(400), 400);
  assert.equal(toNumericFontWeight("unknown-weight"), null);
});

test("resolveTokenOutputValue converts unresolved font weight refs to numeric values", () => {
  const token = {
    type: "fontWeight",
    value: { $ref: "Font/Weight/700" },
    pathSegments: ["Typography", "Label", "Font Weight"],
    aliasTargetId: null,
    aliasTargetName: null,
    aliasRefPath: null,
  };

  const report = { missingAliasTargets: [], aliasCycles: [] };
  assert.equal(resolveTokenOutputValue(token, { byId: new Map(), byPath: new Map() }, report), 700);
});


test("resolveTokenOutputValue falls back to CSS var for unresolved non-font aliases", () => {
  const token = {
    type: "string",
    value: { $ref: "Color/Text/Default" },
    pathSegments: ["Button", "Text Color"],
    aliasTargetId: null,
    aliasTargetName: null,
    aliasRefPath: null,
  };

  const report = { missingAliasTargets: [], aliasCycles: [] };
  assert.equal(
    resolveTokenOutputValue(token, { byId: new Map(), byPath: new Map() }, report),
    "var(--color-text-default)",
  );
});

test("formatTokenValue handles DTCG dimension objects", () => {
  assert.equal(
    formatTokenValue(
      { type: "dimension" },
      { value: 40, unit: "px" },
      "select-height",
      ["Select", "Height"],
    ),
    "2.5rem",
  );
  assert.equal(
    formatTokenValue(
      { type: "dimension" },
      { value: 1.5, unit: "rem" },
      "select-height",
      ["Select", "Height"],
    ),
    "1.5rem",
  );
});
