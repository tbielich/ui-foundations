---
layout: layouts/docs.njk
title: Popover
description: Floating content container triggered by user interaction. Supports rich content, focus management, and dismissal.
navTitle: Popover
order: 22
permalink: /patterns/popover/
playgroundUrl: /patterns/popover-playground/
playgroundLabel: Open Popover Playground
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
    <div class="docs-hero-preview-stage" style="display: flex; gap: 2rem; justify-content: center; padding-block: 3rem;">
      <span class="uif-popover-container">
        <button class="uif-button outline" type="button">Open Popover</button>
        <div class="uif-popover is-open" role="dialog" aria-modal="false" data-placement="bottom">
          <span class="uif-popover-arrow" aria-hidden="true"></span>
          <div class="uif-popover-content">This is a popover with rich content.</div>
        </div>
      </span>
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
    <div class="docs-states-grid-item-preview" style="padding-block: 3rem;">
      <span class="uif-popover-container">
        <button class="uif-button outline" type="button">Top</button>
        <div class="uif-popover is-open" role="dialog" aria-modal="false" data-placement="top">
          <div class="uif-popover-content">Top</div>
        </div>
      </span>
    </div>
    <span class="docs-states-grid-item-label">Top</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="padding-block: 3rem;">
      <span class="uif-popover-container">
        <button class="uif-button outline" type="button">Bottom</button>
        <div class="uif-popover is-open" role="dialog" aria-modal="false" data-placement="bottom">
          <div class="uif-popover-content">Bottom</div>
        </div>
      </span>
    </div>
    <span class="docs-states-grid-item-label">Bottom</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="padding-inline: 6rem; padding-block: 1rem;">
      <span class="uif-popover-container">
        <button class="uif-button outline" type="button">Left</button>
        <div class="uif-popover is-open" role="dialog" aria-modal="false" data-placement="left">
          <div class="uif-popover-content">Left</div>
        </div>
      </span>
    </div>
    <span class="docs-states-grid-item-label">Left</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="padding-inline: 6rem; padding-block: 1rem;">
      <span class="uif-popover-container">
        <button class="uif-button outline" type="button">Right</button>
        <div class="uif-popover is-open" role="dialog" aria-modal="false" data-placement="right">
          <div class="uif-popover-content">Right</div>
        </div>
      </span>
    </div>
    <span class="docs-states-grid-item-label">Right</span>
  </div>
</div>

### Arrow

<div class="docs-states-grid" style="--docs-states-cols: 2">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="padding-block: 3rem;">
      <span class="uif-popover-container">
        <button class="uif-button outline" type="button">With arrow</button>
        <div class="uif-popover is-open" role="dialog" aria-modal="false" data-placement="bottom">
          <span class="uif-popover-arrow" aria-hidden="true"></span>
          <div class="uif-popover-content">Arrow enabled</div>
        </div>
      </span>
    </div>
    <span class="docs-states-grid-item-label">Arrow</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="padding-block: 3rem;">
      <span class="uif-popover-container">
        <button class="uif-button outline" type="button">No arrow</button>
        <div class="uif-popover is-open" role="dialog" aria-modal="false" data-placement="bottom">
          <div class="uif-popover-content">No arrow</div>
        </div>
      </span>
    </div>
    <span class="docs-states-grid-item-label">No arrow</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>placement</td><td><code>top</code> / <code>bottom</code> / <code>left</code> / <code>right</code></td><td><code>bottom</code></td></tr>
    <tr><td>arrow</td><td>boolean attribute</td><td>false</td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      <span class="uif-popover-container">
        <button class="uif-button outline" type="button">Click me</button>
        <div class="uif-popover is-open" role="dialog" aria-modal="false" data-placement="bottom">
          <span class="uif-popover-arrow" aria-hidden="true"></span>
          <div class="uif-popover-content">Click outside or press Escape to dismiss.</div>
        </div>
      </span>
    </div>
    <div class="docs-behavior-body">
      <h3>Toggle on trigger click</h3>
      <p>The popover opens when the trigger button is clicked and closes when clicked again, when the user clicks outside, or when Escape is pressed.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <span class="uif-popover-container">
        <button class="uif-button outline" type="button">More info</button>
        <div class="uif-popover is-open" role="dialog" aria-modal="false" data-placement="bottom">
          <div class="uif-popover-content">Use for rich or interactive content that requires user action.</div>
        </div>
      </span>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use popovers for rich content, interactive controls, or detailed information triggered by a user action.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <span class="uif-popover-container">
        <button class="uif-button outline" type="button">Hover for tip</button>
        <div class="uif-popover is-open" role="dialog" aria-modal="false" data-placement="bottom">
          <div class="uif-popover-content">Short label text.</div>
        </div>
      </span>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use popovers for simple one-line labels. Use a <a href="/patterns/tooltip/">tooltip</a> instead.</p>
    </div>
  </div>
</div>

<h2 id="accessibility">Accessibility</h2>

- Uses `role="dialog"` on the popover panel.
- The trigger button has `aria-expanded` and `aria-controls` linking it to the panel.
- Focus moves into the popover on open and returns to the trigger on close.
- `Escape` closes the popover from anywhere inside it.
- Tab focus is trapped within the open popover.

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Placement, arrow documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>Do/don't for content type.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Component-scoped tokens (<code>--uif-popover-*</code>).</span></div></div>
</div>
