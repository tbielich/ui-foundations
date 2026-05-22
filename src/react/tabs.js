import React from "react";

/**
 * TabList — container for tab buttons.
 *
 * @param {object} props
 * @param {"horizontal"|"vertical"} [props.orientation="horizontal"]
 * @param {string} [props.ariaLabel=""] - Accessible label
 * @param {string} [props.className=""] - Additional CSS classes
 */
export function TabList({ orientation = "horizontal", ariaLabel = "", className = "", children, ...props }) {
  const classes = ["tab-list"];
  if (className) classes.push(className);

  const elementProps = {
    className: classes.join(" "),
    role: "tablist",
    "aria-orientation": orientation,
    ...props,
  };
  if (ariaLabel) elementProps["aria-label"] = ariaLabel;

  return React.createElement("div", elementProps, children);
}

/**
 * Tab — individual tab button.
 *
 * @param {object} props
 * @param {string} props.label - Tab label text
 * @param {boolean} [props.selected=false] - Whether active
 * @param {boolean} [props.disabled=false] - Whether disabled
 * @param {string} [props.controls=""] - ID of controlled panel
 * @param {string} [props.className=""] - Additional CSS classes
 */
export function Tab({ label, selected = false, disabled = false, controls = "", className = "", ...props }) {
  const classes = ["tab"];
  if (className) classes.push(className);

  return React.createElement("button", {
    className: classes.join(" "),
    role: "tab",
    type: "button",
    "aria-selected": String(selected),
    "aria-controls": controls || undefined,
    disabled,
    tabIndex: selected ? 0 : -1,
    ...props,
  }, label);
}

/**
 * TabPanel — content panel associated with a tab.
 *
 * @param {object} props
 * @param {string} [props.id=""] - Panel ID (referenced by tab's aria-controls)
 * @param {boolean} [props.hidden=false] - Whether hidden
 * @param {string} [props.className=""] - Additional CSS classes
 */
export function TabPanel({ id = "", hidden = false, className = "", children, ...props }) {
  const classes = ["tab-panel"];
  if (className) classes.push(className);

  return React.createElement("div", {
    className: classes.join(" "),
    role: "tabpanel",
    id: id || undefined,
    hidden,
    tabIndex: 0,
    ...props,
  }, children);
}
