import figma, { html } from "@figma/code-connect/html";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=3200-1200&m=dev",
  {
    props: {
      className: figma.className([
        "uif-color-picker",
        figma.enum("State", {
          Default: undefined,
          Disabled: "is-disabled",
        }),
      ]),
      value: figma.string("Value"),
      format: figma.enum("Format", {
        Hex: "hex",
        RGB: "rgb",
        HSL: "hsl",
      }),
    },
    example: ({ className, value, format }) => html`<div
      class="${className}"
      data-format="${format}"
      style="--uif-color-picker-accent-color: ${value}"
    >
      <div class="uif-color-picker-panel">
        <div class="uif-color-picker-area"><span class="uif-color-picker-area-thumb"></span></div>
        <div class="uif-color-picker-sliders">
          <input class="uif-color-picker-slider hue" type="range" />
          <input class="uif-color-picker-slider alpha" type="range" />
        </div>
        <div class="uif-color-picker-wheel"></div>
        <div class="uif-color-picker-swatch"></div>
      </div>
    </div>`,
  },
);
