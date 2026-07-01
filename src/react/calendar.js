import React from "react";

/**
 * Calendar — A date selection component supporting single date and range selection.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional CSS classes
 * @param {Date} [props.value] - Currently selected date
 * @param {Date} [props.rangeStart] - Start of selected range
 * @param {Date} [props.rangeEnd] - End of selected range
 * @param {Date} [props.min] - Earliest selectable date
 * @param {Date} [props.max] - Latest selectable date
 * @param {Date} [props.month] - Month to display (defaults to current)
 * @param {string} [props.locale] - Locale for formatting (default: "en-GB")
 * @param {boolean} [props.disabled] - Disable all interactions
 * @param {function} [props.onSelect] - Callback when a date is selected
 * @param {function} [props.onMonthChange] - Callback when month navigation occurs
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

  // Next month fill
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, outside: true, date: new Date(year, monthIndex + 1, d) });
    }
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

    // Range
    if (rangeStart && rangeEnd) {
      if (isSameDay(cell.date, rangeStart)) classes.push("is-range-start");
      else if (isSameDay(cell.date, rangeEnd)) classes.push("is-range-end");
      else if (cell.date > rangeStart && cell.date < rangeEnd) classes.push("is-range-middle");
    }

    return classes.join(" ");
  }

  // Keyboard navigation
  function handleKeyDown(e, cellIndex) {
    let target = null;
    switch (e.key) {
      case "ArrowLeft": target = cellIndex - 1; break;
      case "ArrowRight": target = cellIndex + 1; break;
      case "ArrowUp": target = cellIndex - 7; break;
      case "ArrowDown": target = cellIndex + 7; break;
      case "Home": target = cellIndex - (cellIndex % 7); break;
      case "End": target = cellIndex - (cellIndex % 7) + 6; break;
      default: return;
    }
    e.preventDefault();
    const grid = e.currentTarget.closest(".calendar-grid");
    const buttons = grid?.querySelectorAll("button.calendar-cell");
    if (buttons?.[target]) buttons[target].focus();
  }

  // Weekday labels
  const weekdays = [];
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  for (let i = 0; i < 7; i++) {
    // Monday-based: Jan 5 2026 is a Monday
    weekdays.push(formatter.format(new Date(2026, 0, 5 + i)));
  }

  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(currentMonth);

  const rootClasses = ["calendar", className].filter(Boolean).join(" ");

  return React.createElement("div", { className: rootClasses, role: "group", "aria-label": monthLabel, ...props },
    // Header
    React.createElement("div", { className: "calendar-header" },
      React.createElement("button", {
        type: "button",
        className: "calendar-nav-prev",
        "aria-label": "Previous month",
        onClick: prevMonth,
        disabled,
      }, "‹"),
      React.createElement("span", { className: "calendar-title", "aria-live": "polite" }, monthLabel),
      React.createElement("button", {
        type: "button",
        className: "calendar-nav-next",
        "aria-label": "Next month",
        onClick: nextMonth,
        disabled,
      }, "›"),
    ),
    // Weekday labels
    React.createElement("div", { className: "calendar-weekdays", role: "row" },
      ...weekdays.map((wd) =>
        React.createElement("span", { key: wd, className: "calendar-weekday", role: "columnheader" }, wd),
      ),
    ),
    // Day grid
    React.createElement("div", { className: "calendar-grid", role: "grid" },
      ...cells.map((cell, i) =>
        React.createElement("button", {
          key: `${cell.date.toISOString()}`,
          type: "button",
          className: getCellClasses(cell),
          "aria-selected": isSameDay(cell.date, value) ? "true" : undefined,
          "aria-label": new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(cell.date),
          "aria-disabled": isDisabled(cell.date) ? "true" : undefined,
          disabled: isDisabled(cell.date),
          tabIndex: isSameDay(cell.date, value || today) ? 0 : -1,
          onClick: () => !isDisabled(cell.date) && onSelect?.(cell.date),
          onKeyDown: (e) => handleKeyDown(e, i),
        }, cell.day),
      ),
    ),
  );
}
