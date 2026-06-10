import figma, { html } from "@figma/code-connect/html";
import { LinkProps } from "./web-link";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2797-399&m=dev",
  {
    props: {
      className: figma.className([
        "link",
        figma.enum("State", {
          Default: undefined,
          Hover: "is-hover",
          Active: "is-active",
          Visited: "is-visited",
        }),
        figma.enum("Disabled", {
          True: "is-disabled",
          true: "is-disabled",
          False: undefined,
          false: undefined,
        }),
      ]),
      text: figma.string("Text"),
      href: figma.string("URL"),
      startIcon: figma.boolean("Start Icon"),
      endIcon: figma.boolean("End Icon"),
    },
    example: ({ className, text, href, startIcon, endIcon }: LinkProps) =>
      html`<a class="${className}" href="${href}">${startIcon && html`<span class="icon" data-slot="start" aria-hidden="true"></span>`}${text}${endIcon && html`<span class="icon" data-slot="end" aria-hidden="true"></span>`}</a>`,
  },
);
