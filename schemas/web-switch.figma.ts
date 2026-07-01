import figma, { html } from "@figma/code-connect/html";
import { SwitchProps, SwitchFieldProps } from "./web-switch";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2588-385&m=dev",
  {
    props: {
      className: figma.className([
        "switch",
        figma.enum("Checked", {
          Unchecked: undefined,
          Checked: "is-checked",
        }),
        figma.enum("State", {
          Default: undefined,
          Hover: "is-hover",
        }),
        figma.boolean("Disabled", { true: "is-disabled", false: undefined }),
      ]),
      checked: figma.enum("Checked", {
        Unchecked: "false",
        Checked: "true",
      }),
      disabled: figma.boolean("Disabled"),
      ariaChecked: figma.enum("Checked", {
        Unchecked: "false",
        Checked: "true",
      }),
      ariaLabel: figma.enum("Checked", {
        Unchecked: "Switch",
        Checked: "Switch",
      }),
    },
    example: ({ className, checked, disabled, ariaChecked, ariaLabel }: SwitchProps) => html`<input
      type="checkbox"
      role="switch"
      class="${className}"
      checked="${checked}"
      disabled="${disabled}"
      aria-checked="${ariaChecked}"
      aria-label="${ariaLabel}"
    />`,
  },
);

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2589-276&m=dev",
  {
    props: {
      wrapperClassName: figma.className([
        "switch-field",
        figma.boolean("Is Disabled", { true: "is-disabled", false: undefined }),
      ]),
      className: figma.className([
        "switch",
        figma.boolean("Is Disabled", { true: "is-disabled", false: undefined }),
        "is-checked",
      ]),
      checked: figma.enum("Is Disabled", {
        False: "true",
        True: "true",
        false: "true",
        true: "true",
      }),
      disabled: figma.boolean("Is Disabled"),
      text: figma.string("Text"),
    },
    example: ({ wrapperClassName, className, checked, disabled, text }: SwitchFieldProps) => html`<label
      class="${wrapperClassName}"
    >
      <input
        type="checkbox"
        role="switch"
        class="${className}"
        checked="${checked}"
        disabled="${disabled}"
      />
      <span class="switch-field-text">${text}</span>
    </label>`,
  },
);
