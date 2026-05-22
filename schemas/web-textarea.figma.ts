import figma, { html } from "@figma/code-connect/html";
import { TextAreaProps } from "./web-textarea";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2542-282&m=dev",
  {
    props: {
      className: figma.className([
        "textarea",
        figma.enum("State", {
          Default: undefined,
          Hover: "is-hover",
          Focus: "is-focus-visible",
        }),
        figma.enum("Disabled", {
          True: "is-disabled",
          False: undefined,
          true: "is-disabled",
          false: undefined,
        }),
      ]),
      disabled: figma.boolean("Disabled"),
      placeholder: figma.string("Placeholder"),
    },
    example: ({ className, disabled, placeholder }: TextAreaProps) =>
      html`<textarea class="${className}" placeholder="${placeholder}" disabled="${disabled}"></textarea>`,
  },
);
