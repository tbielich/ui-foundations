import { UIElement, define } from "./base.js";

/**
 * <uif-status-light variant="positive">Online</uif-status-light>
 *
 * Attributes:
 *   variant — "neutral" (default), "positive", "negative", "notice", "info"
 *   size    — "md" (default), "sm"
 */
class UIStatusLight extends UIElement {
  static get observedAttributes() {
    return ["variant", "size"];
  }

  render() {
    const variant = this.getAttr("variant", "neutral");
    const size = this.getAttr("size", "md");
    const text = this.textContent.trim();

    const classes = ["uif-status-light"];
    if (variant && variant !== "neutral") classes.push(variant);
    if (size === "sm") classes.push("sm");
    this.textContent = "";
    const root = document.createElement("span");
    root.className = classes.join(" ");

    const indicator = document.createElement("span");
    indicator.className = "uif-status-light-indicator";
    indicator.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.className = "uif-status-light-text";
    label.textContent = text;

    root.append(indicator, label);
    this.append(root);
  }
}

define("uif-status-light", UIStatusLight);
export { UIStatusLight };
