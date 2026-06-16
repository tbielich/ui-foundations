---
title: Foundation-010 – Implementation and Pipeline Workflow
status: active
type: foundation-decision
---

# Foundation-010: Implementation and Pipeline Workflow

## Purpose

Define the stable implementation workflow for adding or updating UI foundations artifacts, including token generation, component integration, docs updates, and validation.

## Rules

1. Follow this sequence for new components:
   - Run boundary + utility check first (see Foundation-009).
   - Add/update Figma token exports in `figma/exports/`.
   - Regenerate artifacts via `npm run build:all`.
   - Add or update CSS pattern in `src/ui/patterns/`.
   - Export pattern in `src/ui/index.css`.
   - Add React wrapper only when needed.
   - Add docs + playground pages in `site/patterns/`.

2. Keep changes token-first:
   - Components consume semantic/foundation tokens.
   - Do not introduce component-local hard-coded colors.

3. Treat generated output as build artifacts:
   - `dist/tokens/` and `dist/` are generated outputs.
   - Build scripts in `scripts/` are the source for generation behavior.

4. Keep package runtime mode policy consumer-owned:
   - Token outputs define scopes/selectors.
   - Consumers decide when/how `data-mode` and `data-brand` are applied.

## Build and Validation

Use these commands as the baseline:

- `npm run lint`
- `npm run test:unit`
- `npm run ci:check`

Additional useful commands:

- `npm run tokens:generate`
- `npm run build:css`
- `npm run build:all`
- `npm run docs:site`

## Token Pipeline Notes

`scripts/extract-tokens.js` orchestrates generation.

Key helpers:

- `scripts/extract-tokens.utils.js`
- `scripts/extract-tokens.lookup.js`
- `scripts/extract-tokens.value.js`
- `scripts/extract-tokens.scope.js`

Scope behavior from export filenames:

- `Brand X.tokens.json` -> `:root[data-brand="x"]`
- `Mode Light.tokens.json` -> `:root`
- `Mode Dark.tokens.json` -> `:root[data-mode="dark"]`

Fallback behavior:

- Missing or invalid `com.figma.codeSyntax.WEB` falls back to auto-derived CSS variable names and is reported.
- Missing alias targets and alias cycles fall back to literal values and are reported.

## AI-Assisted Workflow

When using assistants for component incubation:

1. Define boundary (composition vs standalone).
2. Propose token naming + component structure.
3. Align/update Figma tokens.
4. Regenerate and integrate in code.
5. Update docs/playground.
6. Run validation commands before handoff.

## Implications

- The repository remains predictable for humans and assistants.
- Detailed operational guidance stays in foundations docs, not top-level onboarding.
- The README can remain minimal while implementation rigor stays explicit.
