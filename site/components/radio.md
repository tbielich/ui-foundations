---
layout: layouts/docs.njk
title: Radio
description: Selection control for mutually exclusive choices within a group.
navTitle: Radio
order: 55
permalink: /components/radio/
playgroundUrl: /components/radio-playground/
playgroundLabel: Open Radio Playground
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
      {{ ui.radio("Option A", false, false, "default", "", "", "", "hero-group", "a") }}
      {{ ui.radio("Option B", true, false, "default", "", "", "", "hero-group", "b") }}
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
      {{ ui.radio("Label text", true, false, "default", "", "", "", "anatomy-group", "a") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Field wrapper — groups the indicator and label as a click target</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Indicator — circular control with filled dot when selected</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Label — describes the option</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### States

<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-row-header">Unselected</div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.radio("Default", false, false, "default", "", "", "", "sg-un", "a") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.radio("Hover", false, false, "hover", "", "", "", "sg-unh", "a") }}</div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.radio("Focus", false, false, "focus", "", "", "", "sg-unf", "a") }}</div>
    <span class="docs-states-grid-item-label">Focus</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.radio("Disabled", false, true, "default", "", "", "", "sg-und", "a") }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
  <div class="docs-states-grid-row-header">Selected</div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.radio("Default", true, false, "default", "", "", "", "sg-sel", "a") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.radio("Hover", true, false, "hover", "", "", "", "sg-selh", "a") }}</div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.radio("Focus", true, false, "focus", "", "", "", "sg-self", "a") }}</div>
    <span class="docs-states-grid-item-label">Focus</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.radio("Disabled", true, true, "default", "", "", "", "sg-seld", "a") }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td>label</td><td>text</td><td><code>"Option"</code></td></tr>
    <tr><td>checked</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>name</td><td>text (shared across group)</td><td>—</td></tr>
    <tr><td>value</td><td>text</td><td>—</td></tr>
    <tr><td>state</td><td><code>default</code> / <code>hover</code> / <code>active</code> / <code>focus</code> / <code>disabled</code></td><td><code>default</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.radio("Option A", false, false, "default", "", "", "", "beh-select", "a") }}
      {{ ui.radio("Option B", true, false, "default", "", "", "", "beh-select", "b") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Mutual exclusion</h3>
      <p>Selecting one radio in a group automatically deselects the previously selected option.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.radio("Focus preview", false, false, "focus", "", "", "", "beh-focus", "a") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Keyboard focus</h3>
      <p>The focus state adds a visible focus ring around the radio indicator.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.radio("Disabled", false, true, "default", "", "", "", "beh-disabled", "a") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Disabled state</h3>
      <p>A disabled radio cannot be selected. It is removed from the tab order and uses reduced contrast.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.radio("Arrow nav", true, false, "default", "", "", "", "beh-arrow", "a") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Arrow key navigation</h3>
      <p>Within a radio group, arrow keys move focus and selection between options without leaving the group.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Use radios for mutually exclusive choices

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      {{ ui.radio("Economy", true, false, "default", "", "", "", "ug-do", "a") }}
      {{ ui.radio("Business", false, false, "default", "", "", "", "ug-do", "b") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use radios when only one option can be selected from a group.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      {{ ui.checkbox("Economy", true) }}
      {{ ui.checkbox("Business") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use checkboxes for mutually exclusive choices.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Write each option as a distinct, parallel choice.
- Use sentence case.
- Keep labels concise — one line when possible.
- Always provide at least two options in a radio group.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Interaction</th></tr></thead>
  <tbody>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus into or out of the radio group.</td></tr>
    <tr><td><kbd>↑</kbd> / <kbd>←</kbd></td><td>Moves selection to the previous option, wrapping to the last.</td></tr>
    <tr><td><kbd>↓</kbd> / <kbd>→</kbd></td><td>Moves selection to the next option, wrapping to the first.</td></tr>
    <tr><td><kbd>Space</kbd></td><td>Selects the focused option if not already selected.</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Use native `<input type="radio">` with shared `name` for grouping.
- Wrap in a `<fieldset>` with a `<legend>`.
- Each radio must have an associated `<label>`.
- Focus indicators meet 3:1 contrast.
- Selected state uses a filled dot, not color alone.

<h2 id="theming">Theming</h2>

Radio adapts automatically across brands and color modes through component
tokens. Use the hero preview switches above to see it in action.

For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All interactive states</strong><span>Default, hover, active, focus, selected, and disabled.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All color themes</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible use of color</strong><span>Selected uses filled dot, not color alone (WCAG 1.4.1).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast for text</strong><span>Label contrast at least 4.5:1 (WCAG 1.4.3).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast for UI</strong><span>Border contrast at least 3:1 (WCAG 1.4.11).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Content standards</strong><span>Label guidelines documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Checked, disabled, name, value documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined behaviors</strong><span>Mutual exclusion, focus, disabled, arrow nav documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>Do/don't for exclusive vs. independent choices.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Tab, arrow, Space documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>All visual attributes as tokens.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Figma component</strong><span>Available in Figma library.</span></div></div>
</div>
