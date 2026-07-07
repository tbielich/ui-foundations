---
layout: layouts/docs.njk
title: Label
description: Text and icon label primitives for components and form fields.
navTitle: Label
order: 30
permalink: /patterns/label/
playgroundUrl: /patterns/label-playground/
playgroundLabel: Open Label Playground
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
      <span class="label-content">
        <span class="icon" data-slot="start" style="--icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
        <span class="label-content-text">Search</span>
      </span>
    </div>
  </div>
  <div class="docs-hero-meta">
    <span class="docs-status" data-status="stable">Stable</span>
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
    {% if figmaConnections and figmaConnections.urlsByName and figmaConnections.urlsByName[page.fileSlug] %}
    <a class="docs-page-link" href="{{ figmaConnections.urlsByName[page.fileSlug] }}" target="_blank" rel="noopener noreferrer">Open in Figma</a>
    {% endif %}
  </div>
</div>

<h2 id="anatomy">Anatomy</h2>

<div class="docs-anatomy">
  <div class="docs-anatomy-preview">
    <div class="docs-anatomy-subject">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="left" style="top: 50%; transform: translateY(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 50%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      <span class="label-content">
        <span class="icon" data-slot="start" style="--icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
        <span class="label-content-text">Search</span>
      </span>
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Start icon slot — optional decorative icon</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Text — the label content</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>text</td><td>text</td><td>—</td></tr>
    <tr><td>startIcon</td><td>icon name / none</td><td>none</td></tr>
    <tr><td>endIcon</td><td>icon name / none</td><td>none</td></tr>
    <tr><td>iconOnly</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>required (FieldLabel)</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>htmlFor (FieldLabel)</td><td>field id</td><td>—</td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      <span class="label-content"><span class="icon" data-slot="start" style="--icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span><span class="label-content-text">Search</span></span>
    </div>
    <div class="docs-behavior-body">
      <h3>Icon + text composition</h3>
      <p>Icons sit in start or end slots alongside the text. They are decorative by default.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      <span class="label-content is-icon-only"><span class="icon" data-slot="start" style="--icon-src: url('/assets/icons/menu.svg');" aria-hidden="true"></span></span>
    </div>
    <div class="docs-behavior-body">
      <h3>Icon-only mode</h3>
      <p>Text is hidden, icon fills the label. Parent must provide an accessible name.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview"><code>&lt;label class="field-label"&gt;</code></div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use FieldLabel with <code>htmlFor</code> to link label and input.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview"><code>&lt;span class="label-content"&gt;</code></div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use LabelContent for form fields — no semantic link to the input.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Sentence case. Keep labels concise.
- FieldLabel: describe the expected input, not the action.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

Labels are not interactive. FieldLabel clicking focuses the associated input.

<h2 id="accessibility">Accessibility</h2>

- FieldLabel uses `<label>` with `for` attribute.
- LabelContent is a `<span>` — no semantic role.
- Icons are decorative (`aria-hidden="true"`).
- Icon-only requires `aria-label` on the parent.

<h2 id="theming">Theming</h2>

Label adapts across brands and modes through typography and color tokens.

For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast</strong><span>Text meets 4.5:1.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Text, icons, iconOnly, required documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>FieldLabel vs. LabelContent do/don't.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>All visual attributes as tokens.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Figma component</strong><span>Available in Figma library.</span></div></div>
</div>
