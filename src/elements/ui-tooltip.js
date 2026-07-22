import { UIElement, define } from "./base.js";

let tooltipSequence = 0;

/**
 * <uif-tooltip text="Helpful info" placement="top" delay="300">
 *   <button>Hover me</button>
 * </uif-tooltip>
 *
 * Attributes:
 *   text      — tooltip content
 *   placement — "top" (default), "bottom", "left", "right"
 *   delay     — show delay in milliseconds (default: 300)
 *   tooltip-id — optional stable tooltip ID
 */
class UITooltip extends UIElement {
  static get observedAttributes() {
    return ["text", "placement", "delay", "tooltip-id"];
  }

  render() {
    const text = this.getAttr("text");
    const placement = this.getAttr("placement", "top");
    const delay = Math.max(0, Number.parseInt(this.getAttr("delay", "300"), 10) || 0);
    const tooltipId = this.getAttr("tooltip-id") || this._tooltipId || `uif-tooltip-${++tooltipSequence}`;
    this._tooltipId = tooltipId;

    const existingTrigger = this.querySelector(":scope > .uif-tooltip-trigger");
    const triggerMarkup = existingTrigger
      ? existingTrigger.querySelector(":scope > :not(.uif-tooltip)")?.outerHTML || ""
      : this.innerHTML;

    this.innerHTML = `<span class="uif-tooltip-trigger" style="--uif-tooltip-delay: ${delay}ms">${triggerMarkup}<span class="uif-tooltip" id="${tooltipId}" role="tooltip" data-placement="${placement}" aria-hidden="true">${text}</span></span>`;

    const trigger = this.querySelector(":scope > .uif-tooltip-trigger > :first-child");
    const tooltip = this.querySelector(`#${CSS.escape(tooltipId)}`);
    if (!trigger || !tooltip) return;

    trigger.setAttribute("aria-describedby", tooltipId);

    const show = () => tooltip.setAttribute("aria-hidden", "false");
    const hide = () => tooltip.setAttribute("aria-hidden", "true");

    trigger.addEventListener("mouseenter", show);
    trigger.addEventListener("mouseleave", hide);
    trigger.addEventListener("focus", show);
    trigger.addEventListener("blur", hide);
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Escape") hide();
    });
  }
}

define("uif-tooltip", UITooltip);
export { UITooltip };
