import { UIElement, define } from "./base.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const DEFAULT_SWATCHES = [
  "#111827",
  "#1d4ed8",
  "#0f766e",
  "#15803d",
  "#a16207",
  "#b91c1c",
  "#be185d",
  "#6d28d9",
];

class UIColorPicker extends UIElement {
  static get observedAttributes() {
    return ["value", "format", "disabled", "swatches", "aria-label", "aria-labelledby"];
  }

  render() {
    const value = this.getAttr("value", "#6366f1");
    const format = this.getAttr("format", "hex");
    const disabled = this.getBool("disabled");
    const ariaLabel = this.getAttr("aria-label");
    const ariaLabelledby = this.getAttr("aria-labelledby");
    const swatches = this.getAttr("swatches")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const palette = swatches.length ? swatches : DEFAULT_SWATCHES;

    if (!ariaLabel && !ariaLabelledby && !this.id) {
      this.warnDev("[ui-foundations] <uif-color-picker> should have an id, aria-label, or aria-labelledby.");
    }

    const attrs = [`class="uif-color-picker${disabled ? " is-disabled" : ""}"`, `style="--uif-color-picker-accent-color: ${escapeHtml(value)}"`];
    if (ariaLabel) attrs.push(`aria-label="${escapeHtml(ariaLabel)}"`);
    if (ariaLabelledby) attrs.push(`aria-labelledby="${escapeHtml(ariaLabelledby)}"`);
    if (this.id) attrs.push(`id="${escapeHtml(this.id)}"`);
    if (format) attrs.push(`data-format="${escapeHtml(format)}"`);

    const disabledAttr = disabled ? " disabled" : "";
    const swatchButtons = palette
      .map(
        (swatch) =>
          `<button type="button" class="uif-color-picker-grid-item" style="background: ${escapeHtml(swatch)}" aria-label="Select ${escapeHtml(swatch)}"${disabledAttr}></button>`,
      )
      .join("");

    this.innerHTML = `<div ${attrs.join(" ")}>
  <div class="uif-color-picker-panel">
    <div class="uif-color-picker-area" role="application" aria-label="Color area">
      <span class="uif-color-picker-area-thumb" aria-hidden="true"></span>
    </div>
    <div class="uif-color-picker-sliders">
      <input class="uif-color-picker-slider hue" type="range" min="0" max="360" value="240" aria-label="Hue"${disabledAttr} />
      <input class="uif-color-picker-slider alpha" type="range" min="0" max="100" value="100" aria-label="Alpha"${disabledAttr} />
    </div>
    <div class="uif-color-picker-wheel" role="img" aria-label="Color wheel"></div>
    <div class="uif-color-picker-swatch" aria-hidden="true"></div>
    <div class="uif-color-picker-inputs">
      <label class="uif-color-picker-input-group"><span>HEX</span><input class="uif-color-picker-input" type="text" value="${escapeHtml(value)}" aria-label="Hex value"${disabledAttr} /></label>
      <label class="uif-color-picker-input-group"><span>R</span><input class="uif-color-picker-input" type="number" min="0" max="255" value="99" aria-label="Red value"${disabledAttr} /></label>
      <label class="uif-color-picker-input-group"><span>G</span><input class="uif-color-picker-input" type="number" min="0" max="255" value="102" aria-label="Green value"${disabledAttr} /></label>
      <label class="uif-color-picker-input-group"><span>B</span><input class="uif-color-picker-input" type="number" min="0" max="255" value="241" aria-label="Blue value"${disabledAttr} /></label>
      <label class="uif-color-picker-input-group"><span>H</span><input class="uif-color-picker-input" type="number" min="0" max="360" value="239" aria-label="Hue value"${disabledAttr} /></label>
      <label class="uif-color-picker-input-group"><span>S</span><input class="uif-color-picker-input" type="number" min="0" max="100" value="84" aria-label="Saturation value"${disabledAttr} /></label>
      <label class="uif-color-picker-input-group"><span>L</span><input class="uif-color-picker-input" type="number" min="0" max="100" value="66" aria-label="Lightness value"${disabledAttr} /></label>
      <label class="uif-color-picker-input-group"><span>A</span><input class="uif-color-picker-input" type="number" min="0" max="100" value="100" aria-label="Alpha value"${disabledAttr} /></label>
    </div>
    <div class="uif-color-picker-grid" role="listbox" aria-label="Swatch picker">
      ${swatchButtons}
    </div>
  </div>
</div>`;
  }
}

define("uif-color-picker", UIColorPicker);
export { UIColorPicker };
