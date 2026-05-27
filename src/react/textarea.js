import React from "react";
import { warnDev } from "./warn-dev.js";

/**
 * TextArea — multi-line text input.
 *
 * @param {object} props
 * @param {string} [props.placeholder=""] - Placeholder text
 * @param {string} [props.value] - Controlled value
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.readonly=false] - Readonly state
 * @param {number} [props.rows] - Visible rows
 * @param {string} [props.className=""] - Additional CSS classes
 */
export function TextArea({
  placeholder = "",
  value,
  disabled = false,
  readonly = false,
  rows,
  className = "",
  ...props
}) {
  const classes = ["textarea"];
  if (className) classes.push(className);

  if (!props["aria-label"] && !props["aria-labelledby"] && !props.id) {
    warnDev(
      "[ui-foundations] TextArea should be associated with a label via `id`, or include `aria-label`/`aria-labelledby`.",
    );
  }

  const elementProps = {
    className: classes.join(" "),
    placeholder,
    disabled,
    readOnly: readonly,
    ...props,
  };

  if (value !== undefined) elementProps.value = value;
  if (rows) elementProps.rows = rows;

  return React.createElement("textarea", elementProps);
}
