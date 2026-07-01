import React from "react";
import { Icon } from "./icon.js";

export function Badge({
  children,
  text,
  variant = "default",
  size = "md",
  startIcon,
  className = "",
  ...props
}) {
  const content = children ?? text;
  const classes = ["badge"];

  if (variant && variant !== "default") classes.push(variant);
  if (size === "sm") classes.push("sm");
  if (className) classes.push(className);

  const iconElement =
    startIcon && typeof startIcon === "string"
      ? React.createElement(Icon, {
          name: startIcon,
          decorative: true,
        })
      : startIcon && React.isValidElement(startIcon)
        ? startIcon
        : null;

  return React.createElement(
    "span",
    {
      className: classes.join(" "),
      ...props,
    },
    iconElement,
    content != null
      ? React.createElement("span", { className: "badge-text" }, content)
      : null,
  );
}
