import { UIElement, define } from "./base.js";

/**
 * <ui-link href="/about" start-icon="arrow">About us</ui-link>
 *
 * Attributes:
 *   href       — link destination
 *   start-icon — icon name for leading position
 *   end-icon   — icon name for trailing position
 *   disabled   — boolean
 */
class UILink extends UIElement {
  static get observedAttributes() {
    return ["href", "start-icon", "end-icon", "disabled"];
  }

  render() {
    const href = this.getAttr("href", "#");
    const startIcon = this.getAttr("start-icon");
    const endIcon = this.getAttr("end-icon");
    const disabled = this.getBool("disabled");
    const text = this.textContent.trim();

    const classes = ["uif-link"];
    if (disabled) classes.push("is-disabled");

    const attrs = [`class="${classes.join(" ")}"`];
    if (!disabled) attrs.push(`href="${href}"`);
    if (disabled) {
      attrs.push('aria-disabled="true"');
      attrs.push('tabindex="-1"');
    }

    let inner = "";
    if (startIcon) {
      inner += `<span class="uif-icon" style="--uif-icon-src: url('/assets/icons/${startIcon}.svg')" aria-hidden="true"></span> `;
    }
    inner += text;
    if (endIcon) {
      inner += ` <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/${endIcon}.svg')" aria-hidden="true"></span>`;
    }

    this.innerHTML = `<a ${attrs.join(" ")}>${inner}</a>`;
  }
}

define("ui-link", UILink);
export { UILink };
