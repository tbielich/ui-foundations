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
- Month changes announce via `aria-live="polite"`
- Focus management follows roving tabindex pattern
- Minimum 44×44px touch target per cell
- Contrast validated for all states and modes

## Anatomy

```
.calendar
├── .calendar-header
│   ├── button.calendar-nav-prev
│   ├── span.calendar-title [aria-live="polite"]
│   └── button.calendar-nav-next
└── table.calendar-table [role="grid"]
    ├── thead
    │   └── tr
    │       └── th[scope="col"] (×7)
    └── tbody
        └── tr (×5–6 weeks)
            └── td
                └── button.calendar-cell [aria-selected, aria-label]
```

## Tokens

| Token | Purpose |
|-------|---------|
| `--calendar-cell-background-default` | Default cell background |
| `--calendar-cell-background-hover` | Hover state |
| `--calendar-cell-background-selected` | Selected date |
| `--calendar-cell-background-range` | Range middle cells |
| `--calendar-cell-text-color-default` | Default text |
| `--calendar-cell-text-color-selected` | Selected text |
| `--calendar-cell-text-color-disabled` | Disabled text |
| `--calendar-cell-text-color-outside` | Outside-month text |
| `--calendar-cell-border-color-today` | Today indicator |
