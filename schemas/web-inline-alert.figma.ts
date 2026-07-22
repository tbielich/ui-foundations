import figma, { html } from "@figma/code-connect/html";
import { InlineAlertProps } from "./web-inline-alert";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=inline-alert&m=dev",
  {
    props: {
      className: figma.className([
        "uif-inline-alert",
        figma.enum("Variant", {
          Default: undefined,
          Info: "info",
          Positive: "positive",
          Negative: "negative",
          Notice: "notice",
        }),
      ]),
      title: figma.string("Title"),
      description: figma.string("Description"),
      dismissible: figma.boolean("Dismissible"),
      icon: figma.string("Icon"),
    },
    example: ({ className, title, description, dismissible, icon }: InlineAlertProps) =>
      html`<div class="${className}" role="alert">
  <span class="uif-inline-alert-icon">
    <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/${icon}.svg')" aria-hidden="true"></span>
  </span>
  <div class="uif-inline-alert-content">
    <strong class="uif-inline-alert-title">${title}</strong>
    <p class="uif-inline-alert-description">${description}</p>
  </div>${dismissible ? html`
  <button type="button" class="uif-inline-alert-dismiss" aria-label="Dismiss">
    <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/cross.svg')" aria-hidden="true"></span>
  </button>` : ""}
</div>`,
  },
);
