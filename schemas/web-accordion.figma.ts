import figma, { html } from "@figma/code-connect/html";
import { AccordionItemProps } from "./web-accordion";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=2535-283&m=dev",
  {
    props: {
      open: figma.boolean("Open", { true: "open", false: undefined }),
      title: figma.string("Title"),
    },
    example: ({ open, title }: AccordionItemProps) =>
      html`<details class="accordion-item" ${open}>
  <summary>${title}</summary>
  <div class="accordion-item-content">
    <p>Content</p>
  </div>
</details>`,
  },
);
