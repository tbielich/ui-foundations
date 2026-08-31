import figma, { html } from "@figma/code-connect/html";
import { IllustratedMessageProps } from "./web-illustrated-message";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=0-1&m=dev",
  {
    props: {
      preset: figma.enum("Preset", {
        Empty: "empty",
        Error: "error",
        "No results": "no-results",
      }),
      heading: figma.string("Heading"),
      description: figma.string("Description"),
      actionLabel: figma.string("Action label"),
      actionHref: figma.string("Action href"),
      actionVariant: figma.enum("Action variant", {
        Solid: "solid",
        Outline: "outline",
        Ghost: "ghost",
      }),
      illustrationIcon: figma.string("Illustration icon"),
    },
    example: ({
      preset,
      heading,
      description,
      actionLabel,
      actionHref,
      actionVariant,
      illustrationIcon,
    }: IllustratedMessageProps) =>
      html`<div class="uif-illustrated-message" data-preset="${preset || "empty"}"><div class="uif-illustrated-message-illustration" aria-hidden="true"><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/${illustrationIcon || "message-info"}.svg');" aria-hidden="true"></span></div><div class="uif-illustrated-message-content"><h2 class="uif-illustrated-message-heading">${heading || "Nothing here yet"}</h2><p class="uif-illustrated-message-description">${description || "Add content or create a new item to get started."}</p></div>${actionLabel && html`<div class="uif-illustrated-message-actions">${actionHref ? html`<a class="uif-button ${actionVariant || "solid"}" href="${actionHref}">${actionLabel}</a>` : html`<button class="uif-button ${actionVariant || "solid"}" type="button">${actionLabel}</button>`}</div>`}</div>`,
  },
);
