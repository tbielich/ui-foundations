---
layout: layouts/docs.njk
title: Tag
description: Removable categorization labels for filtering and organization. Supports sizes, icon/avatar prefix, keyboard navigation, and overflow handling.
navTitle: Tag
order: 25
permalink: /patterns/tag/
playgroundUrl: /patterns/tag-playground/
playgroundLabel: Open Tag Playground
---
{% import "macros/ui.njk" as uif %}

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
      {% call uif.tagGroup() %}
        {{ uif.tag("Design") }}
        {{ uif.tag("Engineering") }}
        {{ uif.tag("Product", removable=true) }}
      {% endcall %}
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
    <div class="docs-anatomy-subject">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 50%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      {{ uif.tag("Label", removable=true) }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Container — pill-shaped background</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Text + optional remove button</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Sizes

<div class="docs-states-grid" style="--docs-states-cols: 3">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.tag("Medium") }}</div>
    <span class="docs-states-grid-item-label">md (default)</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.tag("Small", size="sm") }}</div>
    <span class="docs-states-grid-item-label">sm</span>
  </div>
</div>

### Removable

<div class="docs-states-grid" style="--docs-states-cols: 3">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.tag("Label") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.tag("Label", removable=true) }}</div>
    <span class="docs-states-grid-item-label">Removable</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.tag("Label", selected=true) }}</div>
    <span class="docs-states-grid-item-label">Selected</span>
  </div>
</div>

### With icon prefix

<div class="docs-states-grid" style="--docs-states-cols: 3">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.tag("Starred", startIcon="star") }}</div>
    <span class="docs-states-grid-item-label">Start icon</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.tag("Starred", startIcon="star", removable=true) }}</div>
    <span class="docs-states-grid-item-label">Icon + removable</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>text</td><td>text</td><td>—</td></tr>
    <tr><td>size</td><td><code>md</code> / <code>sm</code></td><td><code>md</code></td></tr>
    <tr><td>removable</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>removeLabel</td><td>text</td><td><code>Remove</code></td></tr>
    <tr><td>selected</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>startIcon</td><td>icon name / none</td><td>none</td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {% call uif.tagGroup() %}
        {{ uif.tag("Design") }}
        {{ uif.tag("Engineering") }}
        {{ uif.tag("Product") }}
        {{ uif.tag("Research") }}
      {% endcall %}
    </div>
    <div class="docs-behavior-body">
      <h3>TagGroup wrapping</h3>
      <p>Tags inside a group wrap to multiple lines by default. Use <code>no-wrap</code> to clip overflow instead.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ uif.tag("Removable", removable=true) }}</div>
    <div class="docs-behavior-body">
      <h3>Remove action</h3>
      <p>The remove button dispatches a <code>uif-tag-remove</code> event. The host application is responsible for removing the tag from the DOM.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Removable vs non-removable

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">{{ uif.tag("Filter: Active", removable=true) }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use removable tags for applied filters or selections the user can dismiss.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">{{ uif.tag("Status") }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't add remove buttons to tags that represent read-only categories or status — use Badge instead.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Keep labels concise (1–3 words). Use sentence case.
- Use descriptive `remove-label` values when the tag text alone is not self-evident (e.g., `"Remove Design filter"`).

<h2 id="keyboard-interactions">Keyboard interactions</h2>

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to the remove button inside a removable tag |
| `Enter` / `Space` | Activates the remove button |
| `ArrowLeft` / `ArrowRight` | Moves focus between tags inside a `uif-tag-group` |

<h2 id="accessibility">Accessibility</h2>

- The remove button carries an explicit `aria-label` for screen readers.
- Icons inside tags are decorative (`aria-hidden="true"`).
- The TagGroup uses `role="group"` to communicate the relationship between tags.
- Selected state is communicated via `aria-selected="true"`.

<h2 id="theming">Theming</h2>

Tag adapts across brands and modes through semantic tokens. Use the hero switches above.

For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible use of color</strong><span>Color is not the only means of conveying state (WCAG 1.4.1).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast</strong><span>Text and background meet requirements.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Size, removable, selected, icon documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard navigation</strong><span>Arrow key navigation and remove action documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>All visual attributes as tokens.</span></div></div>
</div>
