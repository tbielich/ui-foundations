import React from "react";
import { hasTextContent } from "./label.js";
import { warnDev } from "./warn-dev.js";

export function Radio({
  className = "",
  wrapperClassName = "",
  label,
  children,
  ...props
}) {
  const classes = ["radio"];
  if (className) classes.push(className);

  const content = children ?? label;
  const hasLabel = hasTextContent(content);
  const disabled = Boolean(props.disabled);

  const input = React.createElement("input", {
    type: "radio",
    className: classes.join(" "),
    ...props,
  });

  if (!hasLabel && !props["aria-label"] && !props["aria-labelledby"]) {
    warnDev(
      "[ui-foundations] Radio should include visible label content or `aria-label`/`aria-labelledby`.",
    );
  }

  if (!hasLabel) return input;

  const wrapperClasses = ["radio-field"];
  if (disabled) wrapperClasses.push("is-disabled");
  if (wrapperClassName) wrapperClasses.push(wrapperClassName);

  return React.createElement(
    "label",
    {
      className: wrapperClasses.join(" "),
    },
    input,
    React.createElement("span", { className: "radio-field-text" }, content),
  );
}
