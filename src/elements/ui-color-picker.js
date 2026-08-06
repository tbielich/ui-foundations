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

function parseHexColor(value) {
  const match = String(value || "").trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;
  const hex = match[1].length === 3
    ? match[1].split("").map((char) => char + char).join("")
    : match[1];
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

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
    const rgb = parseHexColor(value);
    const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

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
      <input class="uif-color-picker-slider hue" type="range" min="0" max="360" value="${hsl ? escapeHtml(hsl.h) : "0"}" aria-label="Hue"${disabledAttr} />
      <input class="uif-color-picker-slider alpha" type="range" min="0" max="100" value="100" aria-label="Alpha"${disabledAttr} />
    </div>
    <div class="uif-color-picker-wheel" role="img" aria-label="Color wheel"></div>
    <div class="uif-color-picker-swatch" aria-hidden="true"></div>
    <div class="uif-color-picker-inputs">
      <label class="uif-color-picker-input-group"><span>HEX</span><input class="uif-color-picker-input" type="text" value="${escapeHtml(value)}" aria-label="Hex value"${disabledAttr} /></label>
      <label class="uif-color-picker-input-group"><span>R</span><input class="uif-color-picker-input" type="number" min="0" max="255" value="${rgb ? escapeHtml(rgb.r) : ""}" aria-label="Red value"${disabledAttr} /></label>
      <label class="uif-color-picker-input-group"><span>G</span><input class="uif-color-picker-input" type="number" min="0" max="255" value="${rgb ? escapeHtml(rgb.g) : ""}" aria-label="Green value"${disabledAttr} /></label>
      <label class="uif-color-picker-input-group"><span>B</span><input class="uif-color-picker-input" type="number" min="0" max="255" value="${rgb ? escapeHtml(rgb.b) : ""}" aria-label="Blue value"${disabledAttr} /></label>
      <label class="uif-color-picker-input-group"><span>H</span><input class="uif-color-picker-input" type="number" min="0" max="360" value="${hsl ? escapeHtml(hsl.h) : ""}" aria-label="Hue value"${disabledAttr} /></label>
      <label class="uif-color-picker-input-group"><span>S</span><input class="uif-color-picker-input" type="number" min="0" max="100" value="${hsl ? escapeHtml(hsl.s) : ""}" aria-label="Saturation value"${disabledAttr} /></label>
      <label class="uif-color-picker-input-group"><span>L</span><input class="uif-color-picker-input" type="number" min="0" max="100" value="${hsl ? escapeHtml(hsl.l) : ""}" aria-label="Lightness value"${disabledAttr} /></label>
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
