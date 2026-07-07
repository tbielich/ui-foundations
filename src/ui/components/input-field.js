/**
 * Input Field — Progressive Enhancement
 *
 * Activates control buttons inside .input-field elements:
 * - Clear (text/email/search/url/tel): clears the input value
 * - Increment/Decrement (number): steps the value up/down
 * - Toggle visibility (password): switches between password and text type
 * - Open date picker (date): opens the native picker where supported
 *
 * Usage:
 *   import { enhanceInputFields } from 'ui-foundations/ui/components/input-field.js';
 *   enhanceInputFields();           // enhances all .input-field on the page
 *   enhanceInputFields(container);  // enhances only within a container
 */

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
  input.value = String(clampValue(current - step, input));
  input.focus();
  fireInputEvent(input);
}

function handleIncrement(field) {
  const input = getInput(field);
  if (!input || input.disabled || input.readOnly) return;
  const current = parseFloat(input.value) || 0;
  const step = getStep(input);
  input.value = String(clampValue(current + step, input));
  input.focus();
  fireInputEvent(input);
}

function handleToggleVisibility(field) {
  const input = getInput(field);
  if (!input || input.disabled) return;

  const button = field.querySelector(
    '.input-field-control button[aria-label="Toggle password visibility"]',
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

function handleOpenDatePicker(field) {
  const input = getInput(field);
  if (!input || input.disabled || input.readOnly) return;

  input.focus();
  if (typeof input.showPicker === "function") {
    input.showPicker();
  }
}

function enhanceField(field) {
  if (field.dataset.enhanced) return;
  field.dataset.enhanced = "true";

  const control = field.querySelector(".input-field-control");
  if (!control) return;

  // Set aria-pressed on password toggle buttons during enhancement
  const toggleBtn = control.querySelector(
    'button[aria-label="Toggle password visibility"]',
  );
  if (toggleBtn && !toggleBtn.hasAttribute("aria-pressed")) {
    toggleBtn.setAttribute("aria-pressed", "false");
  }

  control.addEventListener("click", function (event) {
    const btn = event.target.closest("button");
    if (!btn) return;

    const label = btn.getAttribute("aria-label");

    if (label === "Clear input") {
      handleClear(field);
    } else if (label === "Decrease value") {
      handleDecrement(field);
    } else if (label === "Increase value") {
      handleIncrement(field);
    } else if (label === "Toggle password visibility") {
      handleToggleVisibility(field);
    } else if (label === "Open date picker") {
      handleOpenDatePicker(field);
    }
  });
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
 * Observe a root for dynamically added .input-field elements.
 * @param {Element|Document} [root=document.body]
 */
export function observeInputFields(root) {
  const target = root || document.body;
  const observer = new MutationObserver(function (mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches && node.matches(".input-field")) {
          enhanceField(node);
        }
        if (node.querySelectorAll) {
          node.querySelectorAll(".input-field").forEach(enhanceField);
        }
      }
    }
  });
  observer.observe(target, { childList: true, subtree: true });
  return observer;
}

/**
 * Auto-enhance on DOMContentLoaded if loaded as a script tag.
 * Module consumers should call enhanceInputFields() manually.
 */
if (typeof window !== "undefined" && !window.__INPUT_FIELD_NO_AUTO) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      enhanceInputFields();
      observeInputFields();
    });
  } else {
    enhanceInputFields();
    observeInputFields();
  }
}
