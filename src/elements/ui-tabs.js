import { UIElement, define } from "./base.js";

/**
 * <ui-tab-list aria-label="Settings">
 *   <ui-tab label="General" selected controls="panel-1"></ui-tab>
 *   <ui-tab label="Advanced" controls="panel-2"></ui-tab>
 * </ui-tab-list>
 * <ui-tab-panel id="panel-1">General content</ui-tab-panel>
 * <ui-tab-panel id="panel-2" hidden>Advanced content</ui-tab-panel>
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
      'class="tab-list"',
      'role="tablist"',
      `aria-orientation="${orientation}"`,
    ];
    if (ariaLabel) attrs.push(`aria-label="${ariaLabel}"`);

    this.innerHTML = `<div ${attrs.join(" ")}>${children}</div>`;
  }
}

define("ui-tab-list", UITabList);
export { UITabList };

/**
 * <ui-tab label="Tab 1" selected controls="panel-1"></ui-tab>
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
      'class="tab"',
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

define("ui-tab", UITab);
export { UITab };

/**
 * <ui-tab-panel id="panel-1">Content</ui-tab-panel>
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

    const attrs = ['class="tab-panel"', 'role="tabpanel"', 'tabindex="0"'];
    if (id) attrs.push(`id="${id}"`);
    if (hidden) attrs.push("hidden");

    this.innerHTML = `<div ${attrs.join(" ")}>${content}</div>`;
  }
}

define("ui-tab-panel", UITabPanel);
export { UITabPanel };
