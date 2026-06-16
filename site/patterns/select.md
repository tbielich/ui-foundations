---
layout: layouts/docs.njk
title: Select
description: Dropdown selection component for choosing a single option from a list. Supports placeholder text, option groups, disabled states, and keyboard navigation.
navTitle: Select
order: 45
permalink: /patterns/select/
playgroundUrl: /patterns/select-playground/
playgroundLabel: Open Select Playground
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
      {{ ui.select(options=[{value: "opt1", label: "Option 1"}, {value: "opt2", label: "Option 2"}, {value: "opt3", label: "Option 3"}], placeholder="Choose an option") }}
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
      <span class="docs-anatomy-callout" data-dir="top" style="left: 30%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 70%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">2</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="bottom" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">3</span>
      </span>
      {{ ui.select(options=[{value: "opt1", label: "Option 1"}], placeholder="Choose an option") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Container — border, background, and padding define the field area</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Chevron indicator — signals the field opens a dropdown</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Text / placeholder — selected value or hint text</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### States

<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.select(options=[{value: "opt1", label: "Option 1"}], placeholder="Default") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.select(options=[{value: "opt1", label: "Option 1"}], value="opt1", state="hover") }}</div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.select(options=[{value: "opt1", label: "Option 1"}], value="opt1", state="focus") }}</div>
    <span class="docs-states-grid-item-label">Focus</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.select(options=[{value: "opt1", label: "Option 1"}], placeholder="Disabled", disabled=true) }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td>options</td><td>Array of <code>{value, label}</code> or <code>{group, items}</code></td><td><code>[]</code></td></tr>
    <tr><td>placeholder</td><td>text</td><td>—</td></tr>
    <tr><td>value</td><td>text (selected option value)</td><td>—</td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>state</td><td><code>default</code> / <code>hover</code> / <code>active</code> / <code>focus</code> / <code>disabled</code></td><td><code>default</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.select(options=[{value: "opt1", label: "Option 1"}, {value: "opt2", label: "Option 2"}], placeholder="Choose an option") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Full width</h3>
      <p>Select expands to fill the available inline size of its container.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.select(options=[{value: "opt1", label: "Option 1"}], value="opt1", state="focus") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Keyboard focus</h3>
      <p>The focus state changes the border color and adds a focus ring. Users can navigate options with arrow keys.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.select(options=[{value: "opt1", label: "Option 1"}], placeholder="Disabled", disabled=true) }}
    </div>
    <div class="docs-behavior-body">
      <h3>Disabled state</h3>
      <p>A disabled select cannot be opened. It is removed from the tab order and uses reduced contrast.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ ui.select(options=[{group: "Fruits", items: [{value: "apple", label: "Apple"}, {value: "banana", label: "Banana"}]}, {group: "Vegetables", items: [{value: "carrot", label: "Carrot"}]}], placeholder="Choose food") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Option groups</h3>
      <p>Options can be organized into labeled groups using <code>optgroup</code> for categorized lists.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Always pair with a label

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <code>&lt;label for="country"&gt;Country&lt;/label&gt;</code>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Every select must have a visible label or an <code>aria-label</code>.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      {{ ui.select(options=[{value: "de", label: "Germany"}], placeholder="Country") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use placeholder text as the only label.</p>
    </div>
  </div>
</div>

### Use select for 5+ options

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <code>Select with 5+ options</code>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use a select when there are 5 or more options. It keeps the interface compact.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <code>Select with 2 options</code>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>For 2–4 options, prefer radio buttons for visibility and fewer interactions.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Placeholder text should describe what to select, not repeat the label.
- Option labels should be short and scannable.
- Use sentence case for option labels.
- Group related options when the list exceeds 7 items.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead>
    <tr><th>Key</th><th>Interaction</th></tr>
  </thead>
  <tbody>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus into or out of the select.</td></tr>
    <tr><td><kbd>Space</kbd> / <kbd>Enter</kbd></td><td>Opens the dropdown list.</td></tr>
    <tr><td><kbd>↑</kbd> <kbd>↓</kbd></td><td>Navigates between options.</td></tr>
    <tr><td><kbd>Home</kbd> / <kbd>End</kbd></td><td>Moves to the first or last option.</td></tr>
    <tr><td><kbd>Escape</kbd></td><td>Closes the dropdown without changing selection.</td></tr>
    <tr><td>Type-ahead</td><td>Jumps to the first option matching typed characters.</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Uses the native `<select>` element which provides built-in keyboard support and screen reader semantics.
- Every select must have a programmatic label via `<label>`, `aria-label`, or `aria-labelledby`.
- Placeholder text is not an accessible label — it disappears once an option is selected.
- Disabled selects use the native `disabled` attribute which removes them from the tab order.
- Option groups use `<optgroup>` with a `label` attribute for screen reader announcement.
- Focus indicators meet 3:1 contrast.

<h2 id="enhanced-dropdown">Enhanced dropdown (base-select)</h2>

In browsers that support `appearance: base-select` (Chromium 136+), the select
dropdown is fully styleable — including the options list, individual options, and
the picker icon. This enhancement is applied automatically via `@supports` and
requires no markup changes.

**What changes in supported browsers:**
- The dropdown panel inherits the component's border radius and shadow tokens.
- Options receive padding, hover, and selected-state styling via component tokens.
- The chevron indicator is rendered as a `::picker-icon` pseudo-element instead of a background SVG.

**Fallback:**
In unsupported browsers, the select renders identically to before — with
`appearance: none` and an inline SVG chevron as `background-image`. No visual
regression occurs.

<h2 id="theming">Theming</h2>

Select adapts automatically across brands and color modes through component
tokens. Use the hero preview switches above to see it in action.

For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All interactive states</strong><span>Hover, active, focus, and disabled states are implemented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All color themes</strong><span>Works across light and dark modes for all brands.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible use of color</strong><span>Color is not the only visual means of conveying information (WCAG 1.4.1).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast for text</strong><span>Text contrast ratio of at least 4.5:1 (WCAG 1.4.3).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast for UI</strong><span>UI component contrast ratio of at least 3:1 (WCAG 1.4.11).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Content standards</strong><span>Placeholder, option label, and grouping guidelines are documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Options, placeholder, value, disabled, and state options are documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined behaviors</strong><span>Full width, focus, disabled, and option group behaviors are documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>Do and don't examples for labeling and option count are included.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Tab, Space, Enter, Arrow, Escape, and type-ahead interactions are documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>All visual attributes are available as design tokens.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Figma component</strong><span>Component is available in the Figma library.</span></div></div>
</div>
