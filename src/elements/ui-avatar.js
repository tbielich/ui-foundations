import { UIElement, define } from "./base.js";

/**
 * <uif-avatar src="/photo.jpg" alt="Jane Doe"></uif-avatar>
 * <uif-avatar initials="JD" size="lg"></uif-avatar>
 *
 * Attributes:
 *   src       — image URL
 *   alt       — alt text for image
 *   initials  — fallback initials when no image
 *   size      — "xs", "sm", "md" (default), "lg", "xl"
 */
class UIAvatar extends UIElement {
  static get observedAttributes() {
    return ["src", "alt", "initials", "size"];
  }

  render() {
    const src = this.getAttr("src");
    const alt = this.getAttr("alt");
    const initials = this.getAttr("initials");
    const size = this.getAttr("size", "md");

    const classes = ["uif-avatar"];
    if (size && size !== "md") classes.push(size);

    const label = alt || initials;
    const inner = src
      ? `<img src="${src}" alt="${alt}" />`
      : `<span class="uif-avatar-initials">${initials}</span>`;

    this.innerHTML = `<span class="${classes.join(" ")}" role="img" aria-label="${label}">${inner}</span>`;
  }
}

define("uif-avatar", UIAvatar);
export { UIAvatar };
