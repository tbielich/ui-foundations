---
inclusion: fileMatch
fileMatchPattern: "site/patterns/**,site/assets/playground/**,site/_includes/macros/**,src/ui/patterns/**,src/react/**"
---

# Pattern Docs + Playground Quality Gate

Use this file whenever a pattern doc page, playground page, macro, renderer, or
React wrapper changes. It captures the checks that keep implementation,
documentation, and playground output aligned.

## Reference pages first

Before changing a pattern page, compare against established examples:

- `site/patterns/button.md` for full anatomy, options, behavior, guidelines,
  keyboard table, and design checklist structure
- `site/patterns/input.md`, `site/patterns/select.md`, and
  `site/patterns/checkbox.md` for form-control anatomy and state grids
- `site/patterns/calendar.md` for complex pattern anatomy, option tables, and
  variant coverage

Do not invent parallel documentation markup when an existing docs class already
exists.

## Documentation markup

- Use `docs-anatomy` for component anatomy. Do not use ASCII trees, plain
  bullet lists, or screenshots as the primary anatomy view.
- Anatomy callouts must point to the named part, not only to the component's
  outer frame. For complex components, add part-specific target overlays or
  callout classes when the generic anatomy callout positions are not precise.
- Use `docs-options-table` for property/variant tables.
- Use `docs-keyboard-table` for keyboard interaction tables.
- Use `docs-table` inside `docs-table-wrap` for generic structured tables such
  as state semantics.
- Keep option tables to `Property`, `Values`, and `Default` unless the existing
  page type clearly needs a fourth column.
- Put code usage and generated used-token tables on the playground page, not on
  the component documentation page.
- Link to the playground and Figma from `docs-hero-meta`.

## Playground contract

- Playground controls use `kind`, not `type`.
- The renderer key in front matter must match
  `global.UIPlaygroundRenderers[renderer]`.
- Renderers return `{ element, code }`. The live preview and HTML tab must come
  from the same generated DOM structure.
- Code tabs are generated from `global.UIPlaygroundCodeGenerators.njk` and
  `global.UIPlaygroundCodeGenerators.wc`.
- If a web component does not exist for a pattern, the WC generator must say so
  honestly instead of inventing a tag.
- Every playground page with component CSS must set `tokenCssPath`.
- Queryable controls should set `query: true` for meaningful shareable states.

## Markup alignment

- Playground renderers must mirror the macro/static production markup for the
  pattern. Do not keep older hand-written markup after the macro or pattern
  structure changes.
- Search for stale class reuse before completion. In particular, do not compose
  unrelated pattern classes into internal parts just to borrow styling.
- For calendar days, use the calendar day cell structure and classes. Do not
  render day cells as ghost buttons.
- Boolean visual variants must have an explicit control and at least one visible
  preview path for both values. For calendar, this includes the `container`
  control and the `.has-container` / no-container output.
- Range-like interaction states need explicit controls and class output for
  start, middle, and end states. For calendar, use `rangeStart`, `rangeEnd`,
  `is-range-start`, `is-range-middle`, and `is-range-end`.

## Figma comparison

When the user provides a Figma URL or node id:

1. Fetch design context and/or screenshot through the Figma MCP.
2. Compare the component parts, variant names, and visible states with the code
   and playground controls.
3. Update docs/playground naming to match Figma unless it would violate the
   code naming contract.
4. Document any unavoidable mismatch in the implementation notes or PR summary.

## Completion checks

Before reporting completion:

- Search for stale markup/classes with `rg` in the touched pattern, playground,
  macro, and renderer files.
- Build docs if docs or playground pages changed: `npm run docs:build`.
- Run required validation: `npm run lint`, `npm run test:unit`,
  `npm run ci:check`.
