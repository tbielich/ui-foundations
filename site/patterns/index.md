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
