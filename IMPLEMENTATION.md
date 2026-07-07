# UI Foundations — Implementation Guide

This file provides implementation details for working in this repository.

Follow `AGENTS.md` for operational rules and source priority.
Follow `docs/ui-foundations-rules.md` for the canonical governance model covering token layering, naming, brand/mode context, design-to-code parity, review criteria, and agent-readiness.
This file should add implementation detail, not redefine those rules.

---

## Project Overview

This is a token-first design system (`ui-foundations`).\
Figma is the single source of truth.

Token flow: Figma Variables → JSON exports → generated CSS/TS/JSON → consumed by components

Tech stack:

- Vanilla CSS (Custom Properties + @layer)
- Node.js
- Eleventy (11ty)
- React (optional wrappers)
- Nunjucks macros

---

## Figma MCP Integration — Implementation Flow

1. Call `get_design_context` for the target node
2. If truncated:
   - call `get_metadata`
   - then re-fetch specific nodes
3. Call `get_screenshot` and keep it as visual reference
4. Download assets (SVGs/images) from MCP response
   - use localhost URLs directly
5. Translate output into project conventions
6. Validate result against screenshot

Note: MCP output is a design reference, not final code.

This repository uses MCP as the active Figma integration path.
The Figma plugin under `figma/plugin/` is a standalone validation/export tool
loaded directly in Figma. It is not part of the site build or token pipeline, but
it is actively maintained — `scripts/generate-plugin-meta.mjs` generates its
entry file and `tests/plugin-code.test.mjs` covers its color utilities.

---

## Token Architecture

Four layers:

- Core (Primitives)
- Appearance (Modes)
- Semantics (Brands)
- Patterns (UI) / Components

Locations:

- Core: `dist/tokens/css/core-primitives.tokens.css`
- Appearance: `dist/tokens/css/appearance-modes.tokens.mode-*.css`
- Brand semantics: `dist/tokens/css/semantics-brands.tokens.brand-*.css`
- Patterns: `dist/tokens/css/patterns-ui.tokens.css`

Notes:

- Pattern and component tokens reference semantic roles or Core tokens
- Typography tokens never include color
- Generated files in `dist/` are not edited directly

---

## Token Naming

- Component: `Component.variant.part.property.state` → `--component-variant-part-property-state`
- Brand semantic: role-based and brand-scoped (e.g. `Brand.Color.*`, `Brand.Corner.*`)
- States: `default`, `hover`, `active`, `focus`, `disabled`
- CSS variables: kebab-case with `--`

---

## CSS Methodology

- Use CSS Custom Properties: `var(--token-name)`
- Use CSS Layers: `reset → base → tokens → context → components`

Runtime switching:

- `data-brand`
- `data-mode`

No:

- Tailwind
- CSS Modules
- styled-components

---

## Pattern Implementation

HTML patterns:

```html
<button class="button">Label</button>
<button class="button outline">Outline</button>
<input class="input" type="text" />
<a class="link">Link</a>
```

Nunjucks:

```njk
{{ ui.button("Label") }}
{{ ui.input(type="text") }}
```

React (optional):

```js
<Button variant="outline" />
```

---

## File Locations

- CSS patterns: `src/ui/patterns/*.css`
- React: `src/react/*.js`
- Macros: `site/_includes/macros/ui.njk` (source), `dist/macros/ui.njk` (generated copy)
- Code Connect: `schemas/*.figma.ts`
- Token exports: `figma/exports/*.tokens.json`
- Generated tokens: `dist/tokens/`
- Docs: `site/`
- Rule pipeline docs: `docs/agentic/`
- Rule pipeline validation: `docs/validation/rule-pipeline.manifest.json`, `scripts/validate-rule-pipeline.mjs`

---

## Pattern Workflow

1. Update Figma token exports
2. Run: npm run build\:all
3. Add CSS pattern
4. Export pattern
5. Add React wrapper (if needed)
6. Add Code Connect file
7. Add docs page

---

## Token Pipeline

Figma → exports → generate → dist → build CSS

Commands:

- npm run tokens\:sync — Figma dump → exports → generate (agent workflow)
- npm run tokens\:dump — prints Figma plugin code for MCP export
- npm run tokens\:generate — regenerate dist/ from existing exports
- npm run build\:css — build CSS bundles from generated tokens
- npm run build\:all — icons + tokens + CSS (full rebuild)
- npm run rules\:validate — check rule pipeline traceability
- npm run docs\:site — build documentation site

See `docs/token-sync-workflow.md` for the full agent-assisted sync workflow.

---

## Assets

- Icons: `src/assets/icons/`
- Use MCP-provided assets directly
- Do not add new icon packages
- No placeholders

---

## Validation Checklist

- Layout matches Figma
- Typography correct
- Uses tokens (no hardcoded values)
- States implemented
- Brand/mode switching works

---

## Key References

- docs/foundations/
- docs/agentic/
- Figma file
- Docs site
