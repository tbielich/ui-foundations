import React from "react";
import { LabelContent, hasTextContent } from "./label.js";
import { warnDev } from "./warn-dev.js";

function normalizeOrientation(value) {
  return value === "vertical" ? "vertical" : "horizontal";
}

function normalizeJustify(value) {
  return value === "stretch" ? "stretch" : "start";
}

function normalizeVariant(value) {
  return value === "outline" || value === "ghost" ? value : "solid";
}

export function Button({
  variant = "solid",
  className = "",
  type = "button",
  label,
  startIcon,
  endIcon,
  iconOnly,
  ariaLabel,
  children,
  ...props
}) {
  const classes = ["uif-button", normalizeVariant(variant)];
  if (className) classes.push(className);

  const content = children ?? label;
  const hasReadableLabel = hasTextContent(content);
  const resolvedIconOnly = iconOnly ?? !hasReadableLabel;
  const iconStart = resolvedIconOnly ? startIcon || endIcon : startIcon;
  const iconEnd = resolvedIconOnly ? undefined : endIcon;

  if (resolvedIconOnly) classes.push("icon-only");

  const buttonProps = {
    type,
    className: classes.join(" "),
    ...props,
  };

  if (resolvedIconOnly && !buttonProps["aria-label"] && ariaLabel) {
    buttonProps["aria-label"] = ariaLabel;
  }

  if (resolvedIconOnly && !buttonProps["aria-label"]) {
    warnDev(
      "[ui-foundations] iconOnly Button should include `ariaLabel` or `aria-label`.",
    );
  }

  return React.createElement(
    "button",
    buttonProps,
    React.createElement(
      LabelContent,
      {
        startIcon: iconStart,
        endIcon: iconEnd,
        iconOnly: resolvedIconOnly,
      },
      content,
    ),
  );
}

export function ButtonGroup({
  className = "",
  orientation = "horizontal",
  attached = false,
  justify = "start",
  children,
  ...props
}) {
  const classes = ["uif-button-group"];
  if (className) classes.push(className);

  return React.createElement(
    "div",
    {
      role: "group",
      className: classes.join(" "),
      "data-orientation": normalizeOrientation(orientation),
      "data-attached": attached ? "true" : "false",
      "data-justify": normalizeJustify(justify),
      ...props,
    },
    children,
  );
}
