import React from "react";
import { hasTextContent } from "./label.js";
import { warnDev } from "./warn-dev.js";

export function Switch({
  className = "",
  wrapperClassName = "",
  label,
  children,
  role = "switch",
  ...props
}) {
  const classes = ["switch"];
  if (className) classes.push(className);

  const content = children ?? label;
  const hasLabel = hasTextContent(content);
  const disabled = Boolean(props.disabled);
  const input = React.createElement("input", {
    type: "checkbox",
    role,
    className: classes.join(" "),
    ...props,
  });

  if (!hasLabel && !props["aria-label"] && !props["aria-labelledby"]) {
    warnDev(
      "[ui-foundations] Switch should include visible label content or `aria-label`/`aria-labelledby`.",
    );
  }

  if (!hasLabel) return input;

  const wrapperClasses = ["switch-field"];
  if (disabled) wrapperClasses.push("is-disabled");
  if (wrapperClassName) wrapperClasses.push(wrapperClassName);

  return React.createElement(
    "label",
    {
      className: wrapperClasses.join(" "),
    },
    input,
    React.createElement("span", { className: "switch-field__text" }, content),
  );
}
