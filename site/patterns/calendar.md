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

| State | Description |
|-------|-------------|
| Default | Neutral day cell |
| Hover | Visual feedback on pointer hover |
| Focus | Visible focus ring for keyboard navigation |
| Selected | Active selected date(s) |
| Today | Highlighted current date |
| Disabled | Dates outside the selectable range |
| Outside month | Dates from previous/next month shown for context |

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

| Option | Description |
|--------|-------------|
| `container` | Adds the bordered calendar surface with padding and background. Use `false` when another component already provides the surface. |
| `selectedDate` | Marks one day as selected. |
| `rangeStart` / `rangeEnd` | Marks a continuous range with start, middle, and end cell states. |
| `todayDate` | Marks the current day with the today indicator. |
| `state` | Preview state for documentation examples: `default`, `hover`, or `focus`. |
| `disabled` | Disables all day cells and header controls. |

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

| Token | Purpose |
|-------|---------|
| `--calendar-container-padding` | Container padding |
| `--calendar-container-border-radius` | Container border radius |
| `--calendar-container-border-color` | Container border color |
| `--calendar-container-border-size` | Container border width |
| `--calendar-container-background` | Container background |
| `--calendar-container-gap` | Vertical gap between calendar sections |
| `--calendar-header-gap` | Gap between header controls |
| `--calendar-weekday-text-color` | Weekday label color |
| `--calendar-weekday-font-size` | Weekday label font size |
| `--calendar-weekday-height` | Weekday label row height |
| `--calendar-cell-gap` | Spacing around day cells |
| `--calendar-cell-min-size` | Minimum day cell touch target |
| `--calendar-cell-border-radius` | Day cell radius |
| `--calendar-cell-text-color-default` | Default day cell text |
| `--calendar-cell-text-color-active` | Selected day cell text |
| `--calendar-cell-text-color-disabled` | Disabled and outside-month text |
| `--calendar-cell-background-active` | Selected day cell background |
| `--calendar-cell-background-hover` | Hover state |
| `--calendar-cell-range-border-color` | Range and today indicator border color |
| `--calendar-cell-range-border-size` | Range and today indicator border width |
| `--calendar-cell-range-border-radius` | Range start/end radius |
