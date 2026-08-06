import { UIElement, define } from "./base.js";

let modalCounter = 0;

/**
 * <uif-modal open title="Delete file?" variant="alert" size="m" dismissible="false">
 *   This action cannot be undone.
 * </uif-modal>
 */
class UIModal extends UIElement {
  static get observedAttributes() {
    return [
      "open",
      "variant",
      "size",
      "dismissible",
      "title",
      "description",
      "confirm-label",
      "cancel-label",
    ];
  }

  constructor() {
    super();
    modalCounter += 1;
    this._uid = `uif-modal-${modalCounter}`;
    this._initialContent = null;
    this._wasOpen = false;
    this._previouslyFocused = null;
  }

  render() {
    if (this._initialContent === null) {
      this._initialContent = this.innerHTML;
    }

    const open = this.getBool("open");
    const variantAttr = this.getAttr("variant", "confirmation");
    const variant = variantAttr === "alert" ? "alert" : "confirmation";
    const sizeAttr = this.getAttr("size", "m");
    const size = sizeAttr === "s" || sizeAttr === "l" ? sizeAttr : "m";
    const dismissibleAttr = this.getAttribute("dismissible");
    const dismissible = dismissibleAttr === null ? true : dismissibleAttr !== "false";
    const title = this.getAttr("title", "Dialog");
    const description = this.getAttr("description");
    const confirmLabel = this.getAttr("confirm-label", variant === "alert" ? "Delete" : "Confirm");
    const cancelLabel = this.getAttr("cancel-label", "Cancel");

    const titleId = `${this._uid}-title`;
    const descriptionId = `${this._uid}-description`;
    const sizeClass = size === "s" ? "sm" : size === "l" ? "lg" : "md";
    const bodyContent = this._initialContent || "";

    const overlay = dismissible
      ? '<button class="uif-modal-overlay" type="button" data-action="dismiss" aria-label="Dismiss dialog"></button>'
      : '<span class="uif-modal-overlay" aria-hidden="true"></span>';

    const closeButton = dismissible
      ? '<button class="uif-modal-close" type="button" data-action="dismiss" aria-label="Close dialog">×</button>'
      : "";

    const cancelButton = dismissible
      ? `<button class="uif-button outline" type="button" data-action="cancel">${cancelLabel}</button>`
      : "";

    const describedBy = description ? ` aria-describedby="${descriptionId}"` : "";
    const rootStateClass = open ? " is-open" : "";

    this.innerHTML = `<div class="uif-modal-root${rootStateClass}"${open ? "" : " hidden"}>
  ${overlay}
  <section class="uif-modal ${variant} ${sizeClass}" role="dialog" aria-modal="true" aria-labelledby="${titleId}"${describedBy} tabindex="-1">
    <header class="uif-modal-header">
      <h2 class="uif-modal-title" id="${titleId}">${title}</h2>
      ${closeButton}
    </header>
    <div class="uif-modal-body">
      ${description ? `<p class="uif-modal-description" id="${descriptionId}">${description}</p>` : ""}
      ${bodyContent}
    </div>
    <footer class="uif-modal-actions">
      ${cancelButton}
      <button class="uif-button solid" type="button" data-action="confirm">${confirmLabel}</button>
    </footer>
  </section>
</div>`;

    this.#wireEvents({ open, dismissible });
  }

  #wireEvents({ open, dismissible }) {
    const root = this.querySelector(".uif-modal-root");
    const dialog = this.querySelector(".uif-modal");
    if (!root || !dialog) return;

    if (open && !this._wasOpen) {
      this._previouslyFocused = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    }

    const close = () => {
      this.removeAttribute("open");
      this.dispatchEvent(new CustomEvent("uif-modal-close", { bubbles: true }));
    };

    const handleDismiss = () => {
      if (!dismissible) return;
      close();
    };

    root.querySelectorAll('[data-action="dismiss"]').forEach((node) => {
      node.addEventListener("click", handleDismiss);
    });

    const cancel = root.querySelector('[data-action="cancel"]');
    if (cancel) {
      cancel.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("uif-modal-cancel", { bubbles: true }));
        handleDismiss();
      });
    }

    const confirm = root.querySelector('[data-action="confirm"]');
    if (confirm) {
      confirm.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("uif-modal-confirm", { bubbles: true }));
        close();
      });
    }

    if (open) {
      dialog.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          handleDismiss();
          return;
        }
        if (event.key !== "Tab") return;

        const focusable = [...dialog.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )].filter((node) => node instanceof HTMLElement);

        if (focusable.length === 0) {
          event.preventDefault();
          dialog.focus();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const current = document.activeElement;

        if (event.shiftKey && current === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && current === last) {
          event.preventDefault();
          first.focus();
        }
      });

      queueMicrotask(() => {
        const preferred = dialog.querySelector('.uif-modal-close, [data-action="confirm"], [data-action="cancel"]');
        if (preferred instanceof HTMLElement) preferred.focus();
        else dialog.focus();
      });
    } else if (this._wasOpen && this._previouslyFocused?.isConnected) {
      this._previouslyFocused.focus();
    }

    this._wasOpen = open;
  }
}

define("uif-modal", UIModal);
export { UIModal };
