import figma, { html } from "@figma/code-connect/html";

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
      selected: figma.boolean("Selected"),
    },
    example: ({ className, label, selected }: { className: string; label: string; selected: boolean }) =>
      html`<button class="${className}" type="button" aria-pressed="${selected}">${label}</button>`,
  },
);
