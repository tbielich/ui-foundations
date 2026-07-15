import { UIElement, define } from "./base.js";

/**
 * <ui-input type="text" placeholder="Enter value"></ui-input>
 * <ui-input type="number" value="0" min="0" max="100" step="1"></ui-input>
 * <ui-input type="password" placeholder="Password"></ui-input>
 *
 * Attributes:
 *   type        — "text" (default), "email", "search", "password", "number", "tel", "url", "date", "time"
 *   placeholder — placeholder text
 *   value       — initial value
 *   disabled    — boolean
 *   readonly    — boolean
 *   name        — form field name
 *   min/max/step — number constraints
 *   aria-label  — accessible label
 */
class UIInput extends UIElement {
  static get observedAttributes() {
    return ["type", "placeholder", "value", "disabled", "readonly", "name", "min", "max", "step", "aria-label", "aria-labelledby"];
  }

  render() {
    const type = this.getAttr("type", "text");
    const placeholder = this.getAttr("placeholder");
    const value = this.getAttr("value");
    const disabled = this.getBool("disabled");
    const readonly = this.getBool("readonly");
    const name = this.getAttr("name");
    const min = this.getAttr("min");
    const max = this.getAttr("max");
    const step = this.getAttr("step");
    const ariaLabel = this.getAttr("aria-label");
    const ariaLabelledby = this.getAttr("aria-labelledby");

    if (!ariaLabel && !ariaLabelledby && !this.id) {
      this.warnDev("[ui-foundations] <ui-input> should have an id, aria-label, or aria-labelledby.");
    }

    const wrapperClasses = ["uif-input-field"];
    if (disabled) wrapperClasses.push("is-disabled");

    const inputAttrs = ['class="uif-input"', `type="${type}"`];
    if (placeholder) inputAttrs.push(`placeholder="${placeholder}"`);
    if (value) inputAttrs.push(`value="${value}"`);
    if (disabled) inputAttrs.push("disabled");
    if (readonly) inputAttrs.push("readonly");
    if (name) inputAttrs.push(`name="${name}"`);
    if (min) inputAttrs.push(`min="${min}"`);
    if (max) inputAttrs.push(`max="${max}"`);
    if (step) inputAttrs.push(`step="${step}"`);
    if (ariaLabel) inputAttrs.push(`aria-label="${ariaLabel}"`);
    if (ariaLabelledby) inputAttrs.push(`aria-labelledby="${ariaLabelledby}"`);
    if (this.id) inputAttrs.push(`id="${this.id}"`);

    let controlHTML = "";
    const TEXT_TYPES = ["text", "email", "search", "url", "tel"];

    if (TEXT_TYPES.includes(type)) {
      controlHTML = `<button type="button" aria-label="Clear input" tabindex="-1"><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/cross-circled.svg')" aria-hidden="true"></span></button>`;
    } else if (type === "number") {
      controlHTML = `<button type="button" aria-label="Decrease value"><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/minus-circled.svg')" aria-hidden="true"></span></button>
      <button type="button" aria-label="Increase value"><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/plus-circled.svg')" aria-hidden="true"></span></button>`;
    } else if (type === "password") {
      controlHTML = `<button type="button" aria-label="Toggle password visibility"><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/view.svg')" aria-hidden="true"></span></button>`;
    }

    this.innerHTML = `<div class="${wrapperClasses.join(" ")}">
  <input ${inputAttrs.join(" ")} />
  <span class="uif-input-field-control">${controlHTML}</span>
</div>`;
  }
}

define("ui-input", UIInput);
export { UIInput };
