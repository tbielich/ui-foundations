import figma, { html } from "@figma/code-connect/html";
import { RadioProps, RadioFieldProps } from "./web-radio";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2329-241&m=dev",
  {
    props: {
      className: figma.className([
        "radio",
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
      ariaLabel: figma.enum("Checked", {
        Unchecked: "Radio",
        Checked: "Radio",
      }),
    },
    example: ({ className, checked, disabled, ariaLabel }: RadioProps) => html`<input
      type="radio"
      class="${className}"
      checked="${checked}"
      disabled="${disabled}"
      aria-label="${ariaLabel}"
    />`,
  },
);

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2329-250&m=dev",
  {
    props: {
      wrapperClassName: figma.className([
        "radio-field",
        figma.boolean("Is Disabled", { true: "is-disabled", false: undefined }),
      ]),
      className: figma.className([
        "radio",
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
    example: ({ wrapperClassName, className, checked, disabled, text }: RadioFieldProps) => html`<label
      class="${wrapperClassName}"
    >
      <input
        type="radio"
        class="${className}"
        checked="${checked}"
        disabled="${disabled}"
      />
      <span class="radio-field__text">${text}</span>
    </label>`,
  },
);
