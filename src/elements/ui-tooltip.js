import { UIElement, define } from "./base.js";

/**
 * <ui-tooltip text="Helpful info" placement="top">
 *   <button>Hover me</button>
 * </ui-tooltip>
 *
 * Attributes:
 *   text      — tooltip content
 *   placement — "top" (default), "bottom", "left", "right"
 */
class UITooltip extends UIElement {
  static get observedAttributes() {
    return ["text", "placement"];
  }

  render() {
    const text = this.getAttr("text");
    const placement = this.getAttr("placement", "top");
    const children = this.innerHTML;

    this.innerHTML = `<span class="uif-tooltip-trigger">${children}<span class="uif-tooltip" role="tooltip" data-placement="${placement}">${text}</span></span>`;
  }
}

define("ui-tooltip", UITooltip);
export { UITooltip };
