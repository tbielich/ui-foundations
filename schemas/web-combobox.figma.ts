import figma, { html } from "@figma/code-connect/html";
import { ComboBoxProps } from "./web-combobox";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2035-317&m=dev",
  {
    props: {
      className: figma.className([
        "uif-combobox",
        figma.enum("State", {
          Default: undefined,
          Hover: "is-hover",
          Active: "is-active",
          Focus: "is-focus-visible",
        }),
        figma.boolean("Disabled", { true: "is-disabled", false: undefined }),
      ]),
      disabled: figma.boolean("Disabled"),
      placeholder: figma.string("Placeholder"),
      value: figma.string("Value"),
    },
    example: ({ className, disabled, placeholder, value }: ComboBoxProps) => html`<div class="${className}">
  <div class="uif-combobox-field">
    <input
      class="uif-combobox-input"
      type="text"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded="false"
      placeholder="${placeholder}"
      value="${value}"
      disabled="${disabled}"
    />
    <span class="uif-combobox-control">
      <span class="uif-icon" aria-hidden="true"></span>
    </span>
  </div>
  <div class="uif-combobox-listbox" role="listbox" hidden>
    <button class="uif-combobox-option" role="option" aria-selected="false">Option 1</button>
    <button class="uif-combobox-option" role="option" aria-selected="false">Option 2</button>
  </div>
</div>`,
  },
);
