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
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.button("Action") }}
      {{ uif.button("Secondary", "outline") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/button/">Button</a></h2>
      <p>Solid, outline, and ghost variants for primary, secondary, and tertiary actions.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
      <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/star.svg');" aria-hidden="true"></span>
      <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/menu.svg');" aria-hidden="true"></span>
      <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/plus.svg');" aria-hidden="true"></span>
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/icon/">Icon</a></h2>
      <p>SVG icons via CSS mask, inheriting color and size from the parent.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.badge("Default") }}
      {{ uif.badge("Brand", variant="brand") }}
      {{ uif.badge("Success", variant="success") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/badge/">Badge</a></h2>
      <p>Pill-shaped labels for status, counts, or highlights.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.illustratedMessage(preset="empty", actionLabel="Create item") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/illustrated-message/">Illustrated Message</a></h2>
      <p>Empty, error, and no-results messaging with optional recovery actions.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.statusLight("Online", variant="positive") }}
      {{ uif.statusLight("Offline", variant="negative") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/status-light/">Status Light</a></h2>
      <p>Compact semantic status indicator with optional label and size variants.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview" style="min-inline-size: 12rem;">
      {{ uif.meter(label="Storage used", value=72, variant="positive", size="sm") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/meter/">Meter</a></h2>
      <p>Visual indicator of a value within a known range.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      <span class="uif-label-content">
        <span class="uif-icon" data-slot="start" style="--uif-icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
        <span class="uif-label-content-text">Search</span>
      </span>
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/label/">Label</a></h2>
      <p>Text and icon primitives for components and form fields.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.combobox(options=[{value: "pmi", label: "Palma de Mallorca"}, {value: "her", label: "Heraklion"}], placeholder="Search destinations") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/combobox/">ComboBox</a></h2>
      <p>Input field with autocomplete filtering and expandable suggestions.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.input(type="text", placeholder="Email address") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/input/">Input</a></h2>
      <p>Text input with token-driven states for data entry.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.searchField(placeholder="Search") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/search-field/">Search Field</a></h2>
      <p>Search-specialized input with icon, clear action, Enter submit, and quiet variant.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.checkbox("Option A", true) }}
      {{ uif.checkbox("Option B") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/checkbox/">Checkbox</a></h2>
      <p>Binary selection with checked, unchecked, and indeterminate states.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.radio("Option A", true, false, "default", "", "", "", "ov-radio", "a") }}
      {{ uif.radio("Option B", false, false, "default", "", "", "", "ov-radio", "b") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/radio/">Radio</a></h2>
      <p>Mutually exclusive choices within a group.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.rangeSlider("Price range", 0, 100, 20, 80, 5) }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/range-slider/">Range Slider</a></h2>
      <p>Dual-thumb slider for selecting a bounded numeric range.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.progressCircle(65, false, "sm", "Loading trip summary") }}
      {{ uif.progressCircle(0, true, "md", "Loading trip summary") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/progress-circle/">Progress Circle</a></h2>
      <p>Circular loading indicator for determinate and indeterminate progress.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.switch("Notifications", true) }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/switch/">Switch</a></h2>
      <p>Binary toggle for immediate on/off settings.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.notification("Profile updated", "success", false) }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/notification/">Notification</a></h2>
      <p>Transient status messages with variants, actions, and auto-dismiss support.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      <span class="uif-link">Learn more</span>
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/link/">Link</a></h2>
      <p>Inline and standalone navigation with token-driven states.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      <span class="uif-breadcrumbs" role="img" aria-label="Breadcrumbs example">
        <span class="uif-breadcrumbs-list" style="display:flex;align-items:center;gap:var(--uif-breadcrumbs-gap);list-style:none;margin:0;padding:0;">
          <span style="color:var(--uif-breadcrumbs-text-color-default)">Home</span>
          <span style="color:var(--uif-breadcrumbs-separator-color);margin-inline:var(--uif-breadcrumbs-separator-gap)">/</span>
          <span style="color:var(--uif-breadcrumbs-text-color-default)">Shop</span>
          <span style="color:var(--uif-breadcrumbs-separator-color);margin-inline:var(--uif-breadcrumbs-separator-gap)">/</span>
          <span style="color:var(--uif-breadcrumbs-text-color-current);font-weight:var(--font-weight-600)">Bags</span>
        </span>
      </span>
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/breadcrumbs/">Breadcrumbs</a></h2>
      <p>Hierarchical navigation with separators, truncation, and responsive collapse.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      <div class="uif-modal-root is-preview is-open">
        <span class="uif-modal-overlay" aria-hidden="true"></span>
        <div class="uif-modal confirmation sm" aria-hidden="true">
          <div class="uif-modal-header">
            <span class="uif-modal-title">Confirm action</span>
          </div>
          <div class="uif-modal-body">
            <p class="uif-modal-description">Proceed with this change?</p>
          </div>
          <div class="uif-modal-actions">
            <span class="uif-button solid">Confirm</span>
          </div>
        </div>
      </div>
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/modal/">Modal</a></h2>
      <p>Focused dialogs for alerts and confirmations with trapped focus and backdrop overlay.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.select(options=[{value: "opt1", label: "Option 1"}, {value: "opt2", label: "Option 2"}], placeholder="Choose an option") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/select/">Select</a></h2>
      <p>Dropdown for choosing a single option from a predefined list.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      <ul class="uif-tree-view" style="inline-size: 100%; max-inline-size: 18rem; list-style: none; margin: 0; padding: 0;">
        <li class="uif-tree-node is-expanded is-selected">
          <div class="uif-tree-node-row">
            <span class="uif-tree-toggle" aria-hidden="true"></span>
            <span class="uif-tree-label">Workspace</span>
          </div>
          <ul class="uif-tree-children" style="list-style: none; padding-inline-start: 1.25rem; margin: 0;">
            <li class="uif-tree-node">
              <div class="uif-tree-node-row"><span class="uif-tree-label">Components</span></div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/tree-view/">TreeView</a></h2>
      <p>Hierarchical tree navigation with expand/collapse, selection, and keyboard support.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.dropzone(label="Drop files", hint="or", buttonLabel="Browse", filesText="No files selected") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/dropzone/">DropZone</a></h2>
      <p>Drag-and-drop upload target with accessible file picker fallback.</p>
    </div>
  </article>
  <article class="docs-component-card">
    <div class="docs-component-card-preview">
      {{ uif.colorPicker(value="#6366f1") }}
    </div>
    <div class="docs-component-card-body">
      <h2><a href="/patterns/color-picker/">Color Picker</a></h2>
      <p>Composite color selection with area, sliders, wheel, swatch preview, and value inputs.</p>
    </div>
  </article>
    </div>
  </div>
</div>
