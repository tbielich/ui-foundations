import { UIElement, define } from "./base.js";

/**
 * <uif-number-field value="0" min="0" max="100" step="1"></uif-number-field>
 * <uif-number-field format="currency" value="9.99"></uif-number-field>
 * <uif-number-field format="percent" value="50" min="0" max="100"></uif-number-field>
 *
 * Attributes:
 *   value       — initial numeric value
 *   min         — minimum allowed value
 *   max         — maximum allowed value
 *   step        — increment/decrement step (default: 1)
 *   format      — "currency" | "percent" | "" (none)
 *   placeholder — placeholder text (default: "0")
 *   disabled    — boolean
 *   readonly    — boolean
 *   name        — form field name
 *   aria-label  — accessible label
 *   aria-labelledby — id of labelling element
 */
class UINumberField extends UIElement {
  static get observedAttributes() {
    return ["value", "min", "max", "step", "format", "placeholder", "disabled", "readonly", "name", "aria-label", "aria-labelledby"];
  }

  render() {
    const value = this.getAttr("value");
    const min = this.getAttr("min");
    const max = this.getAttr("max");
    const step = this.getAttr("step");
    const format = this.getAttr("format", "");
    const placeholder = this.getAttr("placeholder", "0");
    const disabled = this.getBool("disabled");
    const readonly = this.getBool("readonly");
    const name = this.getAttr("name");
    const ariaLabel = this.getAttr("aria-label");
    const ariaLabelledby = this.getAttr("aria-labelledby");

    if (!ariaLabel && !ariaLabelledby && !this.id) {
      this.warnDev("[ui-foundations] <uif-number-field> should have an id, aria-label, or aria-labelledby.");
    }

    const wrapperClasses = ["uif-input-field", "uif-number-field"];
    if (disabled) wrapperClasses.push("is-disabled");

    const inputAttrs = ['class="uif-input"', 'type="number"'];
    if (placeholder) inputAttrs.push(`placeholder="${placeholder}"`);
    if (value != null && value !== "") inputAttrs.push(`value="${value}"`);
    if (min != null && min !== "") inputAttrs.push(`min="${min}"`);
    if (max != null && max !== "") inputAttrs.push(`max="${max}"`);
    if (step != null && step !== "") inputAttrs.push(`step="${step}"`);
    if (disabled) inputAttrs.push("disabled");
    if (readonly) inputAttrs.push("readonly");
    if (name) inputAttrs.push(`name="${name}"`);
    if (ariaLabel) inputAttrs.push(`aria-label="${ariaLabel}"`);
    if (ariaLabelledby) inputAttrs.push(`aria-labelledby="${ariaLabelledby}"`);
    if (this.id) inputAttrs.push(`id="${this.id}"`);

    const prefixHTML = format === "currency"
      ? `<span class="uif-number-field-prefix" aria-hidden="true">$</span>`
      : "";
    const suffixHTML = format === "percent"
      ? `<span class="uif-number-field-suffix" aria-hidden="true">%</span>`
      : "";

    this.innerHTML = `<div class="${wrapperClasses.join(" ")}">
  ${prefixHTML}<input ${inputAttrs.join(" ")} />${suffixHTML}
  <span class="uif-input-field-control">
    <button type="button" aria-label="Decrease value"><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/minus-circled.svg')" aria-hidden="true"></span></button>
    <button type="button" aria-label="Increase value"><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/plus-circled.svg')" aria-hidden="true"></span></button>
  </span>
</div>`;
  }
}

define("uif-number-field", UINumberField);
export { UINumberField };
