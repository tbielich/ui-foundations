import { UIElement, define } from "./base.js";

const DEFAULT_ICONS = {
  info: "info-circled",
  positive: "checkmark-circled",
  negative: "cross-circled",
  notice: "exclamation-mark-circled",
};

/**
 * <uif-inline-alert variant="info" title="Heads up" description="Something to know."></uif-inline-alert>
 * <uif-inline-alert variant="negative" title="Error" dismissible></uif-inline-alert>
 *
 * Attributes:
 *   variant     — "info" (default), "positive", "negative", "notice"
 *   title       — bold heading text
 *   description — body text
 *   icon        — override icon name; defaults to variant-appropriate icon
 *   dismissible — boolean; adds a dismiss button
 */
class UIInlineAlert extends UIElement {
  static get observedAttributes() {
    return ["variant", "title", "description", "icon", "dismissible"];
  }

  render() {
    const variant = this.getAttr("variant", "info");
    const title = this.getAttr("title");
    const description = this.getAttr("description");
    const iconOverride = this.getAttr("icon");
    const dismissible = this.getBool("dismissible");

    const icon = iconOverride || DEFAULT_ICONS[variant] || "info-circled";

    const classes = ["uif-inline-alert"];
    if (variant) classes.push(variant);

    const iconHtml = `<span class="uif-inline-alert-icon"><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/${icon}.svg')" aria-hidden="true"></span></span>`;

    const titleHtml = title
      ? `<strong class="uif-inline-alert-title">${title}</strong>`
      : "";

    const descHtml = description
      ? `<p class="uif-inline-alert-description">${description}</p>`
      : "";

    const dismissHtml = dismissible
      ? `<button type="button" class="uif-inline-alert-dismiss" aria-label="Dismiss"><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/cross.svg')" aria-hidden="true"></span></button>`
      : "";

    this.innerHTML = `<div class="${classes.join(" ")}" role="alert">${iconHtml}<div class="uif-inline-alert-content">${titleHtml}${descHtml}</div>${dismissHtml}</div>`;

    if (dismissible) {
      const btn = this.querySelector(".uif-inline-alert-dismiss");
      if (btn) {
        btn.addEventListener("click", () => {
          const alert = this.querySelector(".uif-inline-alert");
          if (alert) {
            alert.classList.add("is-hidden");
            this.dispatchEvent(new CustomEvent("uif-dismiss", { bubbles: true }));
          }
        });
      }
    }
  }
}

define("uif-inline-alert", UIInlineAlert);
export { UIInlineAlert };
