import figma, { html } from "@figma/code-connect/html";
import { IconProps } from "./web-icon";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2016-293&m=dev",
  {
    props: {
      name: figma.enum("Name", {
        none: "search",
        search: "search",
        menu: "menu",
        plus: "plus",
      }),
    },
    example: ({ name }: IconProps) => html`<span
      class="icon"
      style="--icon-src: url('/assets/icons/${name}.svg')"
      aria-hidden="true"
    ></span>`,
  },
);
