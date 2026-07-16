import { UIElement, define } from "./base.js";

/**
 * <uif-tab-list aria-label="Settings">
 *   <uif-tab label="General" selected controls="panel-1"></uif-tab>
 *   <uif-tab label="Advanced" controls="panel-2"></uif-tab>
 * </uif-tab-list>
 * <uif-tab-panel id="panel-1">General content</uif-tab-panel>
 * <uif-tab-panel id="panel-2" hidden>Advanced content</uif-tab-panel>
 */

class UITabList extends UIElement {
  static get observedAttributes() {
    return ["orientation", "aria-label"];
  }

  render() {
    const orientation = this.getAttr("orientation", "horizontal");
    const ariaLabel = this.getAttr("aria-label");
    const children = this.innerHTML;

    const attrs = [
      'class="uif-tab-list"',
      'role="tablist"',
      `aria-orientation="${orientation}"`,
    ];
    if (ariaLabel) attrs.push(`aria-label="${ariaLabel}"`);

    this.innerHTML = `<div ${attrs.join(" ")}>${children}</div>`;
  }
}

define("uif-tab-list", UITabList);
export { UITabList };

/**
 * <uif-tab label="Tab 1" selected controls="panel-1"></uif-tab>
 *
 * Attributes:
 *   label    — tab button text
 *   selected — boolean
 *   disabled — boolean
 *   controls — ID of controlled panel
 */
class UITab extends UIElement {
  static get observedAttributes() {
    return ["label", "selected", "disabled", "controls"];
  }

  render() {
    const label = this.getAttr("label");
    const selected = this.getBool("selected");
    const disabled = this.getBool("disabled");
    const controls = this.getAttr("controls");

    const attrs = [
      'class="uif-tab"',
      'role="tab"',
      'type="button"',
      `aria-selected="${selected}"`,
      `tabindex="${selected ? "0" : "-1"}"`,
    ];
    if (controls) attrs.push(`aria-controls="${controls}"`);
    if (disabled) attrs.push("disabled");

    this.innerHTML = `<button ${attrs.join(" ")}>${label}</button>`;
  }
}

define("uif-tab", UITab);
export { UITab };

/**
 * <uif-tab-panel id="panel-1">Content</uif-tab-panel>
 *
 * Attributes:
 *   hidden — boolean
 */
class UITabPanel extends UIElement {
  static get observedAttributes() {
    return ["hidden"];
  }

  render() {
    const hidden = this.getBool("hidden");
    const content = this.innerHTML;
    const id = this.id;

    const attrs = ['class="uif-tab-panel"', 'role="tabpanel"', 'tabindex="0"'];
    if (id) attrs.push(`id="${id}"`);
    if (hidden) attrs.push("hidden");

    this.innerHTML = `<div ${attrs.join(" ")}>${content}</div>`;
  }
}

define("uif-tab-panel", UITabPanel);
export { UITabPanel };
