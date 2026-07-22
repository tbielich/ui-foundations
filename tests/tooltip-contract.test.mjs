import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const element = fs.readFileSync("src/elements/ui-tooltip.js", "utf8");
const css = fs.readFileSync("src/ui/patterns/tooltip.css", "utf8");
const macro = fs.readFileSync("site/_includes/macros/ui.njk", "utf8");

test("tooltip exposes delay, arrow, and accessible description contract", () => {
  assert.match(element, /delay/);
  assert.match(element, /aria-describedby/);
  assert.match(element, /aria-hidden/);
  assert.match(css, /::after/);
  assert.match(css, /--uif-tooltip-delay/);
  assert.match(macro, /tooltipId/);
});
