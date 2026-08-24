import { UIElement, define } from "./base.js";

/**
 * <uif-menu>
 *   <li class="uif-menu-item" role="menuitem" tabindex="0">Item 1</li>
 *   <li class="uif-menu-item" role="menuitem" tabindex="-1">Item 2</li>
 * </uif-menu>
 *
 * Attributes:
 *   role — "menu" (default) or "listbox"
 *
 * Keyboard navigation:
 *   ArrowUp / ArrowDown — move focus between items
 *   Home / End          — jump to first / last item
 *   Enter / Space       — activate focused item
 *   Escape              — close menu (fires "uif-menu:close" event)
 */
class UIMenu extends UIElement {
  connectedCallback() {
    super.connectedCallback();
    if (!this.getAttribute("role")) {
      this.setAttribute("role", "menu");
    }
    this._onKeydown = this._handleKeydown.bind(this);
    this.addEventListener("keydown", this._onKeydown);
    this._items().forEach((item, i) => {
      if (!item.hasAttribute("tabindex")) {
        item.setAttribute("tabindex", i === 0 ? "0" : "-1");
      }
    });
  }

  disconnectedCallback() {
    this.removeEventListener("keydown", this._onKeydown);
  }

  _items() {
    return Array.from(
      this.querySelectorAll(
        '.uif-menu-item:not(.is-disabled):not([aria-disabled="true"])',
      ),
    );
  }

  _handleKeydown(event) {
    const items = this._items();
    const current = document.activeElement;
    const idx = items.indexOf(current);

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const next = idx < items.length - 1 ? items[idx + 1] : items[0];
        this._focus(items, next);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prev = idx > 0 ? items[idx - 1] : items[items.length - 1];
        this._focus(items, prev);
        break;
      }
      case "Home": {
        event.preventDefault();
        this._focus(items, items[0]);
        break;
      }
      case "End": {
        event.preventDefault();
        this._focus(items, items[items.length - 1]);
        break;
      }
      case "Escape": {
        this.dispatchEvent(new CustomEvent("uif-menu:close", { bubbles: true, composed: true }));
        break;
      }
      default:
        break;
    }
  }

  _focus(items, target) {
    items.forEach((item) => item.setAttribute("tabindex", "-1"));
    if (target) {
      target.setAttribute("tabindex", "0");
      target.focus();
    }
  }
}

define("uif-menu", UIMenu);
export { UIMenu };
