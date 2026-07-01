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
      <div class="input-field date" id="date-input-demo">
        <div class="date-segments">
          <input class="date-segment day" type="text" inputmode="numeric" maxlength="2" placeholder="DD" aria-label="Day">
          <span class="date-separator">/</span>
          <input class="date-segment month" type="text" inputmode="numeric" maxlength="2" placeholder="MM" aria-label="Month">
          <span class="date-separator">/</span>
          <input class="date-segment year" type="text" inputmode="numeric" maxlength="4" placeholder="YYYY" aria-label="Year">
        </div>
        <span class="input-field-control">
          <button type="button" class="button ghost" aria-label="Open calendar" aria-expanded="false">
            <span class="icon" style="--icon-src: url('/assets/icons/calendar.svg');" aria-hidden="true"></span>
          </button>
        </span>
        {{ ui.calendar("July 2026", todayDate="1") }}
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
.input-field.date
├── .date-segments
│   ├── input.date-segment.day [maxlength=2, inputmode=numeric, aria-label="Day"]
│   ├── span.date-separator  "/"
│   ├── input.date-segment.month [maxlength=2, inputmode=numeric, aria-label="Month"]
│   ├── span.date-separator  "/"
│   └── input.date-segment.year [maxlength=4, inputmode=numeric, aria-label="Year"]
├── .input-field-control
│   └── button.button.ghost [aria-label="Open calendar", aria-expanded]
│       └── span.icon (calendar icon)
└── .calendar [hidden until opened]
    ├── .calendar-header
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
| Type 2 digits in Day | Auto-advances focus to Month |
| Type 2 digits in Month | Auto-advances focus to Year |
| Press `/` or `.` in any segment | Advances to next segment |
| Backspace on empty segment | Moves focus to previous segment |
| Arrow Left at start of segment | Moves to previous segment |
| Arrow Right at end of segment | Moves to next segment |
| Click calendar icon | Open/close the calendar dropdown |
| Click a day cell | Fill segments, close calendar |
| Escape (while calendar open) | Close calendar without selecting |
| Tab | Moves between segments, then to calendar trigger |

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

<script>
(function() {
  document.querySelectorAll('.input-field.date').forEach(function(root) {
    var segments = root.querySelectorAll('.date-segment');
    var trigger = root.querySelector("[aria-label='Open calendar']");
    var calendar = root.querySelector('.calendar');
    var isOpen = false;

    // Auto-tab between segments
    segments.forEach(function(seg, i) {
      seg.addEventListener('input', function() {
        seg.value = seg.value.replace(/\D/g, '');
        if (seg.value.length >= seg.maxLength && i < segments.length - 1) {
          segments[i + 1].focus();
        }
      });
      seg.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !seg.value && i > 0) {
          e.preventDefault();
          segments[i - 1].focus();
        }
        if ((e.key === '/' || e.key === '.') && i < segments.length - 1) {
          e.preventDefault();
          segments[i + 1].focus();
        }
      });
      seg.addEventListener('focus', function() { seg.select(); });
    });

    // Calendar open/close
    function open() {
      isOpen = true;
      root.classList.add('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      var first = calendar && calendar.querySelector('[tabindex="0"]');
      if (first) first.focus();
    }
    function close() {
      isOpen = false;
      root.classList.remove('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }

    if (trigger) {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        if (isOpen) close(); else open();
      });
    }

    root.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) { e.preventDefault(); close(); if (trigger) trigger.focus(); }
    });

    document.addEventListener('click', function(e) {
      if (isOpen && !root.contains(e.target)) close();
    });

    // Cell selection → fill segments
    if (calendar) {
      calendar.addEventListener('click', function(e) {
        var btn = e.target.closest('button.calendar-cell');
        if (!btn || btn.disabled) return;
        calendar.querySelectorAll('.calendar-cell').forEach(function(c) {
          c.classList.remove('is-selected');
          c.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-selected');
        btn.setAttribute('aria-selected', 'true');
        var day = btn.textContent.trim().padStart(2, '0');
        if (segments[0]) segments[0].value = day;
        if (segments[1]) segments[1].value = '07';
        if (segments[2]) segments[2].value = '2026';
        close();
        if (segments[0]) segments[0].focus();
      });
    }

    close();
  });
})();
</script>
