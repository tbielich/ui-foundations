import React from "react";
import { hasTextContent } from "./label.js";
import { warnDev } from "./warn-dev.js";

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
  const hasLabel = hasTextContent(content);
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
    React.createElement("span", { className: "checkbox-field-text" }, content),
  );
}
