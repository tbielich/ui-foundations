/**
 * Date Input — Progressive Enhancement
 *
 * Enhances a segmented `.uif-input-field.date` with:
 * - Auto-tab between DD/MM/YYYY segments on completion
 * - Backspace navigates to previous segment
 * - Calendar dropdown toggle via trigger button
 * - Sync between calendar selection and segment values
 * - Validation per segment (day 1-31, month 1-12, year 1900-2100)
 *
 * HTML structure:
 *   .uif-input-field.date
 *     .date-segments
 *       input.date-segment.day [maxlength=2, inputmode=numeric]
 *       span.date-separator "/"
 *       input.date-segment.month [maxlength=2, inputmode=numeric]
 *       span.date-separator "/"
 *       input.date-segment.year [maxlength=4, inputmode=numeric]
 *     .uif-input-field-control
 *       button (calendar trigger)
 *     .uif-calendar (dropdown)
 */

import { Calendar } from "./calendar.js";

export class DateInput {
  constructor(root, options = {}) {
    this.root = root;
    this.locale = options.locale || "en-GB";
    this.onSelect = options.onSelect || null;

    // Segments
    this.dayEl = root.querySelector(".date-segment.day");
    this.monthEl = root.querySelector(".date-segment.month");
    this.yearEl = root.querySelector(".date-segment.year");
    this.segments = [this.dayEl, this.monthEl, this.yearEl].filter(Boolean);

    // Calendar
    this.trigger = root.querySelector("[aria-label='Open calendar']");
    this.calendarEl = root.querySelector(":is(.uif-calendar, .calendar)");
    this.isOpen = false;

    if (this.calendarEl) {
      this.calendar = new Calendar(this.calendarEl, {
        locale: this.locale,
        onSelect: (date) => this._onCalendarSelect(date),
      });
    }

    this._bindEvents();
    this._close();
  }

  // ─── Events ─────────────────────────────────────────────────────

  _bindEvents() {
    // Auto-tab on segment completion
    this.segments.forEach((seg, i) => {
      seg.addEventListener("input", () => this._handleSegmentInput(seg, i));
      seg.addEventListener("keydown", (e) => this._handleSegmentKeydown(e, i));
      seg.addEventListener("focus", () => seg.select());
      seg.addEventListener("blur", () => this._padSegment(seg));
    });

    // Calendar toggle
    this.trigger?.addEventListener("click", (e) => {
      e.preventDefault();
      this.isOpen ? this._close() : this._open();
    });

    // Close on Escape
    this.root.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        e.preventDefault();
        this._close();
        this.trigger?.focus();
      }
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
      if (this.isOpen && !this.root.contains(e.target)) this._close();
    });
  }

  // ─── Segment Logic ──────────────────────────────────────────────

  _handleSegmentInput(seg, index) {
    // Strip non-numeric
    seg.value = seg.value.replace(/\D/g, "");

    // Auto-advance when segment is full
    const max = seg.maxLength;
    if (seg.value.length >= max && index < this.segments.length - 1) {
      this.segments[index + 1].focus();
    }

    // Validate and dispatch
    this._validate();
    this._dispatchChange();
  }

  _handleSegmentKeydown(e, index) {
    const seg = this.segments[index];

    // ArrowUp / ArrowDown → increment/decrement value by 1
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const delta = e.key === "ArrowUp" ? 1 : -1;
      const current = parseInt(seg.value, 10) || 0;
      const next = current + delta;

      // Clamp based on segment type
      let min = 1;
      let max = 31;
      if (seg === this.monthEl) { min = 1; max = 12; }
      else if (seg === this.yearEl) { min = 1900; max = 2100; }

      if (next >= min && next <= max) {
        const pad = seg === this.yearEl ? 4 : 2;
        seg.value = String(next).padStart(pad, "0");
        this._validate();
        this._dispatchChange();
      }
      return;
    }

    // Backspace on empty → go to previous segment
    if (e.key === "Backspace" && !seg.value && index > 0) {
      e.preventDefault();
      const prev = this.segments[index - 1];
      prev.focus();
      prev.value = prev.value.slice(0, -1);
    }

    // ArrowLeft at position 0 → previous segment
    if (e.key === "ArrowLeft" && seg.selectionStart === 0 && index > 0) {
      e.preventDefault();
      this.segments[index - 1].focus();
    }

    // ArrowRight at end → next segment
    if (e.key === "ArrowRight" && seg.selectionStart >= seg.value.length && index < this.segments.length - 1) {
      e.preventDefault();
      this.segments[index + 1].focus();
    }

    // Slash or dot → advance to next segment
    if ((e.key === "/" || e.key === ".") && index < this.segments.length - 1) {
      e.preventDefault();
      this.segments[index + 1].focus();
    }
  }

  _padSegment(seg) {
    if (!seg.value) return;
    const pad = seg === this.yearEl ? 4 : 2;
    seg.value = seg.value.padStart(pad, "0");
  }

  _validate() {
    const day = parseInt(this.dayEl?.value, 10);
    const month = parseInt(this.monthEl?.value, 10);
    const year = parseInt(this.yearEl?.value, 10);

    // Visual invalid state
    if (this.dayEl?.value && (day < 1 || day > 31)) {
      this.dayEl.setAttribute("aria-invalid", "true");
    } else {
      this.dayEl?.removeAttribute("aria-invalid");
    }

    if (this.monthEl?.value && (month < 1 || month > 12)) {
      this.monthEl.setAttribute("aria-invalid", "true");
    } else {
      this.monthEl?.removeAttribute("aria-invalid");
    }

    if (this.yearEl?.value && this.yearEl.value.length === 4 && (year < 1900 || year > 2100)) {
      this.yearEl.setAttribute("aria-invalid", "true");
    } else {
      this.yearEl?.removeAttribute("aria-invalid");
    }
  }

  // ─── Calendar ───────────────────────────────────────────────────

  _open() {
    this.isOpen = true;
    this.root.classList.add("is-open");
    this.trigger?.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      const cell = this.calendarEl?.querySelector("[tabindex='0']");
      cell?.focus();
    });
  }

  _close() {
    this.isOpen = false;
    this.root.classList.remove("is-open");
    this.trigger?.setAttribute("aria-expanded", "false");
  }

  _onCalendarSelect(date) {
    if (this.dayEl) this.dayEl.value = String(date.getDate()).padStart(2, "0");
    if (this.monthEl) this.monthEl.value = String(date.getMonth() + 1).padStart(2, "0");
    if (this.yearEl) this.yearEl.value = String(date.getFullYear());
    this._close();
    this.dayEl?.focus();
    this._dispatchChange();
  }

  // ─── Public ─────────────────────────────────────────────────────

  getDate() {
    const d = parseInt(this.dayEl?.value, 10);
    const m = parseInt(this.monthEl?.value, 10);
    const y = parseInt(this.yearEl?.value, 10);
    if (d && m && y) {
      const date = new Date(y, m - 1, d);
      if (!isNaN(date.getTime())) return date;
    }
    return null;
  }

  _dispatchChange() {
    const date = this.getDate();
    this.root.dispatchEvent(
      new CustomEvent("date-input:change", { detail: { date }, bubbles: true }),
    );
  }
}

// Auto-init
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelectorAll(":is(.uif-input-field, .input-field).date:not([data-enhanced])")
      .forEach((el) => {
        el.setAttribute("data-enhanced", "");
        new DateInput(el);
      });
  });
}
