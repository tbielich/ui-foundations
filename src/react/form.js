import React from "react";

/**
 * Form — layout container for form fields.
 *
 * @param {object} props
 * @param {boolean} [props.borderless=false] - Remove border and background
 * @param {string} [props.className=""] - Additional class names
 * @param {React.ReactNode} props.children - Form content
 */
export function Form({
  borderless = false,
  className = "",
  children,
  ...props
}) {
  const classes = ["form"];
  if (borderless) classes.push("borderless");
  if (className) classes.push(className);

  return React.createElement(
    "form",
    { className: classes.join(" "), noValidate: true, ...props },
    children,
  );
}

/**
 * FormGroup — groups related fields with an optional title.
 *
 * @param {object} props
 * @param {string} [props.title=""] - Group legend
 * @param {string} [props.className=""] - Additional class names
 * @param {React.ReactNode} props.children - Grouped fields
 */
export function FormGroup({ title = "", className = "", children, ...props }) {
  const classes = ["form-group"];
  if (className) classes.push(className);

  return React.createElement(
    "fieldset",
    { className: classes.join(" "), ...props },
    title
      ? React.createElement("legend", { className: "form-group-title" }, title)
      : null,
    children,
  );
}

/**
 * FormField — single field wrapper with optional side label layout.
 *
 * @param {object} props
 * @param {"top"|"side"} [props.labelPosition="top"] - Label placement
 * @param {boolean} [props.invalid=false] - Show invalid state
 * @param {string} [props.className=""] - Additional class names
 * @param {React.ReactNode} props.children - Label + input + helper
 */
export function FormField({
  labelPosition = "top",
  invalid = false,
  className = "",
  children,
  ...props
}) {
  const classes = ["form-field"];
  if (invalid) classes.push("is-invalid");
  if (className) classes.push(className);

  const attrs = { className: classes.join(" "), ...props };
  if (labelPosition === "side") attrs["data-label-position"] = "side";

  return React.createElement("div", attrs, children);
}

/**
 * FormHelper — helper or error text below a field.
 *
 * @param {object} props
 * @param {string} props.text - Helper message
 */
export function FormHelper({ text, ...props }) {
  return React.createElement(
    "p",
    { className: "form-field-helper", ...props },
    text,
  );
}

/**
 * FormActions — button area at the bottom of a form.
 *
 * @param {object} props
 * @param {"start"|"end"|"stretch"} [props.align="end"] - Button alignment
 * @param {string} [props.className=""] - Additional class names
 * @param {React.ReactNode} props.children - Action buttons
 */
export function FormActions({
  align = "end",
  className = "",
  children,
  ...props
}) {
  const classes = ["form-actions"];
  if (className) classes.push(className);

  const attrs = { className: classes.join(" "), ...props };
  if (align !== "end") attrs["data-align"] = align;

  return React.createElement("div", attrs, children);
}
