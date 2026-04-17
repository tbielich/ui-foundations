import React from "react";

function hasLabelContent(value) {
  if (value === null || value === undefined || value === false) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasLabelContent);
  return true;
}

function warnDev(message) {
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV === "production"
  ) {
    return;
  }

  console.warn(message);
}

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
  const hasLabel = hasLabelContent(content);
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
    React.createElement("span", { className: "radio-field__text" }, content),
  );
}
