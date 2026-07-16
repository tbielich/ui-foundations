import { UIElement, define } from "./base.js";

/**
 * <uif-accordion>
 *   <uif-accordion-item title="Section 1" open>Content</uif-accordion-item>
 *   <uif-accordion-item title="Section 2">Content</uif-accordion-item>
 * </uif-accordion>
 */
class UIAccordion extends UIElement {
  render() {
    // Wrap children in accordion container, preserving inner content
    const children = this.innerHTML;
    this.innerHTML = `<div class="uif-accordion">${children}</div>`;
  }
}

define("uif-accordion", UIAccordion);
export { UIAccordion };

/**
 * <uif-accordion-item title="Question?" open disabled>Answer.</uif-accordion-item>
 *
 * Attributes:
 *   title    — summary/trigger text
 *   open     — boolean, whether expanded
 *   disabled — boolean
 */
class UIAccordionItem extends UIElement {
  static get observedAttributes() {
    return ["title", "open", "disabled"];
  }

  render() {
    const title = this.getAttr("title");
    const open = this.getBool("open");
    const disabled = this.getBool("disabled");
    const content = this.innerHTML;

    const classes = ["uif-accordion-item"];
    if (disabled) classes.push("is-disabled");

    const detailsAttrs = [`class="${classes.join(" ")}"`];
    if (open) detailsAttrs.push("open");

    this.innerHTML = `<details ${detailsAttrs.join(" ")}>
  <summary>${title}</summary>
  <div class="uif-accordion-item-content">${content}</div>
</details>`;
  }
}

define("uif-accordion-item", UIAccordionItem);
export { UIAccordionItem };
