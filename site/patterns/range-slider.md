---
layout: layouts/docs.njk
title: Range Slider
description: Dual-thumb slider for selecting a bounded numeric range with keyboard support.
navTitle: Range Slider
order: 57
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
      {{ uif.rangeSlider("Price range", 0, 100, 20, 80, 5, false, "", "hero-range") }}
    </div>
  </div>
  <div class="docs-hero-meta">
    <span class="docs-status" data-status="stable">Stable</span>
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
  </div>
</div>

<h2 id="anatomy">Anatomy</h2>

<div class="docs-anatomy">
  <div class="docs-anatomy-preview">
    <div class="docs-anatomy-subject">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 18%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 82%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">2</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="bottom" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">3</span>
      </span>
      {{ uif.rangeSlider("Budget", 0, 100, 30, 70, 5, false, "", "anatomy-range") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Label — names the range being adjusted</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Value display — shows the current lower and upper values</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Dual-thumb track — two native range inputs share one visual track</li>
  </ol>
</div>

<h2 id="options">Options</h2>

<div class="docs-states-grid" style="--docs-states-cols: 2">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.rangeSlider("Price range", 0, 100, 20, 80, 5, false, "", "default-range") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.rangeSlider("Price range", 0, 100, 20, 80, 5, true, "", "disabled-range") }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td>label</td><td>text</td><td><code>"Range"</code></td></tr>
    <tr><td>min</td><td>number</td><td><code>0</code></td></tr>
    <tr><td>max</td><td>number</td><td><code>100</code></td></tr>
    <tr><td>lowerValue</td><td>number</td><td><code>25</code></td></tr>
    <tr><td>upperValue</td><td>number</td><td><code>75</code></td></tr>
    <tr><td>step</td><td>number</td><td><code>1</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.rangeSlider("Discount range", 0, 100, 10, 60, 10, false, "", "step-range") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Stepped adjustments</h3>
      <p>Both thumbs respect the configured step so ranges snap to meaningful increments.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.rangeSlider("Age range", 18, 65, 24, 52, 1, false, "", "value-range") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Live value display</h3>
      <p>The value display updates as either thumb moves so the selected interval stays readable.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.rangeSlider("Budget", 0, 100, 20, 80, 5, true, "", "disabled-beh-range") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Disabled state</h3>
      <p>Disabled sliders preserve the selected bounds visually but cannot be changed by pointer or keyboard.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      {{ uif.rangeSlider("Price range", 0, 100, 20, 80, 5, false, "", "guideline-do") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use a range slider when people need to set both minimum and maximum values within the same scale.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      {{ uif.input(type="number", value="20") }}
      {{ uif.input(type="number", value="80") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don’t replace a shared range control with unrelated numeric fields when a visual interval is important.</p>
    </div>
  </div>
</div>

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Interaction</th></tr></thead>
  <tbody>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus between the lower thumb, upper thumb, and the next focusable element.</td></tr>
    <tr><td><kbd>←</kbd> / <kbd>↓</kbd></td><td>Moves the focused thumb down by one step without crossing the other thumb.</td></tr>
    <tr><td><kbd>→</kbd> / <kbd>↑</kbd></td><td>Moves the focused thumb up by one step without crossing the other thumb.</td></tr>
    <tr><td><kbd>Home</kbd> / <kbd>End</kbd></td><td>Moves the focused thumb to the minimum or maximum bound.</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Each thumb uses a native <code>&lt;input type="range"&gt;</code> for built-in keyboard support.
- Provide clear labels for both bounds, especially when the surrounding field label is not enough context.
- Keep the visible value display synchronized with the actual form values.
- Disabled state uses the native <code>disabled</code> attribute on both thumbs.

<script type="module" src="/vendor/ui-foundations/components/range-slider.js"></script>
