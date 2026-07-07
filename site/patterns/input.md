---
layout: layouts/docs.njk
title: Input
description: Text inputs allow users to enter freeform text. They support multiple types, placeholder text, and validation states for structured data entry.
navTitle: Input
order: 40
permalink: /patterns/input/
playgroundUrl: /patterns/input-playground/
playgroundLabel: Open Input Playground
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
      {{ ui.input(type="text", placeholder="Email address") }}
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
      <span class="docs-anatomy-callout" data-dir="top" style="left: 20%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="bottom" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 85%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">3</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      {{ ui.input(type="text", value="Input value") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Container — border, background, and padding define the field area</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Input primitive — text entry element (value or placeholder)</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Control — trailing action button(s) based on type (clear, +/-, visibility)</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### States

<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.input(type="text", placeholder="Default") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.input(type="text", value="Hover", state="hover") }}</div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.input(type="text", value="Focus", state="focus") }}</div>
    <span class="docs-states-grid-item-label">Focus</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.input(type="text", value="Disabled", disabled=true) }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td>type</td><td><code>text</code> / <code>email</code> / <code>password</code> / <code>number</code> / <code>tel</code> / <code>url</code> / <code>search</code> / <code>date</code> / <code>time</code></td><td><code>text</code></td></tr>
    <tr><td>placeholder</td><td>text</td><td>—</td></tr>
    <tr><td>value</td><td>text</td><td>—</td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>state</td><td><code>default</code> / <code>hover</code> / <code>active</code> / <code>focus</code> / <code>disabled</code></td><td><code>default</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.input(type="text", value="Input") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Text with clear control</h3>
      <p>Text-type inputs include a clear button that allows users to reset the field value in one action.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.input(type="number", value="0") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Number with increment/decrement</h3>
      <p>Number inputs show minus and plus buttons for stepping the value without typing.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.input(type="password", value="secret") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Password with visibility toggle</h3>
      <p>Password inputs include a toggle button to reveal or hide the entered value.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.input(type="date", value="2026-07-20") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Date with picker affordance</h3>
      <p>Date inputs use the same trailing input control slot and open the native date picker where supported.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.input(type="text", placeholder="Email address") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Full width</h3>
      <p>Inputs expand to fill the available inline size of their container.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.input(type="text", value="Focus preview", state="focus") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Keyboard focus</h3>
      <p>The focus state changes the border color and adds a focus ring.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.input(type="text", value="Disabled field", disabled=true) }}
    </div>
    <div class="docs-behavior-body">
      <h3>Disabled state</h3>
      <p>A disabled input cannot be edited. It is removed from the tab order and uses reduced contrast.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.input(type="text", placeholder="name@example.com") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Placeholder text</h3>
      <p>Placeholder shows a format hint. It disappears on input and is not a substitute for a label.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Always pair with a label

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <code>&lt;label for="email"&gt;Email&lt;/label&gt;</code>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Every input must have a visible label or an <code>aria-label</code>.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      {{ ui.input(type="text", placeholder="Email") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use placeholder text as the only label.</p>
    </div>
  </div>
</div>

### Use the right input type

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <code>type="email"</code>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use semantic types to enable browser validation and mobile keyboards.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <code>type="text"</code> for emails
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use <code>type="text"</code> when a more specific type exists.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Placeholder text should show a format example, not repeat the label.
- Keep placeholder text short — it truncates in narrow containers.
- Error messages should identify the field, the problem, and the fix.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead>
    <tr><th>Key</th><th>Interaction</th></tr>
  </thead>
  <tbody>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus into or out of the input.</td></tr>
    <tr><td>Any character</td><td>Enters text at the cursor position.</td></tr>
    <tr><td><kbd>Backspace</kbd></td><td>Deletes the character before the cursor.</td></tr>
    <tr><td><kbd>Ctrl</kbd> + <kbd>A</kbd></td><td>Selects all text in the input.</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Every input must have a programmatic label via `<label>`, `aria-label`, or `aria-labelledby`.
- Placeholder text is not an accessible label — it disappears on input.
- Disabled inputs use the native `disabled` attribute.
- Error states should be communicated via `aria-invalid` and associated error text via `aria-describedby`.
- Focus indicators meet 3:1 contrast.

<h2 id="theming">Theming</h2>

Input adapts automatically across brands and color modes through component
tokens. Use the hero preview switches above to see it in action.

For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All interactive states</strong><span>Hover, active, focus, and disabled states are implemented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes for all brands.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible use of color</strong><span>Color is not the only visual means of conveying information (WCAG 1.4.1).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast for text</strong><span>Text contrast ratio of at least 4.5:1 (WCAG 1.4.3).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast for UI</strong><span>UI component contrast ratio of at least 3:1 (WCAG 1.4.11).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Content standards</strong><span>Placeholder and error message guidelines are documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Type, placeholder, value, disabled, and state options are documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined behaviors</strong><span>Full width, focus, disabled, and placeholder behaviors are documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>Do and don't examples for labeling and input types are included.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Tab, text entry, and selection interactions are documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>All visual attributes are available as design tokens.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Figma component</strong><span>Component is available in the Figma library.</span></div></div>
</div>

<script type="module" src="/vendor/ui-foundations/components/input-field.js"></script>
