---
layout: layouts/docs.njk
title: Segmented Control
description: Mutually exclusive option selector. Each segment is a button; only one can be active at a time. Supports icon + label, size variants, and disabled segments.
navTitle: Segmented Control
order: 21
permalink: /components/segmented-control/
playgroundUrl: /components/segmented-control-playground/
playgroundLabel: Open Segmented Control Playground
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
      {% call uif.segmentedControl(ariaLabel="View mode") %}
        {{ uif.segmentedControlItem(label="Day", selected=true) }}
        {{ uif.segmentedControlItem(label="Week") }}
        {{ uif.segmentedControlItem(label="Month") }}
      {% endcall %}
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
    <div class="docs-anatomy-subject">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 20%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 50%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      {% call uif.segmentedControl(ariaLabel="Anatomy") %}
        {{ uif.segmentedControlItem(label="One", selected=true) }}
        {{ uif.segmentedControlItem(label="Two") }}
      {% endcall %}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Track — pill-shaped container that groups all segments</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Segment — individual button; active segment has an elevated indicator</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### States

<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      <button class="uif-segmented-control-item" type="button" aria-pressed="false">Default</button>
    </div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      <button class="uif-segmented-control-item is-hover" type="button" aria-pressed="false">Hover</button>
    </div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      <button class="uif-segmented-control-item is-active" type="button" aria-pressed="true">Selected</button>
    </div>
    <span class="docs-states-grid-item-label">Selected</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      <button class="uif-segmented-control-item is-disabled" type="button" aria-pressed="false" disabled>Disabled</button>
    </div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

### Size variants

<div class="docs-states-grid" style="--docs-states-cols: 3">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      {% call uif.segmentedControl(ariaLabel="Small", size="sm") %}
        {{ uif.segmentedControlItem(label="One", selected=true) }}
        {{ uif.segmentedControlItem(label="Two") }}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">sm</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      {% call uif.segmentedControl(ariaLabel="Medium") %}
        {{ uif.segmentedControlItem(label="One", selected=true) }}
        {{ uif.segmentedControlItem(label="Two") }}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">md (default)</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      {% call uif.segmentedControl(ariaLabel="Large", size="lg") %}
        {{ uif.segmentedControlItem(label="One", selected=true) }}
        {{ uif.segmentedControlItem(label="Two") }}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">lg</span>
  </div>
</div>

### Icon + label

<div class="docs-states-grid" style="--docs-states-cols: 1">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      {% call uif.segmentedControl(ariaLabel="Layout") %}
        {{ uif.segmentedControlItem(label="Grid", icon="grid", selected=true) }}
        {{ uif.segmentedControlItem(label="List", icon="list") }}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">Icon + label</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>ariaLabel</td><td>string</td><td>—</td></tr>
    <tr><td>size</td><td><code>sm</code> / <code>md</code> / <code>lg</code></td><td><code>md</code></td></tr>
    <tr><td>label</td><td>string</td><td>—</td></tr>
    <tr><td>selected</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>icon</td><td>icon name / none</td><td>none</td></tr>
  </tbody>
</table>

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus into/out of the segmented control</td></tr>
    <tr><td><kbd>←</kbd> / <kbd>→</kbd></td><td>Moves between segments</td></tr>
    <tr><td><kbd>Enter</kbd> / <kbd>Space</kbd></td><td>Activates the focused segment</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- The container uses `role="group"` with `aria-label` to describe the purpose.
- Each segment uses `aria-pressed` to communicate selected state.
- Disabled segments carry `disabled` and `aria-disabled="true"`.

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Arrow key navigation within group.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Component-scoped tokens (<code>--uif-segmented-control-*</code>).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Size variants</strong><span>sm, md (default), lg.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Disabled segments</strong><span>Individual segments can be disabled.</span></div></div>
</div>
