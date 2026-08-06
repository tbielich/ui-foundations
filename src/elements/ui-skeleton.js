import { UIElement, define } from "./base.js";

/**
 * <uif-skeleton shape="text"></uif-skeleton>
 * <uif-skeleton shape="circle" size="lg"></uif-skeleton>
 * <uif-skeleton shape="rect" size="sm"></uif-skeleton>
 *
 * Attributes:
 *   shape     — "text" (default), "heading", "circle", "rect"
 *   size      — "sm", "md" (default), "lg"
 *   width     — shorthand for inline-size (for text lines), e.g. "short", "medium"
 *   animated  — "true" (default) | "false" — set to "false" to disable shimmer
 */
class UISkeleton extends UIElement {
  static get observedAttributes() {
    return ["shape", "size", "width", "animated"];
  }

  render() {
    const shape = this.getAttr("shape", "text");
    const size = this.getAttr("size", "md");
    const width = this.getAttr("width", "");
    const animated = this.getAttr("animated", "true");

    const classes = ["uif-skeleton"];
    if (shape && shape !== "text") classes.push(shape);
    if (shape === "text") classes.push("text");
    if (size === "sm") classes.push("sm");
    if (size === "lg") classes.push("lg");
    if (width === "short" || width === "medium") classes.push(width);
    if (animated === "false") classes.push("no-animation");

    this.innerHTML = `<span class="${classes.join(" ")}" role="status" aria-label="Loading…" aria-busy="true"></span>`;
  }
}

define("uif-skeleton", UISkeleton);
export { UISkeleton };
