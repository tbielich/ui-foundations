import React from "react";
import { Icon } from "./icon.js";

export function Link({
  children,
  text,
  href = "#",
  startIcon,
  endIcon,
  disabled = false,
  className = "",
  ...props
}) {
  const content = children ?? text;
  const classes = ["link"];

  if (disabled) classes.push("is-disabled");
  if (className) classes.push(className);

  const startIconElement =
    startIcon && typeof startIcon === "string"
      ? React.createElement(Icon, { name: startIcon, decorative: true })
      : startIcon && React.isValidElement(startIcon)
        ? startIcon
        : null;

  const endIconElement =
    endIcon && typeof endIcon === "string"
      ? React.createElement(Icon, { name: endIcon, decorative: true })
      : endIcon && React.isValidElement(endIcon)
        ? endIcon
        : null;

  const linkProps = {
    className: classes.join(" "),
    href: disabled ? undefined : href,
    ...props,
  };

  if (disabled) {
    linkProps["aria-disabled"] = "true";
    linkProps.tabIndex = -1;
  }

  return React.createElement(
    "a",
    linkProps,
    startIconElement,
    content,
    endIconElement,
  );
}
