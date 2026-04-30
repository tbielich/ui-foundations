import figma, { html } from "@figma/code-connect/html";
import { BadgeProps } from "./web-badge";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2385-709&m=dev",
  {
    props: {
      className: figma.className([
        "badge",
        figma.enum("Variant", {
          Default: undefined,
          Brand: "brand",
          Success: "success",
          Danger: "danger",
        }),
        figma.enum("Size", {
          Md: undefined,
          Sm: "sm",
        }),
      ]),
      text: figma.string("Text"),
    },
    example: ({ className, text }: BadgeProps) =>
      html`<span class="${className}"><span class="badge__text">${text}</span></span>`,
  },
);
