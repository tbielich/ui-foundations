---
layout: layouts/docs.njk
title: Patterns
description: CSS-only building blocks of the design system.
navTitle: Overview
order: 1
permalink: /patterns/
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
  <a class="docs-component-card" href="/patterns/button/">
    <div class="docs-component-card-preview">
      {{ uif.button("Action") }}
      {{ uif.button("Secondary", "outline") }}
    </div>
    <div class="docs-component-card-body">
      <h2>Button</h2>
      <p>Solid, outline, and ghost variants for primary, secondary, and tertiary actions.</p>
    </div>
  </a>
  <a class="docs-component-card" href="/patterns/icon/">
    <div class="docs-component-card-preview">
      <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
      <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/star.svg');" aria-hidden="true"></span>
      <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/menu.svg');" aria-hidden="true"></span>
      <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/plus.svg');" aria-hidden="true"></span>
    </div>
    <div class="docs-component-card-body">
      <h2>Icon</h2>
      <p>SVG icons via CSS mask, inheriting color and size from the parent.</p>
    </div>
  </a>
  <a class="docs-component-card" href="/patterns/badge/">
    <div class="docs-component-card-preview">
      {{ uif.badge("Default") }}
      {{ uif.badge("Brand", variant="brand") }}
      {{ uif.badge("Success", variant="success") }}
    </div>
    <div class="docs-component-card-body">
      <h2>Badge</h2>
      <p>Pill-shaped labels for status, counts, or highlights.</p>
    </div>
  </a>
  <a class="docs-component-card" href="/patterns/illustrated-message/">
    <div class="docs-component-card-preview">
      {{ uif.illustratedMessage(preset="empty", actionLabel="Create item") }}
    </div>
    <div class="docs-component-card-body">
      <h2>Illustrated Message</h2>
      <p>Empty, error, and no-results messaging with optional recovery actions.</p>
  <a class="docs-component-card" href="/patterns/status-light/">
    <div class="docs-component-card-preview">
      {{ uif.statusLight("Online", variant="positive") }}
      {{ uif.statusLight("Offline", variant="negative") }}
    </div>
    <div class="docs-component-card-body">
      <h2>Status Light</h2>
      <p>Compact semantic status indicator with optional label and size variants.</p>
    </div>
  </a>
  <a class="docs-component-card" href="/patterns/label/">
    <div class="docs-component-card-preview">
      <span class="uif-label-content">
        <span class="uif-icon" data-slot="start" style="--uif-icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
        <span class="uif-label-content-text">Search</span>
      </span>
    </div>
    <div class="docs-component-card-body">
      <h2>Label</h2>
      <p>Text and icon primitives for components and form fields.</p>
    </div>
  </a>
  <a class="docs-component-card" href="/patterns/combobox/">
    <div class="docs-component-card-preview">
      {{ uif.combobox(options=[{value: "pmi", label: "Palma de Mallorca"}, {value: "her", label: "Heraklion"}], placeholder="Search destinations") }}
    </div>
    <div class="docs-component-card-body">
      <h2>ComboBox</h2>
      <p>Input field with autocomplete filtering and expandable suggestions.</p>
    </div>
  </a>
  <a class="docs-component-card" href="/patterns/input/">
    <div class="docs-component-card-preview">
      {{ uif.input(type="text", placeholder="Email address") }}
    </div>
    <div class="docs-component-card-body">
      <h2>Input</h2>
      <p>Text input with token-driven states for data entry.</p>
    </div>
  </a>
  <a class="docs-component-card" href="/patterns/checkbox/">
    <div class="docs-component-card-preview">
      {{ uif.checkbox("Option A", true) }}
      {{ uif.checkbox("Option B") }}
    </div>
    <div class="docs-component-card-body">
      <h2>Checkbox</h2>
      <p>Binary selection with checked, unchecked, and indeterminate states.</p>
    </div>
  </a>
  <a class="docs-component-card" href="/patterns/radio/">
    <div class="docs-component-card-preview">
      {{ uif.radio("Option A", true, false, "default", "", "", "", "ov-radio", "a") }}
      {{ uif.radio("Option B", false, false, "default", "", "", "", "ov-radio", "b") }}
    </div>
    <div class="docs-component-card-body">
      <h2>Radio</h2>
      <p>Mutually exclusive choices within a group.</p>
    </div>
  </a>
  <a class="docs-component-card" href="/patterns/range-slider/">
    <div class="docs-component-card-preview">
      {{ uif.rangeSlider("Price range", 0, 100, 20, 80, 5) }}
    </div>
    <div class="docs-component-card-body">
      <h2>Range Slider</h2>
      <p>Dual-thumb slider for selecting a bounded numeric range.</p>
    </div>
  </a>
  <a class="docs-component-card" href="/patterns/switch/">
    <div class="docs-component-card-preview">
      {{ uif.switch("Notifications", true) }}
    </div>
    <div class="docs-component-card-body">
      <h2>Switch</h2>
      <p>Binary toggle for immediate on/off settings.</p>
    </div>
  </a>
  <a class="docs-component-card" href="/patterns/link/">
    <div class="docs-component-card-preview">
      <span class="uif-link">Learn more</span>
    </div>
    <div class="docs-component-card-body">
      <h2>Link</h2>
      <p>Inline and standalone navigation with token-driven states.</p>
    </div>
  </a>
  <a class="docs-component-card" href="/patterns/select/">
    <div class="docs-component-card-preview">
      {{ uif.select(options=[{value: "opt1", label: "Option 1"}, {value: "opt2", label: "Option 2"}], placeholder="Choose an option") }}
    </div>
    <div class="docs-component-card-body">
      <h2>Select</h2>
      <p>Dropdown for choosing a single option from a predefined list.</p>
    </div>
  </a>
  <a class="docs-component-card" href="/patterns/tree-view/">
    <div class="docs-component-card-preview">
      <ul class="uif-tree-view" role="tree" style="inline-size: 100%; max-inline-size: 18rem;">
        <li class="uif-tree-node is-expanded is-selected" role="treeitem" aria-selected="true" aria-expanded="true">
          <div class="uif-tree-node-row">
            <button class="uif-tree-toggle" type="button" aria-label="Toggle node"></button>
            <span class="uif-tree-label">Workspace</span>
          </div>
          <ul class="uif-tree-children" role="group">
            <li class="uif-tree-node" role="treeitem" aria-selected="false">
              <div class="uif-tree-node-row"><span class="uif-tree-label">Components</span></div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="docs-component-card-body">
      <h2>TreeView</h2>
      <p>Hierarchical tree navigation with expand/collapse, selection, and keyboard support.</p>
  <a class="docs-component-card" href="/patterns/dropzone/">
    <div class="docs-component-card-preview">
      {{ uif.dropzone(label="Drop files", hint="or", buttonLabel="Browse", filesText="No files selected") }}
    </div>
    <div class="docs-component-card-body">
      <h2>DropZone</h2>
      <p>Drag-and-drop upload target with accessible file picker fallback.</p>
    </div>
  </a>
    </div>
  </div>
</div>
