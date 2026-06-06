# UI Foundations — Codex Instructions

Read `AGENTS.md` first, then this file for Codex-specific execution guidance.

---

## Context Loading

Before working on any task, read these files in order:

1. `AGENTS.md` — operational rules
2. `IMPLEMENTATION.md` — repo structure and conventions
3. `docs/agentic/assistant-behavior-rules.md` — component rules (Rule 8–13)
4. This file — component creation checklist and validation

---

## Component Creation Checklist (11 Surfaces)

When creating a new component, ALL of these surfaces must be completed:

| # | Surface | Path |
|---|---------|------|
| 1 | Component Tokens | `figma/exports/Components (UI).tokens.json` |
| 2 | CSS Pattern | `src/ui/patterns/{component}.css` |
| 3 | CSS Index | `src/ui/index.css` (add import) |
| 4 | Nunjucks Macro | `site/_includes/macros/ui.njk` |
| 5 | React Wrapper | `src/react/{component}.js` |
| 6 | React Index | `src/react/index.js` (add export) |
| 7 | Docs Page | `site/components/{component}.md` |
| 8 | Playground Page | `site/components/{component}-playground.md` |
| 9 | Playground Renderer | `site/assets/playground/renderers.js` |
| 10 | Code Connect | `schemas/web-{component}.figma.ts` |
| 11 | Components Index | `site/components/index.md` (add card) |

Missing any surface will cause broken pages or incomplete integration.

---

## CSS Pattern Rules (Rule 11)

- Class = bare component name: `.select`, not `.ui-select`
- Always wrap in `@layer components { }`
- Logical properties: `inline-size`/`block-size`, not `width`/`height`
- All values via `var(--token)` — never hardcode
- States: pseudo-classes AND fallback classes (`.is-hover`, `.is-disabled`)
- Focus: `box-shadow: 0 0 0 var(--shadow-focus, 0) var(--color-focus, transparent);`

---

## React Wrapper Rules (Rule 12)

- Named `export function` — never `export const` with arrow
- Use `React.createElement` — never JSX
- No CSS imports in React files
- Class array pattern:
  ```js
  const classes = ["component"];
  if (className) classes.push(className);
  ```
- Warn when interactive components lack `aria-label` or `aria-labelledby`
- Use `warnDev()` helper from `./warn-dev.js`

---

## Token Rules (Rule 9–10)

- Every component gets its OWN tokens: `--component-part-property-state`
- Never reference another component's tokens
- Token aliases must point to tokens that actually exist
- Run `npm run tokens:generate` and check for missing alias warnings
- Components reference only Semantic or Core layer — never raw values

---

## Nunjucks Macro Pattern

Follow existing macros in `site/_includes/macros/ui.njk`:
- Macro name: `ui.{component}(params)`
- Parameters with defaults
- State classes: `is-hover`, `is-active`, `is-focus-visible`, `is-disabled`
- Accessibility attributes (role, aria-*)

---

## Playground Integration

1. Add renderer function to `site/assets/playground/renderers.js`
2. Register in the `renderers` map at the bottom of that file
3. Add code generators to `site/assets/playground/code-generators.js`
4. Register in both `njk` and `react` maps
5. Playground page YAML must have `renderer: {component}` matching the key

---

## Icons

- Never draw vector graphics — always reuse icons from `src/assets/icons/`
- If needed, rotate existing icons
- Use the Icon component (`ui.icon()` macro / `.icon` class)
- Color with semantic tokens: `--color-text-success`, `--color-text-brand`, etc.

---

## Docs Page Template

Follow the structure in existing component docs (e.g. `site/components/input.md`):
1. Hero with brand/mode switches
2. Anatomy with numbered callouts
3. Options (states grid + table)
4. Behaviors (2-column list)
5. Usage guidelines (do/don't)
6. Content standards
7. Keyboard interactions
8. Accessibility
9. Theming
10. Design checklist

---

## Validation (REQUIRED before commit)

```bash
npm run ci:check
```

This runs: lint → test:unit → build:all → smoke:check → tokens:validate →
assets:check → rules:validate → docs:build

---

## What Codex Cannot Do

These require Kiro or manual Figma work:
- Creating Figma components (use `use_figma` MCP tool)
- Publishing components to the Figma team library
- Registering Code Connect mappings in Figma
- Live preview on localhost

For these, leave a TODO comment or note in the PR description.

---

## Branch and Commit Convention

- Feature branch: `feat/{component}-component`
- Commit: `feat({component}): add {name} component`
- Never push directly to main
