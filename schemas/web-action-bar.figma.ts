import figma, { html } from "@figma/code-connect/html";
import { ActionBarProps } from "./web-action-bar";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=action-bar&m=dev",
  {
    props: {
      className: figma.className([
        "uif-action-bar",
        figma.boolean("Open", {
          true: "is-open",
          false: undefined,
        }),
      ]),
      count: figma.string("Count"),
    },
    example: ({ className, count }: ActionBarProps) =>
      html`<div class="${className}" role="toolbar" aria-label="Bulk actions">
  <span class="uif-action-bar-count">${count} items selected</span>
  <div class="uif-action-bar-actions">
    <!-- action buttons -->
  </div>
  <span class="uif-action-bar-spacer" aria-hidden="true"></span>
  <button type="button" class="uif-action-bar-dismiss" aria-label="Dismiss"></button>
</div>`,
  },
);
