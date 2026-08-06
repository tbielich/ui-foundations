/**
 * Search Field — Progressive Enhancement
 *
 * Activates clear and enter-submit behavior inside `.uif-search-field` elements.
 */

const SEARCH_FIELD_SELECTOR = ":is(.uif-search-field, .search-field)";
const SEARCH_INPUT_SELECTOR =
  'input:is(.uif-search-field-input, .search-field-input)[type="search"]';
const SEARCH_CONTROL_END_SELECTOR =
  ':is(.uif-search-field-control, .search-field-control)[data-slot="end"]';

function getInput(field) {
  return field.querySelector(SEARCH_INPUT_SELECTOR);
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

function handleEnterSubmit(field, event) {
  const input = getInput(field);
  if (!input || input.disabled || input.readOnly) return;
  if (event.key !== "Enter") return;
  const form = input.form || field.closest("form");
  if (form) return;
  field.dispatchEvent(
    new CustomEvent("search", {
      bubbles: true,
      cancelable: true,
      detail: { value: input.value },
    }),
  );
}

function enhanceField(field) {
  if (field.dataset.enhanced) return;
  field.dataset.enhanced = "true";

  const control = field.querySelector(SEARCH_CONTROL_END_SELECTOR);
  const input = getInput(field);
  if (!input) return;

  if (control) {
    control.addEventListener("click", (event) => {
      const btn = event.target.closest("button");
      if (!btn || btn.getAttribute("aria-label") !== "Clear search") return;
      handleClear(field);
    });
  }

  input.addEventListener("keydown", (event) => handleEnterSubmit(field, event));
}

export function enhanceSearchFields(root) {
  const container = root || document;
  const fields = container.querySelectorAll(SEARCH_FIELD_SELECTOR);
  fields.forEach(enhanceField);
}

export function observeSearchFields(root) {
  const target = root || document.body;
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches && node.matches(SEARCH_FIELD_SELECTOR)) {
          enhanceField(node);
        }
        if (node.querySelectorAll) {
          node.querySelectorAll(SEARCH_FIELD_SELECTOR).forEach(enhanceField);
        }
      }
    }
  });
  observer.observe(target, { childList: true, subtree: true });
  return observer;
}

if (typeof window !== "undefined" && !window.__SEARCH_FIELD_NO_AUTO) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      enhanceSearchFields();
      observeSearchFields();
    });
  } else {
    enhanceSearchFields();
    observeSearchFields();
  }
}
