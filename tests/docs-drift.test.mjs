import assert from "node:assert/strict";
import test from "node:test";
import { runDocsDriftCheck } from "../scripts/check-docs-drift.mjs";

test("documentation baseline has no detectable drift", () => {
  assert.equal(runDocsDriftCheck(), 0);
});
