import { UIElement, define } from "./base.js";

/**
 * <ui-icon name="search" label="Search"></ui-icon>
 *
 * Attributes:
 *   name      — icon file name (without .svg)
 *   src       — custom icon URL (overrides name)
 *   label     — accessible label (makes it non-decorative)
 *   folder    — asset subfolder (default: "icons")
 *   decorative — force decorative (no label announced)
 */
class UIIcon extends UIElement {
  static get observedAttributes() {
    return ["name", "src", "label", "folder", "decorative"];
  }

  render() {
    const name = this.getAttr("name");
    const src = this.getAttr("src");
    const label = this.getAttr("label");
    const folder = this.getAttr("folder", "icons");
    const decorative = this.getBool("decorative") || !label;

    if (!name && !src) {
      this.innerHTML = "";
      return;
    }

    const iconUrl = src || new URL(`../assets/${folder}/${name}.svg`, import.meta.url).href;

    const classes = ["icon"];
    const extraClass = this.getAttr("class");
    if (extraClass) classes.push(extraClass);

    const attrs = [
      `class="${classes.join(" ")}"`,
      `style="--icon-src: url('${iconUrl}')"`,
    ];

    if (decorative) {
      attrs.push('aria-hidden="true"');
    } else {
      attrs.push('role="img"');
      attrs.push(`aria-label="${label || name.replace(/[-_]+/g, " ").trim()}"`);
    }

    this.innerHTML = `<span ${attrs.join(" ")}></span>`;
  }
}

define("ui-icon", UIIcon);
export { UIIcon };
