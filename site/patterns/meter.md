---
layout: layouts/docs.njk
title: Meter
description: Meter shows a value within a known range, such as storage usage or quota consumption.
navTitle: Meter
order: 17
permalink: /patterns/meter/
playgroundUrl: /patterns/meter-playground/
playgroundLabel: Open Meter Playground
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
      <div style="min-inline-size: 16rem;">
        {{ uif.meter(label="Storage used", value=72, variant="default") }}
      </div>
      <div style="min-inline-size: 16rem;">
        {{ uif.meter(label="API quota", value=43, variant="notice") }}
      </div>
      <div style="min-inline-size: 16rem;">
        {{ uif.meter(label="Errors", value=88, variant="negative") }}
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

<h2 id="options">Options</h2>

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>label</td><td>text</td><td><code>Storage used</code></td></tr>
    <tr><td>value</td><td>number</td><td><code>72</code></td></tr>
    <tr><td>min</td><td>number</td><td><code>0</code></td></tr>
    <tr><td>max</td><td>number</td><td><code>100</code></td></tr>
    <tr><td>variant</td><td><code>default</code> / <code>positive</code> / <code>notice</code> / <code>negative</code></td><td><code>default</code></td></tr>
    <tr><td>size</td><td><code>md</code> / <code>sm</code></td><td><code>md</code></td></tr>
    <tr><td>valueText</td><td>text / none</td><td>none (auto percent)</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Meter uses `role="meter"` with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
- Use a descriptive label so the current value is understandable out of context.
- Do not rely on color alone; keep label/value text visible.
