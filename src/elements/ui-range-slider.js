import { UIElement, define } from "./base.js";

/**
 * <uif-range-slider label="Price" min="0" max="100" value-min="20" value-max="80" step="1"></uif-range-slider>
 *
 * Attributes:
 *   label      — visible label text
 *   min        — minimum possible value (default: 0)
 *   max        — maximum possible value (default: 100)
 *   value-min  — current lower thumb value (default: min)
 *   value-max  — current upper thumb value (default: max)
 *   step       — step increment (default: 1)
 *   disabled   — boolean
 *   aria-label — accessible label when no visible label
 *   name-min   — form field name for min value
 *   name-max   — form field name for max value
 */
class UIRangeSlider extends UIElement {
  static get observedAttributes() {
    return [
      "label",
      "min",
      "max",
      "value-min",
      "value-max",
      "step",
      "disabled",
      "aria-label",
      "name-min",
      "name-max",
    ];
  }

  render() {
    const label = this.getAttr("label");
    const min = Number(this.getAttr("min", "0"));
    const max = Number(this.getAttr("max", "100"));
    const step = Number(this.getAttr("step", "1"));
    const valueMin = Number(this.getAttr("value-min", String(min)));
    const valueMax = Number(this.getAttr("value-max", String(max)));
    const disabled = this.getBool("disabled");
    const ariaLabel = this.getAttr("aria-label");
    const nameMin = this.getAttr("name-min");
    const nameMax = this.getAttr("name-max");

    if (!label && !ariaLabel) {
      this.warnDev(
        "[ui-foundations] <uif-range-slider> should have a label or aria-label.",
      );
    }

    const fieldClasses = ["uif-range-slider-field"];
    if (disabled) fieldClasses.push("is-disabled");

    const pctMin = ((valueMin - min) / (max - min)) * 100;
    const pctMax = ((valueMax - min) / (max - min)) * 100;

    const labelHTML = label
      ? `<div class="uif-range-slider-header">
    <span class="uif-range-slider-label">${label}</span>
    <span class="uif-range-slider-value">${valueMin} – ${valueMax}</span>
  </div>`
      : "";

    const ariaLabelMin = label
      ? `${label} minimum`
      : ariaLabel
        ? `${ariaLabel} minimum`
        : "Minimum";
    const ariaLabelMax = label
      ? `${label} maximum`
      : ariaLabel
        ? `${ariaLabel} maximum`
        : "Maximum";

    this.innerHTML = `<div class="${fieldClasses.join(" ")}">
  ${labelHTML}
  <div class="uif-range-slider" role="group"${ariaLabel && !label ? ` aria-label="${ariaLabel}"` : ""}>
    <div class="uif-range-slider-track">
      <div class="uif-range-slider-range" style="inset-inline-start: ${pctMin}%; inline-size: ${pctMax - pctMin}%;"></div>
    </div>
    <div class="uif-range-slider-thumb" role="slider" tabindex="${disabled ? "-1" : "0"}" aria-label="${ariaLabelMin}" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${valueMin}" style="inset-inline-start: ${pctMin}%;"${disabled ? ' aria-disabled="true"' : ""}></div>
    <div class="uif-range-slider-thumb" role="slider" tabindex="${disabled ? "-1" : "0"}" aria-label="${ariaLabelMax}" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${valueMax}" style="inset-inline-start: ${pctMax}%;"${disabled ? ' aria-disabled="true"' : ""}></div>
    <input type="range" min="${min}" max="${max}" step="${step}" value="${valueMin}"${nameMin ? ` name="${nameMin}"` : ""} aria-hidden="true" tabindex="-1"${disabled ? " disabled" : ""} />
    <input type="range" min="${min}" max="${max}" step="${step}" value="${valueMax}"${nameMax ? ` name="${nameMax}"` : ""} aria-hidden="true" tabindex="-1"${disabled ? " disabled" : ""} />
  </div>
</div>`;

    if (!disabled) {
      this._attachBehavior(min, max, step, valueMin, valueMax);
    }
  }

  _attachBehavior(min, max, step, initialMin, initialMax) {
    const thumbs = this.querySelectorAll(".uif-range-slider-thumb");
    const range = this.querySelector(".uif-range-slider-range");
    const inputs = this.querySelectorAll('input[type="range"]');
    const valueDisplay = this.querySelector(".uif-range-slider-value");
    const thumbMin = thumbs[0];
    const thumbMax = thumbs[1];
    const inputMin = inputs[0];
    const inputMax = inputs[1];

    let currentMin = initialMin;
    let currentMax = initialMax;

    const clamp = (val, lo, hi) => Math.min(Math.max(val, lo), hi);
    const snap = (val) => Math.round(val / step) * step;

    const update = () => {
      const pMin = ((currentMin - min) / (max - min)) * 100;
      const pMax = ((currentMax - min) / (max - min)) * 100;
      thumbMin.style.insetInlineStart = `${pMin}%`;
      thumbMax.style.insetInlineStart = `${pMax}%`;
      range.style.insetInlineStart = `${pMin}%`;
      range.style.inlineSize = `${pMax - pMin}%`;
      thumbMin.setAttribute("aria-valuenow", String(currentMin));
      thumbMax.setAttribute("aria-valuenow", String(currentMax));
      inputMin.value = String(currentMin);
      inputMax.value = String(currentMax);
      if (valueDisplay) {
        valueDisplay.textContent = `${currentMin} – ${currentMax}`;
      }
      this.setAttribute("value-min", String(currentMin));
      this.setAttribute("value-max", String(currentMax));
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { min: currentMin, max: currentMax },
          bubbles: true,
        }),
      );
    };

    const handlePointer = (thumb, isMin) => {
      const onPointerDown = (e) => {
        e.preventDefault();
        thumb.focus();
        const slider = this.querySelector(".uif-range-slider");
        const rect = slider.getBoundingClientRect();

        const onPointerMove = (event) => {
          const pct = (event.clientX - rect.left) / rect.width;
          const raw = min + pct * (max - min);
          const snapped = snap(raw);
          if (isMin) {
            currentMin = clamp(snapped, min, currentMax);
          } else {
            currentMax = clamp(snapped, currentMin, max);
          }
          update();
        };

        const onPointerUp = () => {
          document.removeEventListener("pointermove", onPointerMove);
          document.removeEventListener("pointerup", onPointerUp);
        };

        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener("pointerup", onPointerUp);
      };
      thumb.addEventListener("pointerdown", onPointerDown);
    };

    handlePointer(thumbMin, true);
    handlePointer(thumbMax, false);

    // Keyboard support
    const handleKeydown = (thumb, isMin) => {
      thumb.addEventListener("keydown", (e) => {
        let val = isMin ? currentMin : currentMax;
        switch (e.key) {
          case "ArrowRight":
          case "ArrowUp":
            val += step;
            break;
          case "ArrowLeft":
          case "ArrowDown":
            val -= step;
            break;
          case "Home":
            val = min;
            break;
          case "End":
            val = max;
            break;
          case "PageUp":
            val += step * 10;
            break;
          case "PageDown":
            val -= step * 10;
            break;
          default:
            return;
        }
        e.preventDefault();
        if (isMin) {
          currentMin = clamp(snap(val), min, currentMax);
        } else {
          currentMax = clamp(snap(val), currentMin, max);
        }
        update();
      });
    };

    handleKeydown(thumbMin, true);
    handleKeydown(thumbMax, false);
  }
}

define("uif-range-slider", UIRangeSlider);
export { UIRangeSlider };
