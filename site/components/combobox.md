---
layout: layouts/docs.njk
title: ComboBox
description: Text input with autocomplete suggestions, async loading support, free-form entry, and keyboard navigation.
navTitle: ComboBox
order: 42
permalink: /components/combobox/
playgroundUrl: /components/combobox-playground/
playgroundLabel: Open ComboBox Playground
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
      <uif-combobox placeholder="Search destinations" aria-label="Destination search">
        <option value="pmi" data-description="Spain">Palma de Mallorca</option>
        <option value="her" data-description="Greece">Heraklion</option>
        <option value="fue" data-description="Canary Islands">Fuerteventura</option>
      </uif-combobox>
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
      <span class="docs-anatomy-callout" data-dir="top" style="left: 24%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 81%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">2</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="bottom" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">3</span>
      </span>
      {{ uif.combobox(
        options=[
          {value: "pmi", label: "Palma de Mallorca", description: "Spain"},
          {value: "her", label: "Heraklion", description: "Greece"}
        ],
        placeholder="Search destinations",
        query="Pal",
        open=true
      ) }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Input field — editable text entry for typeahead filtering.</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Controls — clear, loading, and expand/collapse affordances.</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Suggestion list — filtered options, async status, or a free-form value action.</li>
  </ol>
</div>

<h2 id="options">Options</h2>

<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.combobox(options=[{value: "one", label: "One"}], placeholder="Default") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.combobox(options=[{value: "one", label: "One"}], value="One", state="hover") }}</div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.combobox(options=[{value: "one", label: "One"}], value="One", state="focus", open=true) }}</div>
    <span class="docs-states-grid-item-label">Focus</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.combobox(options=[{value: "one", label: "One"}], placeholder="Disabled", disabled=true) }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td>options</td><td>Array of <code>{value, label, description, keywords, disabled}</code></td><td><code>[]</code></td></tr>
    <tr><td>placeholder</td><td>text</td><td>—</td></tr>
    <tr><td>value</td><td>selected value</td><td>—</td></tr>
    <tr><td>loading</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>allowCustomValue</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>state</td><td><code>default</code> / <code>hover</code> / <code>active</code> / <code>focus</code> / <code>disabled</code></td><td><code>default</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.combobox(
        options=[
          {value: "pmi", label: "Palma de Mallorca", description: "Spain"},
          {value: "fue", label: "Fuerteventura", description: "Canary Islands"}
        ],
        query="Fu",
        open=true
      ) }}
    </div>
    <div class="docs-behavior-body">
      <h3>Typeahead filtering</h3>
      <p>Filtering happens as the user types. Matching checks labels, values, descriptions, groups, and optional keywords.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.combobox(options=[], query="Bal", loading=true, open=true) }}
    </div>
    <div class="docs-behavior-body">
      <h3>Async loading</h3>
      <p>Set the <code>loading</code> attribute while remote suggestions are pending, then update the <code>options</code> property when results arrive.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.combobox(options=[{value: "pmi", label: "Palma de Mallorca"}], query="Balearic coast", allowCustomValue=true, open=true) }}
    </div>
    <div class="docs-behavior-body">
      <h3>Free-form value</h3>
      <p>When <code>allow-custom-value</code> is present, unmatched text can be committed as a submitted value.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      <uif-combobox placeholder="Search resorts" aria-label="Resort search" option-template="combobox-rich-option">
        <option value="alcudia" data-description="Majorca · Beach resort">Alcúdia</option>
        <option value="kos-town" data-description="Kos · Old town">Kos Town</option>
      </uif-combobox>
      <template id="combobox-rich-option">
        <span class="uif-combobox-option-label">{% raw %}{{label}}{% endraw %}</span>
        <span class="uif-combobox-option-meta">{% raw %}{{description}}{% endraw %}</span>
      </template>
    </div>
    <div class="docs-behavior-body">
      <h3>Custom option rendering</h3>
      <p>Use an <code>option-template</code> reference when labels need richer layouts such as helper text, region names, or additional metadata.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <code>&lt;uif-combobox aria-label="Destination"&gt;…&lt;/uif-combobox&gt;</code>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use ComboBox when typing is faster than scanning a long list or when suggestions come from an async source.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <code>&lt;select&gt;</code> with 50 options
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't replace a native <code>select</code> unless filtering, async loading, or free-form entry is genuinely needed.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Placeholder text should describe the search target, not restate the field label.
- Option labels should stay short and scannable; move detail into <code>description</code> when needed.
- Free-form input should be constrained by downstream validation when the field feeds structured data.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead>
    <tr><th>Key</th><th>Interaction</th></tr>
  </thead>
  <tbody>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus into or out of the field and commits the current value if appropriate.</td></tr>
    <tr><td><kbd>↑</kbd> <kbd>↓</kbd></td><td>Opens the list and moves the active option.</td></tr>
    <tr><td><kbd>Home</kbd> / <kbd>End</kbd></td><td>Moves to the first or last enabled option when the list is open.</td></tr>
    <tr><td><kbd>Enter</kbd></td><td>Selects the active option or commits the free-form value.</td></tr>
    <tr><td><kbd>Escape</kbd></td><td>Closes the list and restores the last committed selection.</td></tr>
    <tr><td>Type-ahead</td><td>Filters available options in place.</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- The input uses the ARIA <code>combobox</code> pattern with an associated <code>listbox</code> and active descendant.
- Always provide a visible label or <code>aria-label</code> / <code>aria-labelledby</code>.
- Loading and empty states announce status updates with <code>role="status"</code> and <code>aria-live="polite"</code>.
- Free-form values should be validated the same way as other user-entered text before submission.

<h2 id="theming">Theming</h2>

ComboBox adapts automatically across brands and color modes through dedicated component tokens. Use the hero switches above to review brand/mode combinations.

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Autocomplete filtering</strong><span>Suggestions can be filtered from user input.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Async loading state</strong><span>Loading affordance and live status messaging are documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Free-form input</strong><span>Optional custom value behavior is supported and documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard support</strong><span>Arrow, Home/End, Enter, Escape, and Tab interactions are documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Visual styling is driven by dedicated <code>--uif-combobox-*</code> tokens.</span></div></div>
</div>

<script type="module" src="/vendor/ui-foundations/elements/ui-combobox.js"></script>
