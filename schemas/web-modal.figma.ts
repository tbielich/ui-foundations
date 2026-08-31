import figma, { html } from "@figma/code-connect/html";
import { ModalProps } from "./web-modal";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=3120-110&m=dev",
  {
    props: {
      variant: figma.enum("Variant", {
        confirmation: "confirmation",
        alert: "alert",
      }),
      size: figma.enum("Size", {
        s: "s",
        m: "m",
        l: "l",
      }),
      dismissible: figma.boolean("Dismissible"),
      title: figma.string("Title"),
      description: figma.string("Description"),
    },
    example: ({ variant, size, dismissible, title, description }: ModalProps) =>
      html`<div class="uif-modal-root is-open">
  ${dismissible
    ? html`<button class="uif-modal-overlay" type="button" aria-label="Dismiss dialog"></button>`
    : html`<span class="uif-modal-overlay" aria-hidden="true"></span>`}
  <section class="uif-modal ${variant} ${size === "s" ? "sm" : size === "l" ? "lg" : "md"}" role="dialog" aria-modal="true" aria-labelledby="figma-modal-title" aria-describedby="figma-modal-description">
    <header class="uif-modal-header">
      <h2 class="uif-modal-title" id="figma-modal-title">${title}</h2>
      ${dismissible ? html`<button class="uif-modal-close" type="button" aria-label="Close dialog">×</button>` : ""}
    </header>
    <div class="uif-modal-body">
      <p class="uif-modal-description" id="figma-modal-description">${description}</p>
    </div>
    <footer class="uif-modal-actions">
      ${dismissible ? html`<button class="uif-button outline" type="button">Cancel</button>` : ""}
      <button class="uif-button solid" type="button">Confirm</button>
    </footer>
  </section>
</div>`,
  },
);
