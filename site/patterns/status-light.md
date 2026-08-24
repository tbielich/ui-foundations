---
layout: layouts/docs.njk
title: Status Light
description: Small colored indicator with semantic status variants, optional label text, and size variants.
navTitle: Status Light
order: 17
permalink: /patterns/status-light/
playgroundUrl: /patterns/status-light-playground/
playgroundLabel: Open Status Light Playground
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
      {{ uif.statusLight("Online", variant="positive") }}
      {{ uif.statusLight("Offline", variant="negative") }}
      {{ uif.statusLight("Review", variant="notice") }}
      {{ uif.statusLight("Pending", variant="info") }}
      {{ uif.statusLight("Unknown", variant="neutral") }}
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
      <span class="docs-anatomy-callout" data-dir="top" style="left: 30%;">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 60%;">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      {{ uif.statusLight("Online", variant="positive") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Indicator dot — semantic status color</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Label text — optional status label</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Variants

<div class="docs-states-grid" style="--docs-states-cols: 5">
  <div class="docs-states-grid-item"><div class="docs-states-grid-item-preview">{{ uif.statusLight("Positive", variant="positive") }}</div><span class="docs-states-grid-item-label">Positive</span></div>
  <div class="docs-states-grid-item"><div class="docs-states-grid-item-preview">{{ uif.statusLight("Negative", variant="negative") }}</div><span class="docs-states-grid-item-label">Negative</span></div>
  <div class="docs-states-grid-item"><div class="docs-states-grid-item-preview">{{ uif.statusLight("Notice", variant="notice") }}</div><span class="docs-states-grid-item-label">Notice</span></div>
  <div class="docs-states-grid-item"><div class="docs-states-grid-item-preview">{{ uif.statusLight("Info", variant="info") }}</div><span class="docs-states-grid-item-label">Info</span></div>
  <div class="docs-states-grid-item"><div class="docs-states-grid-item-preview">{{ uif.statusLight("Neutral", variant="neutral") }}</div><span class="docs-states-grid-item-label">Neutral</span></div>
</div>

### Sizes

<div class="docs-states-grid" style="--docs-states-cols: 2">
  <div class="docs-states-grid-item"><div class="docs-states-grid-item-preview">{{ uif.statusLight("Medium", variant="positive", size="md") }}</div><span class="docs-states-grid-item-label">MD</span></div>
  <div class="docs-states-grid-item"><div class="docs-states-grid-item-preview">{{ uif.statusLight("Small", variant="positive", size="sm") }}</div><span class="docs-states-grid-item-label">SM</span></div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>text</td><td>text</td><td>—</td></tr>
    <tr><td>variant</td><td><code>neutral</code> / <code>positive</code> / <code>negative</code> / <code>notice</code> / <code>info</code></td><td><code>neutral</code></td></tr>
    <tr><td>size</td><td><code>md</code> / <code>sm</code></td><td><code>md</code></td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Status Light is non-interactive and not focusable.
- Dot is decorative (`aria-hidden="true"`); label text carries meaning.
- Do not rely on color alone for critical status communication.
