---
layout: layouts/docs.njk
title: Checkbox
description: Checkboxes allow users to select one or more options from a list, or toggle a single binary choice. They support checked, unchecked, and indeterminate states.
navTitle: Checkbox
order: 45
permalink: /patterns/checkbox/
playgroundUrl: /patterns/checkbox-playground/
playgroundLabel: Open Checkbox Playground
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
    <div class="docs-hero-preview-stage">
      {{ uif.checkbox("Accept terms", true) }}
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
      <span class="docs-anatomy-callout" data-dir="top" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="left" style="top: 50%; transform: translateY(-50%);">
        <span class="docs-anatomy-badge">2</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 50%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">3</span>
      </span>
      {{ uif.checkbox("Accept terms", true) }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Field wrapper — groups the control and label as a click target</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Control box — shows checkmark, bar, or empty state</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Label — describes the choice</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### States

<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-row-header">Unchecked</div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.checkbox("Default") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.checkbox("Hover", false, false, "hover") }}</div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.checkbox("Focus", false, false, "focus") }}</div>
    <span class="docs-states-grid-item-label">Focus</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.checkbox("Disabled", false, true) }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
  <div class="docs-states-grid-row-header">Checked</div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.checkbox("Default", true) }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.checkbox("Hover", true, false, "hover") }}</div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.checkbox("Focus", true, false, "focus") }}</div>
    <span class="docs-states-grid-item-label">Focus</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.checkbox("Disabled", true, true) }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
  <div class="docs-states-grid-row-header">Indeterminate</div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.checkbox("Default", false, false, "indeterminate") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.checkbox("Hover", false, false, "indeterminate") }}</div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.checkbox("Focus", false, false, "indeterminate") }}</div>
    <span class="docs-states-grid-item-label">Focus</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.checkbox("Disabled", false, true, "indeterminate") }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td>label</td><td>text</td><td>—</td></tr>
    <tr><td>checked</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>indeterminate</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>state</td><td><code>default</code> / <code>hover</code> / <code>active</code> / <code>focus</code> / <code>indeterminate</code> / <code>disabled</code></td><td><code>default</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ uif.checkbox("Toggle me") }}</div>
    <div class="docs-behavior-body">
      <h3>Toggle on click</h3>
      <p>Clicking the checkbox or its label toggles between checked and unchecked. The change is immediate.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ uif.checkbox("Indeterminate", false, false, "indeterminate") }}</div>
    <div class="docs-behavior-body">
      <h3>Indeterminate state</h3>
      <p>Represents a partial selection — typically when a parent checkbox controls a group where some children are checked. Set programmatically, not by user interaction.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ uif.checkbox("Focused", false, false, "focus") }}</div>
    <div class="docs-behavior-body">
      <h3>Keyboard focus</h3>
      <p>Adds a visible focus ring. The checkbox is toggled with Space when focused.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ uif.checkbox("Disabled", false, true) }}</div>
    <div class="docs-behavior-body">
      <h3>Disabled state</h3>
      <p>Cannot be toggled. Removed from the tab order with reduced contrast.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Use checkboxes for independent choices

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      {{ uif.checkbox("Email notifications", true) }}
      {{ uif.checkbox("SMS notifications") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use checkboxes when each option can be toggled independently.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      {{ uif.checkbox("Yes", true) }}
      {{ uif.checkbox("No") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use checkboxes for mutually exclusive choices — use radio buttons instead.</p>
    </div>
  </div>
</div>

### Always provide a visible label

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">{{ uif.checkbox("I agree to the terms") }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Every checkbox must have a visible text label.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">{{ uif.checkbox("") }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use a checkbox without a label.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Write labels as positive statements: "Receive updates" not "Don't send updates".
- Use sentence case.
- Keep labels to one line when possible.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Interaction</th></tr></thead>
  <tbody>
    <tr><td><kbd>Space</kbd></td><td>Toggles the checkbox between checked and unchecked.</td></tr>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus to the next focusable element.</td></tr>
    <tr><td><kbd>Shift</kbd> + <kbd>Tab</kbd></td><td>Moves focus to the previous focusable element.</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Use native `<input type="checkbox">` with an associated `<label>`.
- Indeterminate state is communicated via `aria-checked="mixed"`.
- Disabled checkboxes use the native `disabled` attribute.
- Grouped checkboxes should be wrapped in a `<fieldset>` with a `<legend>`.
- Focus indicators meet 3:1 contrast.
- Checked state uses a checkmark, not color alone.

<h2 id="theming">Theming</h2>

Checkbox adapts automatically across brands and color modes through component
tokens. Use the hero preview switches above to see it in action.

For the full theming architecture see [Foundations: Design Tokens](/foundations/design-tokens/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All interactive states</strong><span>Default, hover, active, focus, checked, indeterminate, and disabled.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes for all brands.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible use of color</strong><span>Checked state uses a checkmark, not color alone (WCAG 1.4.1).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast for text</strong><span>Label contrast of at least 4.5:1 (WCAG 1.4.3).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast for UI</strong><span>Checkbox border contrast of at least 3:1 (WCAG 1.4.11).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Content standards</strong><span>Label writing guidelines documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Checked, indeterminate, disabled, and state options documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined behaviors</strong><span>Toggle, indeterminate, focus, and disabled behaviors documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>Do/don't examples for independent vs. exclusive choices.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Space toggle and Tab navigation documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>All visual attributes available as design tokens.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Figma component</strong><span>Available in the Figma library.</span></div></div>
</div>
