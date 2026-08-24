import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Notification CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/notification.css");
  for (const className of [
    "notification",
    "notification-stack",
    "notification-icon",
    "notification-content",
    "notification-message",
    "notification-action",
    "notification-dismiss",
  ]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${className}, \\.${className}\\)`));
  }
  assert.match(css, /var\(--uif-notification-/);
  assert.doesNotMatch(css, /var\(--notification-/);
});

test("Notification Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.ok((tokenExport.match(/var\(--uif-notification-/g) ?? []).length >= 8);
  assert.doesNotMatch(tokenExport, /var\(--notification-/);
});

test("Notification-owned emitters produce canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-notification.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-notification.figma.ts"),
  ]);

  for (const source of sources) assert.match(source, /uif-notification/);
  assert.doesNotMatch(sources[0], /class="notification(?:[\s"])/);
  assert.doesNotMatch(sources[3], /class="notification(?:[\s"])/);
});

test("Notification migration guide and registration use the canonical namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-notification.js"),
  ]);

  assert.match(documentation, /\| Notification \|.*`--uif-notification-\*`/);
  assert.match(element, /define\("uif-notification", UINotification\)/);
});
