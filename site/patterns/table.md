---
layout: layouts/docs.njk
title: Table
description: Data table for displaying structured information with sortable columns, row selection, resizable columns, and sticky headers.
navTitle: Table
order: 21
permalink: /patterns/table/
playgroundUrl: /patterns/table-playground/
playgroundLabel: Open Table Playground
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
    <div class="docs-hero-preview-stage" style="inline-size: 100%; align-items: flex-start;">
      {% call uif.table(selection="single") %}
        {% call uif.tableHead() %}
          <tr>
            {{ uif.th("Destination", sort=true) }}
            {{ uif.th("Departure", sort=true) }}
            {{ uif.th("Duration") }}
            {{ uif.th("Price") }}
          </tr>
        {% endcall %}
        {% call uif.tableBody() %}
          {{ uif.tr(["Mallorca", "15 Aug 2025", "7 nights", "€499"]) }}
          {{ uif.tr(["Tenerife", "22 Aug 2025", "14 nights", "€799"]) }}
          {{ uif.tr(["Lanzarote", "01 Sep 2025", "10 nights", "€649"], selected=true) }}
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

<h2 id="anatomy">Anatomy</h2>

<div class="docs-anatomy">
  <div class="docs-anatomy-preview">
    <div class="docs-anatomy-subject" style="inline-size: 100%;">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 15%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 60%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      <span class="docs-anatomy-callout" data-dir="bottom" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">3</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      {% call uif.table() %}
        {% call uif.tableHead() %}
          <tr>{{ uif.th("Column A") }}{{ uif.th("Column B") }}{{ uif.th("Column C") }}</tr>
        {% endcall %}
        {% call uif.tableBody() %}
          {{ uif.tr(["Cell", "Cell", "Cell"]) }}
          {{ uif.tr(["Cell", "Cell", "Cell"]) }}
        {% endcall %}
      {% endcall %}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Header row — sticky column labels, optionally sortable or resizable</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Body row — data cells, optionally selectable</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Table wrapper — horizontal scroll container</li>
  </ol>
</div>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview" style="inline-size: 100%;">
      {% call uif.table() %}
        {% call uif.tableHead() %}<tr>{{ uif.th("Destination", sort=true) }}{{ uif.th("Price", sort=true) }}</tr>{% endcall %}
        {% call uif.tableBody() %}{{ uif.tr(["Mallorca", "€499"]) }}{{ uif.tr(["Tenerife", "€799"]) }}{% endcall %}
      {% endcall %}
    </div>
    <div class="docs-behavior-body">
      <h3>Sortable columns</h3>
      <p>Clicking or keyboard-activating a <code>th[aria-sort]</code> header cycles through <code>none → ascending → descending → none</code>. Only one column is sorted at a time; activating a new header resets the previous sort.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview" style="inline-size: 100%;">
      {% call uif.table(selection="single") %}
        {% call uif.tableHead() %}<tr>{{ uif.th("Destination") }}{{ uif.th("Price") }}</tr>{% endcall %}
        {% call uif.tableBody() %}
          {{ uif.tr(["Mallorca", "€499"], selected=true) }}
          {{ uif.tr(["Tenerife", "€799"]) }}
        {% endcall %}
      {% endcall %}
    </div>
    <div class="docs-behavior-body">
      <h3>Row selection</h3>
      <p><code>data-selection="single"</code> allows one row at a time; <code>multi</code> allows multiple rows. The selected state is tracked via <code>aria-selected="true"</code> on the <code>&lt;tr&gt;</code>. Multi-selection supports a select-all checkbox in the header.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview" style="inline-size: 100%;">
      {% call uif.table() %}
        {% call uif.tableHead() %}<tr>{{ uif.th("Destination", resizable=true) }}{{ uif.th("Departure", resizable=true) }}{{ uif.th("Price") }}</tr>{% endcall %}
        {% call uif.tableBody() %}{{ uif.tr(["Mallorca", "15 Aug 2025", "€499"]) }}{% endcall %}
      {% endcall %}
    </div>
    <div class="docs-behavior-body">
      <h3>Resizable columns</h3>
      <p>Adding <code>data-resizable</code> to a <code>&lt;th&gt;</code> injects a drag handle. Dragging resizes the column inline; a minimum width of 96 px is enforced. Column widths are not persisted by default.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview" style="inline-size: 100%;">
      <div class="uif-table-wrapper" style="max-block-size: 140px; overflow-y: auto;">
        <table class="uif-table">
          <thead><tr><th>Destination</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td>Mallorca</td><td>€499</td></tr>
            <tr><td>Tenerife</td><td>€799</td></tr>
            <tr><td>Lanzarote</td><td>€649</td></tr>
            <tr><td>Rhodes</td><td>€589</td></tr>
            <tr><td>Gran Canaria</td><td>€529</td></tr>
            <tr><td>Ibiza</td><td>€459</td></tr>
            <tr><td>Fuerteventura</td><td>€699</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="docs-behavior-body">
      <h3>Sticky header</h3>
      <p>The <code>&lt;thead&gt;</code> row sticks to the top of the scroll container via <code>position: sticky</code> so column labels remain visible as the user scrolls through long tables.</p>
    </div>
  </div>
</div>

<h2 id="options">Options</h2>

### Density

<div class="docs-states-grid" style="--docs-states-cols: 3; align-items: start;">
  <div class="docs-states-grid-item" style="align-items: stretch;">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">
      <div class="uif-table-wrapper" style="inline-size: 100%;">
        <table class="uif-table uif-table--compact" style="inline-size: 100%;">
          <thead><tr><th>Name</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td>Mallorca</td><td>€499</td></tr>
            <tr><td>Tenerife</td><td>€799</td></tr>
            <tr><td>Lanzarote</td><td>€649</td></tr>
            <tr><td>Rhodes</td><td>€589</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <span class="docs-states-grid-item-label">Compact</span>
  </div>
  <div class="docs-states-grid-item" style="align-items: stretch;">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">
      <div class="uif-table-wrapper" style="inline-size: 100%;">
        <table class="uif-table" style="inline-size: 100%;">
          <thead><tr><th>Name</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td>Mallorca</td><td>€499</td></tr>
            <tr><td>Tenerife</td><td>€799</td></tr>
            <tr><td>Lanzarote</td><td>€649</td></tr>
            <tr><td>Rhodes</td><td>€589</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item" style="align-items: stretch;">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">
      <div class="uif-table-wrapper" style="inline-size: 100%;">
        <table class="uif-table uif-table--spacious" style="inline-size: 100%;">
          <thead><tr><th>Name</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td>Mallorca</td><td>€499</td></tr>
            <tr><td>Tenerife</td><td>€799</td></tr>
            <tr><td>Lanzarote</td><td>€649</td></tr>
            <tr><td>Rhodes</td><td>€589</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <span class="docs-states-grid-item-label">Spacious</span>
  </div>
</div>

### Options reference

<table class="docs-options-table">
  <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td><code>density</code></td><td><code>compact</code> / <code>comfortable</code> / <code>spacious</code></td><td>—</td></tr>
    <tr><td><code>data-selection</code></td><td><code>single</code> / <code>multi</code></td><td>—</td></tr>
    <tr><td><code>aria-sort</code> on <code>th</code></td><td><code>none</code> / <code>ascending</code> / <code>descending</code></td><td>—</td></tr>
    <tr><td><code>data-resizable</code> on <code>th</code></td><td>boolean attribute</td><td>—</td></tr>
  </tbody>
</table>

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Context</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td><kbd>Enter</kbd> / <kbd>Space</kbd></td><td>Sortable header</td><td>Cycles sort direction: none → ascending → descending → none</td></tr>
    <tr><td><kbd>Enter</kbd> / <kbd>Space</kbd></td><td>Selectable row</td><td>Toggles row selection</td></tr>
    <tr><td><kbd>Tab</kbd></td><td>Table</td><td>Moves focus through interactive cells and controls</td></tr>
  </tbody>
</table>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Use selection only when the action is clear

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview" style="inline-size: 100%;">
      {% call uif.table(selection="single") %}
        {% call uif.tableHead() %}<tr>{{ uif.th("Destination") }}{{ uif.th("Price") }}</tr>{% endcall %}
        {% call uif.tableBody() %}
          {{ uif.tr(["Mallorca", "€499"], selected=true) }}
          {{ uif.tr(["Tenerife", "€799"]) }}
        {% endcall %}
      {% endcall %}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use selection when the user needs to act on a row — e.g. delete, compare, or bulk-update.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview" style="inline-size: 100%;">
      {% call uif.table(selection="single") %}
        {% call uif.tableHead() %}<tr>{{ uif.th("Destination") }}{{ uif.th("Price") }}</tr>{% endcall %}
        {% call uif.tableBody() %}
          {{ uif.tr(["Mallorca", "€499"]) }}
          {{ uif.tr(["Tenerife", "€799"]) }}
        {% endcall %}
      {% endcall %}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't add row selection to display-only tables — it implies an action that doesn't exist.</p>
    </div>
  </div>
</div>

### Match density to context

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview" style="inline-size: 100%;">
      {% call uif.table(density="compact") %}
        {% call uif.tableHead() %}<tr>{{ uif.th("Name") }}{{ uif.th("Status") }}{{ uif.th("Value") }}</tr>{% endcall %}
        {% call uif.tableBody() %}
          {{ uif.tr(["Item A", "Active", "100"]) }}
          {{ uif.tr(["Item B", "Draft", "200"]) }}
          {{ uif.tr(["Item C", "Active", "150"]) }}
        {% endcall %}
      {% endcall %}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use compact density for data-heavy dashboards where many rows must be visible at once.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview" style="inline-size: 100%;">
      {% call uif.table(density="spacious") %}
        {% call uif.tableHead() %}<tr>{{ uif.th("Name") }}{{ uif.th("Status") }}{{ uif.th("Value") }}</tr>{% endcall %}
        {% call uif.tableBody() %}
          {{ uif.tr(["Item A", "Active", "100"]) }}
          {{ uif.tr(["Item B", "Draft", "200"]) }}
        {% endcall %}
      {% endcall %}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use spacious density in compact UIs — it wastes vertical space and forces unnecessary scrolling.</p>
    </div>
  </div>
</div>

<h2 id="accessibility">Accessibility</h2>

- Use a `<caption>` element or `aria-label` on the `<table>` to give it an accessible name.
- Sortable `<th>` elements use `aria-sort` (`none` / `ascending` / `descending`) to communicate sort state to screen readers.
- Selected rows use `aria-selected="true"` on `<tr>`; the table must have `role="grid"` or the selection pattern must be documented for AT users.
- Column resize handles are visually-only; ensure column widths can also be controlled by other means.
- Focus ring uses `box-shadow` inset to avoid layout impact and remains visible in high-contrast modes.
- Do not rely on color alone to communicate sort direction — the `↑` / `↓` / `↕` icons provide a redundant visual cue.

<h2 id="content-standards">Content standards</h2>

### Column headers

Keep column headers short — 1–3 words. Use sentence case, not title case. Avoid abbreviations unless they are universally understood (e.g. "ID", "SKU").

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview" style="inline-size: 100%;">
      {% call uif.table() %}
        {% call uif.tableHead() %}<tr>{{ uif.th("Destination") }}{{ uif.th("Departure date") }}{{ uif.th("Price") }}</tr>{% endcall %}
        {% call uif.tableBody() %}{{ uif.tr(["Mallorca", "15 Aug 2025", "€499"]) }}{% endcall %}
      {% endcall %}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use clear, concise labels that describe the column's data.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview" style="inline-size: 100%;">
      {% call uif.table() %}
        {% call uif.tableHead() %}<tr>{{ uif.th("Dest.") }}{{ uif.th("Dep. Dt.") }}{{ uif.th("Pr. (€)") }}</tr>{% endcall %}
        {% call uif.tableBody() %}{{ uif.tr(["Mallorca", "15/08/25", "499"]) }}{% endcall %}
      {% endcall %}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use unclear abbreviations that force the user to guess what the column means.</p>
    </div>
  </div>
</div>

### Empty and loading states

Provide a meaningful message for empty tables. Use `<td colspan="…">` with the `.uif-table-empty` class. For loading state, add `.uif-table--loading` to the `<table>` element.

<h2 id="theming">Theming</h2>

Table adapts automatically across brands and color modes through component tokens (`--uif-table-*`). Background, text, border, hover, and selection colors all respond to brand and mode changes. Use the hero preview switches above to see it in action.

For the full theming architecture — brands, modes, and how tokens cascade — see [Foundations: Design Tokens](/foundations/design-tokens/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Token-driven colors and spacing adapt across brands and light/dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Sort, selection, and focus are fully keyboard accessible.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Component-scoped tokens (<code>--uif-table-*</code>) defined.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Density variants</strong><span>Compact, comfortable, and spacious densities available.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Progressive enhancement</strong><span>Base HTML table is fully usable without JavaScript; JS adds sort/select/resize.</span></div></div>
  <div class="docs-checklist-item" data-done="false"><div class="docs-checklist-icon">○</div><div class="docs-checklist-text"><strong>Code Connect</strong><span>Figma node-id needed — <code>schemas/web-table.figma.ts</code> has a placeholder.</span></div></div>
</div>

<h2 id="usage">Usage</h2>

### HTML

```html
<div class="uif-table-wrapper">
  <table class="uif-table" data-selection="single">
    <thead>
      <tr>
        <th aria-sort="none">Destination</th>
        <th aria-sort="none">Departure</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Mallorca</td><td>15 Aug 2025</td><td>€499</td></tr>
    </tbody>
  </table>
</div>
<script type="module" src="/vendor/ui-foundations/components/table.js"></script>
```

### JavaScript

```js
import { enhanceTable } from "ui-foundations/ui/components/table.js";
// Enhance all tables on the page:
enhanceTable();
// Or enhance within a specific container:
enhanceTable(document.querySelector("#my-container"));
```

<script type="module" src="/vendor/ui-foundations/components/table.js"></script>

<script type="module" src="/vendor/ui-foundations/components/table.js"></script>
