import { UIElement, define } from "./base.js";

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * <uif-progress-circle value="65" aria-label="Profile completion"></uif-progress-circle>
 * <uif-progress-circle indeterminate size="lg" aria-label="Loading"></uif-progress-circle>
 *
 * Attributes:
 *   value           — determinate progress from 0 to 100
 *   indeterminate   — boolean
 *   size            — "sm", "md" (default), "lg"
 *   aria-label      — accessible label
 *   aria-labelledby — external accessible label reference
 */
class UIProgressCircle extends UIElement {
  static get observedAttributes() {
    return ["value", "indeterminate", "size", "aria-label", "aria-labelledby"];
  }

  render() {
    const indeterminate = this.getBool("indeterminate");
    const size = this.getAttr("size", "md");
    const resolvedSize = size === "sm" || size === "lg" ? size : "md";
    const ariaLabel = this.getAttr("aria-label");
    const ariaLabelledby = this.getAttr("aria-labelledby");
    const rawValue = Number.parseFloat(this.getAttr("value", "0"));
    const value = Number.isFinite(rawValue)
      ? Math.min(100, Math.max(0, rawValue))
      : 0;

    if (!ariaLabel && !ariaLabelledby && !this._warnedMissingAccessibleName) {
      this._warnedMissingAccessibleName = true;
      this.warnDev("[ui-foundations] <uif-progress-circle> should have aria-label or aria-labelledby.");
    }

    const root = document.createElement("span");
    const classes = ["uif-progress-circle"];
    if (resolvedSize !== "md") classes.push(resolvedSize);
    if (indeterminate) classes.push("is-indeterminate");
    root.className = classes.join(" ");
    root.setAttribute("role", "progressbar");

    if (ariaLabel) root.setAttribute("aria-label", ariaLabel);
    if (ariaLabelledby) root.setAttribute("aria-labelledby", ariaLabelledby);

    if (!indeterminate) {
      root.setAttribute("aria-valuemin", "0");
      root.setAttribute("aria-valuemax", "100");
      root.setAttribute("aria-valuenow", String(value));
      root.style.setProperty("--_progress-circle-value", String(value));
    }

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "uif-progress-circle-svg");
    svg.setAttribute("viewBox", "0 0 32 32");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    const track = document.createElementNS(SVG_NS, "circle");
    track.setAttribute("class", "uif-progress-circle-track");
    track.setAttribute("cx", "16");
    track.setAttribute("cy", "16");
    track.setAttribute("r", "14");
    track.setAttribute("pathLength", "100");

    const indicator = document.createElementNS(SVG_NS, "circle");
    indicator.setAttribute("class", "uif-progress-circle-indicator");
    indicator.setAttribute("cx", "16");
    indicator.setAttribute("cy", "16");
    indicator.setAttribute("r", "14");
    indicator.setAttribute("pathLength", "100");

    svg.append(track, indicator);
    root.append(svg);

    this.replaceChildren(root);
  }
}

define("uif-progress-circle", UIProgressCircle);
export { UIProgressCircle };
