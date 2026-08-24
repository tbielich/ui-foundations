---
layout: layouts/docs.njk
title: Breadcrumbs
description: Hierarchical navigation that shows the current page path with customizable separators and collapse behavior.
navTitle: Breadcrumbs
order: 64
permalink: /patterns/breadcrumbs/
playgroundUrl: /patterns/breadcrumbs-playground/
playgroundLabel: Open Breadcrumbs Playground
templateEngineOverride: njk
breadcrumb:
  - label: Components
    url: /patterns/
  - label: Breadcrumbs
---

{% import "macros/ui.njk" as uif %}

{% set sampleItems = [
  { label: "Home", url: "/" },
  { label: "Products", url: "/products" },
  { label: "Travel Gear", url: "/products/travel-gear" },
  { label: "Carry-on Trolley", current: true }
] %}

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
    <div class="docs-hero-preview-stage" style="inline-size: 100%;">
      {{ uif.breadcrumbs(items=sampleItems, separator="/", collapse="responsive", maxItems=4) }}
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
  <li>Link items for ancestor pages.</li>
  <li>Current page item with <code>aria-current="page"</code>.</li>
  <li>Separator between items using <code>data-separator</code>.</li>
  <li>Overflow indicator (<code>…</code>) for collapsed paths.</li>
</ol>

<h2 id="options">Options</h2>

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>items</td><td>Array of <code>{ label, url?, current? }</code></td><td>—</td></tr>
    <tr><td>separator</td><td>Any short text separator</td><td><code>/</code></td></tr>
    <tr><td>collapse</td><td><code>responsive</code>, <code>always</code>, <code>none</code></td><td><code>responsive</code></td></tr>
    <tr><td>maxItems</td><td>Integer ≥ 2 (used by <code>always</code>)</td><td><code>4</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<ul>
  <li><strong>Truncation:</strong> Long labels truncate with ellipsis.</li>
  <li><strong>Overflow handling:</strong> In collapsed states, middle items are represented by <code>…</code>.</li>
  <li><strong>Responsive collapse:</strong> In <code>responsive</code> mode, middle items collapse on smaller viewports.</li>
  <li><strong>Current page:</strong> The current item is rendered as text with <code>aria-current</code>, not a link.</li>
</ul>

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus through breadcrumb links.</td></tr>
    <tr><td><kbd>Enter</kbd></td><td>Activates the focused breadcrumb link.</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

<ul>
  <li>Use semantic <code>&lt;nav aria-label="Breadcrumb"&gt;</code> and ordered list markup.</li>
  <li>Ensure only the active page item uses <code>aria-current="page"</code>.</li>
  <li>Keep link labels concise and meaningful for screen reader users.</li>
</ul>
