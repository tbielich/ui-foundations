import React from "react";

/**
 * Divider — visual separator between content sections.
 *
 * @param {object} props
 * @param {"horizontal"|"vertical"} [props.orientation="horizontal"] - Orientation
 * @param {"subtle"|""} [props.variant=""] - Color variant
 * @param {string} [props.className=""] - Additional CSS classes
 */
export function Divider({
  orientation = "horizontal",
  variant = "",
  className = "",
  ...props
}) {
  const classes = ["divider"];
  if (variant) classes.push(variant);
  if (className) classes.push(className);

  const elementProps = {
    className: classes.join(" "),
    ...props,
  };

  if (orientation === "vertical") {
    elementProps["aria-orientation"] = "vertical";
  }

  return React.createElement("hr", elementProps);
}
