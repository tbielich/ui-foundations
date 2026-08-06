import figma, { html } from "@figma/code-connect/html";
import { NotificationProps } from "./web-notification";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=1-1&m=dev",
  {
    props: {
      className: figma.className([
        "uif-notification",
        figma.enum("Variant", {
          Info: "info",
          Success: "success",
          Warning: "warning",
          Error: "error",
        }),
      ]),
      role: figma.enum("Variant", {
        Info: "status",
        Success: "status",
        Warning: "status",
        Error: "alert",
      }),
      ariaLive: figma.enum("Variant", {
        Info: "polite",
        Success: "polite",
        Warning: "polite",
        Error: "assertive",
      }),
      message: figma.string("Message"),
      actionLabel: figma.string("Action Label"),
      actionHref: figma.string("Action Href"),
      dismissible: figma.boolean("Dismissible"),
    },
    example: ({
      className,
      role,
      ariaLive,
      message,
      actionLabel,
      actionHref,
      dismissible,
    }: NotificationProps) => html`<div class="${className}" role="${role}" aria-live="${ariaLive}">
      <span class="uif-notification-icon" aria-hidden="true"></span>
      <div class="uif-notification-content">
        <p class="uif-notification-message">${message}</p>
        ${actionLabel
          ? html`<a class="uif-notification-action" href="${actionHref}">${actionLabel}</a>`
          : ""}
      </div>
      ${dismissible
        ? html`<button type="button" class="uif-notification-dismiss" aria-label="Dismiss notification">×</button>`
        : ""}
    </div>`,
  },
);
