import figma, { html } from "@figma/code-connect/html";
import { TagProps } from "./web-tag";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=tag-component&m=dev",
  {
    props: {
      className: figma.className([
        "uif-tag",
        figma.enum("Size", {
          Md: undefined,
          Sm: "sm",
        }),
      ]),
      text: figma.string("Label"),
      removable: figma.boolean("Removable"),
    },
    example: ({ className, text, removable }: TagProps) =>
      html`<span class="${className}"><span class="uif-tag-text">${text}</span>${removable ? html`<button type="button" class="uif-tag-remove" aria-label="Remove"><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/cross.svg')" aria-hidden="true"></span></button>` : ""}</span>`,
  },
);
