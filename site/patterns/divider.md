---
layout: layouts/docs.njk
title: Divider
description: Dividers are visual separators that create clear boundaries between content sections. They use semantic HTML and adapt across brands and modes.
navTitle: Divider
order: 16
permalink: /patterns/divider/
playgroundUrl: /patterns/divider-playground/
playgroundLabel: Open Divider Playground
---
{% import "macros/ui.njk" as ui %}

<div class="docs-hero">
  <div class="docs-hero-preview">
    <div class="docs-hero-preview-controls">
      <span class="docs-hero-switch" data-hero-group="brand">
        <button type="button" data-hero-brand="a" aria-pressed="true">Brand A</button>
        <button type="button" data-hero-brand="b" aria-pressed="false">Brand B</button>
        <button type="button" data-hero-brand="c" aria-pressed="false">Brand C</button>
      </span>
      <span class="docs-hero-switch" data-hero-group="mode">
        <button type="button" data-hero-mode="light" aria-pressed="true">Light</button>
        <button type="button" data-hero-mode="dark" aria-pressed="false">Dark</button>
      </span>
    </div>
    <div class="docs-hero-preview-stage">
      <div style="inline-size: 100%; display: flex; flex-direction: column; gap: 1rem; align-items: stretch;">
        {{ ui.divider() }}
        {{ ui.divider(variant="subtle") }}
      </div>
    </div>
  </div>
  <div class="docs-hero-meta">
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
    {% if figmaConnections and figmaConnections.urlsByName and figmaConnections.urlsByName[page.fileSlug] %}
    <a class="docs-page-link" href="{{ figmaConnections.urlsByName[page.fileSlug] }}" target="_blank" rel="noopener noreferrer">Open in Figma</a>
    {% endif %}
  </div>
</div>

<h2 id="anatomy">Anatomy</h2>

<div class="docs-anatomy">
  <div class="docs-anatomy-preview">
    <div class="docs-anatomy-subject" style="inline-size: 100%;">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      {{ ui.divider() }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Rule — the visible line that separates content</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Orientation

<div class="docs-states-grid" style="--docs-states-cols: 2">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ ui.divider() }}</div>
    <span class="docs-states-grid-item-label">Horizontal</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="display: flex; block-size: 3rem; align-items: stretch;">{{ ui.divider(orientation="vertical") }}</div>
    <span class="docs-states-grid-item-label">Vertical</span>
  </div>
</div>

### Variants

<div class="docs-states-grid" style="--docs-states-cols: 2">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ ui.divider() }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ ui.divider(variant="subtle") }}</div>
    <span class="docs-states-grid-item-label">Subtle</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>orientation</td><td><code>horizontal</code> / <code>vertical</code></td><td><code>horizontal</code></td></tr>
    <tr><td>variant</td><td><code>default</code> / <code>subtle</code></td><td><code>default</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview" style="inline-size: 100%;">{{ ui.divider() }}</div>
    <div class="docs-behavior-body">
      <h3>Non-interactive</h3>
      <p>Dividers are purely visual. They cannot be clicked, focused, or dismissed.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview" style="inline-size: 100%;">{{ ui.divider() }}</div>
    <div class="docs-behavior-body">
      <h3>Full-width by default</h3>
      <p>Horizontal dividers stretch to fill their container. Vertical dividers stretch to the container height.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Use dividers to separate, not decorate

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview" style="display: flex; flex-direction: column; gap: 0.5rem; inline-size: 100%;">
      <p style="margin: 0;">Section A content</p>
      {{ ui.divider() }}
      <p style="margin: 0;">Section B content</p>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use dividers between distinct content sections.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview" style="display: flex; flex-direction: column; gap: 0.5rem; inline-size: 100%;">
      {{ ui.divider() }}
      <p style="margin: 0;">Content</p>
      {{ ui.divider() }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use dividers as decorative borders around content.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Dividers have no text content. They are purely structural.
- Use spacing tokens around dividers rather than adding margin to the divider itself.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

Dividers are non-interactive and not focusable. They are skipped by keyboard navigation.

<h2 id="accessibility">Accessibility</h2>

- Uses native `<hr>` element which has implicit `role="separator"`.
- Vertical dividers include `aria-orientation="vertical"` for assistive technology.
- Decorative dividers (purely visual, no semantic separation) can use `role="presentation"` to hide from the accessibility tree.

<h2 id="theming">Theming</h2>

Divider adapts across brands and modes through semantic color tokens (`--color-border-default`, `--color-border-subtle`). Use the hero switches above to preview.

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast</strong><span>Border color meets minimum contrast requirements.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Orientation, size, variant documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>Separation vs decoration do/don't.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Color and size via semantic tokens.</span></div></div>
  <div class="docs-checklist-item" data-done="false"><div class="docs-checklist-icon">○</div><div class="docs-checklist-text"><strong>Figma component</strong><span>Pending Figma library addition.</span></div></div>
</div>
