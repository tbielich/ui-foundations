import figma, { html } from "@figma/code-connect/html";
import { DropzoneProps } from "./web-dropzone";

figma.connect(
  "https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations?node-id=3500-100&m=dev",
  {
    props: {
      className: figma.className([
        "uif-dropzone",
        figma.enum("State", {
          Default: undefined,
          Dragover: "is-dragover",
          Filled: "is-filled",
        }),
        figma.boolean("Disabled", { true: "is-disabled", false: undefined }),
      ]),
      accept: figma.string("Accept"),
      multiple: figma.boolean("Multiple"),
      disabled: figma.boolean("Disabled"),
      label: figma.string("Label"),
      hint: figma.string("Hint"),
      buttonLabel: figma.string("Button"),
      filesText: figma.string("Files"),
    },
    example: ({ className, accept, multiple, disabled, label, hint, buttonLabel, filesText }: DropzoneProps) => html`<div
      class="${className}"
      role="group"
      aria-label="File upload drop zone"
    >
      <input
        class="uif-dropzone-input"
        type="file"
        accept="${accept}"
        multiple="${multiple}"
        disabled="${disabled}"
      />
      <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/upload.svg');" aria-hidden="true"></span>
      <span class="uif-dropzone-label">${label}</span>
      <span class="uif-dropzone-hint">${hint}</span>
      <button class="uif-button outline uif-dropzone-button" type="button" disabled="${disabled}">
        ${buttonLabel}
      </button>
      <span class="uif-dropzone-files" aria-live="polite">${filesText}</span>
    </div>`,
  },
);
