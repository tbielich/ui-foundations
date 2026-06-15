---
inclusion: manual
---

# Component Creation Workflow

Reusable process for building new UI components in the UI Foundations design
system. Every new component follows these phases in order.

---

## Phase 1 — Semantic HTML

Start with the correct HTML element. Use native elements before adding ARIA.

### Sources

- HTML elements: https://developer.mozilla.org/en-US/docs/Web/HTML/Element
- ARIA reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference

### Rules

1. Choose the semantically correct HTML element (e.g. `<hr>` for Divider,
   `<dialog>` for Modal, `<details>` for Accordion)
2. Use ARIA roles only when no native element exists
3. Ensure keyboard accessibility, screen reader compatibility, focus management
4. Document the chosen HTML basis and rationale

### Checklist

- [ ] Native HTML element identified
- [ ] ARIA role added only when necessary
- [ ] Keyboard interaction defined (Tab, Enter, Space, Escape, Arrows)
- [ ] Screen reader behavior verified (role, aria-label, aria-expanded etc.)

---

## Phase 2 — Component Tokens in Figma

Create component tokens in Figma before writing CSS — but only when the
component meets the threshold for dedicated tokens.

### Token Threshold Rule

**Use component-specific tokens when ANY of these apply:**
- The component has more than 2 visual variants (e.g. solid/outline/ghost)
- The component needs brand-specific color overrides
- The component has dedicated variables in the Figma "Components (UI)" collection

**Use semantic tokens directly when ALL of these apply:**
- The component only uses standard colors, spacing, and borders
- No brand-specific overrides are needed
- No dedicated Figma variables exist for the component

Examples:
- Button → component tokens (3 variants, brand colors)
- Checkbox → component tokens (checked/unchecked/indeterminate states with distinct colors)
- Divider → semantic tokens (single line, standard border color)
- Avatar → semantic tokens (standard fill and text)
- Accordion → semantic tokens (standard borders and text)

### Rules (when component tokens apply)

1. Token naming: `--component-variant-part-property-state`
   - Example: `--divider-container-border-color-default`
2. Tokens reference only Semantic or Core layer (Foundation-001)
3. Each component gets its own tokens — never reference another component's
   tokens (Rule 9)
4. States as last segment: `default`, `hover`, `active`, `focus`, `disabled`
5. Set web syntax (`codeSyntax.WEB`) in Figma

### Figma Component Rules

Follow `.kiro/steering/figma/figma-components.md` for all Figma component creation:
- Disabled is ALWAYS a separate boolean property (never in State enum)
- All text must be exposed as component text properties
- Colors must be bound to semantic variables
- Circular shapes need `clipsContent = true` + `cornerRadius = size / 2`

### Checklist

- [ ] Figma variables created in "Components (UI)" collection
- [ ] Naming follows `--component-variant-part-property-state`
- [ ] All references point to Semantic/Core tokens
- [ ] Web syntax set
- [ ] Token export updated: `figma/exports/Components (UI).tokens.json`

---

## Phase 3 — CSS Pattern

Create the CSS pattern in `src/ui/patterns/`.

### Rules (Rule 11)

1. Class = bare component name: `.divider`, not `.ui-divider`
2. Always wrap in `@layer components { }`
3. Logical properties: `inline-size`/`block-size`, `margin-inline` etc.
4. All values via `var(--token)` — never hardcode
5. States: pseudo-classes AND fallback classes (`.is-hover`, `.is-disabled`)
6. Focus pattern with `box-shadow` and `--shadow-focus`

### Checklist

- [ ] File created: `src/ui/patterns/{component}.css`
- [ ] Import added to `src/ui/index.css`
- [ ] `@layer components { }` used
- [ ] All values via tokens
- [ ] Logical properties
- [ ] States (pseudo + fallback classes)
- [ ] Focus styling

---

## Phase 4 — Nunjucks Macro

Create the macro in `site/_includes/macros/ui.njk`.

### Rules

1. Macro name: `ui.{component}(params)`
2. Parameters as object with defaults
3. Use semantic HTML from Phase 1
4. Apply classes from Phase 3
5. Include accessibility attributes

### Checklist

- [ ] Macro added to `site/_includes/macros/ui.njk`
- [ ] Semantic HTML
- [ ] All variants/options as parameters
- [ ] Accessibility attributes (role, aria-*)

---

## Phase 5 — React Wrapper

Create the React wrapper in `src/react/`.

### Rules (Rule 12)

1. Named `export function` — no default export
2. `React.createElement` — no JSX
3. No CSS imports in the React file
4. Document props interface

### Checklist

- [ ] File created: `src/react/{component}.js`
- [ ] Export added to `src/react/index.js`
- [ ] `React.createElement` used
- [ ] No CSS imports
- [ ] Props documented

---

## Phase 6 — Documentation Page

Create the docs page following the Component Doc Template.

### Rules

- Follow `.kiro/steering/components/component-doc-template.md`
- Sections: Hero, Anatomy, Options, Behaviors, Usage Guidelines,
  Content Standards, Keyboard, Accessibility, Theming, Design Checklist
- Use docs CSS (Rule 13) — not brand theming

### Checklist

- [ ] File created: `site/patterns/{component}.md`
- [ ] All required sections present
- [ ] Hero with brand/mode switches
- [ ] States grid
- [ ] Keyboard table
- [ ] Design checklist

---

## Phase 7 — Playground Page

Create the interactive playground page.

### Rules

- Add renderer to `site/assets/playground/renderers.js`
- Add code generator to `site/assets/playground/code-generators.js`
- Playground page: `site/patterns/{component}-playground.md`
- Token table via `tokenCssPath`

### Checklist

- [ ] Renderer created
- [ ] Code generator (HTML/Nunjucks/React tabs)
- [ ] Playground page with controls
- [ ] Token table works

---

## Phase 8 — Code Connect (Figma)

Connect the Figma component to code.

### Rules

- Schema file: `schemas/web-{component}.figma.ts`
- Use `@figma/code-connect`
- Map props to Figma variants

### Checklist

- [ ] Code Connect schema created
- [ ] Props correctly mapped
- [ ] Verified in Figma

---

## Phase 9 — Validation

Ensure everything fits together.

### Commands

```bash
npm run tokens:generate    # Validate token export
npm run build:all          # Build CSS + tokens
npm run ci:check           # Full pipeline
```

### Checklist

- [ ] `npm run ci:check` green
- [ ] No "missing alias targets"
- [ ] No duplicate warnings
- [ ] Docs page renders correctly
- [ ] Playground works
- [ ] All variants visually verified

---

## Phase 10 — PR and Board

1. Create feature branch
2. Commit with `feat(component): add {name} component`
3. Create PR, link issue
4. Update board status to "Done" after merge

---

## Surface Summary (Rule 8)

| # | Surface | Path |
|---|---------|------|
| 1 | Component Tokens | `figma/exports/Components (UI).tokens.json` |
| 2 | CSS Pattern | `src/ui/patterns/{component}.css` |
| 3 | CSS Index | `src/ui/index.css` (add import) |
| 4 | Nunjucks Macro | `site/_includes/macros/ui.njk` |
| 5 | React Wrapper | `src/react/{component}.js` |
| 6 | React Index | `src/react/index.js` (add export) |
| 7 | Docs Page | `site/patterns/{component}.md` |
| 8 | Playground Page | `site/patterns/{component}-playground.md` |
| 9 | Playground Renderer | `site/assets/playground/renderers.js` |
| 10 | Code Connect | `schemas/web-{component}.figma.ts` |
| 11 | Components Index | `site/patterns/index.md` (add card) |

---

## Design Decision Checklist

Before building, resolve these questions. They prevent rework mid-session:

### Container ownership
- **Does this component own its visual container (border, background, radius)?**
- If yes → make it a variant property (e.g. `Container=bordered|none`)
- If no → the component is layout-only; containers come from parent (Card, Modal, Page)
- Rule: Only **one** component in the tree should own the container. Never nest
  containers (Form inside Card both with borders).

### Atom vs Molecule
- **Does this component compose other existing components?**
- If yes → it's a Molecule. Place in Molecules section. Use INSTANCES of existing
  atoms (Input, Button, Label), not placeholder frames.
- If no → it's an Atom. Place in Atoms section.

### Component Set vs Simple Component
- **Does this component need variant properties (state, size, orientation)?**
- If yes → create a Component Set with `combineAsVariants()`
- If no → create a simple `figma.createComponent()`
- Rule: A Component Set with only 1 variant is invalid. If you remove variants
  until 1 remains, convert to a simple Component.

### Fieldset reset
- **Does the HTML use `<fieldset>`?**
- If yes → add explicit reset in CSS: `margin: 0; padding: 0; border: 0; min-inline-size: 0;`
- Browsers apply default padding and borders to fieldsets that break layouts.

### Playground page template
- Always use `{% from "macros/playground.njk" import playground as uiPlayground with context %}`
  and `{{ uiPlayground(playground) }}` — never a raw `<div>` stage.
- Don't forget code generators in `code-generators.js` for Nunjucks/React tabs.
