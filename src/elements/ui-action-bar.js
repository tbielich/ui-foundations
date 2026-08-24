import { UIElement, define } from "./base.js";

/**
 * <uif-action-bar count="3" open>
 *   <button type="button">Delete</button>
 *   <button type="button">Export</button>
 * </uif-action-bar>
 *
 * Attributes:
 *   count        — number of selected items (default: 0)
 *   open         — boolean; shows the bar when present
 *   label        — accessible toolbar label (default: "Bulk actions")
 *   dismiss-label — accessible label for dismiss button (default: "Dismiss")
 */
class UIActionBar extends UIElement {
  static get observedAttributes() {
    return ["count", "open", "label", "dismiss-label"];
  }

  render() {
    const count = parseInt(this.getAttr("count", "0"), 10) || 0;
    const isOpen = this.getBool("open");
    const label = this.getAttr("label", "Bulk actions");
    const dismissLabel = this.getAttr("dismiss-label", "Dismiss");

    const classes = ["uif-action-bar"];
    if (isOpen) classes.push("is-open");

    const userActions = [];
    for (const child of this.childNodes) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        userActions.push(child.cloneNode(true));
      }
    }

    const countText = count === 1 ? "1 item selected" : `${count} items selected`;

    const bar = document.createElement("div");
    bar.setAttribute("role", "toolbar");
    bar.setAttribute("aria-label", label);
    bar.className = classes.join(" ");

    const countSpan = document.createElement("span");
    countSpan.className = "uif-action-bar-count";
    countSpan.setAttribute("aria-live", "polite");
    countSpan.textContent = countText;
    bar.append(countSpan);

    if (userActions.length) {
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "uif-action-bar-actions";
      for (const action of userActions) {
        actionsDiv.append(action);
      }
      bar.append(actionsDiv);
    }

    const spacer = document.createElement("span");
    spacer.className = "uif-action-bar-spacer";
    spacer.setAttribute("aria-hidden", "true");
    bar.append(spacer);

    const dismiss = document.createElement("button");
    dismiss.type = "button";
    dismiss.className = "uif-action-bar-dismiss";
    dismiss.setAttribute("aria-label", dismissLabel);
    dismiss.innerHTML = `<span class="uif-icon" style="--uif-icon-src: url('/assets/icons/close.svg')" aria-hidden="true"></span>`;
    dismiss.addEventListener("click", () => {
      this.removeAttribute("open");
    });
    bar.append(dismiss);

    this.innerHTML = "";
    this.append(bar);
  }
}

define("uif-action-bar", UIActionBar);
export { UIActionBar };
