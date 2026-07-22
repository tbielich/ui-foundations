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
      {% call uif.tooltip(text="Top tooltip", placement="top", delay=300, tooltipId="tooltip-hero") %}
        <button class="button outline" type="button" aria-describedby="tooltip-hero">Hover me</button>
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
  <div class="docs-states-grid-item"><div class="docs-states-grid-item-preview" style="padding-block: 2rem;"><span class="uif-tooltip-trigger"><button class="button outline" type="button">Top</button><span class="uif-tooltip is-visible" role="tooltip" data-placement="top">Tooltip text</span></span></div><span class="docs-states-grid-item-label">Top</span></div>
  <div class="docs-states-grid-item"><div class="docs-states-grid-item-preview" style="padding-block: 2rem;"><span class="uif-tooltip-trigger"><button class="button outline" type="button">Bottom</button><span class="uif-tooltip is-visible" role="tooltip" data-placement="bottom">Tooltip text</span></span></div><span class="docs-states-grid-item-label">Bottom</span></div>
  <div class="docs-states-grid-item"><div class="docs-states-grid-item-preview" style="padding-inline: 5rem; padding-block: 1rem;"><span class="uif-tooltip-trigger"><button class="button outline" type="button">Left</button><span class="uif-tooltip is-visible" role="tooltip" data-placement="left">Tip</span></span></div><span class="docs-states-grid-item-label">Left</span></div>
  <div class="docs-states-grid-item"><div class="docs-states-grid-item-preview" style="padding-inline: 5rem; padding-block: 1rem;"><span class="uif-tooltip-trigger"><button class="button outline" type="button">Right</button><span class="uif-tooltip is-visible" role="tooltip" data-placement="right">Tip</span></span></div><span class="docs-states-grid-item-label">Right</span></div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>text</td><td>text</td><td>—</td></tr>
    <tr><td>placement</td><td><code>top</code> / <code>bottom</code> / <code>left</code> / <code>right</code></td><td><code>top</code></td></tr>
    <tr><td>delay</td><td>milliseconds, zero or greater</td><td><code>300</code></td></tr>
    <tr><td>tooltip-id</td><td>stable DOM ID</td><td>generated</td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

- Tooltips appear after the configured delay on hover or keyboard focus.
- Tooltips hide when hover or focus leaves the trigger; Escape also hides an open tooltip.
- An arrow is positioned for each placement.
- Tooltip content remains non-interactive.

<h2 id="usage-guidelines">Usage guidelines</h2>

- Use tooltips to label icon-only controls or provide brief supplementary information.
- Use a popover or inline help for long or interactive content.

<h2 id="accessibility">Accessibility</h2>

- Uses `role="tooltip"` on the tooltip element.
- The Web Component generates or accepts a stable ID and applies `aria-describedby` to its trigger.
- Shows on both hover and focus to support pointer and keyboard users.
- Escape hides the tooltip without moving focus.
- Tooltips cannot contain interactive controls.

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Placement, delay, ID, and text documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible relationship</strong><span>Trigger and tooltip are connected through <code>aria-describedby</code>.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Component-scoped tokens (<code>--uif-tooltip-*</code>).</span></div></div>
</div>
