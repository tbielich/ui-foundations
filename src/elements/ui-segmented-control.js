import { UIElement, define } from "./base.js";

/**
 * <uif-segmented-control aria-label="View mode">
 *   <uif-segmented-control-item label="Day" value="day" selected></uif-segmented-control-item>
 *   <uif-segmented-control-item label="Week" value="week"></uif-segmented-control-item>
 *   <uif-segmented-control-item label="Month" value="month" disabled></uif-segmented-control-item>
 * </uif-segmented-control>
 */

class UISegmentedControl extends UIElement {
  static get observedAttributes() {
    return ["aria-label", "size"];
  }

  render() {
    const ariaLabel = this.getAttr("aria-label");
    const size = this.getAttr("size");
    const existingWrapper = this.querySelector(".uif-segmented-control");
    const children = existingWrapper ? existingWrapper.innerHTML : this.innerHTML;

    const classes = ["uif-segmented-control"];
    if (size && size !== "md") classes.push(size);

    const attrs = [`class="${classes.join(" ")}"`, 'role="group"'];
    if (ariaLabel) attrs.push(`aria-label="${ariaLabel}"`);

    this.innerHTML = `<div ${attrs.join(" ")}>${children}</div>`;
  }
}

define("uif-segmented-control", UISegmentedControl);
export { UISegmentedControl };

/**
 * <uif-segmented-control-item label="Day" value="day" selected></uif-segmented-control-item>
 *
 * Attributes:
 *   label    — button text
 *   value    — value of the segment (optional)
 *   selected — boolean; marks this segment as active
 *   disabled — boolean; marks this segment as non-interactive
 *   icon     — icon name (optional leading icon)
 */
class UISegmentedControlItem extends UIElement {
  static get observedAttributes() {
    return ["label", "value", "selected", "disabled", "icon"];
  }

  render() {
    const label = this.getAttr("label");
    const selected = this.getBool("selected");
    const disabled = this.getBool("disabled");
    const icon = this.getAttr("icon");

    const attrs = [
      'class="uif-segmented-control-item"',
      'type="button"',
      `aria-pressed="${selected}"`,
    ];
    if (disabled) attrs.push("disabled", 'aria-disabled="true"');

    const iconHtml = icon
      ? `<span class="uif-icon" style="--uif-icon-src: url('/assets/icons/${icon}.svg');" aria-hidden="true"></span>`
      : "";

    this.innerHTML = `<button ${attrs.join(" ")}>${iconHtml}${label}</button>`;
  }
}

define("uif-segmented-control-item", UISegmentedControlItem);
export { UISegmentedControlItem };
