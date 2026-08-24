---
layout: layouts/docs.njk
title: Action Bar
description: A contextual sticky toolbar for bulk actions on selected items. Appears on selection, displays item count, and provides action buttons with select-all and dismiss controls.
navTitle: Action Bar
order: 49
permalink: /components/action-bar/
playgroundUrl: /components/action-bar-playground/
playgroundLabel: Open Action Bar Playground
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
      {% call uif.actionBar(count=3, open=true) %}
        <button type="button" class="uif-button ghost sm">Delete</button>
        <button type="button" class="uif-button ghost sm">Export</button>
      {% endcall %}
    </div>
  </div>
  <div class="docs-hero-meta">
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
      <span class="docs-anatomy-callout" data-dir="top" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">2</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 85%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">3</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      {% call uif.actionBar(count=2, open=true) %}
        <button type="button" class="uif-button ghost sm">Delete</button>
      {% endcall %}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Count — number of selected items</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Actions — contextual action buttons</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Dismiss — closes the bar and clears selection</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>count</td><td>number</td><td><code>0</code></td></tr>
    <tr><td>open</td><td>boolean</td><td><code>false</code></td></tr>
    <tr><td>label</td><td>text</td><td><code>"Bulk actions"</code></td></tr>
    <tr><td>dismiss-label</td><td>text</td><td><code>"Dismiss"</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {% call uif.actionBar(count=3, open=true) %}
        <button type="button" class="uif-button ghost sm">Delete</button>
        <button type="button" class="uif-button ghost sm">Export</button>
      {% endcall %}
    </div>
    <div class="docs-behavior-body">
      <h3>Appears on selection</h3>
      <p>The bar is hidden by default and becomes visible when items are selected (via the <code>is-open</code> class or <code>open</code> attribute).</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {% call uif.actionBar(count=1, open=true) %}
        <button type="button" class="uif-button ghost sm">Delete</button>
      {% endcall %}
    </div>
    <div class="docs-behavior-body">
      <h3>Sticky positioning</h3>
      <p>The bar sticks to the bottom of its scroll container so it remains accessible as users scroll through a long list.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Show only when items are selected

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      {% call uif.actionBar(count=2, open=true) %}
        <button type="button" class="uif-button ghost sm">Delete</button>
      {% endcall %}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Display the action bar only when one or more items are selected.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      {% call uif.actionBar(count=0, open=true) %}
        <button type="button" class="uif-button ghost sm">Delete</button>
      {% endcall %}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't show the bar when no items are selected — it creates confusion about what the actions apply to.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Use the count to tell users how many items are selected. Prefer "N items selected" for clarity.
- Keep action labels short and verb-first: "Delete", "Export", "Move".

<h2 id="keyboard-interactions">Keyboard interactions</h2>

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus through action buttons and dismiss |
| `Enter` / `Space` | Activates the focused button |
| `Escape` | Dismisses the bar (handled by consuming code) |

<h2 id="accessibility">Accessibility</h2>

- The bar uses `role="toolbar"` with an `aria-label` to describe its purpose.
- The dismiss button has an explicit `aria-label`.
- The count is announced as live text when the bar opens.
- Icons inside the dismiss button are decorative (`aria-hidden="true"`).

<h2 id="theming">Theming</h2>

Action Bar adapts across brands and modes through semantic tokens. Use the hero switches above.

For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible use of color</strong><span>Text conveys meaning, not color alone (WCAG 1.4.1).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Sticky positioning</strong><span>Bar remains visible while scrolling.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Count, open state, and labels documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>Shown only when items are selected.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>All visual attributes as tokens.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Tab and Enter/Space documented.</span></div></div>
</div>
