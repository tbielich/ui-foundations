---
inclusion: manual
---

# Component Documentation Template (Spectrum-style)

When writing or upgrading a component documentation page, follow this section
structure. The Button (`site/patterns/button.md`), Icon
(`site/patterns/icon.md`), and Checkbox (`site/patterns/checkbox.md`)
pages are the reference implementations.

## Required sections (in order)

1. **Hero** — Inline brand/mode switches + centered component preview +
   status badge + playground/Figma links in `docs-hero-meta`.
2. **Anatomy** — Annotated diagram in `docs-anatomy` with numbered callouts
   connected by thin lines to the component parts. Footnotes below explain
   each number.
3. **Options** — States grid (`docs-states-grid`) with row headers per
   variant group (e.g. Unchecked / Checked / Indeterminate), then subsections
   for other options. End with a **Table of options**
   (`<table class="docs-options-table">`).
4. **Behaviors** — 2-column grid (`docs-behavior-list` > `docs-behavior-item`)
   with a live preview on the left and title + description on the right.
5. **Usage guidelines** — Do/Don't blocks (`docs-guideline` >
   `docs-guideline-item[data-type="do/dont/caution"]`).
6. **Content standards** — Writing rules for labels, messages, and copy.
7. **Keyboard interactions** — `<table class="docs-keyboard-table">` with
   `<kbd>` keys.
8. **Accessibility** — Bullet list of semantic HTML, ARIA, focus, and contrast
   requirements.
9. **Theming** — Short paragraph + link to `/foundations/theming/`. The hero
   preview switches already demonstrate theming inline.
10. **Design checklist** — `docs-checklist` grid with items: interactive states,
    color themes, accessible color (1.4.1), accessible contrast text (1.4.3),
    accessible contrast UI (1.4.11), content standards, defined options,
    defined behaviors, usage guidelines, keyboard interactions, design tokens,
    Figma component.

Code usage and Used tokens are NOT on the component doc page — they live in
the playground page instead (code tabs + token table in the code panel).

## States grid

Use `docs-states-grid` with `--docs-states-cols` to control column count.
Add `docs-states-grid-row-header` spans for variant group labels.

```html
<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-row-header">Unchecked</div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview"><!-- component --></div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <!-- ... Default, Hover, Focus, Disabled per row -->
  <div class="docs-states-grid-row-header">Checked</div>
  <!-- repeat for checked row... -->
</div>
```

Columns: Default, Hover, Focus, Disabled. Rows: one per variant group.

## Anatomy callouts

Numbered badges sit outside the component, connected by thin lines. The
subject gets a dashed outline and margin for callout space.

```html
<div class="docs-anatomy">
  <div class="docs-anatomy-preview">
    <div class="docs-anatomy-subject">
      <span class="docs-anatomy-outline"></span>
      <!-- top: badge first, line second -->
      <span class="docs-anatomy-callout" data-dir="top"
            style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <!-- right: line first, badge second -->
      <span class="docs-anatomy-callout" data-dir="right"
            style="top: 50%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      <!-- component here -->
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Part — description</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Part — description</li>
  </ol>
</div>
```

Badge is always on the outer end:
- `top` → badge, line (badge on top)
- `bottom` → line, badge (badge on bottom)
- `left` → badge, line (badge on left)
- `right` → line, badge (badge on right)

## Hero structure

```html
<div class="docs-hero">
  <div class="docs-hero-preview">
    <div class="docs-hero-preview-controls">
      <span class="docs-hero-switch" data-hero-group="brand">
        <button type="button" data-hero-brand="a" aria-pressed="true">Brand A</button>
        <button type="button" data-hero-brand="b" aria-pressed="false">Brand B</button>
      </span>
      <span class="docs-hero-switch" data-hero-group="mode">
        <button type="button" data-hero-mode="light" aria-pressed="true">Light</button>
        <button type="button" data-hero-mode="dark" aria-pressed="false">Dark</button>
      </span>
    </div>
    <div class="docs-hero-preview-stage"><!-- component --></div>
  </div>
  <div class="docs-hero-meta">
    <span class="docs-status" data-status="stable">Stable</span>
    <a class="docs-page-link docs-page-link--playground" href="...">Open Playground</a>
    <a class="docs-page-link" href="...">Open in Figma</a>
  </div>
</div>
```

## Behavior items

```html
<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview"><!-- example --></div>
    <div class="docs-behavior-body"><h3>Name</h3><p>Description.</p></div>
  </div>
</div>
```

## Heading IDs

Use `<h2 id="name">Title</h2>` — not `## Title {#name}` (Nunjucks conflict).

## Sidebar nav

Collapsible categories: Foundations, Components, Examples. Getting Started last.
No Tokens category (merged into Foundations).

## Right-side TOC

Auto-generated from `h2[id]`. Sticky with scroll spy.

## Breadcrumbs

Auto-generated from URL. No "Home" crumb.

## Playground pages

Code panel has HTML/Nunjucks/React tabs + used tokens table. Add `tokenCssPath`:

```yaml
playground:
  renderer: button
  tokenCssPath: src/ui/patterns/button.css
  controls: [...]
```

## No inline styles

Only `--icon-src` permitted inline. Utility classes:
`docs-narrow-stack`, `docs-medium-stack`, `docs-icon-line-height`,
`docs-guideline-spacer`, `docs-dont-custom-color`, `docs-icon-color-brand`,
`docs-icon-color-danger`.

## CSS classes

| Class | Purpose |
|---|---|
| `docs-hero` | Hero wrapper |
| `docs-hero-preview` | Preview with controls + stage |
| `docs-hero-preview-controls` | Inline brand/mode bar |
| `docs-hero-preview-stage` | Token-scoped render area |
| `docs-hero-meta` | Status + links row |
| `docs-anatomy` | Anatomy wrapper (preview + footnotes) |
| `docs-anatomy-preview` | Centered preview area |
| `docs-anatomy-subject` | Positioned container with margin for callouts |
| `docs-anatomy-outline` | Dashed border around component |
| `docs-anatomy-callout` | Callout (`data-dir="top/bottom/left/right"`) |
| `docs-anatomy-callout-line` | Thin connecting line |
| `docs-anatomy-badge` | Numbered circle in callout |
| `docs-anatomy-footnotes` | Grid list of explanations |
| `docs-anatomy-badge-inline` | Numbered circle in footnote |
| `docs-states-grid` | States grid (set `--docs-states-cols`) |
| `docs-states-grid-row-header` | Full-width row label |
| `docs-states-grid-item` | Single state cell |
| `docs-states-grid-item-preview` | Component preview in cell |
| `docs-states-grid-item-label` | State name label |
| `docs-options-table` | Options table |
| `docs-behavior-list` | Behavior items container |
| `docs-behavior-item` | 2-col: preview + text |
| `docs-behavior-preview` | Left preview (overflow hidden) |
| `docs-guideline` | Do/don't grid |
| `docs-guideline-item` | Card with `data-type` |
| `docs-keyboard-table` | Keyboard table |
| `docs-checklist` | Design checklist grid |
| `docs-checklist-item` | Checklist card |
