import figma, { html } from "@figma/code-connect/html";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2035-317&m=dev",
  {
    props: {
      wrapperClassName: figma.className([
        "input-field",
        figma.enum("State", {
          Default: undefined,
          Hover: "is-hover",
          Active: "is-active",
          Readonly: undefined,
        }),
        figma.boolean("Disabled", { true: "is-disabled", false: undefined }),
      ]),
      disabled: figma.boolean("Disabled"),
      type: figma.enum("Type", {
        Text: "text",
        Number: "number",
        Password: "password",
      }),
      readonlyAttr: figma.enum("State", {
        Default: undefined,
        Hover: undefined,
        Active: undefined,
        Readonly: "true",
      }),
      placeholder: figma.string("Placeholder"),
    },
    example: ({ wrapperClassName, disabled, type, readonlyAttr, placeholder }) => html`<div class="${wrapperClassName}">
  <input
    class="input"
    type="${type}"
    placeholder="${placeholder}"
    readonly="${readonlyAttr}"
    disabled="${disabled}"
  />
  <span class="input-field-control">
    <!-- Control buttons rendered by type -->
  </span>
</div>`,
  },
);
