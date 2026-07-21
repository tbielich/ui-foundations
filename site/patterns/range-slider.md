---
layout: layouts/docs.njk
title: Range Slider
description: A dual-thumb slider for selecting a value range. Supports min/max thumbs, step values, labels, value display, and disabled state.
navTitle: Range Slider
order: 49
permalink: /patterns/range-slider/
playgroundUrl: /patterns/range-slider-playground/
playgroundLabel: Open Range Slider Playground
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
      {{ uif.rangeSlider("Price range", 0, 100, 20, 80) }}
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
      <span class="docs-anatomy-callout" data-dir="top" style="left: 10%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 85%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">2</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="bottom" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">3</span>
      </span>
      <span class="docs-anatomy-callout" data-dir="bottom" style="left: 20%; transform: translateX(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">4</span>
      </span>
      <span class="docs-anatomy-callout" data-dir="bottom" style="left: 80%; transform: translateX(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">5</span>
      </span>
      {{ uif.rangeSlider("Price range", 0, 100, 20, 80) }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Label — describes what the range controls</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Value display — shows current min–max values</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Track — background rail</li>
    <li><span class="docs-anatomy-badge-inline">4</span> Min thumb — draggable handle for lower bound</li>
    <li><span class="docs-anatomy-badge-inline">5</span> Max thumb — draggable handle for upper bound</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### States

<div class="docs-states-grid" style="--docs-states-cols: 3">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.rangeSlider("Default", 0, 100, 25, 75) }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.rangeSlider("Full range", 0, 100, 0, 100) }}</div>
    <span class="docs-states-grid-item-label">Full range</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.rangeSlider("Disabled", 0, 100, 30, 70, 1, true) }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td>label</td><td>text</td><td>—</td></tr>
    <tr><td>min</td><td>number</td><td><code>0</code></td></tr>
    <tr><td>max</td><td>number</td><td><code>100</code></td></tr>
    <tr><td>valueMin</td><td>number</td><td><code>min</code></td></tr>
    <tr><td>valueMax</td><td>number</td><td><code>max</code></td></tr>
    <tr><td>step</td><td>number</td><td><code>1</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ uif.rangeSlider("Drag", 0, 100, 30, 70) }}</div>
    <div class="docs-behavior-body">
      <h3>Drag interaction</h3>
      <p>Each thumb can be dragged along the track to adjust the range boundary. The active range fill updates in real time.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ uif.rangeSlider("Constrained", 0, 100, 40, 60) }}</div>
    <div class="docs-behavior-body">
      <h3>Thumb constraints</h3>
      <p>The min thumb cannot exceed the max thumb and vice versa. This ensures a valid range at all times.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ uif.rangeSlider("Step", 0, 100, 20, 80, 10) }}</div>
    <div class="docs-behavior-body">
      <h3>Step snapping</h3>
      <p>Values snap to the nearest step increment during drag and keyboard interactions.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### When to use

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">{{ uif.rangeSlider("Price", 0, 500, 50, 300, 10) }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use a range slider when users need to select a span between two values (e.g. price filters, date ranges).</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">{{ uif.rangeSlider("Volume", 0, 100, 0, 70) }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use a dual-thumb range slider for a single value. Use a standard input[type=range] instead.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Labels should describe the value dimension: "Price", "Distance", "Temperature".
- Use sentence case.
- The value display should show both bounds separated by an en-dash: "20 – 80".

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Interaction</th></tr></thead>
  <tbody>
    <tr><td><kbd>Arrow Right</kbd> / <kbd>Arrow Up</kbd></td><td>Increases value by one step.</td></tr>
    <tr><td><kbd>Arrow Left</kbd> / <kbd>Arrow Down</kbd></td><td>Decreases value by one step.</td></tr>
    <tr><td><kbd>Page Up</kbd></td><td>Increases value by 10 steps.</td></tr>
    <tr><td><kbd>Page Down</kbd></td><td>Decreases value by 10 steps.</td></tr>
    <tr><td><kbd>Home</kbd></td><td>Sets value to minimum.</td></tr>
    <tr><td><kbd>End</kbd></td><td>Sets value to maximum.</td></tr>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus between thumbs and to next element.</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Each thumb uses `role="slider"` with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
- Thumbs have distinct `aria-label` values: "Label minimum" and "Label maximum".
- The slider group uses `role="group"` to associate both thumbs.
- Disabled state uses `aria-disabled="true"` and removes from tab order.
- Focus indicators meet 3:1 contrast requirements.
- Hidden native `<input type="range">` elements ensure form submission compatibility.

<h2 id="theming">Theming</h2>

Range Slider adapts across brands and modes through tokens. Use the hero switches above to preview.

For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All interactive states</strong><span>Default, hover, active, focus, disabled.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible use of color</strong><span>Track fill and thumb position indicate range (WCAG 1.4.1).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast</strong><span>Thumb borders and labels meet contrast requirements.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Content standards</strong><span>Label and value display guidelines documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Min, max, step, disabled documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined behaviors</strong><span>Drag, constraints, step snapping documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>Range slider vs. single slider do/don't.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Full arrow, page, home/end support documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Component-scoped tokens (<code>--uif-range-slider-*</code>).</span></div></div>
  <div class="docs-checklist-item" data-done="false"><div class="docs-checklist-icon">–</div><div class="docs-checklist-text"><strong>Figma component</strong><span>Not yet connected via Code Connect.</span></div></div>
</div>
