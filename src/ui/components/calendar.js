/**
 * Calendar — Progressive Enhancement
 *
 * Enhances a static `.calendar` element with:
 * - Month navigation (prev/next buttons rebuild the grid)
 * - Keyboard navigation (arrow keys, Home/End, PageUp/PageDown)
 * - Date selection (click/Enter updates aria-selected)
 * - Today highlighting
 *
 * Usage:
 *   import { Calendar } from './components/calendar.js';
 *   document.querySelectorAll('.calendar').forEach(el => new Calendar(el));
 */

export class Calendar {
  /**
   * @param {HTMLElement} root - The .calendar element to enhance
   * @param {object} [options]
   * @param {string} [options.locale] - Intl locale (default: "en-GB")
   * @param {Date} [options.min] - Earliest selectable date
   * @param {Date} [options.max] - Latest selectable date
   * @param {function} [options.onSelect] - Callback when date is selected
   */
  constructor(root, options = {}) {
    this.root = root;
    this.locale = options.locale || "en-GB";
    this.min = options.min || null;
    this.max = options.max || null;
    this.onSelect = options.onSelect || null;

    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    // Parse initial month from the title element
    this.currentMonth = this._parseInitialMonth();
    this.selectedDate = null;

    // Cache DOM references
    this.titleEl = root.querySelector(".calendar-title");
    this.tableBody = root.querySelector(".calendar-table tbody");
    this.prevBtn = root.querySelector("[aria-label='Previous month']");
    this.nextBtn = root.querySelector("[aria-label='Next month']");

    this._bindEvents();
    this._render();
  }

  // ─── Event Binding ──────────────────────────────────────────────

  _bindEvents() {
    this.prevBtn?.addEventListener("click", () => this._navigate(-1));
    this.nextBtn?.addEventListener("click", () => this._navigate(1));
    this.root.addEventListener("click", (e) => this._handleCellClick(e));
    this.root.addEventListener("keydown", (e) => this._handleKeyDown(e));
  }

  // ─── Navigation ─────────────────────────────────────────────────

  _navigate(delta) {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth() + delta;
    this.currentMonth = new Date(year, month, 1);
    this._render();
  }

  // ─── Selection ──────────────────────────────────────────────────

  _handleCellClick(e) {
    const btn = e.target.closest("button.calendar-cell");
    if (!btn || btn.disabled) return;

    const date = this._dateFromCell(btn);
    if (date) this._selectDate(date);
  }

  _selectDate(date) {
    this.selectedDate = date;
    this._render();

    if (this.onSelect) {
      this.onSelect(date);
    }

    // Dispatch custom event
    this.root.dispatchEvent(
      new CustomEvent("calendar:select", { detail: { date }, bubbles: true }),
    );
  }

  // ─── Keyboard ───────────────────────────────────────────────────

  _handleKeyDown(e) {
    const btn = e.target.closest("button.calendar-cell");
    if (!btn) return;

    const cells = [...this.tableBody.querySelectorAll("button.calendar-cell")];
    const index = cells.indexOf(btn);
    if (index === -1) return;

    let target = null;

    switch (e.key) {
      case "ArrowLeft":
        target = index - 1;
        break;
      case "ArrowRight":
        target = index + 1;
        break;
      case "ArrowUp":
        target = index - 7;
        break;
      case "ArrowDown":
        target = index + 7;
        break;
      case "Home":
        target = index - (index % 7);
        break;
      case "End":
        target = index - (index % 7) + 6;
        break;
      case "PageUp":
        e.preventDefault();
        this._navigate(-1);
        return;
      case "PageDown":
        e.preventDefault();
        this._navigate(1);
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        this._handleCellClick(e);
        return;
      default:
        return;
    }

    e.preventDefault();

    if (target >= 0 && target < cells.length && !cells[target].disabled) {
      cells[target].focus();
    }
  }

  // ─── Rendering ──────────────────────────────────────────────────

  _render() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    // Update title
    const formatter = new Intl.DateTimeFormat(this.locale, {
      month: "long",
      year: "numeric",
    });
    this.titleEl.textContent = formatter.format(this.currentMonth);

    // Calculate grid
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = lastDay.getDate();

    // Previous month fill
    const prevMonthLast = new Date(year, month, 0).getDate();
    const cells = [];

    for (let i = startDow - 1; i >= 0; i--) {
      cells.push({
        day: prevMonthLast - i,
        date: new Date(year, month - 1, prevMonthLast - i),
        outside: true,
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, date: new Date(year, month, d), outside: false });
    }

    // Next month fill
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        cells.push({
          day: d,
          date: new Date(year, month + 1, d),
          outside: true,
        });
      }
    }

    // Build rows
    const dateFormatter = new Intl.DateTimeFormat(this.locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    let html = "";
    for (let i = 0; i < cells.length; i += 7) {
      html += "<tr>";
      for (let j = i; j < i + 7 && j < cells.length; j++) {
        const cell = cells[j];
        const classes = ["calendar-cell"];
        const isSelected = this._isSameDay(cell.date, this.selectedDate);
        const isToday = this._isSameDay(cell.date, this.today);
        const isDisabled = this._isDisabled(cell.date);

        if (cell.outside) classes.push("is-outside-month");
        if (isSelected) classes.push("is-selected");
        if (isToday) classes.push("is-today");
        if (isDisabled) classes.push("is-disabled");

        const tabindex =
          isSelected || (!this.selectedDate && isToday) ? "0" : "-1";

        html += `<td><button type="button"
          class="${classes.join(" ")}"
          aria-selected="${isSelected}"
          aria-label="${dateFormatter.format(cell.date)}"
          tabindex="${tabindex}"
          ${isDisabled ? "disabled" : ""}
          data-date="${cell.date.toISOString().slice(0, 10)}"
        >${cell.day}</button></td>`;
      }
      html += "</tr>";
    }

    this.tableBody.innerHTML = html;
  }

  // ─── Helpers ────────────────────────────────────────────────────

  _parseInitialMonth() {
    const titleEl = this.root.querySelector(".calendar-title");
    if (titleEl) {
      const parsed = new Date(titleEl.textContent);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  }

  _dateFromCell(btn) {
    const iso = btn.dataset.date;
    if (iso) return new Date(iso);
    return null;
  }

  _isSameDay(a, b) {
    if (!a || !b) return false;
    return a.toDateString() === b.toDateString();
  }

  _isDisabled(date) {
    if (this.min && date < this.min) return true;
    if (this.max && date > this.max) return true;
    return false;
  }
}

// Auto-init: enhance all .calendar elements on DOMContentLoaded
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelectorAll(".calendar:not([data-enhanced])")
      .forEach((el) => {
        el.setAttribute("data-enhanced", "");
        new Calendar(el);
      });
  });
}
