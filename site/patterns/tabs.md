---
layout: layouts/docs.njk
title: Tabs
description: Tabbed navigation for switching between related content panels. Keyboard accessible with ARIA tablist pattern.
navTitle: Tabs
order: 20
permalink: /patterns/tabs/
playgroundUrl: /patterns/tabs-playground/
playgroundLabel: Open Tabs Playground
---
{% import "macros/ui.njk" as uif %}

<div class="docs-hero">
  <div class="docs-hero-preview">
    <div class="docs-hero-preview-stage" style="inline-size: 100%;">
      <uif-tabs orientation="horizontal" size="default" overflow="scroll">
        <uif-tab-list aria-label="Example tabs">
          <uif-tab label="Overview" selected controls="panel-1"></uif-tab>
          <uif-tab label="Details" controls="panel-2"></uif-tab>
          <uif-tab label="Settings" controls="panel-3"></uif-tab>
        </uif-tab-list>
        <uif-tab-panel id="panel-1">Overview content goes here.</uif-tab-panel>
        <uif-tab-panel id="panel-2" hidden>Details content goes here.</uif-tab-panel>
        <uif-tab-panel id="panel-3" hidden>Settings content goes here.</uif-tab-panel>
      </uif-tabs>
    </div>
  </div>
  <div class="docs-hero-meta">
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
  </div>
</div>

<h2 id="options">Options</h2>

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>orientation</td><td><code>horizontal</code> / <code>vertical</code></td><td><code>horizontal</code></td></tr>
    <tr><td>size</td><td><code>default</code> / <code>compact</code></td><td><code>default</code></td></tr>
    <tr><td>overflow</td><td><code>scroll</code> / <code>wrap</code></td><td><code>scroll</code></td></tr>
    <tr><td>selected</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
  </tbody>
</table>

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus into or out of the tab list.</td></tr>
    <tr><td><kbd>←</kbd> / <kbd>→</kbd></td><td>Moves focus between enabled tabs in a horizontal list.</td></tr>
    <tr><td><kbd>↑</kbd> / <kbd>↓</kbd></td><td>Moves focus between enabled tabs in a vertical list.</td></tr>
    <tr><td><kbd>Home</kbd></td><td>Moves focus to the first enabled tab.</td></tr>
    <tr><td><kbd>End</kbd></td><td>Moves focus to the last enabled tab.</td></tr>
    <tr><td><kbd>Enter</kbd> / <kbd>Space</kbd></td><td>Activates the focused tab and reveals its controlled panel.</td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

- Clicking or activating a tab updates `aria-selected`, roving `tabindex`, and the controlled panel.
- Disabled tabs are skipped by keyboard navigation.
- Horizontal tab lists scroll when content exceeds available width by default.
- Set `overflow="wrap"` to allow multiple rows.
- Compact size reduces spacing and typography while preserving the same interaction model.
- Activation dispatches a bubbling `uif-tab-change` event with the controlled panel ID.

<h2 id="accessibility">Accessibility</h2>

- Uses `role="tablist"`, `role="tab"`, and `role="tabpanel"`.
- `aria-selected` represents active state.
- `aria-controls` connects each tab to its panel.
- Roving focus keeps only the selected tab in the page tab sequence.
- `aria-orientation` determines the supported arrow-key axis.

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard behavior</strong><span>Arrow, Home, End, Enter, and Space are implemented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Panel synchronization</strong><span>Selected tab and controlled panel stay aligned.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Responsive overflow</strong><span>Scrollable and wrapped tab-list modes are available.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Sizes</strong><span>Default and compact sizes are supported.</span></div></div>
</div>
