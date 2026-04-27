---
inclusion: manual
---

# Component Documentation Template (Spectrum-style)

When writing or upgrading a component documentation page, follow this section
structure. The Button page (`site/components/button.md`) is the reference
implementation.

## Required sections (in order)

1. **Hero** — Status badge (stable / beta / draft) below the title.
2. **Table of contents** — `<nav class="docs-toc">` linking to each h2 section.
3. **Anatomy** — Visual preview of the component with a short description of its
   parts (container, label, icon, etc.).
4. **Options** — Subsections for each variant, state, and size. End with a
   **Table of options** (`<table class="docs-options-table">`) listing every
   property, its values, and the default.
5. **Behaviors** — Flexible width, overflow, focus, and any component-specific
   interaction behavior.
6. **Usage guidelines** — Do/Don't blocks using `<div class="docs-guideline">`.
   Each block has a preview area and a short explanation.
7. **Content standards** — Writing rules for labels, messages, and copy inside
   the component.
8. **Keyboard interactions** — `<table class="docs-keyboard-table">` with `<kbd>`
   keys and interaction descriptions.
9. **Accessibility** — Bullet list of semantic HTML, ARIA, focus, and contrast
   requirements.
10. **Code usage** — Code tabs (HTML / Nunjucks / React) using the existing
    `code-tabs` pattern.
11. **Used tokens** — `{% componentTokenTable "src/ui/patterns/<component>.css" %}`
12. **Design checklist** — `<div class="docs-checklist">` with items matching the
    Spectrum checklist: interactive states, color themes, accessible color,
    accessible contrast (text), accessible contrast (UI), content standards,
    defined options, defined behaviors, usage guidelines, keyboard interactions,
    design tokens, Figma component.

## Heading IDs

Use `<h2 id="section-name">Title</h2>` instead of `## Title {#section-name}`
because Nunjucks interprets `{#` as a comment start.

## CSS classes reference

| Class | Purpose |
|---|---|
| `docs-hero` | Hero wrapper below title |
| `docs-hero-meta` | Flex row for status/version badges |
| `docs-status` | Status pill (`data-status="stable/beta/draft"`) |
| `docs-version` | Version pill |
| `docs-toc` | Table of contents nav |
| `docs-toc-list` | Two-column link list inside TOC |
| `docs-anatomy` | Centered preview area for anatomy |
| `docs-options-table` | Property/values/default table |
| `docs-guideline` | Grid container for do/don't pairs |
| `docs-guideline-item` | Single guideline card (`data-type="do/dont/caution"`) |
| `docs-guideline-preview` | Visual preview inside guideline |
| `docs-guideline-body` | Text body inside guideline |
| `docs-guideline-label` | Do / Don't / Caution label |
| `docs-keyboard-table` | Keyboard interaction table |
| `docs-checklist` | Design checklist grid |
| `docs-checklist-item` | Single checklist card (`data-done="true/false"`) |
