import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  createTokenLookup,
  resolveAliasRef,
} = require("../scripts/extract-tokens.lookup.js");

function baseToken(overrides = {}) {
  return {
    pathSegments: ["Token"],
    type: "string",
    value: "",
    variableId: null,
    path: "Token",
    pathKey: "Token",
    aliasTargetId: null,
    aliasTargetName: null,
    aliasRefPath: null,
    webSyntax: null,
    cssVar: null,
    cssVarRef: null,
    sourceScope: "global:global",
    sourceFile: "",
    sourceFileName: "",
    ...overrides,
  };
}

test("resolveAliasRef resolves target via variable id", () => {
  const target = baseToken({
    path: "Color/Primary",
    pathKey: "Color.Primary",
    variableId: "VariableID:1/2",
    cssVar: "--color-primary",
    cssVarRef: "var(--color-primary)",
  });
  const source = baseToken({
    path: "Button/Background",
    pathKey: "Button.Background",
    aliasTargetId: "VariableID:1/2/Mode",
  });

  const lookup = createTokenLookup([source, target]);
  const report = { missingAliasTargets: [], aliasCycles: [] };

  assert.equal(resolveAliasRef(source, lookup, report), "var(--color-primary)");
  assert.equal(report.missingAliasTargets.length, 0);
  assert.equal(report.aliasCycles.length, 0);
});

test("resolveAliasRef reports missing targets", () => {
  const source = baseToken({
    path: "Button/Border",
    pathKey: "Button.Border",
    aliasTargetName: "Color/Missing",
  });

  const lookup = createTokenLookup([source]);
  const report = { missingAliasTargets: [], aliasCycles: [] };

  assert.equal(resolveAliasRef(source, lookup, report), null);
  assert.deepEqual(report.missingAliasTargets, ["Button/Border"]);
});

test("resolveAliasRef detects alias cycles", () => {
  const tokenA = baseToken({
    path: "A",
    pathKey: "A",
    variableId: "A",
    aliasTargetName: "B",
  });
  const tokenB = baseToken({
    path: "B",
    pathKey: "B",
    variableId: "B",
    aliasTargetName: "A",
  });

  const lookup = createTokenLookup([tokenA, tokenB]);
  const report = { missingAliasTargets: [], aliasCycles: [] };

  assert.equal(resolveAliasRef(tokenA, lookup, report), null);
  assert.deepEqual(report.aliasCycles, ["A"]);
});


test("resolveAliasRef resolves targets via normalized path matching", () => {
  const target = baseToken({
    path: "Typography/Label/Font Weight",
    pathKey: "Typography.Label.Font Weight",
    cssVar: "--typography-label-font-weight",
  });
  const source = baseToken({
    path: "Button/Font Weight",
    pathKey: "Button.Font Weight",
    aliasRefPath: "typography.label.font weight",
  });

  const lookup = createTokenLookup([source, target]);

  assert.equal(
    resolveAliasRef(source, lookup, { missingAliasTargets: [], aliasCycles: [] }),
    "var(--typography-label-font-weight)",
  );
});
