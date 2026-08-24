import { UIElement, define } from "./base.js";

let modalCounter = 0;

/**
 * <uif-modal open title="Delete file?" variant="alert" size="m" confirm-label="Delete" dismissible="false">
 *   This action cannot be undone.
 * </uif-modal>
 *
 * Uses the native <dialog> element for built-in focus trapping, backdrop,
 * inert management, Esc handling, and accessibility semantics.
 * Implements: principle.foundation.native-html-first
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
    this._dialog = null;
    this._handleCancel = this._handleCancel.bind(this);
    this._handleClick = this._handleClick.bind(this);
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

    const closeButton = dismissible
      ? `<button class="uif-button ghost uif-modal-close" type="button" data-action="dismiss" aria-label="Close dialog"><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/cross.svg')" aria-hidden="true"></span></button>`
      : "";
    const cancelButton = dismissible
      ? `<button class="uif-button outline" type="button" data-action="cancel">${cancelLabel}</button>`
      : "";
    const describedBy = description ? ` aria-describedby="${descriptionId}"` : "";

    this.innerHTML = `<dialog class="uif-modal ${variant} ${sizeClass}" aria-labelledby="${titleId}"${describedBy}>
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
</dialog>`;

    this._dialog = this.querySelector("dialog");
    this.#syncOpenState(open);
    this.#wireEvents(dismissible);
  }

  #syncOpenState(open) {
    const dialog = this._dialog;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
    this._wasOpen = open;
  }

  #wireEvents(dismissible) {
    const dialog = this._dialog;
    if (!dialog) return;

    // Native <dialog> fires 'cancel' on Esc
    dialog.removeEventListener("cancel", this._handleCancel);
    dialog.addEventListener("cancel", this._handleCancel);

    // Click handling for dismiss/cancel/confirm buttons and backdrop click
    dialog.removeEventListener("click", this._handleClick);
    dialog.addEventListener("click", this._handleClick);
  }

  _handleCancel(event) {
    const dismissible = this.getAttribute("dismissible") !== "false";
    if (!dismissible) {
      event.preventDefault();
      return;
    }
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("uif-modal-close", { bubbles: true }));
  }

  _handleClick(event) {
    const target = event.target;
    const action = target.closest("[data-action]")?.dataset?.action;
    const dismissible = this.getAttribute("dismissible") !== "false";

    if (action === "dismiss" && dismissible) {
      this.removeAttribute("open");
      this.dispatchEvent(new CustomEvent("uif-modal-close", { bubbles: true }));
    } else if (action === "cancel") {
      this.dispatchEvent(new CustomEvent("uif-modal-cancel", { bubbles: true }));
      if (dismissible) {
        this.removeAttribute("open");
        this.dispatchEvent(new CustomEvent("uif-modal-close", { bubbles: true }));
      }
    } else if (action === "confirm") {
      this.dispatchEvent(new CustomEvent("uif-modal-confirm", { bubbles: true }));
      this.removeAttribute("open");
      this.dispatchEvent(new CustomEvent("uif-modal-close", { bubbles: true }));
    } else if (target === this._dialog && dismissible) {
      // Click on backdrop (the dialog element itself, outside content)
      const rect = this._dialog.getBoundingClientRect();
      const clickedInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!clickedInside) {
        this.removeAttribute("open");
        this.dispatchEvent(new CustomEvent("uif-modal-close", { bubbles: true }));
      }
    }
  }
}

define("uif-modal", UIModal);
export { UIModal };
