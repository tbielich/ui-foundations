import React from "react";
import { warnDev } from "./warn-dev.js";
import { Icon } from "./icon.js";

function controlIconsForType(type) {
  switch (type) {
    case "number":
      return [
        { icon: "minus-circled", label: "Decrease value" },
        { icon: "plus-circled", label: "Increase value" },
      ];
    case "password":
      return [{ icon: "view", label: "Toggle password visibility" }];
    case "text":
    case "email":
    case "search":
    case "url":
    case "tel":
      return [{ icon: "cross-circled", label: "Clear input" }];
    default:
      return [];
  }
}

export function Input({
  className = "",
  type = "text",
  hasControl = false,
  onClear,
  onIncrement,
  onDecrement,
  onToggleVisibility,
  ...props
}) {
  if (!props["aria-label"] && !props["aria-labelledby"] && !props.id) {
    warnDev(
      "[ui-foundations] Input should be associated with a label via `id`, or include `aria-label`/`aria-labelledby`.",
    );
  }

  if (!hasControl) {
    const classes = ["input"];
    if (className) classes.push(className);
    return React.createElement("input", {
      type,
      className: classes.join(" "),
      ...props,
    });
  }

  const wrapperClasses = ["input-field"];
  if (className) wrapperClasses.push(className);
  if (props.disabled) wrapperClasses.push("is-disabled");

  const icons = controlIconsForType(type);

  const controlButtons = icons.map(function (item, index) {
    var handler = null;
    if (type === "number" && item.icon === "minus-circled") handler = onDecrement;
    if (type === "number" && item.icon === "plus-circled") handler = onIncrement;
    if (type === "password") handler = onToggleVisibility;
    if (item.icon === "cross-circled") handler = onClear;

    return React.createElement(
      "button",
      {
        key: index,
        type: "button",
        "aria-label": item.label,
        tabIndex: -1,
        onClick: handler,
        disabled: props.disabled,
      },
      React.createElement(Icon, { name: item.icon, decorative: true }),
    );
  });

  return React.createElement(
    "div",
    { className: wrapperClasses.join(" ") },
    React.createElement("input", {
      type,
      className: "input",
      ...props,
    }),
    React.createElement(
      "span",
      { className: "input-field__control" },
      controlButtons,
    ),
  );
}
