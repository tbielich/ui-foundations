---
layout: layouts/docs.njk
title: Progress Circle
description: Circular progress indicator for determinate and indeterminate loading states.
navTitle: Progress Circle
order: 57
permalink: /patterns/progress-circle/
playgroundUrl: /patterns/progress-circle-playground/
playgroundLabel: Open Progress Circle Playground
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
    <div class="docs-hero-preview-stage" style="display: flex; align-items: center; gap: 1rem;">
      {{ uif.progressCircle(72, false, "md", "Uploading travel receipts") }}
      {{ uif.progressCircle(0, true, "lg", "Loading booking details") }}
    </div>
  </div>
  <div class="docs-hero-meta">
    <span class="docs-status" data-status="stable">Stable</span>
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
      {{ uif.progressCircle(72, false, "lg", "Uploading travel receipts") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Track — full circular rail showing the total range</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Indicator — animated arc for indeterminate loading or partial arc for determinate progress</li>
  </ol>
</div>

<h2 id="options">Options</h2>

<div class="docs-states-grid" style="--docs-states-cols: 3">
  <div class="docs-states-grid-row-header">Sizes</div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.progressCircle(40, false, "sm", "Loading small card") }}</div>
    <span class="docs-states-grid-item-label">Small</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.progressCircle(65, false, "md", "Loading section") }}</div>
    <span class="docs-states-grid-item-label">Medium</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.progressCircle(90, false, "lg", "Loading page") }}</div>
    <span class="docs-states-grid-item-label">Large</span>
  </div>
  <div class="docs-states-grid-row-header">Modes</div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.progressCircle(30, false, "md", "Preparing departure updates") }}</div>
    <span class="docs-states-grid-item-label">Determinate</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.progressCircle(0, true, "md", "Loading availability") }}</div>
    <span class="docs-states-grid-item-label">Indeterminate</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.progressCircle(100, false, "md", "Sync complete") }}</div>
    <span class="docs-states-grid-item-label">Complete</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td>value</td><td><code>0</code>–<code>100</code></td><td><code>0</code></td></tr>
    <tr><td>indeterminate</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>size</td><td><code>sm</code> / <code>md</code> / <code>lg</code></td><td><code>md</code></td></tr>
    <tr><td>aria-label</td><td>text</td><td>—</td></tr>
    <tr><td>aria-labelledby</td><td>element id</td><td>—</td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ uif.progressCircle(42, false, "md", "Uploading travel itinerary") }}</div>
    <div class="docs-behavior-body">
      <h3>Determinate progress</h3>
      <p>Use a numeric value from 0 to 100 when the system can measure completion progress.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ uif.progressCircle(0, true, "md", "Loading payment options") }}</div>
    <div class="docs-behavior-body">
      <h3>Indeterminate loading</h3>
      <p>Use the indeterminate mode when work is active but the remaining duration is unknown.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ uif.progressCircle(80, false, "lg", "Finalizing booking confirmation") }}</div>
    <div class="docs-behavior-body">
      <h3>Accessible naming</h3>
      <p>Always provide an accessible name with <code>aria-label</code> or <code>aria-labelledby</code> so screen readers can announce the loading context.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">{{ uif.progressCircle(65, false, "md", "Uploading boarding pass") }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use determinate progress when the completed portion can be quantified.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">{{ uif.progressCircle(0, true, "md", "Loading boarding pass") }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don’t fake a percentage when the system cannot estimate progress yet.</p>
    </div>
  </div>
</div>

<h2 id="accessibility">Accessibility</h2>

- Use <code>role="progressbar"</code> on the component root.
- Provide an accessible name with <code>aria-label</code> or <code>aria-labelledby</code>.
- Determinate usage sets <code>aria-valuemin</code>, <code>aria-valuemax</code>, and <code>aria-valuenow</code>.
- Indeterminate usage omits <code>aria-valuenow</code> because there is no measurable percentage.
- The indicator uses motion and arc length, not color alone, to distinguish progress from the track.

<h2 id="theming">Theming</h2>

Progress Circle adapts automatically across brands and color modes through
component tokens. Use the hero preview switches above to inspect the same
pattern across light and dark modes.

For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Determinate and indeterminate</strong><span>Both measured and unknown-duration loading states are covered.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Size variants</strong><span>Small, medium, and large options are documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible labeling</strong><span>Accessible naming requirements are documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Track color, indicator color, stroke width, and sizes are token-backed.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Brand and mode support</strong><span>Works across the repository’s theming model.</span></div></div>
</div>
