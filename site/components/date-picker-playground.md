---
layout: layouts/docs.njk
title: Date Picker Playground
description: Interactive preview for the Date Picker component with segmented fields and calendar dropdown.
navTitle: Date Picker Playground
order: 11
permalink: /components/date-picker-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Date Picker
    url: /components/date-picker/
  - label: Playground
---

{% import "macros/ui.njk" as ui %}

<div class="playground-stage" style="padding: 2rem 2rem 20rem;">
  <div class="input-field date" id="playground-date-input">
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

<script>
(function() {
  var root = document.getElementById('playground-date-input');
  if (!root) return;

  var segments = root.querySelectorAll('.date-segment');
  var trigger = root.querySelector("[aria-label='Open calendar']");
  var calendar = root.querySelector('.calendar');
  var isOpen = false;

  // Segment behavior
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
        var min = seg.maxLength === 4 ? 1900 : 1;
        var max = seg.maxLength === 4 ? 2100 : (i === 1 ? 12 : 31);
        if (next >= min && next <= max) {
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
    trigger.setAttribute('aria-expanded', 'true');
    var first = calendar.querySelector('[tabindex="0"]');
    if (first) first.focus();
  }
  function close() {
    isOpen = false;
    root.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', function(e) {
    e.preventDefault();
    if (isOpen) close(); else open();
  });

  root.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) { e.preventDefault(); close(); trigger.focus(); }
  });

  document.addEventListener('click', function(e) {
    if (isOpen && !root.contains(e.target)) close();
  });

  // Calendar keyboard navigation
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

  // Calendar cell selection
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
    segments[0].focus();
  });

  close();
})();
</script>
