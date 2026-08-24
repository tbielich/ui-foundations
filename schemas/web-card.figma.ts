import figma, { html } from "@figma/code-connect/html";
import { CardProps } from "./web-card";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=9001-1",
  {
    props: {
      className: figma.className([
        "uif-card",
        figma.enum("Layout", {
          Vertical: undefined,
          Horizontal: "horizontal",
        }),
        figma.enum("Interactive", {
          True: "interactive",
          False: undefined,
        }),
        figma.enum("State", {
          Default: undefined,
          Selected: "is-selected",
        }),
      ]),
      layout: figma.enum("Layout", {
        Vertical: "vertical",
        Horizontal: "horizontal",
      }),
      interactive: figma.enum("Interactive", {
        True: true,
        False: false,
      }),
      selected: figma.enum("State", {
        Default: false,
        Selected: true,
      }),
    },
    example: ({ className }: CardProps) =>
      html`<article class="${className}">
  <div class="uif-card-header"><strong>Card title</strong></div>
  <div class="uif-card-body"><p>Card description.</p></div>
  <div class="uif-card-footer"><!-- actions --></div>
</article>`,
  },
);
