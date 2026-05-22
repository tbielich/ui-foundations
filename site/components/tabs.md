---
layout: layouts/docs.njk
title: Tabs
description: Tabbed navigation for switching between related content panels. Keyboard accessible with ARIA tablist pattern.
navTitle: Tabs
order: 20
permalink: /components/tabs/
playgroundUrl: /components/tabs-playground/
playgroundLabel: Open Tabs Playground
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
    <div class="docs-hero-preview-stage" style="inline-size: 100%;">
      {% call ui.tabList(ariaLabel="Example tabs") %}
        {{ ui.tab(label="Overview", selected=true, controls="panel-1") }}
        {{ ui.tab(label="Details", controls="panel-2") }}
        {{ ui.tab(label="Settings", controls="panel-3") }}
      {% endcall %}
      {% call ui.tabPanel(id="panel-1") %}
        <p>Overview content goes here.</p>
      {% endcall %}
    </div>
  </div>
  <div class="docs-hero-meta">
    <span class="docs-status" data-status="draft">Draft</span>
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
  </div>
</div>

<h2 id="anatomy">Anatomy</h2>

<div class="docs-anatomy">
  <div class="docs-anatomy-preview">
    <div class="docs-anatomy-subject" style="inline-size: 100%;">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 30%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 70%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      {% call ui.tabList(ariaLabel="Anatomy tabs") %}
        {{ ui.tab(label="Tab 1", selected=true) }}
        {{ ui.tab(label="Tab 2") }}
      {% endcall %}
      {% call ui.tabPanel() %}
        <p>Panel content</p>
      {% endcall %}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Tab list — horizontal row of tab buttons with active indicator</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Tab panel — content area associated with the active tab</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### States

<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      <button class="tab" role="tab" aria-selected="false">Default</button>
    </div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      <button class="tab is-hover" role="tab" aria-selected="false">Hover</button>
    </div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      <button class="tab" role="tab" aria-selected="true">Selected</button>
    </div>
    <span class="docs-states-grid-item-label">Selected</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      <button class="tab is-disabled" role="tab" aria-selected="false" disabled>Disabled</button>
    </div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>orientation</td><td><code>horizontal</code> / <code>vertical</code></td><td><code>horizontal</code></td></tr>
    <tr><td>selected</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
  </tbody>
</table>

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus into/out of the tab list</td></tr>
    <tr><td><kbd>←</kbd> / <kbd>→</kbd></td><td>Moves between tabs (horizontal)</td></tr>
    <tr><td><kbd>↑</kbd> / <kbd>↓</kbd></td><td>Moves between tabs (vertical)</td></tr>
    <tr><td><kbd>Enter</kbd> / <kbd>Space</kbd></td><td>Activates the focused tab</td></tr>
    <tr><td><kbd>Home</kbd></td><td>Moves to first tab</td></tr>
    <tr><td><kbd>End</kbd></td><td>Moves to last tab</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Uses `role="tablist"`, `role="tab"`, and `role="tabpanel"` ARIA pattern.
- `aria-selected` indicates the active tab.
- `aria-controls` links each tab to its panel.
- Only the selected tab has `tabindex="0"`; others have `tabindex="-1"` for roving focus.
- `aria-orientation` communicates layout direction to assistive technology.

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All color themes</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Full ARIA tablist pattern.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>All values via semantic tokens.</span></div></div>
</div>
