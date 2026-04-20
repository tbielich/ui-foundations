---
inclusion: always
---

# UI Foundations — Design System Context

This is a token-first, Figma-aligned design system. Figma is the single source of truth.

## Token Architecture (4 layers)

| Layer | Purpose | Location |
|---|---|---|
| Core (Primitives) | Raw values: spacing, radii, borders, typography | `dist/tokens/css/core-primitives.tokens.css` |
| Color Modes | Light/dark color palettes, no semantics | `dist/tokens/css/appearance-modes.tokens.mode-*.css` |
| Semantics (Roles) | Intent-based: `--color-text-default`, `--color-fill-surface` | `dist/tokens/css/semantics-roles.tokens.css` |
| Components (UI) | Component-specific: `--button-solid-border-color-default` | `dist/tokens/css/components-ui.tokens.css` |

Rules: Components reference only Semantic or Core. Never mix layers. Never hardcode values.

## Token Naming

- Component: `--component-variant-part-property-state` (e.g. `--button-solid-container-background-hover`)
- Semantic: role-based (e.g. `--color-text-default`, `--color-fill-brand`)
- States: `default`, `hover`, `active`, `focus`, `disabled` — always last segment

## Token Pipeline

`figma/exports/*.tokens.json` → `npm run tokens:generate` → `dist/tokens/css/*.css`

Figma exports are the source. Generated files in `dist/` are never edited directly.

## File Locations

| Surface | Path |
|---|---|
| CSS patterns | `src/ui/patterns/*.css` |
| CSS index | `src/ui/index.css` |
| React wrappers | `src/react/*.js` |
| React exports | `src/react/index.js` |
| Nunjucks macros | `site/_includes/macros/ui.njk` (source; `dist/macros/ui.njk` is build copy) |
| Playground renderers | `site/assets/playground/renderers.js` |
| Docs pages | `site/components/*.md` |
| Playground pages | `site/components/*-playground.md` |
| Code Connect | `figma/connections/web-*.figma.ts` |
| Token exports | `figma/exports/*.tokens.json` |
| Brand overrides | `dist/tokens/css/themes-brands.tokens.*.css` |

## Current Components

Label, Button (solid/outline/ghost), ButtonGroup, Input, Icon, Checkbox, Radio, Switch, Slider, Link

## Key Rules (from `docs/agentic/assistant-behavior-rules.md`)

- Rule 8: New components require all 10 integration surfaces
- Rule 9: Every component gets its own tokens — never reuse another component's
- Rule 10: Token `$ref` aliases must point to existing tokens
- Rule 11: CSS class = bare name (`.slider` not `.ui-slider`), `@layer components`, logical properties
- Rule 12: React = named `export function`, `React.createElement`, no JSX, no CSS imports
- Rule 13: Docs UI uses docs-specific CSS, not brand theming

## Governance Sources (read in this order)

1. `docs/ui-foundations-rules.md` — canonical governance
2. `docs/foundations/` — architecture decisions
3. `docs/agentic/assistant-behavior-rules.md` — agent behavior rules
4. `IMPLEMENTATION.md` — repo-specific execution

## Validation

`npm run ci:check` runs: lint → test:unit → build:all → smoke:check → tokens:validate → assets:check → rules:validate → docs:build

Rule pipeline validation checks:
- principles and heuristics exist in Kiro steering
- pattern rules cite known upstream ids
- component rule surfaces exist
- `ci:check` includes `rules:validate`
