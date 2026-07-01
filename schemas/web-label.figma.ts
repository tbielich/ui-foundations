import figma, { html } from "@figma/code-connect/html";
import { LabelProps } from "./web-label";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2026-810&m=dev",
  {
    props: {
      className: figma.className([
        "label-content",
        figma.boolean("Has Text", { true: undefined, false: "is-icon-only" }),
      ]),
      text: figma.string("Text"),
    },
    example: ({ className, text }: LabelProps) => html`<span style="line-height: 24px;">
      <span class="${className}">
        <span class="label-content-text">${text}</span>
      </span>
    </span>`,
  },
);
