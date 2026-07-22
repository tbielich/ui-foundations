import { UIElement, define } from "./base.js";

function enabledTabs(tabList) {
  return [...tabList.querySelectorAll('[role="tab"]')].filter(
    (tab) => !tab.disabled && tab.getAttribute("aria-disabled") !== "true",
  );
}

function activateTab(tabList, tab, focus = true) {
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];
  const root = tabList.closest("uif-tabs") || tabList.parentElement;

  for (const candidate of tabs) {
    const selected = candidate === tab;
    candidate.setAttribute("aria-selected", String(selected));
    candidate.tabIndex = selected ? 0 : -1;
    candidate.classList.toggle("is-active", selected);
  }

  const controlledId = tab.getAttribute("aria-controls");
  if (root) {
    for (const panel of root.querySelectorAll('[role="tabpanel"]')) {
      const selected = Boolean(controlledId) && panel.id === controlledId;
      panel.hidden = !selected;
    }
  }

  if (focus) tab.focus();
  tab.dispatchEvent(new CustomEvent("uif-tab-change", {
    bubbles: true,
    detail: { controls: controlledId || null },
  }));
}

function handleTabKeydown(event) {
  const tab = event.target.closest('[role="tab"]');
  const tabList = event.currentTarget;
  if (!tab) return;

  const tabs = enabledTabs(tabList);
  const currentIndex = tabs.indexOf(tab);
  if (currentIndex < 0) return;

  const orientation = tabList.getAttribute("aria-orientation") || "horizontal";
  const previousKeys = orientation === "vertical" ? ["ArrowUp"] : ["ArrowLeft"];
  const nextKeys = orientation === "vertical" ? ["ArrowDown"] : ["ArrowRight"];
  let target = null;

  if (previousKeys.includes(event.key)) target = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
  if (nextKeys.includes(event.key)) target = tabs[(currentIndex + 1) % tabs.length];
  if (event.key === "Home") target = tabs[0];
  if (event.key === "End") target = tabs[tabs.length - 1];

  if (target) {
    event.preventDefault();
    target.focus();
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    activateTab(tabList, tab);
  }
}

class UITabs extends UIElement {
  static get observedAttributes() {
    return ["orientation", "size", "overflow"];
  }

  render() {
    const orientation = this.getAttr("orientation", "horizontal");
    const size = this.getAttr("size", "default");
    const overflow = this.getAttr("overflow", "scroll");
    const tabList = this.querySelector("uif-tab-list, [role=tablist]");
    if (!tabList) return;

    tabList.setAttribute("aria-orientation", orientation);
    tabList.dataset.size = size;
    tabList.dataset.overflow = overflow;
  }
}

define("uif-tabs", UITabs);
export { UITabs };

class UITabList extends UIElement {
  static get observedAttributes() {
    return ["orientation", "aria-label", "size", "overflow"];
  }

  render() {
    const orientation = this.getAttr("orientation", "horizontal");
    const ariaLabel = this.getAttr("aria-label");
    const size = this.getAttr("size", "default");
    const overflow = this.getAttr("overflow", "scroll");
    const children = this.innerHTML;

    const attrs = [
      'class="uif-tab-list"',
      'role="tablist"',
      `aria-orientation="${orientation}"`,
      `data-size="${size}"`,
      `data-overflow="${overflow}"`,
    ];
    if (ariaLabel) attrs.push(`aria-label="${ariaLabel}"`);

    this.innerHTML = `<div ${attrs.join(" ")}>${children}</div>`;
    const tabList = this.querySelector('[role="tablist"]');
    tabList.addEventListener("keydown", handleTabKeydown);
    tabList.addEventListener("click", (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab && !tab.disabled) activateTab(tabList, tab, false);
    });

    const selected = tabList.querySelector('[role="tab"][aria-selected="true"]') || enabledTabs(tabList)[0];
    if (selected) activateTab(tabList, selected, false);
  }
}

define("uif-tab-list", UITabList);
export { UITabList };

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
    if (disabled) attrs.push("disabled", 'aria-disabled="true"');

    this.innerHTML = `<button ${attrs.join(" ")}>${label}</button>`;
  }
}

define("uif-tab", UITab);
export { UITab };

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
export { UITabPanel, activateTab, handleTabKeydown };
