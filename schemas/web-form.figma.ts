import figma, { html } from "@figma/code-connect/html";
import { FormProps } from "./web-form";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2070-474&m=dev",
  {
    props: {
      state: figma.enum("State", {
        Default: "default",
        Invalid: "invalid",
        Valid: "valid",
      }),
      helperText: figma.enum("State", {
        Default: "Helper text",
        Invalid: "Please enter a valid value",
        Valid: "Looks good",
      }),
    },
    example: ({ state, helperText }: FormProps) => html`<div
      class="form__field"
      data-state="${state}"
    >
      <label class="field-label" for="form-field-input" style="line-height: 24px;">
        <span class="label-content">
          <span class="label-content__text">Field label</span>
        </span>
      </label>
      <input
        class="input"
        id="form-field-input"
        type="text"
        placeholder="Enter value"
      />
      <p class="form__helper">
        ${helperText}
      </p>
    </div>`,
  },
);
