---
layout: layouts/docs.njk
title: Switch
description: Switches toggle a single setting on or off with immediate effect. Use them for binary choices that take effect without a submit action.
navTitle: Switch
order: 47
permalink: /patterns/switch/
playgroundUrl: /patterns/switch-playground/
playgroundLabel: Open Switch Playground
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
      {{ ui.switch("Notifications", true) }}
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
    <div class="docs-anatomy-subject">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 20%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="bottom" style="left: 20%; transform: translateX(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 50%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">3</span>
      </span>
      {{ ui.switch("Notifications", true) }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Track — pill-shaped container</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Thumb — circular indicator that slides between on/off</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Label — describes the setting</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### States

<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-row-header">Off</div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.switch("Default") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.switch("Hover", false, false, "hover") }}</div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.switch("Focus", false, false, "focus") }}</div>
    <span class="docs-states-grid-item-label">Focus</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.switch("Disabled", false, true) }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
  <div class="docs-states-grid-row-header">On</div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.switch("Default", true) }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.switch("Hover", true, false, "hover") }}</div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.switch("Focus", true, false, "focus") }}</div>
    <span class="docs-states-grid-item-label">Focus</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.switch("Disabled", true, true) }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>label</td><td>text</td><td>—</td></tr>
    <tr><td>checked</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ ui.switch("Toggle me") }}</div>
    <div class="docs-behavior-body">
      <h3>Immediate effect</h3>
      <p>Toggling takes effect immediately — no submit needed.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ ui.switch("Animated", true) }}</div>
    <div class="docs-behavior-body">
      <h3>Thumb animation</h3>
      <p>The thumb slides smoothly. The track color transitions to indicate the new state.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ ui.switch("Focused", false, false, "focus") }}</div>
    <div class="docs-behavior-body">
      <h3>Keyboard focus</h3>
      <p>Adds a visible focus ring. Toggled with Space.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Switch vs. checkbox

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">{{ ui.switch("Dark mode", true) }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use a switch for settings that take effect immediately.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">{{ ui.switch("I agree to the terms") }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use a switch for form consent — use a checkbox.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Write labels as the setting name: "Notifications" not "Turn on notifications".
- Use sentence case. Keep to one line.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Interaction</th></tr></thead>
  <tbody>
    <tr><td><kbd>Space</kbd></td><td>Toggles between on and off.</td></tr>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus to the next element.</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Use `<input type="checkbox" role="switch">`.
- Associate label via `<label>`.
- `role="switch"` communicates on/off semantics.
- Disabled uses native `disabled` attribute.
- Focus indicators meet 3:1 contrast.

<h2 id="theming">Theming</h2>

Switch adapts across brands and modes through tokens. Use the hero switches above.

For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All interactive states</strong><span>On, off, hover, focus, disabled.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All color themes</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible use of color</strong><span>Thumb position indicates state (WCAG 1.4.1).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast</strong><span>Track and label meet contrast requirements.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Content standards</strong><span>Label guidelines documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Checked, disabled documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined behaviors</strong><span>Immediate effect, animation, focus documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>Switch vs. checkbox do/don't.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Space and Tab documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Component-scoped tokens (<code>--switch-*</code>).</span></div></div>
  <div class="docs-checklist-item" data-done="false"><div class="docs-checklist-icon">–</div><div class="docs-checklist-text"><strong>Figma component</strong><span>Not yet connected via Code Connect.</span></div></div>
</div>
