import figma, { html } from "@figma/code-connect/html";
import { InputProps } from "./web-input";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2035-317&m=dev",
  {
    props: {
      className: figma.className([
        "input",
        figma.enum("State", {
          Default: undefined,
          Hover: "is-hover",
          Active: "is-active",
          Readonly: undefined,
          Placeholder: undefined,
        }),
        figma.boolean("Disabled", { true: "is-disabled", false: undefined }),
      ]),
      disabled: figma.boolean("Disabled"),
      type: figma.enum("Type", {
        Text: "text",
      }),
      readonlyAttr: figma.enum("State", {
        Default: undefined,
        Hover: undefined,
        Active: undefined,
        Readonly: "true",
        Placeholder: undefined,
      }),
      placeholder: figma.enum("State", {
        Default: "Enter value",
        Hover: "Enter value",
        Active: "Enter value",
        Readonly: undefined,
        Placeholder: "Placeholder",
      }),
      value: figma.enum("State", {
        Default: "",
        Hover: "",
        Active: "",
        Readonly: "Read only",
        Placeholder: "",
      }),
    },
    example: ({ className, disabled, type, readonlyAttr, placeholder, value }: InputProps) => html`<input
      class="${className}"
      type="${type}"
      placeholder="${placeholder}"
      value="${value}"
      readonly="${readonlyAttr}"
      disabled="${disabled}"
    />`,
  },
);
