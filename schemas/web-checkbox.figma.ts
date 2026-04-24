import figma, { html } from "@figma/code-connect/html";
import { CheckboxProps, CheckboxFieldProps } from "./web-checkbox";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2142-524&m=dev",
  {
    props: {
      className: figma.className([
        "checkbox",
        figma.enum("Checked", {
          Unchecked: undefined,
          Checked: "is-checked",
          Indeterminate: "is-indeterminate",
        }),
        figma.enum("State", {
          Default: undefined,
          Hover: "is-hover",
        }),
        figma.enum("Disabled", {
          False: undefined,
          True: "is-disabled",
          false: undefined,
          true: "is-disabled",
        }),
      ]),
      checked: figma.enum("Checked", {
        Unchecked: "false",
        Checked: "true",
        Indeterminate: "false",
      }),
      disabled: figma.boolean("Disabled"),
      indeterminate: figma.enum("Checked", {
        Unchecked: undefined,
        Checked: undefined,
        Indeterminate: "true",
      }),
      ariaChecked: figma.enum("Checked", {
        Unchecked: undefined,
        Checked: undefined,
        Indeterminate: "mixed",
      }),
      ariaLabel: figma.enum("Checked", {
        Unchecked: "Checkbox",
        Checked: "Checkbox",
        Indeterminate: "Checkbox",
      }),
    },
    example: ({ className, checked, disabled, indeterminate, ariaChecked, ariaLabel }: CheckboxProps) => html`<input
      type="checkbox"
      class="${className}"
      checked="${checked}"
      disabled="${disabled}"
      aria-checked="${ariaChecked}"
      aria-label="${ariaLabel}"
    />`,
  },
);

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2281-730&m=dev",
  {
    props: {
      wrapperClassName: figma.className([
        "checkbox-field",
        figma.enum("Is Disabled", {
          False: undefined,
          True: "is-disabled",
          false: undefined,
          true: "is-disabled",
        }),
      ]),
      className: figma.className([
        "checkbox",
        figma.enum("State", {
          Default: undefined,
          Hover: "is-hover",
        }),
        figma.enum("Is Disabled", {
          False: undefined,
          True: "is-disabled",
          false: undefined,
          true: "is-disabled",
        }),
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
    example: ({ wrapperClassName, className, checked, disabled, text }: CheckboxFieldProps) => html`<label
      class="${wrapperClassName}"
    >
      <input
        type="checkbox"
        class="${className}"
        checked="${checked}"
        disabled="${disabled}"
      />
      <span class="checkbox-field__text">${text}</span>
    </label>`,
  },
);
