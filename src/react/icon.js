import React from "react";

function resolveIconUrl(name, folder, src) {
  if (src) return src;
  return new URL(`../assets/${folder}/${name}.svg`, import.meta.url).href;
}

function humanizeName(name) {
  return String(name || "")
    .replace(/[-_]+/g, " ")
    .trim();
}

function warnDev(message) {
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV === "production"
  ) {
    return;
  }

  console.warn(message);
}

export function Icon({
  name,
  src,
  label,
  folder = "icons",
  decorative,
  className = "",
  style,
  ...props
}) {
  if (!name && !src) return null;

  const iconUrl = resolveIconUrl(name, folder, src);
  const isDecorative = decorative ?? !label;
  const classes = ["icon"];
  if (className) classes.push(className);

  const mergedStyle = {
    "--icon-src": `url(${JSON.stringify(iconUrl)})`,
    ...style,
  };

  const accessibilityProps = {};
  if (isDecorative) {
    accessibilityProps["aria-hidden"] = true;
  } else {
    const accessibleLabel = label || humanizeName(name);
    if (!accessibleLabel) {
      warnDev(
        "[ui-foundations] Non-decorative Icon should include a readable `label` or `name`.",
      );
    }
    accessibilityProps.role = "img";
    accessibilityProps["aria-label"] = accessibleLabel;
  }

  return React.createElement("span", {
    className: classes.join(" "),
    style: mergedStyle,
    ...accessibilityProps,
    ...props,
  });
}
