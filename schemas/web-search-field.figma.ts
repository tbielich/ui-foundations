import figma, { html } from "@figma/code-connect/html";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2035-317&m=dev",
  {
    props: {
      className: figma.className([
        "uif-search-field",
        figma.enum("State", {
          Default: undefined,
          Hover: "is-hover",
          Active: "is-active",
          Focus: "is-focus-visible",
          Readonly: "is-readonly",
        }),
        figma.boolean("Disabled", { true: "is-disabled", false: undefined }),
        figma.boolean("Quiet", { true: "is-quiet", false: undefined }),
      ]),
      disabled: figma.boolean("Disabled"),
      quiet: figma.boolean("Quiet"),
      placeholder: figma.string("Placeholder"),
      value: figma.string("Value"),
      readonly: figma.enum("State", {
        Default: undefined,
        Hover: undefined,
        Active: undefined,
        Focus: undefined,
        Readonly: "true",
      }),
    },
    example: ({ className, disabled, quiet, placeholder, value, readonly }) => html`<div
      class="${className}"
      ${quiet ? 'data-variant="quiet"' : ""}
    >
      <span class="uif-search-field-control" data-slot="start">
        <span
          class="uif-icon"
          data-slot="start"
          style="--uif-icon-src: url('/assets/icons/search.svg');"
          aria-hidden="true"
        ></span>
      </span>
      <input
        class="uif-search-field-input"
        type="search"
        placeholder="${placeholder}"
        value="${value}"
        ${readonly ? "readonly" : ""}
        ${disabled ? "disabled" : ""}
      />
      <span class="uif-search-field-control" data-slot="end">
        <button type="button" aria-label="Clear search" tabindex="-1">
          <span
            class="uif-icon"
            style="--uif-icon-src: url('/assets/icons/cross-circled.svg');"
            aria-hidden="true"
          ></span>
        </button>
      </span>
    </div>`,
  },
);
