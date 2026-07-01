/**
 * Calendar Playground Renderer
 *
 * Append this to site/assets/playground/renderers.js or register
 * separately via the playground runtime.
 */

(function registerCalendarRenderer(global) {
  const shared = global.UIPlaygroundShared || {};
  const renderers = shared.renderers || (shared.renderers = {});

  renderers.calendar = function renderCalendar(props) {
    const {
      month = "2026-07",
      selectedDate = "",
      todayDate = "",
      state = "default",
      disabled = false,
    } = props;

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const weekdayHtml = weekdays
      .map((d) => `<span class="calendar-weekday" role="columnheader">${d}</span>`)
      .join("");

    let cellsHtml = "";
    for (let i = 1; i <= 31; i++) {
      const classes = ["calendar-cell"];
      if (state === "hover" && i === 15) classes.push("is-hover");
      if (state === "focus" && i === 15) classes.push("is-focus-visible");
      if (String(selectedDate) === String(i)) classes.push("is-selected");
      if (String(todayDate) === String(i)) classes.push("is-today");
      if (disabled) classes.push("is-disabled");

      const attrs = disabled ? " disabled" : "";
      const tabindex = i === 1 ? '0' : '-1';
      cellsHtml += `<button type="button" class="${classes.join(" ")}" tabindex="${tabindex}"${attrs}>${i}</button>`;
    }

    return `
      <div class="calendar" role="group" aria-label="Calendar">
        <div class="calendar-header">
          <button type="button" class="calendar-nav-prev" aria-label="Previous month"${disabled ? " disabled" : ""}>‹</button>
          <span class="calendar-title" aria-live="polite">${month}</span>
          <button type="button" class="calendar-nav-next" aria-label="Next month"${disabled ? " disabled" : ""}>›</button>
        </div>
        <div class="calendar-weekdays" role="row">${weekdayHtml}</div>
        <div class="calendar-grid" role="grid">${cellsHtml}</div>
      </div>
    `;
  };

  global.UIPlaygroundShared = shared;
})(typeof globalThis !== "undefined" ? globalThis : this);
