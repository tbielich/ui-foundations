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
  const hasLabel = hasLabelContent(content);
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
