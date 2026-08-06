import { UIElement, define } from "./base.js";

class UINotification extends UIElement {
  static get observedAttributes() {
    return [
      "message",
      "variant",
      "duration",
      "dismissible",
      "action-label",
      "action-href",
      "role",
      "aria-live",
    ];
  }

  constructor() {
    super();
    this._dismissTimer = null;
  }

  disconnectedCallback() {
    if (this._dismissTimer) {
      clearTimeout(this._dismissTimer);
      this._dismissTimer = null;
    }
  }

  render() {
    const allowedVariants = new Set(["info", "success", "warning", "error"]);
    const variantRaw = this.getAttr("variant", "info").toLowerCase();
    const variant = allowedVariants.has(variantRaw) ? variantRaw : "info";
    const message = this.getAttr("message", "Notification");
    const dismissible = this.getBool("dismissible");
    const actionLabel = this.getAttr("action-label");
    const actionHref = this.getAttr("action-href", "#");
    const role = this.getAttr("role", variant === "error" ? "alert" : "status");
    const ariaLive = this.getAttr(
      "aria-live",
      variant === "error" ? "assertive" : "polite",
    );

    const durationValue = Number.parseInt(this.getAttr("duration", "0"), 10);
    const duration = Number.isFinite(durationValue) && durationValue > 0
      ? durationValue
      : 0;

    this.textContent = "";
    const root = document.createElement("div");
    root.className = `uif-notification ${variant}`;
    root.setAttribute("role", role);
    root.setAttribute("aria-live", ariaLive);

    const icon = document.createElement("span");
    icon.className = "uif-notification-icon";
    icon.setAttribute("aria-hidden", "true");
    root.append(icon);

    const content = document.createElement("div");
    content.className = "uif-notification-content";

    const messageNode = document.createElement("p");
    messageNode.className = "uif-notification-message";
    messageNode.textContent = message;
    content.append(messageNode);

    if (actionLabel) {
      const action = document.createElement("a");
      action.className = "uif-notification-action";
      action.href = actionHref;
      action.textContent = actionLabel;
      content.append(action);
    }

    root.append(content);

    if (dismissible) {
      const dismissButton = document.createElement("button");
      dismissButton.type = "button";
      dismissButton.className = "uif-notification-dismiss";
      dismissButton.setAttribute("aria-label", "Dismiss notification");
      dismissButton.textContent = "×";
      dismissButton.addEventListener("click", () => this.remove(), { once: true });
      root.append(dismissButton);
    }

    this.append(root);

    if (this._dismissTimer) {
      clearTimeout(this._dismissTimer);
      this._dismissTimer = null;
    }

    if (duration > 0) {
      this._dismissTimer = setTimeout(() => {
        this.remove();
      }, duration);
    }
  }
}

define("uif-notification", UINotification);
export { UINotification };
