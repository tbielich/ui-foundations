---
layout: layouts/docs.njk
title: Badge
description: Badges are small pill-shaped labels for status, counts, or highlights. Non-interactive, they adapt across brands and modes.
navTitle: Badge
order: 15
permalink: /patterns/badge/
playgroundUrl: /patterns/badge-playground/
playgroundLabel: Open Badge Playground
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
      {{ ui.badge("Default") }}
      {{ ui.badge("Brand", variant="brand") }}
      {{ ui.badge("Success", variant="success") }}
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
      {{ ui.badge("Brand", variant="brand", startIcon="star") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Container — pill-shaped background with variant color</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Text + optional icon — label content</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Variants

<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.badge("Default") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.badge("Brand", variant="brand") }}</div>
    <span class="docs-states-grid-item-label">Brand</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.badge("Success", variant="success") }}</div>
    <span class="docs-states-grid-item-label">Success</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.badge("Danger", variant="danger") }}</div>
    <span class="docs-states-grid-item-label">Danger</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>text</td><td>text</td><td>—</td></tr>
    <tr><td>variant</td><td><code>default</code> / <code>brand</code> / <code>success</code> / <code>danger</code></td><td><code>default</code></td></tr>
    <tr><td>size</td><td><code>md</code> / <code>sm</code></td><td><code>md</code></td></tr>
    <tr><td>startIcon</td><td>icon name / none</td><td>none</td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ ui.badge("3", variant="danger") }}</div>
    <div class="docs-behavior-body">
      <h3>Non-interactive</h3>
      <p>Badges are read-only. They cannot be clicked, focused, or dismissed.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ ui.badge("Featured", variant="brand", startIcon="star") }}</div>
    <div class="docs-behavior-body">
      <h3>Optional icon</h3>
      <p>A leading icon reinforces the badge meaning. It is decorative and inherits the text color.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Use the right variant for the meaning

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">{{ ui.badge("Confirmed", variant="success") }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use semantic variants to communicate status meaning.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">{{ ui.badge("Confirmed", variant="brand") }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use brand for status — it doesn't convey success or danger.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Keep text to 1–2 words or a number. Use sentence case. No punctuation.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

Badges are non-interactive and not focusable.

<h2 id="accessibility">Accessibility</h2>

- Badge is a `<span>` — no interactive role.
- Icons inside badges are decorative (`aria-hidden="true"`).
- Color is not the only means of conveying variant meaning.

<h2 id="theming">Theming</h2>

Badge adapts across brands and modes through semantic tokens. Use the hero switches above.

For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="v1-naming-migration">v1 naming migration</h2>

Badge emitters now produce `.uif-badge` and `.uif-badge-text`. The legacy `.badge` selector remains supported during the v1 compatibility period. Component token slots are now `--uif-badge-*`; library-owned legacy `--badge-*` token aliases are not provided. The existing `<ui-badge>` registration and package export remain unchanged.

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible use of color</strong><span>Text conveys meaning, not color alone (WCAG 1.4.1).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast</strong><span>Text and background meet requirements.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Variant, size, icon documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>Variant selection do/don't.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>All visual attributes as tokens.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Figma component</strong><span>Available in Figma library.</span></div></div>
</div>
