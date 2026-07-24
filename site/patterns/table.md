---
layout: layouts/docs.njk
title: Table
description: Data table for structured information with sorting, selection, resizing, sticky headers, and explicit empty or loading states.
navTitle: Table
order: 21
permalink: /patterns/table/
playgroundUrl: /patterns/table-playground/
playgroundLabel: Open Table Playground
---
{% import "macros/ui.njk" as uif %}

<div class="docs-hero">
  <div class="docs-hero-preview">
    <div class="docs-hero-preview-stage" style="inline-size: 100%; align-items: flex-start;">
      {% call uif.table(caption="Destinations", selection="single", sortable=true) %}
        {% call uif.tableHead() %}
          <tr>
            {{ uif.th("Destination", sort=true) }}
            {{ uif.th("Departure", sort=true) }}
            {{ uif.th("Duration") }}
            {{ uif.th("Price") }}
          </tr>
        {% endcall %}
        {% call uif.tableBody() %}
          {{ uif.tr(["Mallorca", "15 Aug 2025", "7 nights", "£499"]) }}
          {{ uif.tr(["Tenerife", "22 Aug 2025", "14 nights", "£799"], selected=true) }}
          {{ uif.tr(["Lanzarote", "01 Sep 2025", "10 nights", "£649"]) }}
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

## Summary

Table is a semantic data pattern with progressive enhancement for sortable columns, single or multi-row selection, resizable headers, sticky headers, and explicit empty or loading states.

## Markup

```html
<div class="uif-table-wrapper">
  <table class="uif-table uif-table--sortable" data-selection="single">
    <caption>Destinations</caption>
    <thead>
      <tr>
        <th class="uif-table-th" aria-sort="none">Destination</th>
        <th class="uif-table-th" aria-sort="none">Departure</th>
        <th class="uif-table-th">Duration</th>
        <th class="uif-table-th">Price</th>
      </tr>
    </thead>
    <tbody>
      <tr class="uif-table-tr" aria-selected="true">
        <td class="uif-table-td">Mallorca</td>
        <td class="uif-table-td">15 Aug 2025</td>
        <td class="uif-table-td">7 nights</td>
        <td class="uif-table-td">£499</td>
      </tr>
    </tbody>
  </table>
</div>
<script type="module" src="/vendor/ui-foundations/components/table.js"></script>
```

## Behaviors

- **Sortable columns** — add `aria-sort="none"` to headers and `uif-table--sortable` to the table.
- **Row selection** — use `data-selection="single"` or `data-selection="multi"`; selected rows use `aria-selected="true"`.
- **Resizable columns** — add `data-resizable` to any header cell.
- **Sticky header** — table headers remain visible inside the scroll wrapper.
- **Empty state** — render a spanning cell with `.uif-table-empty`.
- **Loading state** — add `.uif-table--loading` to the table while data refreshes.

## States

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview" style="inline-size: 100%;">
      {% call uif.table(caption="Loading table", className="uif-table--loading") %}
        {% call uif.tableHead() %}<tr>{{ uif.th("Name") }}{{ uif.th("Status") }}</tr>{% endcall %}
        {% call uif.tableBody() %}{{ uif.tr(["Flight bundle", "Refreshing…"]) }}{{ uif.tr(["Hotel bundle", "Refreshing…"]) }}{% endcall %}
      {% endcall %}
    </div>
    <div class="docs-behavior-body">
      <h3>Loading</h3>
      <p>Use the loading modifier while new data is being fetched. Interaction is temporarily disabled without breaking the semantic table structure.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview" style="inline-size: 100%;">
      <div class="uif-table-wrapper">
        <table class="uif-table uif-table--comfortable">
          <thead><tr><th class="uif-table-th">Destination</th><th class="uif-table-th">Status</th></tr></thead>
          <tbody>
            <tr class="uif-table-tr"><td class="uif-table-td uif-table-empty" colspan="2">No destinations match the current filter.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="docs-behavior-body">
      <h3>Empty</h3>
      <p>Use a full-width empty row to explain why the table has no data and what the user can do next.</p>
    </div>
  </div>
</div>

## Accessibility

- Provide an accessible name with `<caption>` or `aria-label`.
- Keep sortable headers keyboard reachable; `Enter` and `Space` cycle sort state.
- Selection uses `aria-selected="true"` on rows.
- Do not rely on color alone: sort indicators also use directional glyphs.

## Tokens

Table styling is driven by 13 component tokens in the `--uif-table-*` namespace, covering header colors, row colors, density spacing, font primitives, and border radius.

<script type="module" src="/vendor/ui-foundations/components/table.js"></script>
