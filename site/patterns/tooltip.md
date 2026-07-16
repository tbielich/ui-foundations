---
layout: layouts/docs.njk
title: Tooltip
description: Contextual help text that appears on hover or focus. Non-interactive, positioned relative to a trigger element.
navTitle: Tooltip
order: 21
permalink: /patterns/tooltip/
playgroundUrl: /patterns/tooltip-playground/
playgroundLabel: Open Tooltip Playground
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
    <div class="docs-hero-preview-stage" style="display: flex; gap: 2rem; justify-content: center; padding-block: 2rem;">
      {% call uif.tooltip(text="Top tooltip", placement="top") %}
        <button class="button outline" type="button">Hover me</button>
      {% endcall %}
    </div>
  </div>
  <div class="docs-hero-meta">
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
  </div>
</div>

<h2 id="options">Options</h2>

### Placement

<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="padding-block: 2rem;">
      <span class="uif-tooltip-trigger">
        <button class="button outline" type="button">Top</button>
        <span class="uif-tooltip is-visible" role="tooltip" data-placement="top">Tooltip text</span>
      </span>
    </div>
    <span class="docs-states-grid-item-label">Top</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="padding-block: 2rem;">
      <span class="uif-tooltip-trigger">
        <button class="button outline" type="button">Bottom</button>
        <span class="uif-tooltip is-visible" role="tooltip" data-placement="bottom">Tooltip text</span>
      </span>
    </div>
    <span class="docs-states-grid-item-label">Bottom</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="padding-inline: 5rem; padding-block: 1rem;">
      <span class="uif-tooltip-trigger">
        <button class="button outline" type="button">Left</button>
        <span class="uif-tooltip is-visible" role="tooltip" data-placement="left">Tip</span>
      </span>
    </div>
    <span class="docs-states-grid-item-label">Left</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="padding-inline: 5rem; padding-block: 1rem;">
      <span class="uif-tooltip-trigger">
        <button class="button outline" type="button">Right</button>
        <span class="uif-tooltip is-visible" role="tooltip" data-placement="right">Tip</span>
      </span>
    </div>
    <span class="docs-states-grid-item-label">Right</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>text</td><td>text</td><td>—</td></tr>
    <tr><td>placement</td><td><code>top</code> / <code>bottom</code> / <code>left</code> / <code>right</code></td><td><code>top</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {% call uif.tooltip(text="Appears on hover and focus", placement="top") %}
        <button class="button outline" type="button">Trigger</button>
      {% endcall %}
    </div>
    <div class="docs-behavior-body">
      <h3>Show on hover and focus</h3>
      <p>Tooltips appear when the trigger is hovered or receives keyboard focus. They disappear when the pointer leaves or focus moves away.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      {% call uif.tooltip(text="Save changes", placement="top") %}
        <button class="button" type="button">💾</button>
      {% endcall %}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use tooltips to label icon-only buttons or provide brief supplementary info.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      {% call uif.tooltip(text="This is a very long tooltip that contains multiple sentences and detailed instructions that should really be in a help section instead.", placement="top") %}
        <button class="button outline" type="button">Help</button>
      {% endcall %}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't put long content in tooltips. Use a popover or inline help instead.</p>
    </div>
  </div>
</div>

<h2 id="accessibility">Accessibility</h2>

- Uses `role="tooltip"` on the tooltip element.
- Trigger should have `aria-describedby` pointing to the tooltip ID for screen readers.
- Tooltips are non-interactive — they cannot contain links or buttons.

- Shows on both hover and focus to support keyboard users.

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Placement and text documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>Do/don't for content length.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Component-scoped tokens (<code>--uif-tooltip-*</code>).</span></div></div>
</div>
