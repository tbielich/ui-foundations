/**
 * Input Field — Progressive Enhancement
 *
 * Activates control buttons inside .input-field elements:
 * - Clear (text/email/search/url/tel): clears the input value
 * - Increment/Decrement (number): steps the value up/down
 * - Toggle visibility (password): switches between password and text type
 *
 * Usage:
 *   import { enhanceInputFields } from 'ui-foundations/ui/components/input-field.js';
 *   enhanceInputFields();           // enhances all .input-field on the page
 *   enhanceInputFields(container);  // enhances only within a container
 */

const TEXT_TYPES = ["text", "email", "search", "url", "tel"];

function getInput(field) {
  return field.querySelector("input.input");
}

function getStep(input) {
  const step = parseFloat(input.step);
  return Number.isFinite(step) && step > 0 ? step : 1;
}

function clampValue(value, input) {
  const min = parseFloat(input.min);
  const max = parseFloat(input.max);
  let clamped = value;
  if (Number.isFinite(min) && clamped < min) clamped = min;
  if (Number.isFinite(max) && clamped > max) clamped = max;
  return clamped;
}

function fireInputEvent(input) {
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function handleClear(field) {
  const input = getInput(field);
  if (!input || input.disabled || input.readOnly) return;
  input.value = "";
  input.focus();
  fireInputEvent(input);
}

function handleDecrement(field) {
  const input = getInput(field);
  if (!input || input.disabled || input.readOnly) return;
  const current = parseFloat(input.value) || 0;
  const step = getStep(input);
  input.value = clampValue(current - step, input);
  input.focus();
  fireInputEvent(input);
}

function handleIncrement(field) {
  const input = getInput(field);
  if (!input || input.disabled || input.readOnly) return;
  const current = parseFloat(input.value) || 0;
  const step = getStep(input);
  input.value = clampValue(current + step, input);
  input.focus();
  fireInputEvent(input);
}

function handleToggleVisibility(field) {
  const input = getInput(field);
  if (!input || input.disabled) return;

  const button = field.querySelector(
    '.input-field__control button[aria-label="Toggle password visibility"]',
  );
  const isRevealed = input.type === "text";

  if (isRevealed) {
    input.type = "password";
    if (button) button.setAttribute("aria-pressed", "false");
  } else {
    input.type = "text";
    if (button) button.setAttribute("aria-pressed", "true");
  }

  input.focus();
}

function enhanceField(field) {
  if (field.dataset.enhanced) return;
  field.dataset.enhanced = "true";

  const input = getInput(field);
  if (!input) return;

  const type = input.type;
  const control = field.querySelector(".input-field__control");
  if (!control) return;

  const buttons = control.querySelectorAll("button");

  if (TEXT_TYPES.includes(type)) {
    // Clear button
    buttons.forEach(function (btn) {
      if (btn.getAttribute("aria-label") === "Clear input") {
        btn.addEventListener("click", function () {
          handleClear(field);
        });
      }
    });
  } else if (type === "number") {
    // Decrement / Increment
    buttons.forEach(function (btn) {
      const label = btn.getAttribute("aria-label");
      if (label === "Decrease value") {
        btn.addEventListener("click", function () {
          handleDecrement(field);
        });
      } else if (label === "Increase value") {
        btn.addEventListener("click", function () {
          handleIncrement(field);
        });
      }
    });
  } else if (type === "password") {
    // Toggle visibility
    buttons.forEach(function (btn) {
      if (btn.getAttribute("aria-label") === "Toggle password visibility") {
        btn.addEventListener("click", function () {
          handleToggleVisibility(field);
        });
      }
    });
  }
}

/**
 * Enhance all .input-field elements within a root.
 * @param {Element|Document} [root=document] - Container to search within
 */
export function enhanceInputFields(root) {
  const container = root || document;
  const fields = container.querySelectorAll(".input-field");
  fields.forEach(enhanceField);
}

/**
 * Auto-enhance on DOMContentLoaded if loaded as a script tag.
 * Module consumers should call enhanceInputFields() manually.
 */
if (typeof window !== "undefined" && !window.__INPUT_FIELD_NO_AUTO) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      enhanceInputFields();
    });
  } else {
    enhanceInputFields();
  }
}
