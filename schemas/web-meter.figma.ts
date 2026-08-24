import figma, { html } from "@figma/code-connect/html";
import { MeterProps } from "./web-meter";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=1-1&m=dev",
  {
    props: {
      className: figma.className([
        "uif-meter",
        figma.enum("Variant", {
          Default: undefined,
          Positive: "positive",
          Notice: "notice",
          Negative: "negative",
        }),
        figma.enum("Size", {
          Md: undefined,
          Sm: "sm",
        }),
      ]),
      label: figma.string("Label"),
      valueText: figma.string("Value Text"),
      valuePercent: figma.string("Fill Percent"),
    },
    example: ({ className, label, valueText, valuePercent }: MeterProps) =>
      html`<div class="${className}">
        <div class="uif-meter-header">
          <span class="uif-meter-label">${label}</span>
          <span class="uif-meter-value">${valueText}</span>
        </div>
        <div class="uif-meter-track" role="meter" aria-label="${label}">
          <span class="uif-meter-fill" style="inline-size: ${valuePercent};"></span>
        </div>
      </div>`,
  },
);
