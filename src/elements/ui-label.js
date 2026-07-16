import { UIElement, define } from "./base.js";

/**
 * <uif-field-label for="email" required start-icon="mail">Email address</uif-field-label>
 *
 * Attributes:
 *   for        — associated input ID (htmlFor)
 *   required   — shows required indicator
 *   start-icon — icon name for leading position
 */
class UIFieldLabel extends UIElement {
  static get observedAttributes() {
    return ["for", "required", "start-icon"];
  }

  render() {
    const htmlFor = this.getAttr("for");
    const required = this.getBool("required");
    const startIcon = this.getAttr("start-icon");
    const text = this.textContent.trim();

    const labelAttrs = ['class="uif-field-label"'];
    if (htmlFor) labelAttrs.push(`for="${htmlFor}"`);

    let iconHtml = "";
    if (startIcon) {
      iconHtml = `<span class="uif-icon" data-slot="start" style="--uif-icon-src: url('/assets/icons/${startIcon}.svg')" aria-hidden="true"></span>`;
    }

    let requiredHtml = "";
    if (required) {
      requiredHtml = `<span class="uif-field-label-required" aria-hidden="true">*</span><span class="uif-field-label-required-text"> (required)</span>`;
    }

    this.innerHTML = `<label ${labelAttrs.join(" ")}>
  <span class="uif-label-content">${iconHtml}<span class="uif-label-content-text">${text}</span></span>${requiredHtml}
</label>`;
  }
}

define("uif-field-label", UIFieldLabel);
export { UIFieldLabel };
