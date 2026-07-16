import { UIElement, define } from "./base.js";

/**
 * <ui-badge variant="success" start-icon="checkmark">Active</ui-badge>
 * <ui-badge size="sm">New</ui-badge>
 *
 * Attributes:
 *   variant    — "default", "success", "danger", "warning", "info", "brand"
 *   size       — "md" (default), "sm"
 *   start-icon — icon name for leading position
 */
class UIBadge extends UIElement {
  static get observedAttributes() {
    return ["variant", "size", "start-icon"];
  }

  render() {
    const variant = this.getAttr("variant", "default");
    const size = this.getAttr("size", "md");
    const startIcon = this.getAttr("start-icon");
    const text = this.textContent.trim();

    const classes = ["uif-badge"];
    if (variant && variant !== "default") classes.push(variant);
    if (size === "sm") classes.push("sm");

    let inner = "";
    if (startIcon) {
      inner += `<span class="uif-icon" style="--uif-icon-src: url('/assets/icons/${startIcon}.svg')" aria-hidden="true"></span>`;
    }
    if (text) {
      inner += `<span class="uif-badge-text">${text}</span>`;
    }

    this.innerHTML = `<span class="${classes.join(" ")}">${inner}</span>`;
  }
}

define("ui-badge", UIBadge);
export { UIBadge };
