import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Calendar CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/calendar.css");

  for (const className of [
    "calendar",
    "calendar-header",
    "calendar-selectors",
    "calendar-nav",
    "calendar-header-select",
    "calendar-table",
    "calendar-cell",
    "calendar-month-panel",
    "calendar-month-label",
  ]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${className}, \\.${className}\\)`));
  }

  assert.match(css, /var\(--uif-calendar-/);
  assert.doesNotMatch(css, /var\(--calendar-/);
  assert.doesNotMatch(css, /\.uif-calendar(?:__|--)/);
});

test("Calendar Figma export contains all canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  const canonical = tokenExport.match(/var\(--uif-calendar-/g) ?? [];

  assert.equal(canonical.length, 21);
  assert.doesNotMatch(tokenExport, /var\(--calendar-/);
});

test("Calendar-owned emitters produce canonical classes and shared dependencies", async () => {
  const [macro, renderer] = await Promise.all([
    read("site/_includes/macros/calendar.njk"),
    read("site/assets/playground/renderers.js"),
  ]);

  for (const source of [macro, renderer]) {
    assert.match(source, /uif-calendar/);
    assert.match(source, /uif-button/);
    assert.match(source, /uif-icon/);
    assert.doesNotMatch(source, /class="calendar(?:[\s-"])/);
    assert.doesNotMatch(source, /class="button ghost"/);
  }

  assert.match(macro, /set cellClasses = "uif-calendar-cell"/);
  assert.match(renderer, /const classes = \["uif-calendar-cell"\]/);
});

test("Calendar behavior accepts legacy markup but renders canonical cells", async () => {
  const [calendar, dateInput, dateInputCss] = await Promise.all([
    read("src/ui/components/calendar.js"),
    read("src/ui/components/date-input.js"),
    read("src/ui/patterns/date-input.css"),
  ]);

  assert.match(calendar, /:is\(\.uif-calendar, \.calendar\)/);
  assert.match(calendar, /button:is\(\.uif-calendar-cell, \.calendar-cell\)/);
  assert.match(calendar, /const classes = \["uif-calendar-cell"\]/);
  assert.match(dateInput, /querySelector\(":is\(\.uif-calendar, \.calendar\)"\)/);
  assert.match(dateInputCss, /:is\(\.uif-calendar, \.calendar\)/);
});

test("Calendar no longer relies on pending-export token exceptions", async () => {
  const [validator, documentation] = await Promise.all([
    read("scripts/validate-token-usage.mjs"),
    read("MIGRATION.md"),
  ]);

  assert.doesNotMatch(validator, /calendar-cell-background-selected/);
  assert.doesNotMatch(validator, /calendar-cell-text-color-selected/);
  assert.match(documentation, /\| Calendar \|.*`--uif-calendar-\*`/);
});
