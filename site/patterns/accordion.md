---
layout: layouts/docs.njk
title: Accordion
description: Expandable/collapsible content sections using native details/summary elements. Keyboard accessible by default.
navTitle: Accordion
order: 19
permalink: /patterns/accordion/
playgroundUrl: /patterns/accordion-playground/
playgroundLabel: Open Accordion Playground
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
    <div class="docs-hero-preview-stage" style="inline-size: 100%;">
      {% call ui.accordion() %}
        {% call ui.accordionItem(title="What is UI Foundations?", open=true) %}
          <p>A token-first, Figma-aligned design system for building consistent UIs across brands and modes.</p>
        {% endcall %}
        {% call ui.accordionItem(title="How do I install it?") %}
          <p>Install via npm: <code>npm install ui-foundations</code></p>
        {% endcall %}
        {% call ui.accordionItem(title="Can I customize the tokens?") %}
          <p>Yes — override semantic tokens or add brand semantic token files.</p>
        {% endcall %}
      {% endcall %}
    </div>
  </div>
  <div class="docs-hero-meta">
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
  </div>
</div>

### v1 naming migration

Use `.uif-accordion`, `.uif-accordion-item`, and
`.uif-accordion-item-content` with `--uif-accordion-*` tokens. Unprefixed
Accordion selectors remain compatible throughout v1.x, but legacy
`--accordion-*` token aliases are not provided. Wave 4 selector removal remains
v2.0-or-later work.

<h2 id="anatomy">Anatomy</h2>

<div class="docs-anatomy">
  <div class="docs-anatomy-preview">
    <div class="docs-anatomy-subject" style="inline-size: 100%;">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 30%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 50%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      {% call ui.accordion() %}
        {% call ui.accordionItem(title="Accordion item", open=true) %}
          <p>Content area</p>
        {% endcall %}
      {% endcall %}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Summary — clickable trigger with chevron indicator</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Content — expandable body area</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>title</td><td>text</td><td>—</td></tr>
    <tr><td>open</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
  </tbody>
</table>

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus between summary elements</td></tr>
    <tr><td><kbd>Enter</kbd> / <kbd>Space</kbd></td><td>Toggles the focused item open/closed</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Uses native `<details>` and `<summary>` elements — keyboard and screen reader support is built-in.
- The browser manages `aria-expanded` state automatically.
- Disabled items use `pointer-events: none` and muted color to indicate non-interactivity.

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Native details/summary behavior.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Component-scoped tokens (<code>--uif-accordion-*</code>).</span></div></div>
</div>
