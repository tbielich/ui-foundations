import figma, { html } from "@figma/code-connect/html";
import { ButtonProps } from "./web-button";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=1-83&m=dev",
  {
    props: {
      className: figma.className([
        "uif-button",
        figma.enum("Variant", {
          Solid: "solid",
          Outline: "outline",
          Ghost: "ghost",
        }),
        figma.enum("State", {
          Default: undefined,
          Hover: "is-hover",
          Active: "is-active",
        }),
        figma.enum("Icon Only", {
          False: undefined,
          True: "icon-only",
          false: undefined,
          true: "icon-only",
        }),
      ]),
      disabled: figma.boolean("Disabled"),
      text: figma.string("Label"),
      ariaLabel: figma.enum("Icon Only", {
        False: undefined,
        True: "Button",
        false: undefined,
        true: "Button",
      }),
    },
    example: ({ className, disabled, text, ariaLabel }: ButtonProps) => html`<button
      type="button"
      class="${className}"
      disabled="${disabled}"
      aria-label="${ariaLabel}"
    >
      <span class="uif-label-content">
        <span class="uif-label-content-text">${text}</span>
      </span>
    </button>`,
  },
);
