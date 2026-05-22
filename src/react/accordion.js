import React from "react";

/**
 * Accordion — expandable/collapsible content sections using native details/summary.
 *
 * @param {object} props
 * @param {string} [props.className=""] - Additional CSS classes
 */
export function Accordion({ className = "", children, ...props }) {
  const classes = ["accordion"];
  if (className) classes.push(className);

  return React.createElement("div", { className: classes.join(" "), ...props }, children);
}

/**
 * AccordionItem — single expandable section.
 *
 * @param {object} props
 * @param {string} props.title - Summary/trigger text
 * @param {boolean} [props.open=false] - Whether expanded
 * @param {boolean} [props.disabled=false] - Whether disabled
 * @param {string} [props.className=""] - Additional CSS classes
 */
export function AccordionItem({ title, open = false, disabled = false, className = "", children, ...props }) {
  const classes = ["accordion-item"];
  if (disabled) classes.push("is-disabled");
  if (className) classes.push(className);

  return React.createElement(
    "details",
    { className: classes.join(" "), open, ...props },
    React.createElement("summary", null, title),
    React.createElement("div", { className: "accordion-item__content" }, children)
  );
}
