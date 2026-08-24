import { UIElement, define } from "./base.js";

const METER_VARIANTS = new Set(["default", "positive", "notice", "negative"]);

function toFiniteNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

class UIMeter extends UIElement {
  static get observedAttributes() {
    return ["label", "value", "min", "max", "variant", "size", "value-text"];
  }

  render() {
    const label = this.getAttr("label", "Meter").trim() || "Meter";
    const min = toFiniteNumber(this.getAttr("min", "0"), 0);
    const maxRaw = toFiniteNumber(this.getAttr("max", "100"), 100);
    const max = maxRaw <= min ? min + 1 : maxRaw;
    const rawValue = toFiniteNumber(this.getAttr("value", "0"), 0);
    const value = clamp(rawValue, min, max);

    const variantRaw = this.getAttr("variant", "default");
    const variant = METER_VARIANTS.has(variantRaw) ? variantRaw : "default";
    const size = this.getAttr("size", "md") === "sm" ? "sm" : "md";

    const percent = ((value - min) / (max - min)) * 100;
    const safePercent = clamp(percent, 0, 100);
    const valueText = this.getAttr("value-text", "").trim() || `${Math.round(safePercent)}%`;

    const root = document.createElement("div");
    const classes = ["uif-meter"];
    if (variant !== "default") classes.push(variant);
    if (size === "sm") classes.push("sm");
    root.className = classes.join(" ");

    const header = document.createElement("div");
    header.className = "uif-meter-header";

    const labelNode = document.createElement("span");
    labelNode.className = "uif-meter-label";
    labelNode.textContent = label;

    const valueNode = document.createElement("span");
    valueNode.className = "uif-meter-value";
    valueNode.textContent = valueText;

    header.append(labelNode, valueNode);

    // Native <meter> for semantics and assistive technology
    const meter = document.createElement("meter");
    meter.className = "uif-meter-native";
    meter.min = min;
    meter.max = max;
    meter.value = value;
    meter.setAttribute("aria-label", label);
    meter.textContent = valueText;

    // Visual proxy for token-controlled presentation
    const track = document.createElement("div");
    track.className = "uif-meter-track";
    track.setAttribute("aria-hidden", "true");

    const fill = document.createElement("span");
    fill.className = "uif-meter-fill";
    fill.style.inlineSize = `${safePercent}%`;
    track.append(fill);

    root.append(header, meter, track);
    this.replaceChildren(root);
  }
}

define("uif-meter", UIMeter);
export { UIMeter };
