---
layout: layouts/docs.njk
title: Components
description: Interactive building blocks that require JavaScript for their core behavior.
navTitle: Overview
order: 1
permalink: /components/
---

{% import "macros/ui.njk" as uif %}

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
    <div class="docs-component-grid">
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      <div class="uif-modal-root is-open" style="position:relative;min-block-size:180px;">
        <span class="uif-modal-overlay" aria-hidden="true" style="position:absolute;inset:0;background:var(--docs-surface-2);border-radius:8px;"></span>
        <div class="uif-modal confirmation sm" style="position:relative;background:var(--docs-surface-1);border:1px solid var(--docs-border);border-radius:12px;padding:1rem;max-inline-size:200px;margin:auto;">
          <span style="font-weight:600;display:block;margin-block-end:0.25rem;">Confirm action</span>
          <span style="font-size:0.82rem;color:var(--docs-text-1);">Proceed with this change?</span>
          <span class="uif-button solid" style="margin-block-start:0.75rem;font-size:0.8rem;display:inline-block;">Confirm</span>
        </div>
      </div>
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/components/modal/">Modal</a></h2>
      <p>Focused dialogs for alerts and confirmations with trapped focus and backdrop overlay.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.combobox(options=[{value: "pmi", label: "Palma de Mallorca"}, {value: "her", label: "Heraklion"}], placeholder="Search") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/components/combobox/">ComboBox</a></h2>
      <p>Text input with autocomplete dropdown, async loading, and keyboard navigation.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      <div class="uif-segmented-control" role="group" aria-label="Travel type">
        <button class="uif-segmented-control-item is-active" type="button" aria-pressed="true">Flights</button>
        <button class="uif-segmented-control-item" type="button" aria-pressed="false">Hotels</button>
        <button class="uif-segmented-control-item" type="button" aria-pressed="false">Packages</button>
      </div>
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/components/segmented-control/">Segmented Control</a></h2>
      <p>Mutually exclusive option selector with animated indicator.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      <ul class="uif-tree-view" style="inline-size: 100%; max-inline-size: 16rem; list-style: none; margin: 0; padding: 0;">
        <li class="uif-tree-node is-expanded">
          <div class="uif-tree-node-row">
            <span class="uif-tree-toggle" aria-hidden="true"></span>
            <span class="uif-tree-label">Workspace</span>
          </div>
          <ul class="uif-tree-children" style="list-style: none; padding-inline-start: 1.25rem; margin: 0;">
            <li class="uif-tree-node"><div class="uif-tree-node-row"><span class="uif-tree-label">Components</span></div></li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/components/tree-view/">TreeView</a></h2>
      <p>Hierarchical tree with expand/collapse, selection, and keyboard navigation.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.illustratedMessage(preset="empty") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/components/illustrated-message/">Illustrated Message</a></h2>
      <p>Empty, error, and no-results messaging with optional recovery actions.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      <div class="uif-action-bar" style="padding: 0.5rem 1rem; display: flex; align-items: center; gap: 0.75rem; border: 1px solid var(--docs-border); border-radius: 8px;">
        <span style="font-size: 0.85rem;">3 selected</span>
        <span class="uif-button outline" style="font-size: 0.8rem;">Delete</span>
      </div>
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/components/action-bar/">Action Bar</a></h2>
      <p>Contextual toolbar for bulk actions on selected items.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      <div class="uif-date-picker" style="display:flex;gap:4px;align-items:center;">
        <span class="uif-input" style="font-size:0.85rem;padding:0.25rem 0.5rem;">24 / 08 / 2026</span>
        <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/calendar-day.svg');" aria-hidden="true"></span>
      </div>
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/components/date-picker/">Date Picker</a></h2>
      <p>Date input with calendar dropdown, keyboard navigation, and range selection.</p>
    </div>
  </article>
    </div>
  </div>
</div>
