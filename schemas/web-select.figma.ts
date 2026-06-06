import figma, { html } from "@figma/code-connect/html";
import { SelectProps } from "./web-select";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=TODO&m=dev",
  {
    props: {
      className: figma.className([
        "select",
        figma.enum("State", {
          Default: undefined,
          Hover: "is-hover",
          Active: "is-active",
          Placeholder: "is-placeholder",
        }),
        figma.enum("Disabled", {
          False: undefined,
          True: "is-disabled",
          false: undefined,
          true: "is-disabled",
        }),
      ]),
      disabled: figma.boolean("Disabled"),
      placeholder: figma.enum("State", {
        Default: undefined,
        Hover: undefined,
        Active: undefined,
        Placeholder: "Choose an option",
      }),
    },
    example: ({ className, disabled, placeholder }: SelectProps) => html`<select
      class="${className}"
      disabled="${disabled}"
    >
      <option value="" disabled selected>${placeholder}</option>
      <option value="opt1">Option 1</option>
      <option value="opt2">Option 2</option>
    </select>`,
  },
);
