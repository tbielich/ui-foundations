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
| Code Connect | `schemas/web-*.figma.ts` |
| Token exports | `figma/exports/*.tokens.json` |
| Brand overrides | `dist/tokens/css/themes-brands.tokens.*.css` |

## Current Components

Label, Button (solid/outline/ghost), ButtonGroup, Input, Icon, Checkbox, Radio, Switch, Slider, Link

## Component Promotion Workflow

When building examples, pages, or compositions that use UI patterns not yet in
the component list above, follow this workflow:

1. **Detect** — After finishing the requested work, review the markup for any
   repeated UI pattern (badge, list, card, tooltip, etc.) that is not an
   existing system component.
2. **Report** — At the end of your response, list each missing component with:
   - Name and short purpose (e.g. "Badge — small status pill label").
   - Why it passes the utility test (reusable across multiple contexts).
   - Which of the 10 integration surfaces are needed (Rule 8).
3. **Provide a follow-up prompt** — For each missing component, write a
   ready-to-copy prompt the user can paste in a new conversation to scaffold
   that component. The prompt should include the component name, variants,
   token naming, and a reference to the example where it was first used.
4. **Do NOT auto-create** — Never scaffold all 10 surfaces in the same session
   unless the user explicitly asks. Keep the current task focused and
   token-efficient.

This keeps sessions short and gives the user control over when and how new
components enter the system.

## Icons and Functional Colors

When generating UI that includes visual indicators (checkmarks, status marks,
list bullets, badges, or decorative accents):

- Use the Icon component (`ui.icon()` macro / `.icon` class) with an icon from
  `src/assets/icons/` — never substitute a text character like "✓" or "•".
- Color icons and status indicators with semantic functional tokens:
  `--color-text-success`, `--color-text-danger`, `--color-text-brand`,
  `--color-fill-brand`, `--color-fill-success`, `--color-fill-danger`.
- Use `--color-text-inverse` for text on filled brand/functional backgrounds.
- Use `--color-border-brand` for accent borders on highlighted or featured
  elements.
- Never hardcode hex colors for brand or functional meaning — always reference
  semantic tokens so values adapt across brands and modes.

## Figma Write Capability

When the user asks to create or edit content in a Figma file (slides, frames,
components, layouts), use the `use_figma` tool from the Figma power. It runs
JavaScript via the Figma Plugin API and can create frames, text, shapes,
instances, and bind variables.

- Activate the Figma power first to access `use_figma`.
- For slide decks, load the `#cheatsheet-builder` steering for the full
  frame-by-frame workflow, auto-layout rules, variable bindings, and card types.
- Key pattern: cards and columns in horizontal rows need
  `layoutSizingHorizontal = 'FILL'` to expand equally.

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
