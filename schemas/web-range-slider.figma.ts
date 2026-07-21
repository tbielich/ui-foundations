import figma, { html } from "@figma/code-connect/html";

interface RangeSliderProps {
  fieldClassName: string;
  label: string;
  disabled: boolean;
  min: string;
  max: string;
  valueMin: string;
  valueMax: string;
  step: string;
}

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=PENDING",
  {
    props: {
      fieldClassName: figma.className([
        "uif-range-slider-field",
        figma.boolean("Disabled", { true: "is-disabled", false: undefined }),
      ]),
      label: figma.string("Label"),
      disabled: figma.boolean("Disabled"),
      min: figma.string("Min"),
      max: figma.string("Max"),
      valueMin: figma.string("Value Min"),
      valueMax: figma.string("Value Max"),
      step: figma.string("Step"),
    },
    example: ({ fieldClassName, label, disabled, min, max, valueMin, valueMax, step }: RangeSliderProps) => html`<div
      class="${fieldClassName}"
    >
      <div class="uif-range-slider-header">
        <span class="uif-range-slider-label">${label}</span>
        <span class="uif-range-slider-value">${valueMin} – ${valueMax}</span>
      </div>
      <div class="uif-range-slider" role="group">
        <div class="uif-range-slider-track">
          <div class="uif-range-slider-range"></div>
        </div>
        <div
          class="uif-range-slider-thumb"
          role="slider"
          tabindex="0"
          aria-label="${label} minimum"
          aria-valuemin="${min}"
          aria-valuemax="${max}"
          aria-valuenow="${valueMin}"
        ></div>
        <div
          class="uif-range-slider-thumb"
          role="slider"
          tabindex="0"
          aria-label="${label} maximum"
          aria-valuemin="${min}"
          aria-valuemax="${max}"
          aria-valuenow="${valueMax}"
        ></div>
        <input
          type="range"
          min="${min}"
          max="${max}"
          step="${step}"
          value="${valueMin}"
          aria-hidden="true"
          tabindex="-1"
          disabled="${disabled}"
        />
        <input
          type="range"
          min="${min}"
          max="${max}"
          step="${step}"
          value="${valueMax}"
          aria-hidden="true"
          tabindex="-1"
          disabled="${disabled}"
        />
      </div>
    </div>`,
  },
);
