import React from "react";
import { warnDev } from "./warn-dev.js";

export function Input({ className = "", type = "text", ...props }) {
  const classes = ["input"];
  if (className) classes.push(className);

  if (!props["aria-label"] && !props["aria-labelledby"] && !props.id) {
    warnDev(
      "[ui-foundations] Input should be associated with a label via `id`, or include `aria-label`/`aria-labelledby`.",
    );
  }

  return React.createElement("input", {
    type,
    className: classes.join(" "),
    ...props,
  });
}
