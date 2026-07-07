---
layout: layouts/docs.njk
title: TextArea
description: Multi-line text input for longer form content. Uses native textarea element with token-based styling.
navTitle: TextArea
order: 17
permalink: /patterns/textarea/
playgroundUrl: /patterns/textarea-playground/
playgroundLabel: Open TextArea Playground
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
    <div class="docs-hero-preview-stage">
      {{ ui.textarea(placeholder="Enter your message...") }}
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
    <div class="docs-anatomy-subject" style="inline-size: 100%;">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      {{ ui.textarea(placeholder="Placeholder text", rows="3") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Container — bordered text area with padding and border radius</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### States

<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ ui.textarea(placeholder="Default", rows="2") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ ui.textarea(placeholder="Hover", state="hover", rows="2") }}</div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ ui.textarea(placeholder="Focus", state="focus", rows="2") }}</div>
    <span class="docs-states-grid-item-label">Focus</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ ui.textarea(placeholder="Disabled", disabled=true, rows="2") }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>placeholder</td><td>text</td><td>—</td></tr>
    <tr><td>value</td><td>text</td><td>—</td></tr>
    <tr><td>rows</td><td>number</td><td>3 (via min-height)</td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>readonly</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview" style="inline-size: 100%;">{{ ui.textarea(value="Resizable by default", rows="2") }}</div>
    <div class="docs-behavior-body">
      <h3>Vertical resize</h3>
      <p>Users can resize the textarea vertically by default. Disabled and readonly states prevent resizing.</p>
    </div>
  </div>
</div>

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus to/from the textarea</td></tr>
    <tr><td><kbd>Enter</kbd></td><td>Inserts a new line</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Uses native `<textarea>` element — inherits all built-in accessibility.
- Always pair with a visible `<label>` or `aria-label`.
- Placeholder text is not a substitute for a label.

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>States and properties documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Native textarea behavior.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Component-scoped tokens (<code>--textarea-*</code>).</span></div></div>
</div>
