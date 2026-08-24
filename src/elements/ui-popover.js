import { UIElement, define } from "./base.js";

/**
 * <uif-popover placement="bottom" arrow>
 *   <button slot="trigger">Open</button>
 *   <div slot="content">Popover content</div>
 * </uif-popover>
 *
 * Attributes:
 *   placement — "bottom" (default), "top", "left", "right"
 *   arrow     — boolean, renders an arrow pointer
 */
class UIPopover extends UIElement {
  static get observedAttributes() {
    return ["placement", "arrow"];
  }

  connectedCallback() {
    if (!this._initialized) {
      this._initialized = true;
      this.render();
    }
  }

  attributeChangedCallback() {
    if (this._initialized) {
      this.render();
    }
  }

  render() {
    const placement = this.getAttr("placement", "bottom");
    const showArrow = this.getBool("arrow");

    // Detach existing slot nodes so they survive the DOM rebuild
    const triggerNode = this.querySelector("[slot='trigger']");
    const contentNode = this.querySelector("[slot='content']");
    if (triggerNode) triggerNode.remove();
    if (contentNode) contentNode.remove();

    // Tear down previous event listeners before clearing DOM
    if (this._cleanup) {
      this._cleanup();
      this._cleanup = null;
    }

    // Build structure via DOM APIs to avoid serialising user content
    const container = document.createElement("span");
    container.className = "uif-popover-container";

    const panel = document.createElement("div");
    panel.className = "uif-popover";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("data-placement", placement);
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("tabindex", "-1");

    if (showArrow) {
      const arrow = document.createElement("span");
      arrow.className = "uif-popover-arrow";
      arrow.setAttribute("aria-hidden", "true");
      panel.append(arrow);
    }

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "uif-popover-content";
    if (contentNode) {
      // Move child nodes (not the slot wrapper itself) into the panel content
      contentWrapper.append(...Array.from(contentNode.childNodes));
    }
    panel.append(contentWrapper);

    if (triggerNode) container.append(triggerNode);
    container.append(panel);

    this.innerHTML = "";
    this.append(container);

    this._setupBehavior();
  }

  _setupBehavior() {
    const container = this.querySelector(".uif-popover-container");
    const popover = this.querySelector(".uif-popover");
    const trigger = this.querySelector("[slot='trigger']");

    if (!container || !popover || !trigger) return;

    // Generate correlated ARIA IDs from a single counter value
    const uid = UIPopover._uid++;
    if (!trigger.id) trigger.id = `uif-popover-trigger-${uid}`;
    if (!popover.id) popover.id = `uif-popover-panel-${uid}`;

    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", popover.id);

    const open = () => {
      popover.classList.add("is-open");
      popover.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "true");

      // Auto-flip after layout so getBoundingClientRect is accurate
      requestAnimationFrame(() => this._autoFlip(popover));

      // Focus first focusable element inside the popover
      const focusable = popover.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) {
        focusable.focus();
      } else {
        popover.focus();
      }
    };

    const close = () => {
      popover.classList.remove("is-open");
      popover.setAttribute("aria-hidden", "true");
      trigger.setAttribute("aria-expanded", "false");
      trigger.focus();
    };

    const toggle = () => {
      if (popover.classList.contains("is-open")) {
        close();
      } else {
        open();
      }
    };

    const onKeydown = (e) => {
      if (e.key === "Escape" && popover.classList.contains("is-open")) {
        e.stopPropagation();
        close();
      }
      // Trap focus within popover when open
      if (e.key === "Tab" && popover.classList.contains("is-open")) {
        const focusableEls = Array.from(
          popover.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusableEls.length === 0) return;
        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const onOutsideClick = (e) => {
      if (
        popover.classList.contains("is-open") &&
        !container.contains(e.target)
      ) {
        close();
      }
    };

    trigger.addEventListener("click", toggle);
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("pointerdown", onOutsideClick);

    this._cleanup = () => {
      trigger.removeEventListener("click", toggle);
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("pointerdown", onOutsideClick);
    };
  }

  /**
   * Checks if the popover overflows the viewport and flips placement if needed.
   * Must be called after layout (e.g. in a requestAnimationFrame callback).
   */
  _autoFlip(popover) {
    const placement = popover.dataset.placement || "bottom";
    const rect = popover.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

    let flipped = placement;
    if (placement === "bottom" && rect.bottom > vh) flipped = "top";
    else if (placement === "top" && rect.top < 0) flipped = "bottom";
    else if (placement === "right" && rect.right > vw) flipped = "left";
    else if (placement === "left" && rect.left < 0) flipped = "right";

    if (flipped !== placement) {
      popover.dataset.placement = flipped;
    }
  }

  disconnectedCallback() {
    if (this._cleanup) this._cleanup();
  }
}

UIPopover._uid = 0;

define("uif-popover", UIPopover);
export { UIPopover };

