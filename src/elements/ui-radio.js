import { UIElement, define } from "./base.js";

/**
 * <ui-radio label="Option A" name="choice" value="a"></ui-radio>
 *
 * Attributes:
 *   label      — visible label text
 *   checked    — boolean
 *   disabled   — boolean
 *   name       — radio group name
 *   value      — form field value
 *   aria-label — accessible label when no visible label
 */
class UIRadio extends UIElement {
  static get observedAttributes() {
    return ["label", "checked", "disabled", "name", "value", "aria-label"];
  }

  render() {
    const label = this.getAttr("label");
    const checked = this.getBool("checked");
    const disabled = this.getBool("disabled");
    const name = this.getAttr("name");
    const value = this.getAttr("value");
    const ariaLabel = this.getAttr("aria-label");

    if (!label && !ariaLabel) {
      this.warnDev("[ui-foundations] <ui-radio> should have a label or aria-label.");
    }

    const inputAttrs = ['type="radio"', 'class="radio"'];
    if (checked) inputAttrs.push("checked");
    if (disabled) inputAttrs.push("disabled");
    if (name) inputAttrs.push(`name="${name}"`);
    if (value) inputAttrs.push(`value="${value}"`);
    if (!label && ariaLabel) inputAttrs.push(`aria-label="${ariaLabel}"`);

    if (!label) {
      this.innerHTML = `<input ${inputAttrs.join(" ")} />`;
      return;
    }

    const wrapperClasses = ["radio-field"];
    if (disabled) wrapperClasses.push("is-disabled");

    this.innerHTML = `<label class="${wrapperClasses.join(" ")}">
  <input ${inputAttrs.join(" ")} />
  <span class="radio-field-text">${label}</span>
</label>`;
  }
}

define("ui-radio", UIRadio);
export { UIRadio };
