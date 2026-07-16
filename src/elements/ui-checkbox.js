import { UIElement, define } from "./base.js";

/**
 * <uif-checkbox label="Accept terms" checked></uif-checkbox>
 * <uif-checkbox name="agree" aria-label="I agree"></uif-checkbox>
 *
 * Attributes:
 *   label      — visible label text
 *   checked    — boolean
 *   disabled   — boolean
 *   name       — form field name
 *   value      — form field value (default: "on")
 *   aria-label — accessible label when no visible label
 */
class UICheckbox extends UIElement {
  static get observedAttributes() {
    return ["label", "checked", "disabled", "name", "value", "aria-label"];
  }

  render() {
    const label = this.getAttr("label");
    const checked = this.getBool("checked");
    const disabled = this.getBool("disabled");
    const name = this.getAttr("name");
    const value = this.getAttr("value", "on");
    const ariaLabel = this.getAttr("aria-label");

    if (!label && !ariaLabel) {
      this.warnDev("[ui-foundations] <uif-checkbox> should have a label or aria-label.");
    }

    const inputAttrs = ['type="checkbox"', 'class="uif-checkbox"'];
    if (checked) inputAttrs.push("checked");
    if (disabled) inputAttrs.push("disabled");
    if (name) inputAttrs.push(`name="${name}"`);
    if (value) inputAttrs.push(`value="${value}"`);
    if (!label && ariaLabel) inputAttrs.push(`aria-label="${ariaLabel}"`);

    if (!label) {
      this.innerHTML = `<input ${inputAttrs.join(" ")} />`;
      return;
    }

    const wrapperClasses = ["uif-checkbox-field"];
    if (disabled) wrapperClasses.push("is-disabled");

    this.innerHTML = `<label class="${wrapperClasses.join(" ")}">
  <input ${inputAttrs.join(" ")} />
  <span class="uif-checkbox-field-text">${label}</span>
</label>`;
  }
}

define("uif-checkbox", UICheckbox);
export { UICheckbox };
