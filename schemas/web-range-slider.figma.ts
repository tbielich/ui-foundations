import figma, { html } from "@figma/code-connect/html";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=1-1&m=dev",
  {
    props: {
      label: figma.string("Label"),
      min: figma.string("Min"),
      max: figma.string("Max"),
      lowerValue: figma.string("Lower value"),
      upperValue: figma.string("Upper value"),
      step: figma.string("Step"),
      disabled: figma.boolean("Disabled"),
      wrapperClassName: figma.className([
        "uif-range-slider-field",
        figma.boolean("Disabled", { true: "is-disabled", false: undefined }),
      ]),
    },
    example: ({ label, min, max, lowerValue, upperValue, step, disabled, wrapperClassName }) => html`<div
      class="${wrapperClassName}"
    >
      <div class="uif-range-slider-header">
        <span class="uif-range-slider-label">${label}</span>
        <output class="uif-range-slider-value" aria-live="polite">
          <span class="uif-range-slider-value-lower">${lowerValue}</span>
          <span class="uif-range-slider-value-separator">–</span>
          <span class="uif-range-slider-value-upper">${upperValue}</span>
        </output>
      </div>
      <div
        class="uif-range-slider"
        data-min="${min}"
        data-max="${max}"
        data-lower-value="${lowerValue}"
        data-upper-value="${upperValue}"
      >
        <input
          class="uif-range-slider-input is-lower"
          type="range"
          min="${min}"
          max="${max}"
          step="${step}"
          value="${lowerValue}"
          aria-label="Minimum value"
          ${disabled ? "disabled" : ""}
        />
        <input
          class="uif-range-slider-input is-upper"
          type="range"
          min="${min}"
          max="${max}"
          step="${step}"
          value="${upperValue}"
          aria-label="Maximum value"
          ${disabled ? "disabled" : ""}
        />
      </div>
    </div>`,
  },
);
