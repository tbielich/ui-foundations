---
inclusion: manual
---

# Component Documentation Template (Spectrum-style)

When writing or upgrading a component documentation page, follow this section
structure. The Button (`site/components/button.md`) and Icon
(`site/components/icon.md`) pages are the reference implementations.

## Required sections (in order)

1. **Hero** — Inline brand/mode switches + centered component preview +
   status badge + playground/Figma links in `docs-hero-meta`.
2. **Anatomy** — Visual preview in `docs-anatomy` with a short description of
   the component's parts.
3. **Options** — Subsections for each variant, state, and size. End with a
   **Table of options** (`<table class="docs-options-table">`).
4. **Behaviors** — 2-column grid (`docs-behavior-list` > `docs-behavior-item`)
   with a live preview on the left and title + description on the right.
5. **Usage guidelines** — Do/Don't blocks (`docs-guideline` >
   `docs-guideline-item[data-type="do/dont/caution"]`).
6. **Content standards** — Writing rules for labels, messages, and copy.
   Include do/don't blocks where helpful.
7. **Keyboard interactions** — `<table class="docs-keyboard-table">` with
   `<kbd>` keys.
8. **Accessibility** — Bullet list of semantic HTML, ARIA, focus, and contrast
   requirements.
9. **Theming** — 2x2 grid (`docs-theme-grid` > `docs-theme-demo-card`) showing
   the component in Brand A Light, Brand A Dark, Brand B Light, Brand B Dark.
   Each card uses `data-brand`/`data-mode` on `docs-theme-demo-stage`; the
   layout script snapshots token values onto each stage.
10. **Code usage** — Code tabs (HTML / Nunjucks / React) using the `code-tabs`
    pattern.
11. **Used tokens** — `{% componentTokenTable "src/ui/patterns/<component>.css" %}`
12. **Design checklist** — `docs-checklist` grid with items: interactive states,
    color themes, accessible color (1.4.1), accessible contrast text (1.4.3),
    accessible contrast UI (1.4.11), content standards, defined options,
    defined behaviors, usage guidelines, keyboard interactions, design tokens,
    Figma component.

## Hero structure

The hero is a self-contained mini-playground with inline theme switching.

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
    <div class="docs-hero-preview-stage">
      <!-- component preview here -->
    </div>
  </div>
  <div class="docs-hero-meta">
    <span class="docs-status" data-status="stable">Stable</span>
    <a class="docs-page-link docs-page-link--playground" href="...">Open Playground</a>
    <a class="docs-page-link" href="...">Open in Figma</a>
  </div>
</div>
```

The layout script auto-snapshots token values onto each
`docs-hero-preview-stage` and handles brand/mode button clicks.

## Behavior items structure

```html
<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      <!-- live component example -->
    </div>
    <div class="docs-behavior-body">
      <h3>Behavior name</h3>
      <p>Description.</p>
    </div>
  </div>
</div>
```

## Heading IDs

Use `<h2 id="name">Title</h2>` — not `## Title {#name}` (Nunjucks conflict).

## Navigation

Sidebar uses nested `<nav>` + `<details>`/`<summary>` for collapsible
categories. Current section auto-opens.

## Right-side TOC

Auto-generated from `h2[id]` headings. Sticky with scroll spy. No per-page
markup needed.

## Breadcrumbs

Auto-generated from URL. No "Home" crumb. Manual frontmatter takes precedence.

## Playground pages

Add `tokenCssPath` to show the token table in the code panel:

```yaml
playground:
  renderer: button
  tokenCssPath: src/ui/patterns/button.css
  controls: [...]
```

Code panel includes HTML/Nunjucks/React tabs (live-updating via
`code-generators.js`) and used tokens table.

## No inline styles

Only `--icon-src` is permitted inline (component API). Use utility classes:
`docs-narrow-stack`, `docs-medium-stack`, `docs-icon-line-height`,
`docs-guideline-spacer`, `docs-dont-custom-color`, `docs-icon-color-brand`,
`docs-icon-color-danger`.

## CSS classes reference

| Class | Purpose |
|---|---|
| `docs-hero` | Hero wrapper |
| `docs-hero-preview` | Preview with controls + stage |
| `docs-hero-preview-controls` | Inline brand/mode bar |
| `docs-hero-switch` | Switch button group |
| `docs-hero-preview-stage` | Token-scoped render area |
| `docs-hero-meta` | Status + links row |
| `docs-status` | Status pill |
| `docs-page-link--playground` | Play icon via CSS |
| `docs-anatomy` | Anatomy preview |
| `docs-options-table` | Options table |
| `docs-behavior-list` | Behavior items container |
| `docs-behavior-item` | 2-col: preview + text |
| `docs-behavior-preview` | Left preview (overflow hidden) |
| `docs-guideline` | Do/don't grid |
| `docs-guideline-item` | Card with `data-type` |
| `docs-keyboard-table` | Keyboard table |
| `docs-theme-grid` | 2x2 theming grid |
| `docs-theme-demo-card` | Theme card |
| `docs-theme-demo-stage` | Token-scoped card stage |
| `docs-checklist` | Design checklist grid |
| `docs-checklist-item` | Checklist card |
