const FIELD_SELECTOR = ":is(.uif-range-slider-field, .range-slider-field)";
const SLIDER_SELECTOR = ":is(.uif-range-slider, .range-slider)";
const INPUT_SELECTOR =
  'input[type="range"]:is(.uif-range-slider-input, .range-slider-input)';

function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function syncField(field, source) {
  const slider = field.querySelector(SLIDER_SELECTOR);
  const inputs = field.querySelectorAll(INPUT_SELECTOR);
  const [lowerInput, upperInput] = inputs;
  if (!slider || !lowerInput || !upperInput) return;

  const min = Number(lowerInput.min || upperInput.min || 0);
  const max = Number(lowerInput.max || upperInput.max || 100);
  let lower = clampValue(Number(lowerInput.value || min), min, max);
  let upper = clampValue(Number(upperInput.value || max), min, max);

  if (source === lowerInput && lower > upper) lower = upper;
  if (source === upperInput && upper < lower) upper = lower;
  if (source !== lowerInput && source !== upperInput && lower > upper) {
    lower = upper;
  }

  lowerInput.value = String(lower);
  upperInput.value = String(upper);
  slider.dataset.lowerValue = String(lower);
  slider.dataset.upperValue = String(upper);

  const range = max - min || 1;
  const lowerPercent = ((lower - min) / range) * 100;
  const upperPercent = ((upper - min) / range) * 100;
  slider.style.setProperty("--_range-slider-start", String(lowerPercent));
  slider.style.setProperty("--_range-slider-end", String(upperPercent));

  const lowerValue = field.querySelector(
    ":is(.uif-range-slider-value-lower, .range-slider-value-lower)",
  );
  const upperValue = field.querySelector(
    ":is(.uif-range-slider-value-upper, .range-slider-value-upper)",
  );
  if (lowerValue) lowerValue.textContent = String(lower);
  if (upperValue) upperValue.textContent = String(upper);
}

function enhanceField(field) {
  if (field.dataset.enhanced) {
    syncField(field);
    return;
  }
  field.dataset.enhanced = "true";

  const inputs = field.querySelectorAll(INPUT_SELECTOR);
  inputs.forEach((input) => {
    input.addEventListener("input", () => syncField(field, input));
    input.addEventListener("change", () => syncField(field, input));
  });

  syncField(field);
}

export function enhanceRangeSliders(root) {
  const container = root || document;
  const fields = container.matches && container.matches(FIELD_SELECTOR)
    ? [container]
    : container.querySelectorAll(FIELD_SELECTOR);
  fields.forEach(enhanceField);
}

export function observeRangeSliders(root) {
  const target = root || document.body;
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches && node.matches(FIELD_SELECTOR)) {
          enhanceField(node);
        }
        if (node.querySelectorAll) {
          node.querySelectorAll(FIELD_SELECTOR).forEach(enhanceField);
        }
      }
    }
  });
  observer.observe(target, { childList: true, subtree: true });
  return observer;
}

if (typeof window !== "undefined" && !window.__RANGE_SLIDER_NO_AUTO) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      enhanceRangeSliders();
      observeRangeSliders();
    });
  } else {
    enhanceRangeSliders();
    observeRangeSliders();
  }
}
