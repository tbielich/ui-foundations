---
type: pattern-rule
domain: ui-foundations
status: active
pattern: layout
applies_to:
  - page-layout
  - grid-systems
  - responsive-breakpoints
  - section-spacing
principles:
  - principle.hierarchy
  - principle.proximity
  - principle.cognitive-load
  - principle.consistency
heuristics:
  - heuristic.recognition
  - heuristic.consistency
  - heuristic.accessibility
inclusion: manual
---

# Pattern: layout

## Rule type
pattern composition rule

## Scope
pattern

## Applies to
- page layouts
- grid systems
- responsive breakpoints
- section spacing and stacking

## Purpose
Guide full-page composition by defining how patterns combine into coherent
layouts with consistent spacing, predictable flow, and responsive adaptation.

## Structure
Use a top-level page container that establishes the max-width, inline padding,
and vertical rhythm for the page. Within it, stack sections vertically using
consistent spacing tokens. Within sections, arrange content in flexible grid
columns that collapse at defined breakpoints.

## Rules
- Page containers must use semantic layout tokens (`--size-spacing-*`) for
  inline padding, max-width constraints, and vertical gaps between sections.
- Grid columns must use CSS grid or flexbox with gap tokens — never margin hacks.
- Section spacing must be visibly larger than intra-section spacing to
  communicate grouping.
- Responsive breakpoints must stack columns vertically when horizontal space
  drops below a readable threshold.
- Nested patterns (cards, forms, tables) must fill their grid cell — they do
  not define their own outer spacing.

## Interaction rules
- Scrollable layouts must preserve landmark navigation and focus order.
- Sticky or fixed elements (headers, sidebars) must not obscure focused content.
- Skip-links or landmark headings must provide quick navigation past repeated
  layout sections.

## Accessibility considerations
- Use landmark regions (`main`, `nav`, `aside`, `header`, `footer`) to
  communicate page structure to assistive technology.
- Heading hierarchy (h1–h6) must reflect the visual section hierarchy.
- Visual order and DOM order must match — never use CSS order or grid placement
  to reorder content in a way that conflicts with reading sequence.

## Applied principles
- `principle.hierarchy`
- `principle.proximity`
- `principle.cognitive-load`
- `principle.consistency`

## Applied heuristics
- `heuristic.recognition`
- `heuristic.consistency`
- `heuristic.accessibility`

## Failure signals
- Sections use inconsistent vertical spacing with no structural reason.
- Grid items use hardcoded pixel widths instead of responsive fractions.
- Visual order diverges from DOM order.
- Landmark regions are missing or incorrectly nested.
- Sticky elements cover focused inputs or interactive controls.

## Agent check
- Verify page containers use spacing tokens from the Core or Semantic layer.
- Verify section gaps are larger than gaps within sections.
- Verify landmark regions wrap major page areas.
- Verify heading levels match visual hierarchy without skipping levels.
- Verify responsive layout collapses columns at a defined breakpoint.
