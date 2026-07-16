import { UIElement, define } from "./base.js";

/**
 * <uif-divider></uif-divider>
 * <uif-divider orientation="vertical" variant="subtle"></uif-divider>
 *
 * Attributes:
 *   orientation — "horizontal" (default), "vertical"
 *   variant     — "", "subtle"
 */
class UIDivider extends UIElement {
  static get observedAttributes() {
    return ["orientation", "variant"];
  }

  render() {
    const orientation = this.getAttr("orientation", "horizontal");
    const variant = this.getAttr("variant");

    const classes = ["uif-divider"];
    if (variant) classes.push(variant);

    const attrs = [`class="${classes.join(" ")}"`];
    if (orientation === "vertical") {
      attrs.push('aria-orientation="vertical"');
    }

    this.innerHTML = `<hr ${attrs.join(" ")} />`;
  }
}

define("uif-divider", UIDivider);
export { UIDivider };
