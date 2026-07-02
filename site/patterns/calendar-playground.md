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

<h2>Range View</h2>

<div class="playground-stage" style="padding: 2rem;">
  {{ cal.rangeCalendar("July 2026") }}
</div>

<script>
(function() {
  var calendar = document.querySelector('.playground-stage .calendar');
  if (!calendar) return;

  // Month navigation
  var currentYear = 2026, currentMonth = 6;
  var prevBtn = calendar.querySelector("[aria-label='Previous month']");
  var nextBtn = calendar.querySelector("[aria-label='Next month']");
  var titleEl = calendar.querySelector('.calendar-title');
  var monthSelect = calendar.querySelector('.calendar-month-select');
  var yearSelect = calendar.querySelector('.calendar-year-select');

  function rebuildGrid() {
    var tbody = calendar.querySelector('tbody');
    if (!tbody) return;
    var firstDay = new Date(currentYear, currentMonth, 1);
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    var startDow = (firstDay.getDay() + 6) % 7;
    var today = new Date(); today.setHours(0,0,0,0);

    // Update selects
    if (monthSelect) monthSelect.value = currentMonth;
    if (yearSelect) yearSelect.value = currentYear;
    // Update aria-label on table
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

  // ─── Range View ─────────────────────────────────────────────────
  var rangeView = document.querySelector('.calendar.range-view');
  if (rangeView) {
    var rvYear = 2026, rvMonth = 6;
    var rvPrev = rangeView.querySelector("[aria-label='Previous month']");
    var rvNext = rangeView.querySelector("[aria-label='Next month']");
    var rvMonthSelect = rangeView.querySelector('.calendar-month-select');
    var rvYearSelect = rangeView.querySelector('.calendar-year-select');
    var leftPanel = rangeView.querySelector("[data-panel='left']");
    var rightPanel = rangeView.querySelector("[data-panel='right']");
    var rangeStart = null, rangeEnd = null;

    function buildMonth(panel, year, month) {
      var firstDay = new Date(year, month, 1);
      var daysInMonth = new Date(year, month + 1, 0).getDate();
      var startDow = (firstDay.getDay() + 6) % 7;
      var label = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(firstDay);
      var labelEl = panel.querySelector('.calendar-month-label');
      var table = panel.querySelector('.calendar-table');
      var tbody = panel.querySelector('tbody');
      if (labelEl) labelEl.textContent = label;
      if (table) table.setAttribute('aria-label', label);

      var html = '', day = 1, started = false;
      for (var week = 0; week < 6; week++) {
        if (day > daysInMonth) break;
        html += '<tr>';
        for (var dow = 0; dow < 7; dow++) {
          if (!started && dow < startDow) { html += '<td></td>'; }
          else if (day <= daysInMonth) {
            started = true;
            var classes = ['button', 'ghost', 'calendar-cell'];
            var d = new Date(year, month, day);
            if (rangeStart && rangeEnd) {
              if (d.getTime() === rangeStart.getTime()) classes.push('is-range-start');
              else if (d.getTime() === rangeEnd.getTime()) classes.push('is-range-end');
              else if (d > rangeStart && d < rangeEnd) classes.push('is-range-middle');
            }
            html += '<td><button type="button" class="' + classes.join(' ') + '" data-date="' + d.toISOString().slice(0,10) + '" aria-selected="false" tabindex="-1">' + day + '</button></td>';
            day++;
          } else { html += '<td></td>'; }
        }
        html += '</tr>';
      }
      tbody.innerHTML = html;
    }

    function rebuildRange() {
      if (rvMonthSelect) rvMonthSelect.value = rvMonth;
      if (rvYearSelect) rvYearSelect.value = rvYear;
      buildMonth(leftPanel, rvYear, rvMonth);
      var rightMonth = rvMonth + 1, rightYear = rvYear;
      if (rightMonth > 11) { rightMonth = 0; rightYear++; }
      buildMonth(rightPanel, rightYear, rightMonth);
    }

    if (rvPrev) rvPrev.addEventListener('click', function(e) { e.preventDefault(); rvMonth--; if (rvMonth < 0) { rvMonth = 11; rvYear--; } rebuildRange(); });
    if (rvNext) rvNext.addEventListener('click', function(e) { e.preventDefault(); rvMonth++; if (rvMonth > 11) { rvMonth = 0; rvYear++; } rebuildRange(); });
    if (rvMonthSelect) rvMonthSelect.addEventListener('change', function() { rvMonth = parseInt(rvMonthSelect.value, 10); rebuildRange(); });
    if (rvYearSelect) rvYearSelect.addEventListener('change', function() { rvYear = parseInt(rvYearSelect.value, 10); rebuildRange(); });

    // Range selection: first click = start, second click = end
    rangeView.addEventListener('click', function(e) {
      var btn = e.target.closest('button.calendar-cell');
      if (!btn) return;
      var date = new Date(btn.dataset.date);
      if (!rangeStart || rangeEnd) {
        rangeStart = date; rangeEnd = null;
      } else {
        if (date < rangeStart) { rangeEnd = rangeStart; rangeStart = date; }
        else { rangeEnd = date; }
      }
      rebuildRange();
    });

    rebuildRange();
  }
})();
</script>
