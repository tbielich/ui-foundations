---
layout: layouts/docs.njk
title: Number Field
description: Numeric input with increment and decrement stepper controls. Supports min/max constraints, step value, arrow key increments, and format display for currency and percent values.
navTitle: Number Field
order: 42
permalink: /patterns/number-field/
playgroundUrl: /patterns/number-field-playground/
playgroundLabel: Open Number Field Playground
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
      {{ uif.numberField(value="0", step="1") }}
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
      <span class="docs-anatomy-callout" data-dir="top" style="left: 15%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="bottom" style="left: 45%; transform: translateX(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 80%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">3</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      {{ uif.numberField(value="42", format="currency") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Format prefix/suffix — optional currency (<code>$</code>) or percent (<code>%</code>) indicator</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Input primitive — numeric text entry element (value or placeholder)</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Stepper controls — decrement and increment buttons</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### States

<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.numberField(value="0", placeholder="0") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.numberField(value="10", state="hover") }}</div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.numberField(value="10", state="focus") }}</div>
    <span class="docs-states-grid-item-label">Focus</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.numberField(value="10", disabled=true) }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

### Format display

<div class="docs-states-grid" style="--docs-states-cols: 3">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.numberField(value="0") }}</div>
    <span class="docs-states-grid-item-label">None (default)</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.numberField(value="9.99", format="currency") }}</div>
    <span class="docs-states-grid-item-label">Currency</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.numberField(value="75", format="percent", min="0", max="100") }}</div>
    <span class="docs-states-grid-item-label">Percent</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td>value</td><td>number</td><td>—</td></tr>
    <tr><td>min</td><td>number</td><td>—</td></tr>
    <tr><td>max</td><td>number</td><td>—</td></tr>
    <tr><td>step</td><td>number</td><td><code>1</code></td></tr>
    <tr><td>format</td><td><code>none</code> / <code>currency</code> / <code>percent</code></td><td><code>none</code></td></tr>
    <tr><td>placeholder</td><td>text</td><td><code>0</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>state</td><td><code>default</code> / <code>hover</code> / <code>active</code> / <code>focus</code> / <code>disabled</code> / <code>readonly</code> / <code>invalid</code></td><td><code>default</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.numberField(value="5", step="1") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Stepper buttons</h3>
      <p>Minus and plus buttons increment or decrement the value by the configured step amount. JavaScript enhancement via <code>input-field.js</code> handles click events.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.numberField(value="5", min="0", max="10", step="1") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Min/max constraints</h3>
      <p>The <code>min</code> and <code>max</code> attributes constrain the accepted range. The stepper clamps to these bounds. Arrow key increments also respect constraints.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.numberField(value="0", step="0.25") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Custom step</h3>
      <p>The <code>step</code> attribute controls the increment amount for both button clicks and arrow key presses. Fractional steps are supported.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.numberField(value="9.99", format="currency") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Currency format</h3>
      <p>The <code>format="currency"</code> option prepends a <code>$</code> symbol as a decorative, non-interactive prefix. For localised currency formatting, provide the symbol via the prefix slot.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.numberField(value="75", format="percent", min="0", max="100") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Percent format</h3>
      <p>The <code>format="percent"</code> option appends a <code>%</code> symbol as a decorative suffix after the input.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.numberField(value="10", disabled=true) }}
    </div>
    <div class="docs-behavior-body">
      <h3>Disabled state</h3>
      <p>A disabled number field cannot be edited or stepped. It is removed from the tab order and stepper buttons are visually hidden.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Always pair with a label

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <code>&lt;label for="qty"&gt;Quantity&lt;/label&gt;</code>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Every number field must have a visible label, <code>aria-label</code>, or <code>aria-labelledby</code>.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      {{ uif.numberField(value="0") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Do not render a number field without an associated label or accessible name.</p>
    </div>
  </div>
</div>

### Use min/max to communicate range

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      {{ uif.numberField(value="50", min="0", max="100", format="percent") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Set <code>min</code> and <code>max</code> to prevent out-of-range entries and constrain stepper buttons.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      {{ uif.numberField(value="50", format="percent") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Avoid displaying a percent field without <code>min="0" max="100"</code> constraints.</p>
    </div>
  </div>
</div>

<h2 id="code">Code</h2>

### HTML

```html
<!-- Plain number field -->
<div class="uif-input-field uif-number-field">
  <input class="uif-input" type="number" placeholder="0" value="0" />
  <span class="uif-input-field-control">
    <button type="button" aria-label="Decrease value"><!-- minus icon --></button>
    <button type="button" aria-label="Increase value"><!-- plus icon --></button>
  </span>
</div>

<!-- Currency format -->
<div class="uif-input-field uif-number-field">
  <span class="uif-number-field-prefix" aria-hidden="true">$</span>
  <input class="uif-input" type="number" placeholder="0" value="9.99" step="0.01" />
  <span class="uif-input-field-control">
    <button type="button" aria-label="Decrease value"><!-- minus icon --></button>
    <button type="button" aria-label="Increase value"><!-- plus icon --></button>
  </span>
</div>

<!-- Percent format -->
<div class="uif-input-field uif-number-field">
  <input class="uif-input" type="number" placeholder="0" value="75" min="0" max="100" />
  <span class="uif-number-field-suffix" aria-hidden="true">%</span>
  <span class="uif-input-field-control">
    <button type="button" aria-label="Decrease value"><!-- minus icon --></button>
    <button type="button" aria-label="Increase value"><!-- plus icon --></button>
  </span>
</div>
```

### Web Component

```html
<uif-number-field value="0" step="1" aria-label="Quantity"></uif-number-field>
<uif-number-field format="currency" value="9.99" step="0.01" aria-label="Price"></uif-number-field>
<uif-number-field format="percent" value="75" min="0" max="100" aria-label="Progress"></uif-number-field>
```

### Nunjucks macro

```njk
{% import "macros/ui.njk" as uif %}
{{ uif.numberField(value="0", step="1") }}
{{ uif.numberField(value="9.99", format="currency", step="0.01") }}
{{ uif.numberField(value="75", format="percent", min="0", max="100") }}
```

<h2 id="accessibility">Accessibility</h2>

- The `<input type="number">` element is natively keyboard accessible: arrow keys increment or decrement by the configured step, `Home`/`End` jump to min/max.
- Stepper buttons have descriptive `aria-label` values (`"Decrease value"` / `"Increase value"`).
- Format prefix and suffix elements carry `aria-hidden="true"` to avoid duplicate announcements; the accessible label or surrounding `<label>` should convey the unit context.
- Disabled fields are removed from the tab order via the native `disabled` attribute.
