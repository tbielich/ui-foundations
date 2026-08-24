---
layout: layouts/docs.njk
title: Color Picker
description: Composite color selection component including area, sliders, wheel, swatch preview, value inputs, and swatch grid.
navTitle: Color Picker
order: 46
permalink: /patterns/color-picker/
playgroundUrl: /patterns/color-picker-playground/
playgroundLabel: Open Color Picker Playground
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
      {{ uif.colorPicker(value="#6366f1") }}
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

<ol>
  <li><strong>Color area</strong> (2D saturation/lightness gradient)</li>
  <li><strong>Color sliders</strong> (hue and alpha)</li>
  <li><strong>Color wheel</strong> (hue visualization)</li>
  <li><strong>Color swatch</strong> (current selection preview)</li>
  <li><strong>Hex / RGB / HSL inputs</strong> (direct value editing)</li>
  <li><strong>Swatch picker grid</strong> (preset colors)</li>
</ol>

<h2 id="states">States</h2>

<div class="docs-states-grid" style="--docs-states-cols: 2">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.colorPicker(value="#6366f1", format="hex") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.colorPicker(value="#0ea5e9", format="rgb", state="disabled") }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

<h2 id="options">Options</h2>

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td><code>value</code></td><td>CSS color string</td><td><code>#6366f1</code></td></tr>
    <tr><td><code>format</code></td><td><code>hex</code> / <code>rgb</code> / <code>hsl</code></td><td><code>hex</code></td></tr>
    <tr><td><code>state</code></td><td><code>default</code> / <code>disabled</code></td><td><code>default</code></td></tr>
    <tr><td><code>swatches</code></td><td>Array of color strings</td><td>Built-in 8 swatches</td></tr>
  </tbody>
</table>

<p><strong>Note:</strong> The Nunjucks macro renders RGB/HSL channel fields as placeholders. The `<uif-color-picker>` web component and playground renderer derive channel values from the `value` hex color.</p>

<h2 id="tokens">Tokens</h2>

<ul>
  <li><code>--uif-color-picker-gap</code></li>
  <li><code>--uif-color-picker-panel-background</code></li>
  <li><code>--uif-color-picker-panel-border-color</code></li>
  <li><code>--uif-color-picker-panel-border-size</code></li>
  <li><code>--uif-color-picker-panel-border-radius</code></li>
  <li><code>--uif-color-picker-control-height</code></li>
  <li><code>--uif-color-picker-slider-height</code></li>
  <li><code>--uif-color-picker-slider-thumb-size</code></li>
  <li><code>--uif-color-picker-swatch-size</code></li>
  <li><code>--uif-color-picker-swatch-border-radius</code></li>
  <li><code>--uif-color-picker-swatch-border-color</code></li>
  <li><code>--uif-color-picker-text-color-default</code></li>
  <li><code>--uif-color-picker-text-color-subtle</code></li>
  <li><code>--uif-color-picker-focus-ring-color</code></li>
  <li><code>--uif-color-picker-focus-ring-size</code></li>
  <li><code>--uif-color-picker-accent-color</code></li>
</ul>
