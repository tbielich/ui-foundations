import { UIElement, define } from "./base.js";

/**
 * <uif-tag>Label</uif-tag>
 * <uif-tag size="sm" removable remove-label="Remove Label">Label</uif-tag>
 * <uif-tag start-icon="star">Starred</uif-tag>
 *
 * Attributes:
 *   size         — "md" (default), "sm"
 *   removable    — boolean, shows a remove/dismiss button
 *   remove-label — accessible label for the remove button (default: "Remove")
 *   selected     — boolean, applies the selected visual state
 *   start-icon   — icon name for a leading icon slot
 *
 * Events:
 *   uif-tag-remove — dispatched when the remove button is activated
 */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

class UITag extends UIElement {
  static get observedAttributes() {
    return ["size", "removable", "remove-label", "selected", "start-icon"];
  }

  render() {
    const size = this.getAttr("size", "md");
    const removable = this.getBool("removable");
    const removeLabel = this.getAttr("remove-label", "Remove");
    const selected = this.getBool("selected");
    const startIcon = this.getAttr("start-icon");
    const text = this.textContent.trim();

    const classes = ["uif-tag"];
    if (size === "sm") classes.push("sm");
    if (selected) classes.push("is-selected");

    let inner = "";

    if (startIcon) {
      inner += `<span class="uif-icon" style="--uif-icon-src: url('/assets/icons/${escapeHtml(startIcon)}.svg')" aria-hidden="true"></span>`;
    }

    inner += `<span class="uif-tag-text">${escapeHtml(text)}</span>`;

    if (removable) {
      inner += `<button type="button" class="uif-tag-remove" aria-label="${escapeHtml(removeLabel)}"><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/cross.svg')" aria-hidden="true"></span></button>`;
    }

    const ariaSelected = selected ? ` aria-selected="true"` : "";
    this.innerHTML = `<span class="${classes.join(" ")}"${ariaSelected}>${inner}</span>`;

    const btn = this.querySelector(".uif-tag-remove");
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.dispatchEvent(
          new CustomEvent("uif-tag-remove", { bubbles: true, composed: true }),
        );
      });
    }
  }
}

/**
 * <uif-tag-group>
 *   <uif-tag>A</uif-tag>
 *   <uif-tag>B</uif-tag>
 * </uif-tag-group>
 *
 * Attributes:
 *   no-wrap — boolean, disables wrapping and clips overflow
 *
 * Keyboard navigation:
 *   ArrowLeft / ArrowRight move focus between tags inside the group.
 */
class UITagGroup extends UIElement {
  static get observedAttributes() {
    return ["no-wrap"];
  }

  render() {
    const noWrap = this.getBool("no-wrap");
    const classes = ["uif-tag-group"];
    if (noWrap) classes.push("no-wrap");

    const container = this.querySelector(".uif-tag-group");
    if (container) {
      container.className = classes.join(" ");
      return;
    }

    const slot = this.innerHTML;
    this.innerHTML = `<div class="${classes.join(" ")}" role="group">${slot}</div>`;

    this._attachKeyNav();
  }

  _attachKeyNav() {
    const container = this.querySelector(".uif-tag-group");
    if (!container) return;

    container.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

      const tags = Array.from(
        container.querySelectorAll(
          ".uif-tag, uif-tag",
        ),
      );
      const focused = document.activeElement;
      const idx = tags.findIndex(
        (t) => t === focused || t.contains(focused),
      );
      if (idx === -1) return;

      const next =
        e.key === "ArrowRight"
          ? tags[idx + 1]
          : tags[idx - 1];

      if (next) {
        e.preventDefault();
        const focusTarget =
          next.querySelector("button, [tabindex]") || next;
        focusTarget.focus();
      }
    });
  }
}

define("uif-tag", UITag);
define("uif-tag-group", UITagGroup);
export { UITag, UITagGroup };

