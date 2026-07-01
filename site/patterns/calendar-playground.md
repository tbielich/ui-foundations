---
layout: layouts/docs.njk
title: Calendar Playground
description: Interactive preview for calendar states, selection, and keyboard navigation.
navTitle: Calendar Playground
order: 81
permalink: /patterns/calendar-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Calendar
    url: /patterns/calendar/
  - label: Playground
playground:
  id: calendar-playground
  queryPrefix: calendar
  runtime: vanilla
  renderer: calendar
  controls:
    - id: month
      type: text
      label: Month
      default: "2026-07"
    - id: selectedDate
      type: number
      label: Selected day
      default: ""
    - id: todayDate
      type: number
      label: Today
      default: "1"
    - id: state
      type: select
      label: State
      options:
        - default
        - hover
        - focus
      default: default
    - id: disabled
      type: checkbox
      label: Disabled
      default: false
---

{% import "macros/calendar.njk" as cal %}

<div class="playground-stage" style="padding: 2rem;">
  {{ cal.calendar("July 2026", todayDate="1") }}
</div>

<script>
(function() {
  var calendar = document.querySelector('.playground-stage .calendar');
  if (!calendar) return;

  // Keyboard navigation
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
      case 'Enter': case ' ':
        e.preventDefault();
        btn.click();
        return;
      default: return;
    }
    e.preventDefault();
    if (target >= 0 && target < cells.length && !cells[target].disabled) {
      btn.setAttribute('tabindex', '-1');
      cells[target].setAttribute('tabindex', '0');
      cells[target].focus();
    }
  });

  // Click selection
  calendar.addEventListener('click', function(e) {
    var btn = e.target.closest('button.calendar-cell');
    if (!btn || btn.disabled) return;
    calendar.querySelectorAll('.calendar-cell').forEach(function(c) {
      c.classList.remove('is-selected');
      c.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-selected');
    btn.setAttribute('aria-selected', 'true');
  });
})();
</script>
