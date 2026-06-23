import React from "react";
import { warnDev } from "./warn-dev.js";
import { Icon } from "./icon.js";

function controlsForType(type) {
  switch (type) {
    case "number":
      return [
        { icon: "minus-circled", label: "Decrease value", focusable: true },
        { icon: "plus-circled", label: "Increase value", focusable: true },
      ];
    case "password":
      return [
        {
          icon: "view",
          label: "Toggle password visibility",
          focusable: true,
        },
      ];
    case "text":
    case "email":
    case "search":
    case "url":
    case "tel":
      return [{ icon: "cross-circled", label: "Clear input", focusable: false }];
    default:
      return [];
  }
}

export function Input({
  className = "",
  type = "text",
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

  const wrapperClasses = ["input-field"];
  if (className) wrapperClasses.push(className);
  if (props.disabled) wrapperClasses.push("is-disabled");

  const icons = controlsForType(type);

  var controlButtons = icons.map(function (item, index) {
    var handler = null;
    if (type === "number" && item.icon === "minus-circled") handler = onDecrement;
    if (type === "number" && item.icon === "plus-circled") handler = onIncrement;
    if (type === "password") handler = onToggleVisibility;
    if (item.icon === "cross-circled") handler = onClear;

    var buttonProps = {
      key: index,
      type: "button",
      "aria-label": item.label,
      onClick: handler,
      disabled: props.disabled,
    };

    if (!item.focusable) {
      buttonProps.tabIndex = -1;
    }

    return React.createElement(
      "button",
      buttonProps,
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
