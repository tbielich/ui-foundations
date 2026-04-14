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

export function Checkbox({
  className = "",
  wrapperClassName = "",
  label,
  children,
  indeterminate = false,
  ...props
}) {
  const classes = ["checkbox"];
  if (indeterminate) classes.push("is-indeterminate");
  if (className) classes.push(className);

  const content = children ?? label;
  const hasLabel = hasLabelContent(content);
  const disabled = Boolean(props.disabled);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);

  const input = React.createElement("input", {
    type: "checkbox",
    className: classes.join(" "),
    "aria-checked":
      props["aria-checked"] ?? (indeterminate ? "mixed" : undefined),
    ref: inputRef,
    ...props,
  });

  if (!hasLabel && !props["aria-label"] && !props["aria-labelledby"]) {
    warnDev(
      "[ui-foundations] Checkbox should include visible label content or `aria-label`/`aria-labelledby`.",
    );
  }

  if (!hasLabel) return input;

  const wrapperClasses = ["checkbox-field"];
  if (disabled) wrapperClasses.push("is-disabled");
  if (wrapperClassName) wrapperClasses.push(wrapperClassName);

  return React.createElement(
    "label",
    {
      className: wrapperClasses.join(" "),
    },
    input,
    React.createElement("span", { className: "checkbox-field__text" }, content),
  );
}
