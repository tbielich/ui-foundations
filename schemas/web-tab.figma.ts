import figma, { html } from "@figma/code-connect/html";
import { TabProps } from "./web-tab";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2535-286&m=dev",
  {
    props: {
      className: figma.className([
        "tab",
      ]),
      selected: figma.enum("Selected", {
        True: "true",
        False: "false",
        true: "true",
        false: "false",
      }),
      label: figma.string("Label"),
    },
    example: ({ className, selected, label }: TabProps) =>
      html`<button class="${className}" role="tab" type="button" aria-selected="${selected}">${label}</button>`,
  },
);
