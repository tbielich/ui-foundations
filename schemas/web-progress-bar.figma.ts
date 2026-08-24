import figma, { html } from "@figma/code-connect/html";
import { ProgressBarProps } from "./web-progress-bar";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=9001-1&m=dev",
  {
    props: {
      className: figma.className([
        "uif-progress-bar",
        figma.enum("Variant", {
          Default: undefined,
          Positive: "positive",
          Negative: "negative",
        }),
        figma.enum("Size", {
          Md: undefined,
          Sm: "sm",
          Lg: "lg",
        }),
      ]),
      value: figma.number("Value"),
    },
    example: ({ className, value }: ProgressBarProps & { className: string }) =>
      html`<div class="${className}" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100">
  <div class="uif-progress-bar-track">
    <div class="uif-progress-bar-fill" style="--_progress: ${value}"></div>
  </div>
</div>`,
  },
);
