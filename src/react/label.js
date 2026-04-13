import React from "react";
import { Icon } from "./icon.js";

export function hasTextContent(value) {
  if (value === null || value === undefined || value === false) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasTextContent);
  return true;
}

function renderIcon(icon, position) {
  if (!icon) return null;

  if (React.isValidElement(icon)) {
    return React.cloneElement(icon, {
      "data-slot": position,
    });
  }

  if (typeof icon === "string") {
    return React.createElement(Icon, {
      name: icon,
      decorative: true,
      "data-slot": position,
    });
  }

  if (typeof icon === "object") {
    const iconProps = { ...icon };
    if (iconProps.decorative === undefined) {
      iconProps.decorative = true;
    }
    iconProps["data-slot"] = position;
    return React.createElement(Icon, iconProps);
  }

  return null;
}

export function LabelContent({
  children,
  text,
  startIcon,
  endIcon,
  iconOnly,
  className = "",
  ...props
}) {
  const content = children ?? text;
  const resolvedIconOnly = iconOnly ?? !hasTextContent(content);
  const classes = ["label-content"];

  if (resolvedIconOnly) classes.push("is-icon-only");
  if (className) classes.push(className);

  const textNode = hasTextContent(content)
    ? React.createElement("span", { className: "label-content__text" }, content)
    : null;

  return React.createElement(
    "span",
    {
      className: classes.join(" "),
      ...props,
    },
    renderIcon(startIcon, "start"),
    textNode,
    renderIcon(endIcon, "end"),
  );
}

export function FieldLabel({
  htmlFor,
  required = false,
  requiredText = "required",
  className = "",
  children,
  text,
  startIcon,
  endIcon,
  iconOnly,
  ...props
}) {
  const classes = ["field-label"];
  if (className) classes.push(className);

  const requiredBadge = required
    ? React.createElement(
        "span",
        {
          className: "field-label__required",
          "aria-hidden": true,
        },
        "*",
      )
    : null;

  const requiredA11yText = required
    ? React.createElement(
        "span",
        { className: "field-label__required-text" },
        ` (${requiredText})`,
      )
    : null;

  return React.createElement(
    "label",
    {
      htmlFor,
      className: classes.join(" "),
      ...props,
    },
    React.createElement(
      LabelContent,
      {
        startIcon,
        endIcon,
        iconOnly,
      },
      children ?? text,
    ),
    requiredBadge,
    requiredA11yText,
  );
}
