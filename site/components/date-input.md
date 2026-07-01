---
layout: layouts/docs.njk
title: Date Input
description: A date selection component combining an input field with a calendar dropdown. Supports keyboard navigation, single date and range selection, min/max constraints, and full accessibility.
navTitle: Date Input
order: 10
permalink: /components/date-input/
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
      <div class="date-input">
        <div class="input-field">
          <input class="input" type="text" placeholder="dd/mm/yyyy" aria-label="Select date" readonly>
          <span class="input-field-control">
            <button type="button" class="button ghost" aria-label="Open calendar">
              <span class="icon" style="--icon-src: url('/assets/icons/calendar.svg');" aria-hidden="true"></span>
            </button>
          </span>
        </div>
        {{ ui.calendar("July 2026", selectedDate="15", todayDate="1") }}
      </div>
    </div>
  </div>
</div>

## Overview

The Date Input component combines two patterns into an interactive widget:
- **Input** — displays the selected date and accepts typed input
- **Calendar** — a dropdown grid for visual date selection

Together they form a component that can be opened, navigated, and dismissed — with full keyboard and screen reader support.

## Composition

```
.date-input
├── .input-field
│   ├── input.input [readonly, aria-label, placeholder]
│   └── .input-field-control
│       └── button.button.ghost [aria-label="Open calendar"]
│           └── span.icon (calendar icon)
└── .calendar [role="group", hidden until opened]
    ├── .calendar-header
    │   ├── button.button.ghost (prev month)
    │   ├── span.calendar-title
    │   └── button.button.ghost (next month)
    └── table.calendar-table [role="grid"]
```

## Patterns Used

| Pattern | Role |
|---------|------|
| [Input](/patterns/input/) | Text field showing the formatted date |
| [Button ghost](/patterns/button/) | Calendar toggle trigger + month navigation |
| [Icon](/patterns/icon/) | Calendar and chevron icons |
| [Calendar](/patterns/calendar/) | Date grid with selection and keyboard nav |

## Interaction

| Action | Result |
|--------|--------|
| Click calendar icon | Open/close the calendar dropdown |
| Type in input | Parse and select the typed date |
| Click a day cell | Select date, close calendar, update input |
| Arrow keys (in calendar) | Navigate between days |
| PageUp / PageDown | Switch months |
| Enter / Space (on day) | Select the focused day |
| Escape | Close calendar without selecting |
| Tab away | Close calendar |

## States

| State | Description |
|-------|-------------|
| Closed | Only the input field is visible |
| Open | Calendar is visible below the input |
| Date selected | Input shows formatted date, calendar highlights the day |
| Invalid | Input shows error state (out of range, invalid format) |
| Disabled | Both input and calendar trigger are disabled |

## Accessibility

- Calendar trigger button has `aria-label="Open calendar"`
- Calendar has `aria-expanded` on the trigger
- Focus moves into the calendar on open, returns to trigger on close
- All day cells have `aria-label` with full date
- Escape closes without selecting
- Works entirely via keyboard (no mouse required)

## Tokens

Reuses tokens from the composed patterns:
- Input tokens (`--input-*`)
- Button ghost tokens (`--button-ghost-*`)
- Calendar tokens (`--calendar-cell-*`)

No additional component-specific tokens needed — the composition inherits from its parts.

## JavaScript

The Date Input requires `src/ui/components/date-input.js` for:
- Opening/closing the calendar popover
- Synchronizing input value ↔ calendar selection
- Keyboard event handling (Escape to close, Enter to select)
- Date parsing and formatting

```html
<script type="module">
  import { DateInput } from './components/date-input.js';
  document.querySelectorAll('.date-input').forEach(el => new DateInput(el));
</script>
```
