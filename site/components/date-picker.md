---
layout: layouts/docs.njk
title: Date Picker
description: A date picker component combining segmented input field with a calendar dropdown. Supports keyboard navigation, single date and range selection, min/max constraints, and full accessibility.
navTitle: Date Picker
order: 10
permalink: /components/date-picker/
playgroundUrl: /components/date-picker-playground/
playgroundLabel: Open Date Picker Playground
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

The Date Picker component combines two patterns into an interactive widget:
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

## Why Custom?

The native `<input type="date">` has real accessibility and UX limitations:

| Issue | Native | This Component |
|-------|--------|----------------|
| Touch targets | Under 44px (browser controls) | 44×44px minimum per cell |
| Keyboard navigation | Inconsistent across browsers | Full arrow/Home/End/PageUp/PageDown |
| Styling | Shadow DOM, not themeable | Token-based, Brand/Mode aware |
| Range selection | Not supported | Prepared (`.is-range-start`, `.is-range-middle`, `.is-range-end`) |
| Cross-browser consistency | Safari ≠ Chrome ≠ Firefox | Identical behavior everywhere |
| Screen reader experience | Varies, often poor | Explicit aria-label per cell, aria-live for month changes |
| Segment navigation | Browser-dependent | Tab between DD/MM/YYYY, ArrowUp/Down to increment |

This component is a progressive enhancement: it provides a superior experience while maintaining the same semantics and data format as the native date input.

## JavaScript

The Date Picker requires `src/ui/components/date-input.js` for:
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
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          var delta = e.key === 'ArrowUp' ? 1 : -1;
          var current = parseInt(seg.value, 10) || 0;
          var next = current + delta;
          var min = 1, max = seg.maxLength === 4 ? 2100 : (i === 1 ? 12 : 31);
          var minVal = seg.maxLength === 4 ? 1900 : 1;
          if (next >= minVal && next <= max) {
            seg.value = String(next).padStart(seg.maxLength, '0');
          }
        }
      });
      seg.addEventListener('focus', function() { seg.select(); });
      seg.addEventListener('blur', function() {
        if (seg.value) seg.value = seg.value.padStart(seg.maxLength, '0');
      });
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
      // Month navigation
      var currentYear = 2026, currentMonth = 6;
      var prevBtn = calendar.querySelector("[aria-label='Previous month']");
      var nextBtn = calendar.querySelector("[aria-label='Next month']");
      var monthSelect = calendar.querySelector('.calendar-month-select');
      var yearSelect = calendar.querySelector('.calendar-year-select');

      function rebuildGrid() {
        var tbody = calendar.querySelector('tbody');
        if (!tbody) return;
        var firstDay = new Date(currentYear, currentMonth, 1);
        var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        var startDow = (firstDay.getDay() + 6) % 7;
        var today = new Date(); today.setHours(0,0,0,0);

        if (monthSelect) monthSelect.value = currentMonth;
        if (yearSelect) yearSelect.value = currentYear;
        var table = calendar.querySelector('.calendar-table');
        if (table) {
          var label = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(firstDay);
          table.setAttribute('aria-label', label);
        }

        var html = '', day = 1, started = false;
        for (var week = 0; week < 6; week++) {
          if (day > daysInMonth) break;
          html += '<tr>';
          for (var dow = 0; dow < 7; dow++) {
            if (!started && dow < startDow) {
              html += '<td></td>';
            } else if (day <= daysInMonth) {
              started = true;
              var classes = ['button', 'ghost', 'calendar-cell'];
              var d = new Date(currentYear, currentMonth, day);
              if (d.toDateString() === today.toDateString()) classes.push('is-today');
              var tabindex = (day === 1) ? '0' : '-1';
              html += '<td><button type="button" class="' + classes.join(' ') + '" aria-selected="false" tabindex="' + tabindex + '">' + day + '</button></td>';
              day++;
            } else {
              html += '<td></td>';
            }
          }
          html += '</tr>';
        }
        tbody.innerHTML = html;
      }

      if (prevBtn) prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        rebuildGrid();
      });
      if (nextBtn) nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        rebuildGrid();
      });
      if (monthSelect) monthSelect.addEventListener('change', function() {
        currentMonth = parseInt(monthSelect.value, 10);
        rebuildGrid();
      });
      if (yearSelect) yearSelect.addEventListener('change', function() {
        currentYear = parseInt(yearSelect.value, 10);
        rebuildGrid();
      });

      // Keyboard navigation in the grid (roving tabindex)
      calendar.addEventListener('keydown', function(e) {
        var btn = e.target.closest('button.calendar-cell');
        if (!btn) return;
        var cells = Array.from(calendar.querySelectorAll('button.calendar-cell'));
        var idx = cells.indexOf(btn);
        if (idx === -1) return;

        var target = null;
        switch (e.key) {
          case 'ArrowLeft': target = idx - 1; break;
          case 'ArrowRight': target = idx + 1; break;
          case 'ArrowUp': target = idx - 7; break;
          case 'ArrowDown': target = idx + 7; break;
          case 'Home': target = idx - (idx % 7); break;
          case 'End': target = idx - (idx % 7) + 6; break;
          case 'PageUp':
            e.preventDefault();
            if (e.shiftKey) { currentYear--; } else { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } }
            rebuildGrid();
            return;
          case 'PageDown':
            e.preventDefault();
            if (e.shiftKey) { currentYear++; } else { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } }
            rebuildGrid();
            return;
          case 'Enter': case ' ':
            e.preventDefault();
            btn.click();
            return;
          default: return;
        }
        e.preventDefault();
        if (target >= 0 && target < cells.length && !cells[target].disabled) {
          // Roving tabindex
          btn.setAttribute('tabindex', '-1');
          cells[target].setAttribute('tabindex', '0');
          cells[target].focus();
        }
      });

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
