import { UIElement, define } from "./base.js";

/**
 * <ui-button variant="solid" start-icon="search">Submit</ui-button>
 * <ui-button variant="outline" icon-only aria-label="Close" start-icon="cross"></ui-button>
 *
 * Attributes:
 *   variant    — "solid" (default), "outline", "ghost"
 *   type       — button type: "button" (default), "submit", "reset"
 *   disabled   — boolean
 *   icon-only  — boolean, renders as icon-only button
 *   start-icon — icon name for leading position
 *   end-icon   — icon name for trailing position
 *   aria-label — required for icon-only buttons
 */
class UIButton extends UIElement {
  static get observedAttributes() {
    return ["variant", "type", "disabled", "icon-only", "start-icon", "end-icon", "aria-label"];
  }

  render() {
    const variant = this.getAttr("variant", "solid");
    const type = this.getAttr("type", "button");
    const disabled = this.getBool("disabled");
    const iconOnly = this.getBool("icon-only");
    const startIcon = this.getAttr("start-icon");
    const endIcon = this.getAttr("end-icon");
    const ariaLabel = this.getAttr("aria-label");

    const classes = ["button"];
    if (variant === "outline") classes.push("outline");
    if (variant === "ghost") classes.push("ghost");
    if (iconOnly) classes.push("button--icon-only");

    const text = this.textContent.trim();
    const labelContentClasses = ["label-content"];
    if (iconOnly) labelContentClasses.push("is-icon-only");

    let inner = "";

    if (startIcon) {
      inner += `<span class="icon" data-slot="start" style="--icon-src: url('/assets/icons/${startIcon}.svg')" aria-hidden="true"></span>`;
    }

    if (!iconOnly && text) {
      inner += `<span class="label-content__text">${text}</span>`;
    }

    if (endIcon && !iconOnly) {
      inner += `<span class="icon" data-slot="end" style="--icon-src: url('/assets/icons/${endIcon}.svg')" aria-hidden="true"></span>`;
    }

    const btnAttrs = [
      `type="${type}"`,
      `class="${classes.join(" ")}"`,
    ];
    if (disabled) btnAttrs.push("disabled");
    if (ariaLabel) btnAttrs.push(`aria-label="${ariaLabel}"`);

    this.innerHTML = `<button ${btnAttrs.join(" ")}><span class="${labelContentClasses.join(" ")}">${inner}</span></button>`;
  }
}

define("ui-button", UIButton);
export { UIButton };

/**
 * <ui-button-group orientation="horizontal" attached>...</ui-button-group>
 */
class UIButtonGroup extends UIElement {
  static get observedAttributes() {
    return ["orientation", "attached", "justify", "aria-label"];
  }

  render() {
    const orientation = this.getAttr("orientation", "horizontal") === "vertical" ? "vertical" : "horizontal";
    const attached = this.getBool("attached");
    const justify = this.getAttr("justify", "start") === "stretch" ? "stretch" : "start";
    const ariaLabel = this.getAttr("aria-label");

    const attrs = [
      'role="group"',
      'class="button-group"',
      `data-orientation="${orientation}"`,
      `data-attached="${attached ? "true" : "false"}"`,
      `data-justify="${justify}"`,
    ];
    if (ariaLabel) attrs.push(`aria-label="${ariaLabel}"`);

    // Preserve child elements
    const children = this.innerHTML;
    this.innerHTML = `<div ${attrs.join(" ")}>${children}</div>`;
  }
}

define("ui-button-group", UIButtonGroup);
export { UIButtonGroup };
