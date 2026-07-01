/**
 * Date Input — Progressive Enhancement
 *
 * Composes .input-field + .calendar into a dropdown date picker.
 * Handles: open/close, input↔calendar sync, keyboard, focus management.
 *
 * Usage:
 *   import { DateInput } from './components/date-input.js';
 *   document.querySelectorAll('.date-input').forEach(el => new DateInput(el));
 */

import { Calendar } from "./calendar.js";

export class DateInput {
  /**
   * @param {HTMLElement} root - The .date-input element to enhance
   * @param {object} [options]
   * @param {string} [options.locale] - Intl locale (default: "en-GB")
   * @param {string} [options.format] - Date format for the input (default: "dd/mm/yyyy")
   * @param {Date} [options.min] - Earliest selectable date
   * @param {Date} [options.max] - Latest selectable date
   */
  constructor(root, options = {}) {
    this.root = root;
    this.locale = options.locale || "en-GB";
    this.format = options.format || "dd/mm/yyyy";
    this.min = options.min || null;
    this.max = options.max || null;

    this.isOpen = false;
    this.selectedDate = null;

    // DOM references
    this.input = root.querySelector("input.input");
    this.trigger = root.querySelector("[aria-label='Open calendar']");
    this.calendarEl = root.querySelector(".calendar");

    // Initialize the calendar with progressive enhancement
    this.calendar = new Calendar(this.calendarEl, {
      locale: this.locale,
      min: this.min,
      max: this.max,
      onSelect: (date) => this._onDateSelect(date),
    });

    this._bindEvents();
    this._setInitialState();
  }

  // ─── Event Binding ──────────────────────────────────────────────

  _bindEvents() {
    // Toggle on trigger click
    this.trigger?.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggle();
    });

    // Open on input focus (optional: only if readonly)
    if (this.input?.readOnly) {
      this.input.addEventListener("click", () => this.open());
    }

    // Close on Escape
    this.root.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        e.preventDefault();
        this.close();
        this.trigger?.focus();
      }
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
      if (this.isOpen && !this.root.contains(e.target)) {
        this.close();
      }
    });

    // Close on tab out of calendar
    this.calendarEl?.addEventListener("focusout", (e) => {
      requestAnimationFrame(() => {
        if (this.isOpen && !this.root.contains(document.activeElement)) {
          this.close();
        }
      });
    });
  }

  // ─── Open / Close ───────────────────────────────────────────────

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.root.classList.add("is-open");
    this.trigger?.setAttribute("aria-expanded", "true");

    // Focus the selected or today cell
    requestAnimationFrame(() => {
      const focused =
        this.calendarEl.querySelector("[tabindex='0']") ||
        this.calendarEl.querySelector("button.calendar-cell");
      focused?.focus();
    });
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.root.classList.remove("is-open");
    this.trigger?.setAttribute("aria-expanded", "false");
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  // ─── Selection ──────────────────────────────────────────────────

  _onDateSelect(date) {
    this.selectedDate = date;
    this._updateInput(date);
    this.close();
    this.input?.focus();

    // Dispatch event
    this.root.dispatchEvent(
      new CustomEvent("date-input:change", { detail: { date }, bubbles: true }),
    );
  }

  _updateInput(date) {
    if (!this.input || !date) return;

    const formatter = new Intl.DateTimeFormat(this.locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    this.input.value = formatter.format(date);
  }

  // ─── Initial State ──────────────────────────────────────────────

  _setInitialState() {
    // Ensure calendar is hidden initially
    this.root.classList.remove("is-open");
    this.trigger?.setAttribute("aria-expanded", "false");

    // If input has a value, try to parse it
    if (this.input?.value) {
      const parsed = this._parseDate(this.input.value);
      if (parsed) {
        this.selectedDate = parsed;
      }
    }
  }

  _parseDate(str) {
    // Try common formats: dd/mm/yyyy, yyyy-mm-dd
    const parts = str.split(/[\/\-\.]/);
    if (parts.length === 3) {
      let d, m, y;
      if (parts[0].length === 4) {
        // yyyy-mm-dd
        [y, m, d] = parts.map(Number);
      } else {
        // dd/mm/yyyy
        [d, m, y] = parts.map(Number);
      }
      const date = new Date(y, m - 1, d);
      if (!isNaN(date.getTime())) return date;
    }
    return null;
  }
}

// Auto-init
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelectorAll(".date-input:not([data-enhanced])")
      .forEach((el) => {
        el.setAttribute("data-enhanced", "");
        new DateInput(el);
      });
  });
}
