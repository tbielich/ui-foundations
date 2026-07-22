import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const element = fs.readFileSync("src/elements/ui-tabs.js", "utf8");
const css = fs.readFileSync("src/ui/patterns/tabs.css", "utf8");

test("tabs implements keyboard, panel, overflow, and size contracts", () => {
  for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter"]) {
    assert.match(element, new RegExp(key));
  }
  assert.match(element, /aria-controls/);
  assert.match(element, /panel\.hidden/);
  assert.match(element, /uif-tab-change/);
  assert.match(css, /data-overflow="wrap"/);
  assert.match(css, /data-size="compact"/);
  assert.doesNotMatch(css, /scroll-snap-type/);
});
