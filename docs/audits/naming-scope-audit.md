# Naming Scope Audit — Unscoped Public Classes and Tokens

**Issue:** [#144](https://github.com/tbielich/ui-foundations/issues/144)
**Date:** 2026-07-15
**Status:** Complete — no source files modified

---

## Purpose

UI Foundations is distributed as an npm module. Public CSS classes and CSS custom
properties must be scoped to avoid collisions in consuming applications. This audit
identifies all files that contain unscoped public component classes or tokens so that
a safe migration can be planned.

---

## Canonical Naming Convention

Source of truth: `.uif/packs/governance/contracts/naming-contract.json`

| Concern | Required prefix |
|---|---|
| CSS class | `uif-` |
| CSS custom property | `--uif-` |

### Target class form

```css
.uif-button
.uif-button.solid
.uif-button.outline
.uif-button.ghost
.uif-button.icon-only
.uif-button.is-hover
.uif-button.is-active
.uif-button.is-focus-visible
.uif-button.is-disabled
```

### Target token form

```css
--uif-button-*
```

---

## Scope Searched

| Area | Paths |
|---|---|
| Source CSS | `src/ui/patterns/` |
| Source JS (React) | `src/react/` |
| Source JS (Custom Elements) | `src/elements/` |
| Docs and site | `site/`, `docs/` |
| Tests and snapshots | `tests/`, `packages/mcp-server/tests/` |
| MCP server sources | `packages/mcp-server/src/` |
| Generated output | `dist/` — not present in this checkout |
| Root examples dir | not present (examples are under `site/`) |

Search patterns used:

- Classes: `.button`, `.icon`, `.label-content`, `.button--`, `.button__`
- Tokens: `--button-`, `--color-`, `--shadow-`, `--size-`

---

## Section A — Unprefixed Public Component Classes

### A1. Source / Runtime CSS

**`src/ui/patterns/button.css`**

All component selectors use bare class names:

```css
.button
.button .label-content
.button .label-content-text
.button .icon
.button.icon-only
.button.is-hover / .button:hover
.button.is-active / .button:active
.button.is-focus-visible / .button:focus-visible
.button.is-disabled / .button:disabled / .button[disabled]
.button.outline
.button.outline.is-hover / .button.outline:hover
.button.outline.is-active / .button.outline:active
.button.outline.is-focus-visible / .button.outline:focus-visible
.button.ghost
.button.ghost.is-hover / .button.ghost:hover
.button.ghost.is-active / .button.ghost:active
.button.ghost.is-focus-visible / .button.ghost:focus-visible
.button-group
.button-group[data-orientation="vertical"]
```

**`src/ui/patterns/icon.css`**

```css
.icon
```

**`src/ui/patterns/label.css`**

```css
.label-content
.label-content-text
```

### A2. Source / Runtime JS — React

**`src/react/button.js`**

Emits `"button"`, `"button-group"`, `"icon-only"` via class arrays.

**`src/react/calendar.js`**

Emits `"button ghost"` and `"icon"` in rendered navigation buttons:

```js
className: "button ghost"
className: "icon"
```

**`src/react/icon.js`**

Emits `"icon"` via class array.

**`src/react/label.js`**

Emits `"label-content"`, `"label-content-text"` via class arrays.

### A3. Source / Runtime JS — Custom Elements

**`src/elements/ui-button.js`**

Emits `"button"`, `"label-content"`, `"label-content-text"`, `"icon"`.

**`src/elements/ui-icon.js`**

Emits `"icon"`.

**`src/elements/ui-label.js`**

Emits `"icon"`, `"label-content"`, `"label-content-text"`.

**`src/elements/ui-link.js`**

Emits `"icon"` for start/end icon spans.

**`src/elements/ui-input.js`**

Emits `"icon"` in inline control buttons (clear, increment, decrement, password-toggle).

### A4. Site Macros (Nunjucks)

**`site/_includes/macros/ui.njk`**

All macro outputs use unscoped class names:

```nunjucks
{%- set classes = "button" -%}
{%- set classes = "button-group" -%}
{%- set classes = "icon" -%}
<span class="label-content ...">
  <span class="icon" ...>
  <span class="label-content-text">
```

**`site/_includes/macros/playground.njk`**

Emits `"button"` in playground toggle controls.

**`site/_includes/macros/calendar.njk`**

Emits `"icon"` in calendar cell controls.

### A5. Playground JavaScript

**`site/assets/playground/renderers.js`**

```js
element.className = "icon";
classes = ["button"];
classes.push("icon-only");
contentClasses = ["label-content"];
textNode.className = "label-content-text";
```

**`site/assets/playground/code-generators.js`**

Generates code snippets using unscoped `button-group` references.

---

## Section B — BEM-Style Classes

| Pattern | Result |
|---|---|
| `.button--*` | **None found** |
| `.button__*` | **None found** |

No BEM-style classes are present in the codebase.

---

## Section C — Unscoped Public Component Tokens

### C1. Runtime CSS

**`src/ui/patterns/button.css`** (76 token references)

All component-level slot tokens use the `--button-*` prefix, for example:

```css
var(--button-height-min)
var(--button-solid-container-background-default)
var(--button-solid-border-color-default)
var(--button-border-size-default)
var(--button-solid-text-color-default)
var(--button-border-radius)
var(--button-padding-inline)
var(--button-padding-block)
var(--button-overlay-hover)
var(--button-overlay-active)
var(--button-outline-container-background-default)
var(--button-outline-border-color-default)
var(--button-outline-text-color-default)
var(--button-ghost-container-background-default)
var(--button-ghost-border-color-default)
var(--button-ghost-text-color-default)
/* …and more solid/outline/ghost/state/disabled variants */
```

**`src/ui/patterns/input.css`**

Cross-pattern token fallback coupling:

```css
line-height: var(--input-line-height, var(--button-line-height, 1.5));
```

### C2. Tests and Tooling

**`packages/mcp-server/tests/resources/components.test.ts`**

Test fixtures embed bare `.button` selectors and `--button-*` tokens as inline CSS strings.

**`packages/mcp-server/tests/properties/resolution.property.test.ts`**

Property-based test data contains inline CSS with `.button`, `.button.outline`, `.button.is-hover`, `.button.is-disabled`.

**`packages/mcp-server/src/resources/patterns.ts`**

JSDoc example references `--button-solid-container-background` as an illustration of CSS custom property parsing (comment only; not runtime behavior).

### C3. Docs and Architecture Records

**`docs/agentic/assistant-behavior-rules.md`**

Explicitly documents `--button-*` tokens as deprecated legacy compatibility:

> "Existing unscoped pattern tokens such as `--button-*` are deprecated legacy compatibility and should be migrated with explicit warnings."

**`docs/adr/adr-density-responsive-strategy.md`**

Architecture examples reference `--button-padding-inline`.

**`docs/foundations/foundation-013-class-naming.md`** / **`site/foundations/class-naming.md`**

Acknowledge that existing runtime artifacts still use bare classes such as `.button`.

### C4. Site Docs

**`site/foundations/all-tokens.md`**

Contains an inline `<button class="button ghost">` in a filter-reset control.

**`site/patterns/button.md`** / **`site/patterns/button-playground.md`**

All playground examples use the macro `ui.button(...)` which emits unscoped classes.

**`site/patterns/tooltip.md`** (inline HTML sections, if any)

Referenced in original issue as requiring update after runtime migration.

**`site/assets/docs.css`**

Docs-only stylesheet references `.button` and `.button-group` in playground panel rules:

```css
.playground-code-panel .code-tabs-bar.button-group { … }
.playground-code-panel .code-tabs-bar.button-group > .button { … }
.code-tabs-bar.button-group { … }
.code-tabs-bar.button-group > .button { … }
.code-tabs-bar.button-group > .button.outline { … }
.code-tabs-bar.button-group > .button.ghost { … }
.code-tabs-bar.button-group > .button:hover { … }
.code-tabs-bar.button-group > .button.is-active { … }
.code-tabs-bar.button-group > .button:focus-visible { … }
```

---

## Section D — Tokens Reviewed but Not Classified as Problems

The following token prefixes were searched as requested. They were found broadly in
foundations, docs, and tests but are **not classified as issue #144 problems** because
they are semantic-layer or core-layer tokens, not public component-level token slots:

| Pattern | Verdict | Rationale |
|---|---|---|
| `--color-*` | Not a problem | Semantic/core tokens, not component exports |
| `--size-*` | Not a problem | Semantic/core tokens, not component exports |
| `--shadow-*` | Not a problem | Semantic/core tokens, not component exports |

Per the issue criteria: *"Only classify tokens as problematic if they are public
component-level exports or examples that should be UIF-scoped."*

---

## Section E — Generated and Package Output

| Location | Status |
|---|---|
| `dist/` | Not present in this checkout — cannot audit |
| Root `examples/` directory | Not present — examples are under `site/` and were audited |

**Action required post-build:** Once a `dist/` directory is produced during CI, the
generated CSS bundle should be audited for any `--button-*` or bare `.button`
selectors that consumers may depend on directly.

---

## Migration Risks for Consumers

1. **Hard class-name break** — Renaming `.button` → `.uif-button` without an alias
   period will immediately break any consumer CSS that targets or extends those
   selectors.

2. **Token override break** — Consumers who customise component appearance via
   `--button-*` overrides in their own CSS will lose their customisations. This is
   a silent regression that is hard to detect without visual regression testing.

3. **Docs and playground drift** — If the runtime migration lands before macros,
   playground, and example docs are updated, the live documentation site will render
   broken or mis-styled components during the transition window.

4. **Cross-layer coupling** — `input.css` references `--button-line-height` as a
   fallback. If `--button-line-height` is renamed first, `input.css` silently loses
   its fallback value until it is also updated.

5. **Test fixture lag** — MCP server tests embed literal `.button` and `--button-*`
   strings. If runtime migrates without updating these fixtures the test suite will
   test the old naming convention and give false confidence.

---

## Recommended Safe Migration Order

The following sequence minimises consumer-facing risk by keeping working aliases in
place throughout the transition window.

| Step | Action | Risk gate |
|---|---|---|
| 1 | Add `--uif-button-*` aliases pointing to `--button-*` in `button.css`; add `.uif-button` selector alongside `.button` in CSS and JS emitters | Consumers can opt in; no break |
| 2 | Update `ui.njk`, `renderers.js`, and all element/React emitters to emit `.uif-button` as the primary class while keeping `.button` as a compatibility class | Both names work in parallel |
| 3 | Update `site/patterns/button.md`, `button-playground.md`, `tooltip.md`, `all-tokens.md`, `getting-started.md`, and `vanilla-starter.md` to reflect `uif-` naming | Docs match runtime |
| 4 | Update `site/assets/docs.css` playground panel selectors to use `.uif-button` | Docs UI consistent |
| 5 | Update MCP server test fixtures and `patterns.ts` example comments | Tooling consistent |
| 6 | Resolve `input.css` cross-layer fallback: replace `var(--button-line-height, …)` with `var(--uif-button-line-height, …)` in the same wave as the token rename | Prevents silent fallback loss |
| 7 | **Major-version release:** remove bare `.button` compatibility aliases and `--button-*` shims after a documented deprecation window | Breaking change, semver bump required |

---

## Affected File Checklist

### Source — must migrate

- [ ] `src/ui/patterns/button.css`
- [ ] `src/ui/patterns/icon.css`
- [ ] `src/ui/patterns/label.css`
- [ ] `src/ui/patterns/input.css` (cross-layer fallback only)
- [ ] `src/react/button.js`
- [ ] `src/react/calendar.js`
- [ ] `src/react/icon.js`
- [ ] `src/react/label.js`
- [ ] `src/elements/ui-button.js`
- [ ] `src/elements/ui-icon.js`
- [ ] `src/elements/ui-label.js`
- [ ] `src/elements/ui-link.js`
- [ ] `src/elements/ui-input.js`

### Site — must update after source migrates

- [ ] `site/_includes/macros/ui.njk`
- [ ] `site/_includes/macros/playground.njk`
- [ ] `site/_includes/macros/calendar.njk`
- [ ] `site/assets/playground/renderers.js`
- [ ] `site/assets/playground/code-generators.js`
- [ ] `site/assets/docs.css`
- [ ] `site/getting-started.md`
- [ ] `site/foundations/all-tokens.md`
- [ ] `site/patterns/button.md`
- [ ] `site/patterns/button-playground.md`
- [ ] `site/patterns/button-group-playground.md`
- [ ] `site/patterns/tooltip.md`

### Tests — must update in same wave as source

- [ ] `packages/mcp-server/tests/resources/components.test.ts`
- [ ] `packages/mcp-server/tests/properties/resolution.property.test.ts`

### Tooling docs — update for accuracy

- [ ] `packages/mcp-server/src/resources/patterns.ts` (JSDoc example comment)
- [ ] `docs/adr/adr-density-responsive-strategy.md`

### Informational only (already note migration intent — no immediate edit required)

- `docs/agentic/assistant-behavior-rules.md`
- `docs/foundations/foundation-013-class-naming.md`
- `site/foundations/class-naming.md`

---

*This report is read-only. No source files were modified as part of this audit.*
