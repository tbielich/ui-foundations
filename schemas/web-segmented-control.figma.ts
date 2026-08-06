import figma, { html } from "@figma/code-connect/html";
import { SegmentedControlItemProps } from "./web-segmented-control";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=9100-1",
  {
    props: {
      className: figma.className([
        "uif-segmented-control-item",
        figma.enum("State", {
          Selected: "is-active",
          Disabled: "is-disabled",
        }),
      ]),
      label: figma.string("Label"),
    },
    example: ({ className, label }: SegmentedControlItemProps) =>
      html`<button class="${className}" type="button" aria-pressed="false">${label}</button>`,
  },
);
