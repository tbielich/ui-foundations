import figma, { html } from "@figma/code-connect/html";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=number-field-placeholder&m=dev",
  {
    props: {
      wrapperClassName: figma.className([
        "uif-input-field",
        "uif-number-field",
        figma.enum("State", {
          Default: undefined,
          Hover: "is-hover",
          Active: "is-active",
          Readonly: undefined,
        }),
        figma.boolean("Disabled", { true: "is-disabled", false: undefined }),
      ]),
      disabled: figma.boolean("Disabled"),
      format: figma.enum("Format", {
        None: "",
        Currency: "currency",
        Percent: "percent",
      }),
      readonlyAttr: figma.enum("State", {
        Default: undefined,
        Hover: undefined,
        Active: undefined,
        Readonly: "true",
      }),
      min: figma.string("Min"),
      max: figma.string("Max"),
      step: figma.string("Step"),
      value: figma.string("Value"),
    },
    example: ({ wrapperClassName, disabled, format, readonlyAttr, min, max, step, value }) => html`<div class="${wrapperClassName}">
  ${format === "currency" ? html`<span class="uif-number-field-prefix" aria-hidden="true">$</span>` : ""}
  <input
    class="uif-input"
    type="number"
    placeholder="0"
    value="${value}"
    min="${min}"
    max="${max}"
    step="${step}"
    readonly="${readonlyAttr}"
    disabled="${disabled}"
  />
  ${format === "percent" ? html`<span class="uif-number-field-suffix" aria-hidden="true">%</span>` : ""}
  <span class="uif-input-field-control">
    <button type="button" aria-label="Decrease value"><!-- minus icon --></button>
    <button type="button" aria-label="Increase value"><!-- plus icon --></button>
  </span>
</div>`,
  },
);
