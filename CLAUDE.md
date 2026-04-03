# UI Foundations — Design System Rules for Figma MCP

This file defines how to implement Figma designs and work with tokens in this repository.
Follow these rules for every Figma-driven change.

---

## Project Overview

This is a **token-first design system** (`ui-foundations`). Figma is the single source of truth.
Tokens flow one way: Figma Variables → JSON exports → generated CSS/TS/JSON → consumed by components.

**Tech stack:** Vanilla CSS (Custom Properties + `@layer`), Node.js, Eleventy (11ty), React (optional wrappers), Nunjucks macros.

---

## Figma MCP Integration — Required Flow

**Do not skip steps.**

1. Call `get_design_context` for the target node to get layout, typography, colors, spacing, and component structure.
2. If the response is truncated, call `get_metadata` first to get the node tree, then re-fetch specific child nodes with `get_design_context`.
3. Call `get_screenshot` for a visual reference — keep it visible throughout implementation.
4. Download any assets (SVGs, images) returned by the MCP server. Use `localhost` URLs directly; do not modify them.
5. Translate the output into this project's conventions (see rules below). The MCP output is a design reference, not final code.
6. Validate the final result against the Figma screenshot before marking complete.

---

## Token Architecture

Four layers — never skip or collapse them (Foundation-001):

| Layer | Location | Purpose |
|---|---|---|
| Core (Primitives) | `dist/tokens/css/core-primitives.tokens.css` | Raw values: spacing, radii, typography primitives, layout constants |
| Color Modes | `dist/tokens/css/appearance-modes.tokens.mode-light.css` / `mode-dark.css` | Raw color palettes — no semantics |
| Semantics (Roles) | `dist/tokens/css/semantics-roles.tokens.css` | Role-based: `Color.Text.*`, `Color.Fill.*`, `Color.Border.*`, `Typography.*`, `Corner.*` |
| Components (UI) | `dist/tokens/css/components-ui.tokens.css` | Component-specific: e.g. `--button-solid-container-background-default` |

Brand overrides: `dist/tokens/css/themes-brands.tokens.brand-a.css` / `brand-b.css`

**IMPORTANT:** Components must only reference Semantic or Core tokens — never raw color values, hex codes, or hardcoded sizes.

**IMPORTANT:** Typography tokens never include color. Text color always lives in `Color.Text.*` semantic tokens (Foundation-003).

**IMPORTANT:** Never edit files in `dist/` directly — they are generated outputs.

---

## Token Naming Conventions (Foundation-002)

- **Component tokens:** `Component.variant.part.property.state`
  - Example: `Button.solid.container.background.default` → `--button-solid-container-background-default`
- **Semantic tokens:** Role-based, component-agnostic
  - Example: `Color.Text.Default`, `Color.Fill.Surface`, `Color.Border.Brand`
- **States** are always the last segment: `default`, `hover`, `active`, `focus`, `disabled`
- **CSS variables:** kebab-case with `--` prefix
- **Figma variable names:** `Component/Variant/Part/Property/State` (slash-separated, PascalCase component name)
- Status tokens (`Danger`, `Warning`, `Success`, `Info`) are semantic and applied across role families (Text/Fill/Border)
- State tokens (`hover`, `focus`, `disabled`) are component-level interaction behavior

---

## CSS Methodology

- **CSS Custom Properties** are the primary theming mechanism — always use `var(--token-name)`.
- **CSS Layers** in order: `@layer reset`, `@layer base`, `@layer tokens`, `@layer themes`, `@layer components`.
- **Runtime switching** via data attributes on `:root`:
  - `data-brand="a"` or `"b"` for brand
  - `data-mode="light"` or `"dark"` for appearance
- **Component classes:** lowercase with modifier suffixes (`.button`, `.button.outline`, `.button--icon-only`).
- **No Tailwind, no CSS Modules, no styled-components.** Vanilla CSS only.
- **IMPORTANT:** Never hardcode colors, spacing, or typography values. Always use `var(--token-name)`.

---

## Component Patterns

### HTML (primary)
```html
<button class="button" type="button">Label</button>
<button class="button outline" type="button">Outline</button>
<button class="button ghost" type="button">Ghost</button>
<button class="button button--icon-only" type="button" aria-label="Search">…</button>
<input class="input" type="text" placeholder="Email" />
<a href="/page" class="link">Go to page</a>
```

### Nunjucks macros (SSG / Eleventy docs)
```njk
{% import "macros/ui.njk" as ui %}
{{ ui.button("Label") }}
{{ ui.button("Outline", "outline") }}
{{ ui.input(type="text", placeholder="Email") }}
{{ ui.icon("search") }}
{{ ui.checkbox("Accept terms") }}
{{ ui.switch("Notifications") }}
```

### React (optional wrappers)
```js
import { Button } from "ui-foundations/react";
<Button variant="outline" label="Book now" />
<Button variant="ghost" iconOnly startIcon={<Icon name="search" />} ariaLabel="Search" />
```

---

## Component File Locations

| Concern | Location |
|---|---|
| CSS patterns | `src/ui/patterns/*.css` |
| React wrappers | `src/react/*.js` |
| Nunjucks macros | `dist/macros/ui.njk` (generated) |
| Figma Code Connect | `figma/connections/web-*.figma.ts` |
| Token exports (from Figma) | `figma/exports/*.tokens.json` |
| Generated token CSS | `dist/tokens/css/` |
| Generated token TS | `dist/tokens/ts/` |
| Docs pages | `site/components/*.md`, `site/tokens/*.md` |

**Existing components:** button, checkbox, icon, input, label, switch (+ button-group, link, toggle-button)

---

## Adding or Modifying Components (Foundation-009, Foundation-010)

1. Run a boundary check first: can this be composed from an existing component family?
2. Promote to standalone only if it has distinct semantics, a stable public API, or independent lifecycle.
3. New tokens alone do not justify a new standalone component.
4. Follow this sequence for new components:
   - Add/update Figma token exports in `figma/exports/`
   - Run `npm run build:all`
   - Add CSS pattern in `src/ui/patterns/<component>.css`
   - Export pattern in `src/ui/index.css`
   - Add React wrapper in `src/react/<component>.js` only when needed
   - Add `figma/connections/web-<component>.figma.ts` Code Connect file
   - Add `site/components/<component>.md` docs page with usage examples

---

## Asset Handling

- Icons are SVGs stored in `src/assets/icons/` and published to `dist/assets/icons/`.
- **IMPORTANT:** If the Figma MCP server returns a `localhost` URL for an SVG or image, use it directly — do not modify it.
- **IMPORTANT:** Do not install new icon packages. All icons come from the Figma payload or `src/assets/icons/`.
- **IMPORTANT:** Do not create placeholder assets. If a `localhost` source is provided, use it.
- Reference icons by name: `{{ ui.icon("search") }}` or `<Icon name="search" />`.

---

## Figma Code Connect

Code Connect files live in `figma/connections/web-*.figma.ts` and use `@figma/code-connect/html`.

Pattern:
```ts
import figma, { html } from "@figma/code-connect/html";

figma.connect("https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=...", {
  props: {
    className: figma.className(["button", figma.enum("Variant", { Solid: undefined, Outline: "outline" })]),
    disabled: figma.boolean("Disabled"),
  },
  example: ({ className, disabled }) => html`<button type="button" class="${className}" disabled="${disabled}">
    <span class="label-content"><span class="label-content__text">Label</span></span>
  </button>`,
});
```

The Figma file key is: `uqMsy8fV1fPbQdAzgwlmBA`

---

## Token Pipeline (when modifying tokens)

```
Figma Variables → Token Foundry plugin export → figma/exports/*.tokens.json
  → npm run tokens:generate
  → dist/tokens/css/, dist/tokens/json/, dist/tokens/ts/, dist/tokens/tokens.yaml
  → npm run build:css
  → dist/core/index.css, dist/ui/index.css, dist/main.css
```

Scope behavior is derived from export filenames:
- `Brand X.tokens.json` → `:root[data-brand="x"]`
- `Mode Light.tokens.json` → `:root`
- `Mode Dark.tokens.json` → `:root[data-mode="dark"]`

---

## Validation Checklist (before marking complete)

- [ ] Layout matches Figma screenshot (spacing, alignment, sizing)
- [ ] Typography matches (font, size, weight, line-height)
- [ ] Colors use `var(--token-name)` — no hardcoded values
- [ ] Interactive states work (hover, active, disabled, focus)
- [ ] Brand/mode switching works via `data-brand` / `data-mode`
- [ ] No new icon packages installed
- [ ] `npm run lint` passes
- [ ] `npm run test:unit` passes
- [ ] `npm run ci:check` passes

---

## Key References

- Foundation rules: `docs/foundations/` (source of truth for all architecture decisions)
- Agent behavior rules: `docs/agentic/assistant-behavior-rules.md`
- Figma library: `https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations`
- Docs site: `https://ui-foundations.netlify.app/`
