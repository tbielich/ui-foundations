import figma, { html } from "@figma/code-connect/html";
import { ProgressCircleProps } from "./web-progress-circle";

figma.connect("https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?m=dev", {
  props: {
    className: figma.className([
      "uif-progress-circle",
      figma.enum("Size", {
        S: "sm",
        M: undefined,
        L: "lg",
      }),
      figma.boolean("Indeterminate", { true: "is-indeterminate", false: undefined }),
    ]),
    ariaLabel: figma.string("Aria Label"),
    indeterminate: figma.boolean("Indeterminate"),
    value: figma.string("Value"),
  },
  example: ({ className, ariaLabel, indeterminate, value }: ProgressCircleProps) =>
    indeterminate
      ? html`<span class="${className}" role="progressbar" aria-label="${ariaLabel}">
          <svg class="uif-progress-circle-svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <circle class="uif-progress-circle-track" cx="16" cy="16" r="14" pathLength="100"></circle>
            <circle class="uif-progress-circle-indicator" cx="16" cy="16" r="14" pathLength="100"></circle>
          </svg>
        </span>`
      : html`<span
          class="${className}"
          role="progressbar"
          aria-label="${ariaLabel}"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${value}"
          style="--_progress-circle-value: ${value};"
        >
          <svg class="uif-progress-circle-svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <circle class="uif-progress-circle-track" cx="16" cy="16" r="14" pathLength="100"></circle>
            <circle class="uif-progress-circle-indicator" cx="16" cy="16" r="14" pathLength="100"></circle>
          </svg>
        </span>`,
});
