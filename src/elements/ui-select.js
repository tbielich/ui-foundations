import { UIElement, define } from "./base.js";

/**
 * <ui-select placeholder="Choose..." aria-label="Country">
 *   <option value="de">Germany</option>
 *   <option value="at">Austria</option>
 * </ui-select>
 *
 * Attributes:
 *   placeholder — placeholder option text
 *   value       — selected value
 *   disabled    — boolean
 *   invalid     — boolean
 *   name        — form field name
 *   aria-label  — accessible label
 *
 * Children: <option> and <optgroup> elements (passed through)
 */
class UISelect extends UIElement {
  static get observedAttributes() {
    return ["placeholder", "value", "disabled", "invalid", "name", "aria-label", "aria-labelledby"];
  }

  render() {
    const placeholder = this.getAttr("placeholder");
    const value = this.getAttr("value");
    const disabled = this.getBool("disabled");
    const invalid = this.getBool("invalid");
    const name = this.getAttr("name");
    const ariaLabel = this.getAttr("aria-label");
    const ariaLabelledby = this.getAttr("aria-labelledby");

    if (!ariaLabel && !ariaLabelledby && !this.id) {
      this.warnDev("[ui-foundations] <ui-select> should have an id, aria-label, or aria-labelledby.");
    }

    const classes = ["uif-select"];
    if (!value && placeholder) classes.push("is-placeholder");
    if (invalid) classes.push("is-invalid");

    const selectAttrs = [`class="${classes.join(" ")}"`];
    if (disabled) selectAttrs.push("disabled");
    if (name) selectAttrs.push(`name="${name}"`);
    if (invalid) selectAttrs.push('aria-invalid="true"');
    if (ariaLabel) selectAttrs.push(`aria-label="${ariaLabel}"`);
    if (ariaLabelledby) selectAttrs.push(`aria-labelledby="${ariaLabelledby}"`);
    if (this.id) selectAttrs.push(`id="${this.id}"`);

    // Preserve existing option/optgroup children
    const options = this.innerHTML;
    const placeholderOption = placeholder
      ? `<option value="" disabled${!value ? " selected" : ""}>${placeholder}</option>`
      : "";

    this.innerHTML = `<select ${selectAttrs.join(" ")}>${placeholderOption}${options}</select>`;
  }
}

define("ui-select", UISelect);
export { UISelect };
