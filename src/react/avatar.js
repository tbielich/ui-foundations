import React from "react";

/**
 * Avatar — thumbnail representation of a user or entity.
 *
 * @param {object} props
 * @param {string} [props.src] - Image URL
 * @param {string} [props.alt=""] - Alt text for image
 * @param {string} [props.initials=""] - Fallback initials when no image
 * @param {"xs"|"sm"|"md"|"lg"|"xl"} [props.size="md"] - Size variant
 * @param {string} [props.className=""] - Additional CSS classes
 */
export function Avatar({
  src,
  alt = "",
  initials = "",
  size = "md",
  className = "",
  ...props
}) {
  const classes = ["avatar"];
  if (size && size !== "md") classes.push(size);
  if (className) classes.push(className);

  const children = src
    ? React.createElement("img", { src, alt })
    : React.createElement("span", { className: "avatar__initials" }, initials);

  return React.createElement(
    "span",
    { className: classes.join(" "), role: "img", "aria-label": alt || initials, ...props },
    children
  );
}
