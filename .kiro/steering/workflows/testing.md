---
inclusion: manual
---

# Testing Conventions

## Test Runner

Node.js built-in test runner (`node:test`). No external test framework.

```bash
npm run test:unit        # runs: node --test tests/*.test.mjs
```

## File Conventions

- Location: `tests/` (root-level)
- Naming: `*.test.mjs` (ES modules)
- Imports: `node:test` for `test()`, `node:assert/strict` for assertions
- Use `createRequire` when importing CJS modules from test files

## Current Test Coverage

| File | Tests |
|------|-------|
| `extract-tokens.utils.test.mjs` | `parseWebSyntax`, `formatLength` |
| `extract-tokens.lookup.test.mjs` | Token lookup/resolution logic |
| `extract-tokens.scope-value.test.mjs` | Scope extraction from token paths |
| `plugin-code.test.mjs` | Figma plugin color utilities |

Coverage focus: token pipeline scripts only. No component rendering, macro, or
Component migration tests currently exist.

## Writing a New Test

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { myFunction } = require("../scripts/my-module.js");

test("myFunction does the thing", () => {
  assert.equal(myFunction("input"), "expected");
});

test("myFunction handles edge case", () => {
  assert.throws(() => myFunction(null), /error message/);
});
```

## What to Test

When adding new scripts or utilities:
- Pure functions in `scripts/` (token transforms, validators, parsers)
- Data loaders in `site/lib/` and `site/_data/`
- Build-time logic that can be unit tested without a browser

When NOT required (currently):
- Component CSS rendering (no visual regression framework)
- Browser-only Custom Element behavior (no DOM test environment)
- Nunjucks macro output (tested indirectly via docs build)
- Browser-side playground JS

## Validation Beyond Unit Tests

The `ci:check` pipeline runs several non-test validators:

| Script | Validates |
|--------|-----------|
| `smoke:check` | Built files exist with expected content |
| `tokens:validate` | Token structure, alias resolution, CSS var consistency |
| `tokens:usage` | CSS patterns use only declared tokens |
| `dtcg:validate` | DTCG format compliance |
| `assets:check` | Icon references in CSS/macros resolve to actual files |
| `rules:validate` | Rule pipeline traceability (principle → pattern → component) |

## Pre-commit Hook

`.githooks/pre-commit` runs `npm run lint` + `npm run test:unit` before every
commit. Configure with: `git config core.hooksPath .githooks`
