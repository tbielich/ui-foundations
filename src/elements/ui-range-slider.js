import { UIElement, define } from "./base.js";
import { enhanceRangeSliders } from "../ui/components/range-slider.js";

class UIRangeSlider extends UIElement {
  static get observedAttributes() {
    return [
      "label",
      "min",
      "max",
      "lower-value",
      "upper-value",
      "step",
      "disabled",
      "lower-name",
      "upper-name",
      "lower-aria-label",
      "upper-aria-label",
    ];
  }

  render() {
    const label = this.getAttr("label", "Range");
    const min = this.getAttr("min", "0");
    const max = this.getAttr("max", "100");
    const lowerValue = this.getAttr("lower-value", "25");
    const upperValue = this.getAttr("upper-value", "75");
    const step = this.getAttr("step", "1");
    const disabled = this.getBool("disabled");
    const lowerName = this.getAttr("lower-name");
    const upperName = this.getAttr("upper-name");
    const lowerAriaLabel = this.getAttr("lower-aria-label", "Minimum value");
    const upperAriaLabel = this.getAttr("upper-aria-label", "Maximum value");

    const fieldClasses = ["uif-range-slider-field"];
    if (disabled) fieldClasses.push("is-disabled");

    const lowerAttrs = [
      'class="uif-range-slider-input is-lower"',
      'type="range"',
      `min="${min}"`,
      `max="${max}"`,
      `step="${step}"`,
      `value="${lowerValue}"`,
      `aria-label="${lowerAriaLabel}"`,
    ];
    if (lowerName) lowerAttrs.push(`name="${lowerName}"`);
    if (disabled) lowerAttrs.push("disabled");

    const upperAttrs = [
      'class="uif-range-slider-input is-upper"',
      'type="range"',
      `min="${min}"`,
      `max="${max}"`,
      `step="${step}"`,
      `value="${upperValue}"`,
      `aria-label="${upperAriaLabel}"`,
    ];
    if (upperName) upperAttrs.push(`name="${upperName}"`);
    if (disabled) upperAttrs.push("disabled");

    this.innerHTML = `<div class="${fieldClasses.join(" ")}">
  <div class="uif-range-slider-header">
    <span class="uif-range-slider-label">${label}</span>
    <output class="uif-range-slider-value" aria-live="polite"><span class="uif-range-slider-value-lower">${lowerValue}</span><span class="uif-range-slider-value-separator">–</span><span class="uif-range-slider-value-upper">${upperValue}</span></output>
  </div>
  <div class="uif-range-slider" data-min="${min}" data-max="${max}" data-lower-value="${lowerValue}" data-upper-value="${upperValue}">
    <input ${lowerAttrs.join(" ")} />
    <input ${upperAttrs.join(" ")} />
  </div>
</div>`;

    enhanceRangeSliders(this);
  }
}

define("uif-range-slider", UIRangeSlider);
export { UIRangeSlider };
