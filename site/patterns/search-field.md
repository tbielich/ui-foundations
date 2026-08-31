---
layout: layouts/docs.njk
title: Search Field
description: Specialized search input with a leading search icon, trailing clear action, enter submit behavior, disabled state, and quiet variant.
navTitle: Search Field
order: 42
permalink: /patterns/search-field/
playgroundUrl: /patterns/search-field-playground/
playgroundLabel: Open Search Field Playground
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
      {{ uif.searchField(placeholder="Search docs") }}
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

<h2 id="options">Options</h2>

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td>placeholder</td><td>text</td><td><code>Search</code></td></tr>
    <tr><td>value</td><td>text</td><td>—</td></tr>
    <tr><td>quiet</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>state</td><td><code>default</code> / <code>hover</code> / <code>active</code> / <code>focus</code> / <code>disabled</code> / <code>readonly</code></td><td><code>default</code></td></tr>
  </tbody>
</table>

<h2 id="states">States</h2>

<div class="docs-states-grid" style="--docs-states-cols: 5">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.searchField(placeholder="Search") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.searchField(value="Hover", state="hover") }}</div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.searchField(value="Focus", state="focus") }}</div>
    <span class="docs-states-grid-item-label">Focus</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.searchField(value="Readonly", state="readonly") }}</div>
    <span class="docs-states-grid-item-label">Readonly</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.searchField(value="Disabled", disabled=true) }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.searchField(value="Query") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Clear action</h3>
      <p>The trailing control clears the query and keeps focus in the input.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      <form class="uif-form borderless">
        {{ uif.searchField(placeholder="Search docs") }}
      </form>
    </div>
    <div class="docs-behavior-body">
      <h3>Submit on Enter</h3>
      <p>Inside forms, pressing <kbd>Enter</kbd> submits the form using native browser behavior.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.searchField(placeholder="Quiet search", quiet=true) }}
    </div>
    <div class="docs-behavior-body">
      <h3>Quiet variant</h3>
      <p>Quiet mode reduces visual emphasis while preserving interaction and accessibility.</p>
    </div>
  </div>
</div>

<h2 id="accessibility">Accessibility</h2>

- Provide a visible label or an accessible name via <code>aria-label</code> / <code>aria-labelledby</code>.
- Use the native <code>disabled</code> attribute for unavailable fields.
- Do not rely on placeholder text as the only field label.

<script type="module" src="/vendor/ui-foundations/components/search-field.js"></script>
