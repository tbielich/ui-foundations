---
layout: layouts/docs.njk
title: Progress Bar
description: Linear progress indicator for determinate and indeterminate operations.
navTitle: Progress Bar
order: 82
permalink: /patterns/progress-bar/
playgroundUrl: /patterns/progress-bar-playground/
playgroundLabel: Open Progress Bar Playground
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
    <div class="docs-hero-preview-stage" style="width: 100%; padding: 1rem 2rem;">
      {{ uif.progressBar(60, label="Uploading…", showValue=true) }}
      {{ uif.progressBar(label="Processing…", indeterminate=true) }}
    </div>
  </div>
  <div class="docs-hero-meta">
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
  </div>
</div>

<h2 id="anatomy">Anatomy</h2>

<div class="docs-anatomy">
  <div class="docs-anatomy-preview">
    <div class="docs-anatomy-subject" style="width: 100%; padding: 1rem;">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 50%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      {{ uif.progressBar(60, label="Loading…", showValue=true) }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Track — full-width container showing remaining progress</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Fill — colored bar indicating completed progress</li>
  </ol>
</div>

<h2 id="variants">Variants</h2>

### Color variants

<div class="docs-states-grid">
  <div class="docs-states-grid-item" style="width: 100%;">
    <div class="docs-states-grid-item-preview" style="width: 100%; padding: 0.5rem 1rem;">{{ uif.progressBar(60, label="Default") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item" style="width: 100%;">
    <div class="docs-states-grid-item-preview" style="width: 100%; padding: 0.5rem 1rem;">{{ uif.progressBar(75, variant="positive", label="Positive") }}</div>
    <span class="docs-states-grid-item-label">Positive</span>
  </div>
  <div class="docs-states-grid-item" style="width: 100%;">
    <div class="docs-states-grid-item-preview" style="width: 100%; padding: 0.5rem 1rem;">{{ uif.progressBar(40, variant="negative", label="Negative") }}</div>
    <span class="docs-states-grid-item-label">Negative</span>
  </div>
</div>

### Size variants

<div class="docs-states-grid">
  <div class="docs-states-grid-item" style="width: 100%;">
    <div class="docs-states-grid-item-preview" style="width: 100%; padding: 0.5rem 1rem;">{{ uif.progressBar(50, size="sm", label="Small") }}</div>
    <span class="docs-states-grid-item-label">sm</span>
  </div>
  <div class="docs-states-grid-item" style="width: 100%;">
    <div class="docs-states-grid-item-preview" style="width: 100%; padding: 0.5rem 1rem;">{{ uif.progressBar(50, label="Medium (default)") }}</div>
    <span class="docs-states-grid-item-label">md (default)</span>
  </div>
  <div class="docs-states-grid-item" style="width: 100%;">
    <div class="docs-states-grid-item-preview" style="width: 100%; padding: 0.5rem 1rem;">{{ uif.progressBar(50, size="lg", label="Large") }}</div>
    <span class="docs-states-grid-item-label">lg</span>
  </div>
</div>

### Indeterminate

<div class="docs-states-grid">
  <div class="docs-states-grid-item" style="width: 100%;">
    <div class="docs-states-grid-item-preview" style="width: 100%; padding: 0.5rem 1rem;">{{ uif.progressBar(label="Processing…", indeterminate=true) }}</div>
    <span class="docs-states-grid-item-label">Indeterminate</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>value</td><td>0–100 (number)</td><td>—</td></tr>
    <tr><td>variant</td><td><code>default</code> / <code>positive</code> / <code>negative</code></td><td><code>default</code></td></tr>
    <tr><td>size</td><td><code>sm</code> / <code>md</code> / <code>lg</code></td><td><code>md</code></td></tr>
    <tr><td>label</td><td>text</td><td>none</td></tr>
    <tr><td>showValue</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>indeterminate</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview" style="width: 100%; padding: 0.5rem;">{{ uif.progressBar(65, showValue=true) }}</div>
    <div class="docs-behavior-body">
      <h3>Determinate</h3>
      <p>When a known completion percentage is available, set <code>value</code> (0–100). The fill updates via CSS custom property.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview" style="width: 100%; padding: 0.5rem;">{{ uif.progressBar(label="Loading…", indeterminate=true) }}</div>
    <div class="docs-behavior-body">
      <h3>Indeterminate</h3>
      <p>When completion time is unknown, use <code>indeterminate</code>. The fill animates continuously. Animation is suppressed when the user prefers reduced motion.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Choose the right variant for context

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview" style="width: 100%; padding: 0.5rem;">{{ uif.progressBar(100, variant="positive", label="Upload complete") }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use <code>positive</code> to signal successful completion.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview" style="width: 100%; padding: 0.5rem;">{{ uif.progressBar(100, label="Upload complete") }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use the default color for success states — it doesn't convey meaning.</p>
    </div>
  </div>
</div>

<h2 id="accessibility">Accessibility</h2>

- Uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- Always provide an `aria-label` via the `label` attribute or a visually-hidden label.
- Indeterminate bars omit `aria-valuenow`.
- The indeterminate animation respects `prefers-reduced-motion`.

<h2 id="theming">Theming</h2>

Progress Bar adapts across brands and modes through semantic tokens. For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible use of color</strong><span>Variant color is supplemented by label (WCAG 1.4.1).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>ARIA attributes</strong><span>Uses role="progressbar" with correct ARIA.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Reduced motion</strong><span>Indeterminate animation disabled for prefers-reduced-motion.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Variant, size, value, label documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>All visual attributes as tokens.</span></div></div>
</div>
