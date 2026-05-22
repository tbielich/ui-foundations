import React from "react";

/**
 * Tooltip — contextual help text on hover/focus.
 *
 * @param {object} props
 * @param {string} props.text - Tooltip content
 * @param {"top"|"bottom"|"left"|"right"} [props.placement="top"] - Position
 * @param {string} [props.className=""] - Additional CSS classes
 */
export function Tooltip({ text, placement = "top", className = "", children, ...props }) {
  const triggerClasses = ["tooltip-trigger"];
  if (className) triggerClasses.push(className);

  return React.createElement(
    "span",
    { className: triggerClasses.join(" "), ...props },
    children,
    React.createElement(
      "span",
      { className: "tooltip", role: "tooltip", "data-placement": placement },
      text
    )
  );
}
