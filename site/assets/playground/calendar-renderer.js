/**
 * Calendar Playground Renderer — semantic <table> version
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
    const disabledAttr = disabled ? " disabled" : "";

    const theadHtml = `<thead><tr>${weekdays.map((d) => `<th scope="col" abbr="${d}">${d}</th>`).join("")}</tr></thead>`;

    let tbodyHtml = "<tbody>";
    let day = 1;
    for (let week = 0; week < 5; week++) {
      tbodyHtml += "<tr>";
      for (let dow = 0; dow < 7; dow++) {
        if (day <= 31) {
          const classes = ["button", "ghost", "calendar-cell"];
          if (state === "hover" && day === 15) classes.push("is-hover");
          if (state === "focus" && day === 15) classes.push("is-focus-visible");
          if (String(selectedDate) === String(day)) classes.push("is-selected");
          if (String(todayDate) === String(day)) classes.push("is-today");
          if (disabled) classes.push("is-disabled");

          const selected = String(selectedDate) === String(day) ? "true" : "false";
          const tabindex = day === 1 ? "0" : "-1";
          tbodyHtml += `<td><button type="button" class="${classes.join(" ")}" aria-selected="${selected}" tabindex="${tabindex}"${disabledAttr}>${day}</button></td>`;
          day++;
        } else {
          tbodyHtml += "<td></td>";
        }
      }
      tbodyHtml += "</tr>";
    }
    tbodyHtml += "</tbody>";

    return `
      <div class="calendar">
        <div class="calendar-header">
          <button type="button" class="button ghost" aria-label="Previous month"${disabledAttr}>
            <span class="icon" style="--icon-src: url('/assets/icons/chevron--left.svg');" aria-hidden="true"></span>
          </button>
          <span class="calendar-title" aria-live="polite">${month}</span>
          <button type="button" class="button ghost" aria-label="Next month"${disabledAttr}>
            <span class="icon" style="--icon-src: url('/assets/icons/chevron.svg');" aria-hidden="true"></span>
          </button>
        </div>
        <table class="calendar-table" role="grid" aria-label="${month}">
          ${theadHtml}
          ${tbodyHtml}
        </table>
      </div>
    `;
  };

  global.UIPlaygroundShared = shared;
})(typeof globalThis !== "undefined" ? globalThis : this);
