import React from "react";

/**
 * Calendar — A date selection component using a semantic <table>.
 *
 * Uses <table> with <thead>/<tbody> because a calendar IS tabular data:
 * days organized into weeks (rows) by weekdays (columns).
 */
export function Calendar({
  className = "",
  value,
  rangeStart,
  rangeEnd,
  min,
  max,
  month: controlledMonth,
  locale = "en-GB",
  disabled = false,
  onSelect,
  onMonthChange,
  ...props
}) {
  const today = new Date();
  const [displayMonth, setDisplayMonth] = React.useState(
    controlledMonth || value || today,
  );

  const currentMonth = controlledMonth || displayMonth;
  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth();

  // Generate calendar days
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = lastDay.getDate();

  const cells = [];

  // Previous month fill
  const prevMonthLast = new Date(year, monthIndex, 0).getDate();
  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLast - i, outside: true, date: new Date(year, monthIndex - 1, prevMonthLast - i) });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, outside: false, date: new Date(year, monthIndex, d) });
  }

  // Next month fill to complete last row
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, outside: true, date: new Date(year, monthIndex + 1, d) });
    }
  }

  // Split into weeks (rows of 7)
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  // Navigation
  function prevMonth() {
    const m = new Date(year, monthIndex - 1, 1);
    setDisplayMonth(m);
    onMonthChange?.(m);
  }

  function nextMonth() {
    const m = new Date(year, monthIndex + 1, 1);
    setDisplayMonth(m);
    onMonthChange?.(m);
  }

  // Date helpers
  function isSameDay(a, b) {
    return a && b && a.toDateString() === b.toDateString();
  }

  function isDisabled(date) {
    if (disabled) return true;
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  }

  function getCellClasses(cell) {
    const classes = ["calendar-cell"];
    if (cell.outside) classes.push("is-outside-month");
    if (isSameDay(cell.date, today)) classes.push("is-today");
    if (isSameDay(cell.date, value)) classes.push("is-selected");
    if (isDisabled(cell.date)) classes.push("is-disabled");

    if (rangeStart && rangeEnd) {
      if (isSameDay(cell.date, rangeStart)) classes.push("is-range-start");
      else if (isSameDay(cell.date, rangeEnd)) classes.push("is-range-end");
      else if (cell.date > rangeStart && cell.date < rangeEnd) classes.push("is-range-middle");
    }

    return classes.join(" ");
  }

  // Keyboard navigation within the grid
  function handleKeyDown(e, weekIdx, dayIdx) {
    const flatIdx = weekIdx * 7 + dayIdx;
    let target = null;

    switch (e.key) {
      case "ArrowLeft": target = flatIdx - 1; break;
      case "ArrowRight": target = flatIdx + 1; break;
      case "ArrowUp": target = flatIdx - 7; break;
      case "ArrowDown": target = flatIdx + 7; break;
      case "Home": target = weekIdx * 7; break;
      case "End": target = weekIdx * 7 + 6; break;
      case "PageUp": prevMonth(); return;
      case "PageDown": nextMonth(); return;
      default: return;
    }

    e.preventDefault();
    const table = e.currentTarget.closest(".calendar-table");
    const buttons = table?.querySelectorAll("button.calendar-cell");
    if (buttons?.[target]) buttons[target].focus();
  }

  // Weekday labels (Monday-based)
  const weekdays = [];
  const shortFormatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const narrowFormatter = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  for (let i = 0; i < 7; i++) {
    const d = new Date(2026, 0, 5 + i); // Jan 5 2026 = Monday
    weekdays.push({ short: shortFormatter.format(d), narrow: narrowFormatter.format(d) });
  }

  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(currentMonth);
  const dateFormatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" });
  const rootClasses = ["calendar", className].filter(Boolean).join(" ");

  return React.createElement("div", { className: rootClasses, ...props },
    // Header with icon-only ghost buttons (reusing Button + Icon patterns)
    React.createElement("div", { className: "calendar-header" },
      React.createElement("button", {
        type: "button",
        className: "button button--ghost",
        "aria-label": "Previous month",
        onClick: prevMonth,
        disabled,
      },
        React.createElement("span", {
          className: "icon",
          style: { "--icon-src": "url('/assets/icons/chevron--left.svg')" },
          "aria-hidden": "true",
        }),
      ),
      React.createElement("span", { className: "calendar-title", "aria-live": "polite" }, monthLabel),
      React.createElement("button", {
        type: "button",
        className: "button button--ghost",
        "aria-label": "Next month",
        onClick: nextMonth,
        disabled,
      },
        React.createElement("span", {
          className: "icon",
          style: { "--icon-src": "url('/assets/icons/chevron.svg')" },
          "aria-hidden": "true",
        }),
      ),
    ),
    // Semantic table
    React.createElement("table", { className: "calendar-table", role: "grid", "aria-label": monthLabel },
      React.createElement("thead", null,
        React.createElement("tr", null,
          ...weekdays.map((wd) =>
            React.createElement("th", { key: wd.short, scope: "col", abbr: wd.short }, wd.short),
          ),
        ),
      ),
      React.createElement("tbody", null,
        ...weeks.map((week, weekIdx) =>
          React.createElement("tr", { key: weekIdx },
            ...week.map((cell, dayIdx) =>
              React.createElement("td", { key: dayIdx },
                React.createElement("button", {
                  type: "button",
                  className: getCellClasses(cell),
                  "aria-selected": isSameDay(cell.date, value) ? "true" : "false",
                  "aria-label": dateFormatter.format(cell.date),
                  "aria-disabled": isDisabled(cell.date) ? "true" : undefined,
                  disabled: isDisabled(cell.date),
                  tabIndex: isSameDay(cell.date, value || today) ? 0 : -1,
                  onClick: () => !isDisabled(cell.date) && onSelect?.(cell.date),
                  onKeyDown: (e) => handleKeyDown(e, weekIdx, dayIdx),
                }, cell.day),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
