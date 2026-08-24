import { UIElement, define } from "./base.js";

/**
 * <uif-progress-bar value="60" label="Loading…"></uif-progress-bar>
 * <uif-progress-bar indeterminate label="Processing…"></uif-progress-bar>
 * <uif-progress-bar value="80" variant="positive" show-value></uif-progress-bar>
 *
 * Attributes:
 *   value        — 0–100 (omit or leave empty for indeterminate)
 *   variant      — "default" | "positive" | "negative"
 *   size         — "sm" | "md" (default) | "lg"
 *   label        — visible label text above the track
 *   show-value   — boolean, display the numeric percentage beside the label
 *   indeterminate — boolean, force indeterminate animation
 */

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

class UIProgressBar extends UIElement {
  static get observedAttributes() {
    return ["value", "variant", "size", "label", "show-value", "indeterminate"];
  }

  render() {
    const rawValue = this.getAttr("value");
    const variant = this.getAttr("variant", "default");
    const size = this.getAttr("size", "md");
    const label = this.getAttr("label");
    const showValue = this.getBool("show-value");
    const forceIndeterminate = this.getBool("indeterminate");

    const isIndeterminate = forceIndeterminate || rawValue === "" || rawValue === null || rawValue === undefined;
    const value = isIndeterminate ? null : Math.min(100, Math.max(0, parseFloat(rawValue) || 0));

    const classes = ["uif-progress-bar"];
    if (variant && variant !== "default") classes.push(variant);
    if (size === "sm") classes.push("sm");
    if (size === "lg") classes.push("lg");
    if (isIndeterminate) classes.push("indeterminate");

    // ARIA
    const ariaLabel = escapeHtml(label || (isIndeterminate ? "Loading" : "Progress"));
    const ariaAttrs = isIndeterminate
      ? `role="progressbar" aria-label="${ariaLabel}" aria-valuemin="0" aria-valuemax="100"`
      : `role="progressbar" aria-label="${ariaLabel}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"`;

    const headerParts = [];
    if (label) headerParts.push(`<span class="uif-progress-bar-label">${escapeHtml(label)}</span>`);
    if (showValue && !isIndeterminate) headerParts.push(`<span class="uif-progress-bar-value">${Math.round(value)}%</span>`);
    const header = headerParts.length
      ? `<div class="uif-progress-bar-header">${headerParts.join("")}</div>`
      : "";

    const fillStyle = isIndeterminate ? "" : ` style="--_progress: ${value}"`;

    this.innerHTML = `
<div class="${classes.join(" ")}" ${ariaAttrs}>
  ${header}
  <div class="uif-progress-bar-track">
    <div class="uif-progress-bar-fill"${fillStyle}></div>
  </div>
</div>`.trim();
  }
}

define("uif-progress-bar", UIProgressBar);
export { UIProgressBar };
