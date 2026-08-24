import figma, { html } from "@figma/code-connect/html";
import { StatusLightProps } from "./web-status-light";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2385-709&m=dev",
  {
    props: {
      className: figma.className([
        "uif-status-light",
        figma.enum("Variant", {
          Neutral: undefined,
          Positive: "positive",
          Negative: "negative",
          Notice: "notice",
          Info: "info",
        }),
        figma.enum("Size", {
          Md: undefined,
          Sm: "sm",
        }),
      ]),
      text: figma.string("Text"),
    },
    example: ({ className, text }: StatusLightProps) =>
      html`<span class="${className}"><span class="uif-status-light-indicator" aria-hidden="true"></span><span class="uif-status-light-text">${text}</span></span>`,
  },
);
