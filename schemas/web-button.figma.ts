import figma, { html } from "@figma/code-connect/html";
import { ButtonProps } from "./web-button";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=1-83&m=dev",
  {
    props: {
      className: figma.className([
        "button",
        figma.enum("Variant", {
          Solid: undefined,
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
          True: "button--icon-only",
          false: undefined,
          true: "button--icon-only",
        }),
      ]),
      disabled: figma.boolean("Disabled"),
      text: figma.enum("Icon Only", {
        False: "Book now",
        True: "",
        false: "Book now",
        true: "",
      }),
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
      <span class="label-content">
        <span class="label-content__text">${text}</span>
      </span>
    </button>`,
  },
);