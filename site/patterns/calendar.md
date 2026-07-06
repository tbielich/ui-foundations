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

{% import "macros/ui.njk" as ui %}
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

## Usage

The Calendar component enables date selection in forms, filters, and booking flows. It supports single date selection and date range selection.

## States

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
        <td><div class="docs-calendar-day-preview">{{ cal.calendarDay("01", today=true) }}</div></td>
        <td>Today</td>
        <td>Highlighted current date.</td>
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

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Arrow Left/Right | Move one day |
| Arrow Up/Down | Move one week |
| Home/End | Move to start/end of week |
| Page Up/Down | Move to previous/next month |
| Enter/Space | Select the focused date |

## Accessibility

- Uses `role="grid"` for the day grid
- Each cell has an `aria-label` with the full date (e.g. "15 July 2026")
- Focus management follows roving tabindex pattern
- Minimum 44×44px touch target per cell
- Contrast validated for all states and modes

<h2 id="anatomy">Anatomy</h2>

<div class="docs-anatomy">
  <div class="docs-anatomy-preview">
    <div class="docs-anatomy-subject" style="inline-size: fit-content;">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="left" style="top: 13%; transform: translateY(-50%);">
        <span class="docs-anatomy-badge">2</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 32%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">3</span>
      </span>
      <span class="docs-anatomy-callout" data-dir="bottom" style="left: 50%; transform: translateX(-50%);">
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

## Options

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

## Variants

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

## Tokens

<div class="docs-table-wrap">
  <table class="docs-table">
    <thead>
      <tr><th>Token</th><th>Purpose</th></tr>
    </thead>
    <tbody>
      <tr><td><code>--calendar-container-padding</code></td><td>Container padding</td></tr>
      <tr><td><code>--calendar-container-border-radius</code></td><td>Container border radius</td></tr>
      <tr><td><code>--calendar-container-border-color</code></td><td>Container border color</td></tr>
      <tr><td><code>--calendar-container-border-size</code></td><td>Container border width</td></tr>
      <tr><td><code>--calendar-container-background</code></td><td>Container background</td></tr>
      <tr><td><code>--calendar-container-gap</code></td><td>Vertical gap between calendar sections</td></tr>
      <tr><td><code>--calendar-header-gap</code></td><td>Gap between header controls</td></tr>
      <tr><td><code>--calendar-weekday-text-color</code></td><td>Weekday label color</td></tr>
      <tr><td><code>--calendar-weekday-font-size</code></td><td>Weekday label font size</td></tr>
      <tr><td><code>--calendar-weekday-height</code></td><td>Weekday label row height</td></tr>
      <tr><td><code>--calendar-cell-gap</code></td><td>Spacing around day cells</td></tr>
      <tr><td><code>--calendar-cell-min-size</code></td><td>Minimum day cell touch target</td></tr>
      <tr><td><code>--calendar-cell-border-radius</code></td><td>Day cell radius</td></tr>
      <tr><td><code>--calendar-cell-text-color-default</code></td><td>Default day cell text</td></tr>
      <tr><td><code>--calendar-cell-text-color-active</code></td><td>Selected day cell text</td></tr>
      <tr><td><code>--calendar-cell-text-color-disabled</code></td><td>Disabled and outside-month text</td></tr>
      <tr><td><code>--calendar-cell-background-active</code></td><td>Selected day cell background</td></tr>
      <tr><td><code>--calendar-cell-background-hover</code></td><td>Hover state</td></tr>
      <tr><td><code>--calendar-cell-range-border-color</code></td><td>Range and today indicator border color</td></tr>
      <tr><td><code>--calendar-cell-range-border-size</code></td><td>Range and today indicator border width</td></tr>
      <tr><td><code>--calendar-cell-range-border-radius</code></td><td>Range start/end radius</td></tr>
    </tbody>
  </table>
</div>
