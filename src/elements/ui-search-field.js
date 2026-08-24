import { UIElement, define } from "./base.js";

function fireInputEvents(input) {
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

class UISearchField extends UIElement {
  static get observedAttributes() {
    return [
      "placeholder",
      "value",
      "disabled",
      "readonly",
      "name",
      "quiet",
      "aria-label",
      "aria-labelledby",
    ];
  }

  render() {
    const placeholder = this.getAttr("placeholder");
    const value = this.getAttr("value");
    const disabled = this.getBool("disabled");
    const readonly = this.getBool("readonly");
    const quiet = this.getBool("quiet");
    const name = this.getAttr("name");
    const ariaLabel = this.getAttr("aria-label");
    const ariaLabelledby = this.getAttr("aria-labelledby");

    if (!ariaLabel && !ariaLabelledby && !this.id) {
      this.warnDev(
        "[ui-foundations] <uif-search-field> should have an id, aria-label, or aria-labelledby.",
      );
    }

    const wrapperClasses = ["uif-search-field"];
    if (disabled) wrapperClasses.push("is-disabled");
    if (readonly) wrapperClasses.push("is-readonly");
    if (quiet) wrapperClasses.push("is-quiet");

    const inputAttrs = ['class="uif-search-field-input"', 'type="search"'];
    if (placeholder) inputAttrs.push(`placeholder="${escapeAttr(placeholder)}"`);
    if (value) inputAttrs.push(`value="${escapeAttr(value)}"`);
    if (disabled) inputAttrs.push("disabled");
    if (readonly) inputAttrs.push("readonly");
    if (name) inputAttrs.push(`name="${escapeAttr(name)}"`);
    if (ariaLabel) inputAttrs.push(`aria-label="${escapeAttr(ariaLabel)}"`);
    if (ariaLabelledby) inputAttrs.push(`aria-labelledby="${escapeAttr(ariaLabelledby)}"`);
    if (this.id) inputAttrs.push(`id="${escapeAttr(this.id)}"`);

    this.innerHTML = `<div class="${wrapperClasses.join(" ")}"${quiet ? ' data-variant="quiet"' : ""}>
  <span class="uif-search-field-control" data-slot="start">
    <span class="uif-icon" data-slot="start" style="--uif-icon-src: url('/assets/icons/search.svg')" aria-hidden="true"></span>
  </span>
  <input ${inputAttrs.join(" ")} />
  <span class="uif-search-field-control" data-slot="end">
    <button type="button" aria-label="Clear search" tabindex="-1">
      <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/cross-circled.svg')" aria-hidden="true"></span>
    </button>
  </span>
</div>`;

    const input = this.querySelector(".uif-search-field-input");
    const clearButton = this.querySelector(
      '.uif-search-field-control[data-slot="end"] button[aria-label="Clear search"]',
    );
    if (!input) return;

    if (clearButton) {
      clearButton.disabled = disabled || readonly;
      clearButton.addEventListener("click", () => {
        if (input.disabled || input.readOnly) return;
        input.value = "";
        input.focus();
        fireInputEvents(input);
      });
    }

    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || input.disabled || input.readOnly) return;
      const form = input.form || this.closest("form");
      if (form) return;
      this.dispatchEvent(
        new CustomEvent("search", {
          bubbles: true,
          cancelable: true,
          detail: { value: input.value },
        }),
      );
    });
  }
}

define("uif-search-field", UISearchField);
export { UISearchField };
