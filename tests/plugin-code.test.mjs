import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  valuesMatch,
  toHex,
  expandShortHex,
} = require("../figma/plugin/color-utils.js");

test("expandShortHex expands 3- and 4-digit hex colors", () => {
  assert.equal(expandShortHex("#fff"), "#ffffff");
  assert.equal(expandShortHex("#ffff"), "#ffffffff");
  assert.equal(expandShortHex("#ffffff"), "#ffffff");
});

test("toHex normalizes short and long hex colors consistently", () => {
  assert.equal(toHex("#fff"), "#ffffff");
  assert.equal(toHex("#ffffff"), "#ffffff");
  assert.equal(toHex("#ffffffff"), "#ffffff");
});

test("valuesMatch treats equivalent short and long hex colors as equal", () => {
  assert.equal(valuesMatch("#fff", "#ffffff"), true);
  assert.equal(valuesMatch("#ffff", "#ffffff"), true);
  assert.equal(valuesMatch("#000", "#ffffff"), false);
});
