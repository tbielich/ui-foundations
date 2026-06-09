import figma, { html } from "@figma/code-connect/html";
import { LinkProps } from "./web-link";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=TODO&m=dev",
  {
    props: {
      className: figma.className([
        "link",
        figma.enum("State", {
          Default: undefined,
          Hover: "is-hover",
          Active: "is-active",
          Visited: "is-visited",
          Disabled: "is-disabled",
        }),
      ]),
      text: figma.string("Text"),
      href: figma.string("URL"),
    },
    example: ({ className, text, href }: LinkProps) =>
      html`<a class="${className}" href="${href}">${text}</a>`,
  },
);
