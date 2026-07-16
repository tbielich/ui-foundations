import { UIElement, define } from "./base.js";

/**
 * <uif-textarea placeholder="Enter message" rows="4"></uif-textarea>
 *
 * Attributes:
 *   placeholder — placeholder text
 *   value       — initial value
 *   disabled    — boolean
 *   readonly    — boolean
 *   rows        — visible row count
 *   name        — form field name
 *   aria-label  — accessible label
 */
class UITextarea extends UIElement {
  static get observedAttributes() {
    return ["placeholder", "value", "disabled", "readonly", "rows", "name", "aria-label", "aria-labelledby"];
  }

  render() {
    const placeholder = this.getAttr("placeholder");
    const value = this.getAttr("value");
    const disabled = this.getBool("disabled");
    const readonly = this.getBool("readonly");
    const rows = this.getAttr("rows");
    const name = this.getAttr("name");
    const ariaLabel = this.getAttr("aria-label");
    const ariaLabelledby = this.getAttr("aria-labelledby");

    if (!ariaLabel && !ariaLabelledby && !this.id) {
      this.warnDev("[ui-foundations] <uif-textarea> should have an id, aria-label, or aria-labelledby.");
    }

    const attrs = ['class="uif-textarea"'];
    if (placeholder) attrs.push(`placeholder="${placeholder}"`);
    if (disabled) attrs.push("disabled");
    if (readonly) attrs.push("readonly");
    if (rows) attrs.push(`rows="${rows}"`);
    if (name) attrs.push(`name="${name}"`);
    if (ariaLabel) attrs.push(`aria-label="${ariaLabel}"`);
    if (ariaLabelledby) attrs.push(`aria-labelledby="${ariaLabelledby}"`);
    if (this.id) attrs.push(`id="${this.id}"`);

    this.innerHTML = `<textarea ${attrs.join(" ")}>${value || ""}</textarea>`;
  }
}

define("uif-textarea", UITextarea);
export { UITextarea };
