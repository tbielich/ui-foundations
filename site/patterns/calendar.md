---
layout: layouts/docs.njk
title: Calendar
description: A date selection component supporting single dates and date ranges. Includes keyboard navigation, screen reader support, and multi-brand theming.
navTitle: Calendar
order: 80
permalink: /patterns/calendar/
playgroundUrl: /patterns/calendar-playground/
playgroundLabel: Open Calendar Playground
---

{% import "macros/ui.njk" as uif %}
{% import "macros/calendar.njk" as cal %}

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
      {{ cal.calendar("July 2026", selectedDate="15", todayDate="1") }}
    </div>
  </div>
  <div class="docs-hero-meta">
    <span class="docs-status" data-status="stable">Stable</span>
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
  </div>
</div>

### v1 naming migration

Use `.uif-calendar` and the `.uif-calendar-*` part classes with
`--uif-calendar-*` tokens in new and migrated markup. Unprefixed Calendar class
selectors remain compatible throughout v1.x, but legacy `--calendar-*` token
aliases are not provided. Consumers must migrate classes and tokens together.
Legacy selector removal remains Wave 4 work for v2.0 or later.

<h2 id="usage">Usage</h2>

The Calendar component enables date selection in forms, filters, and booking flows. It supports single date selection and date range selection.

<h2 id="states">States</h2>

<div class="docs-table-wrap">
  <table class="docs-table docs-calendar-states-table">
    <thead>
      <tr><th>Preview</th><th>State</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><div class="docs-calendar-day-preview">{{ cal.calendarDay("01") }}</div></td>
        <td>Default</td>
        <td>Neutral day cell.</td>
      </tr>
      <tr>
        <td><div class="docs-calendar-day-preview">{{ cal.calendarDay("01", hover=true) }}</div></td>
        <td>Hover</td>
        <td>Visual feedback on pointer hover.</td>
      </tr>
      <tr>
        <td><div class="docs-calendar-day-preview">{{ cal.calendarDay("01", focus=true) }}</div></td>
        <td>Focus</td>
        <td>Visible focus ring for keyboard navigation.</td>
      </tr>
      <tr>
        <td><div class="docs-calendar-day-preview">{{ cal.calendarDay("01", selected=true) }}</div></td>
        <td>Selected</td>
        <td>Active selected date.</td>
      </tr>
      <tr>
        <td><div class="docs-calendar-day-preview docs-calendar-day-preview--range">{{ cal.calendarDay("01", rangeStart=true) }}{{ cal.calendarDay("02", rangeMiddle=true) }}{{ cal.calendarDay("03", rangeEnd=true) }}</div></td>
        <td>Range</td>
        <td>Start, middle, and end cells for date range selection.</td>
      </tr>
      <tr>
        <td><div class="docs-calendar-day-preview">{{ cal.calendarDay("01", outsideMonth=true) }}</div></td>
        <td>Outside month</td>
        <td>Date from the previous or next month shown for context.</td>
      </tr>
      <tr>
        <td><div class="docs-calendar-day-preview">{{ cal.calendarDay("01", disabled=true) }}</div></td>
        <td>Disabled</td>
        <td>Date outside the selectable range.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead>
    <tr><th>Key</th><th>Interaction</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><kbd>ArrowLeft</kbd> or <kbd>ArrowRight</kbd></td>
      <td>Moves focus one day backward or forward.</td>
    </tr>
    <tr>
      <td><kbd>ArrowUp</kbd> or <kbd>ArrowDown</kbd></td>
      <td>Moves focus one week backward or forward.</td>
    </tr>
    <tr>
      <td><kbd>Home</kbd> or <kbd>End</kbd></td>
      <td>Moves focus to the first or last day in the current week.</td>
    </tr>
    <tr>
      <td><kbd>PageUp</kbd> or <kbd>PageDown</kbd></td>
      <td>Moves focus to the previous or next month.</td>
    </tr>
    <tr>
      <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
      <td>Selects the focused date.</td>
    </tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Uses `role="grid"` for the day grid
- Each cell has an `aria-label` with the full date (e.g. "15 July 2026")
- Focus management follows roving tabindex pattern
- Minimum 44×44px touch target per cell
- Contrast validated for all states and modes

<h2 id="anatomy">Anatomy</h2>

<div class="docs-anatomy">
  <div class="docs-anatomy-preview">
    <div class="docs-anatomy-subject docs-calendar-anatomy-subject">
      <span class="docs-calendar-anatomy-target docs-calendar-anatomy-target--container"></span>
      <span class="docs-calendar-anatomy-target docs-calendar-anatomy-target--header"></span>
      <span class="docs-calendar-anatomy-target docs-calendar-anatomy-target--weekdays"></span>
      <span class="docs-calendar-anatomy-target docs-calendar-anatomy-target--day"></span>
      <span class="docs-anatomy-callout docs-calendar-anatomy-callout docs-calendar-anatomy-callout--container" data-dir="top">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout docs-calendar-anatomy-callout docs-calendar-anatomy-callout--header" data-dir="left">
        <span class="docs-anatomy-badge">2</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout docs-calendar-anatomy-callout docs-calendar-anatomy-callout--weekdays" data-dir="right">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">3</span>
      </span>
      <span class="docs-anatomy-callout docs-calendar-anatomy-callout docs-calendar-anatomy-callout--day" data-dir="bottom">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">4</span>
      </span>
      {{ cal.calendar("July 2026", rangeStart="12", rangeEnd="18", todayDate="1") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Calendar container — optional bordered surface added with <code>.has-container</code></li>
    <li><span class="docs-anatomy-badge-inline">2</span> Header — previous/next actions and month/year selects</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Weekday row — column labels for the grid</li>
    <li><span class="docs-anatomy-badge-inline">4</span> Day cell — selectable date button with selected, today, disabled, and range states</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Table of options

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td>container</td><td><code>true</code> / <code>false</code></td><td><code>true</code></td></tr>
    <tr><td>selectedDate</td><td>day number / none</td><td>—</td></tr>
    <tr><td>rangeStart</td><td>day number / none</td><td>—</td></tr>
    <tr><td>rangeEnd</td><td>day number / none</td><td>—</td></tr>
    <tr><td>todayDate</td><td>day number / none</td><td><code>1</code></td></tr>
    <tr><td>state</td><td><code>default</code> / <code>hover</code> / <code>focus</code></td><td><code>default</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
  </tbody>
</table>

<h2 id="variants">Variants</h2>

<div class="docs-states-grid" style="--docs-states-cols: 2">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ cal.calendar("July 2026", selectedDate="15", todayDate="1") }}</div>
    <span class="docs-states-grid-item-label">Container</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ cal.calendar("July 2026", selectedDate="15", todayDate="1", container=false) }}</div>
    <span class="docs-states-grid-item-label">No container</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ cal.calendar("July 2026", rangeStart="12", rangeEnd="18", todayDate="1") }}</div>
    <span class="docs-states-grid-item-label">Range</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ cal.calendar("July 2026", selectedDate="15", todayDate="1", disabled=true) }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

<h2 id="tokens">Tokens</h2>

<div class="docs-table-wrap">
  <table class="docs-table">
    <thead>
      <tr><th>Token</th><th>Purpose</th></tr>
    </thead>
    <tbody>
      <tr><td><code>--uif-calendar-container-padding</code></td><td>Container padding</td></tr>
      <tr><td><code>--uif-calendar-container-border-radius</code></td><td>Container border radius</td></tr>
      <tr><td><code>--uif-calendar-container-border-color</code></td><td>Container border color</td></tr>
      <tr><td><code>--uif-calendar-container-border-size</code></td><td>Container border width</td></tr>
      <tr><td><code>--uif-calendar-container-background</code></td><td>Container background</td></tr>
      <tr><td><code>--uif-calendar-container-gap</code></td><td>Vertical gap between calendar sections</td></tr>
      <tr><td><code>--uif-calendar-header-gap</code></td><td>Gap between header controls</td></tr>
      <tr><td><code>--uif-calendar-weekday-text-color</code></td><td>Weekday label color</td></tr>
      <tr><td><code>--uif-calendar-weekday-font-size</code></td><td>Weekday label font size</td></tr>
      <tr><td><code>--uif-calendar-weekday-height</code></td><td>Weekday label row height</td></tr>
      <tr><td><code>--uif-calendar-cell-gap</code></td><td>Spacing around day cells</td></tr>
      <tr><td><code>--uif-calendar-cell-min-size</code></td><td>Minimum day cell touch target</td></tr>
      <tr><td><code>--uif-calendar-cell-border-radius</code></td><td>Day cell radius</td></tr>
      <tr><td><code>--uif-calendar-cell-text-color-default</code></td><td>Default day cell text</td></tr>
      <tr><td><code>--uif-calendar-cell-text-color-active</code></td><td>Selected day cell text</td></tr>
      <tr><td><code>--uif-calendar-cell-text-color-disabled</code></td><td>Disabled and outside-month text</td></tr>
      <tr><td><code>--uif-calendar-cell-background-active</code></td><td>Selected day cell background</td></tr>
      <tr><td><code>--uif-calendar-cell-background-hover</code></td><td>Hover state</td></tr>
      <tr><td><code>--uif-calendar-cell-range-border-color</code></td><td>Range and today indicator border color</td></tr>
      <tr><td><code>--uif-calendar-cell-range-border-size</code></td><td>Range and today indicator border width</td></tr>
      <tr><td><code>--uif-calendar-cell-range-border-radius</code></td><td>Range start/end radius</td></tr>
    </tbody>
  </table>
</div>
