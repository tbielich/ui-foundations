import React from "react";

function hasLabelContent(value) {
  if (value === null || value === undefined || value === false) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasLabelContent);
  return true;
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
