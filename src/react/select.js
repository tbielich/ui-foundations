import React from "react";
import { warnDev } from "./warn-dev.js";

export function Select({
  className = "",
  options = [],
  placeholder = "",
  value,
  disabled = false,
  invalid = false,
  children,
  ...props
}) {
  const classes = ["select"];
  if (!value && placeholder) classes.push("is-placeholder");
  if (invalid) classes.push("is-invalid");
  if (className) classes.push(className);

  if (!props["aria-label"] && !props["aria-labelledby"] && !props.id) {
    warnDev(
      "[ui-foundations] Select should be associated with a label via `id`, or include `aria-label`/`aria-labelledby`.",
    );
  }

  const optionElements = [];

  if (placeholder) {
    optionElements.push(
      React.createElement(
        "option",
        { key: "__placeholder", value: "", disabled: true, selected: !value },
        placeholder,
      ),
    );
  }

  if (children) {
    return React.createElement(
      "select",
      {
        className: classes.join(" "),
        disabled,
        value,
        "aria-invalid": invalid || undefined,
        ...props,
      },
      placeholder
        ? [
            React.createElement(
              "option",
              { key: "__placeholder", value: "", disabled: true },
              placeholder,
            ),
            children,
          ]
        : children,
    );
  }

  options.forEach((opt, i) => {
    if (opt.group) {
      optionElements.push(
        React.createElement(
          "optgroup",
          { key: `group-${i}`, label: opt.group },
          opt.items.map((item, j) =>
            React.createElement(
              "option",
              { key: `${i}-${j}`, value: item.value },
              item.label,
            ),
          ),
        ),
      );
    } else {
      optionElements.push(
        React.createElement(
          "option",
          { key: `opt-${i}`, value: opt.value },
          opt.label,
        ),
      );
    }
  });

  return React.createElement(
    "select",
    {
      className: classes.join(" "),
      disabled,
      value,
      "aria-invalid": invalid || undefined,
      ...props,
    },
    optionElements,
  );
}
