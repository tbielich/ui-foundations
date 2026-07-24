import { UIElement, define } from "./base.js";

/**
 * <uif-card>
 *   <uif-card-media src="/img/photo.jpg" alt="A scenic view"></uif-card-media>
 *   <uif-card-header>Card title</uif-card-header>
 *   <uif-card-body>Card description text.</uif-card-body>
 *   <uif-card-footer>Footer actions</uif-card-footer>
 * </uif-card>
 *
 * Attributes:
 *   layout      — "vertical" (default), "horizontal"
 *   interactive — boolean, makes the card clickable/focusable
 *   selected    — boolean, applies selection state
 *   href        — if set, renders as an <a> element
 */
class UICard extends UIElement {
  static get observedAttributes() {
    return ["layout", "interactive", "selected", "href"];
  }

  render() {
    const layout = this.getAttr("layout", "vertical");
    const interactive = this.getBool("interactive");
    const selected = this.getBool("selected");
    const href = this.getAttr("href");
    const content = this.innerHTML;

    const classes = ["uif-card"];
    if (layout === "horizontal") classes.push("horizontal");
    if (interactive) classes.push("interactive");
    if (selected) classes.push("is-selected");

    const classAttr = `class="${classes.join(" ")}"`;

    if (href) {
      const selectedAttr = selected ? ' aria-pressed="true"' : "";
      this.innerHTML = `<a ${classAttr} href="${href}"${selectedAttr}>${content}</a>`;
    } else {
      const tabAttr = interactive ? ' tabindex="0"' : "";
      const selectedAttr = selected ? ' aria-selected="true"' : "";
      this.innerHTML = `<article ${classAttr}${tabAttr}${selectedAttr}>${content}</article>`;
    }
  }
}

define("uif-card", UICard);
export { UICard };

/**
 * <uif-card-media src="/img/photo.jpg" alt="Description">
 *   <!-- or place arbitrary media inside -->
 * </uif-card-media>
 *
 * Attributes:
 *   src — image URL (optional; if omitted, slot content is used)
 *   alt — alt text for the image
 */
class UICardMedia extends UIElement {
  static get observedAttributes() {
    return ["src", "alt"];
  }

  render() {
    const src = this.getAttr("src");
    const alt = this.getAttr("alt", "");
    const slotContent = this.innerHTML;

    const inner = src
      ? `<img src="${src}" alt="${alt}" />`
      : slotContent;

    this.innerHTML = `<div class="uif-card-media">${inner}</div>`;
  }
}

define("uif-card-media", UICardMedia);
export { UICardMedia };

/**
 * <uif-card-header>Card title</uif-card-header>
 */
class UICardHeader extends UIElement {
  render() {
    const content = this.innerHTML;
    this.innerHTML = `<div class="uif-card-header">${content}</div>`;
  }
}

define("uif-card-header", UICardHeader);
export { UICardHeader };

/**
 * <uif-card-body>Description text.</uif-card-body>
 */
class UICardBody extends UIElement {
  render() {
    const content = this.innerHTML;
    this.innerHTML = `<div class="uif-card-body">${content}</div>`;
  }
}

define("uif-card-body", UICardBody);
export { UICardBody };

/**
 * <uif-card-footer>Footer content</uif-card-footer>
 */
class UICardFooter extends UIElement {
  render() {
    const content = this.innerHTML;
    this.innerHTML = `<div class="uif-card-footer">${content}</div>`;
  }
}

define("uif-card-footer", UICardFooter);
export { UICardFooter };
