import figma, { html } from "@figma/code-connect/html";
import { ButtonGroupProps } from "./web-button-group";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2075-349&m=dev",
  {
    props: {
      orientation: figma.enum("Orientation", {
        Horizontal: "horizontal",
        Vertical: "vertical",
      }),
      attached: figma.boolean("Attached", { true: "true", false: "false" }),
    },
    example: ({ orientation, attached }: ButtonGroupProps) => html`<div
      class="button-group"
      role="group"
      data-orientation="${orientation}"
      data-attached="${attached}"
      data-justify="start"
      aria-label="Button group"
    >
      <button type="button" class="button outline">
        Day 1
      </button>
      <button type="button" class="button outline">
        Day 2
      </button>
      <button type="button" class="button outline">
        Day 3
      </button>
    </div>`,
  },
);
