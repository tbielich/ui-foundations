import figma, { html } from "@figma/code-connect/html";
import { PopoverProps } from "./web-popover";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=popover&m=dev",
  {
    props: {
      placement: figma.enum("Placement", {
        top: "top",
        bottom: "bottom",
        left: "left",
        right: "right",
      }),
      arrow: figma.boolean("Arrow"),
      content: figma.string("Content"),
    },
    example: ({ placement, arrow, content }: PopoverProps) =>
      html`<span class="uif-popover-container">
  <button class="uif-button outline" type="button">Open</button>
  <div class="uif-popover" role="dialog" aria-modal="false" data-placement="${placement}"${arrow ? ` data-arrow` : ``}>
    ${arrow ? `<span class="uif-popover-arrow" aria-hidden="true"></span>` : ``}
    <div class="uif-popover-content">${content}</div>
  </div>
</span>`,
  },
);
