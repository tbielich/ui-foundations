import { UIElement, define } from "./base.js";

class UIDropzone extends UIElement {
  static get observedAttributes() {
    return ["label", "hint", "button-label", "accept", "multiple", "disabled", "filled", "files-text", "name"];
  }

  render() {
    const label = this.getAttr("label", "Drag and drop files here");
    const hint = this.getAttr("hint", "or");
    const buttonLabel = this.getAttr("button-label", "Choose files");
    const accept = this.getAttr("accept");
    const multiple = this.getBool("multiple");
    const disabled = this.getBool("disabled");
    const filled = this.getBool("filled");
    const name = this.getAttr("name", "files");
    const filesText = this.getAttr("files-text", filled ? "Files selected" : "No files selected");

    const classes = ["uif-dropzone"];
    if (disabled) classes.push("is-disabled");
    if (filled) classes.push("is-filled");

    const inputAttrs = ['class="uif-dropzone-input"', 'type="file"'];
    if (accept) inputAttrs.push(`accept="${accept}"`);
    if (multiple) inputAttrs.push("multiple");
    if (disabled) inputAttrs.push("disabled");
    if (name) inputAttrs.push(`name="${name}"`);

    this.innerHTML = `<div class="${classes.join(" ")}" role="group" aria-label="File upload drop zone">
  <input ${inputAttrs.join(" ")} />
  <span class="uif-icon" style="--uif-icon-src: url('/assets/icons/upload.svg');" aria-hidden="true"></span>
  <span class="uif-dropzone-label">${label}</span>
  <span class="uif-dropzone-hint">${hint}</span>
  <button class="uif-button outline uif-dropzone-button" type="button"${disabled ? " disabled" : ""}>${buttonLabel}</button>
  <span class="uif-dropzone-files" aria-live="polite">${filesText}</span>
</div>`;

    if (disabled) return;

    const root = this.querySelector(".uif-dropzone");
    const input = this.querySelector(".uif-dropzone-input");
    const button = this.querySelector(".uif-dropzone-button");

    if (button && input) {
      button.addEventListener("click", () => input.click());
    }

    if (root) {
      const setDragover = (event) => {
        event.preventDefault();
        root.classList.add("is-dragover");
      };
      const clearDragover = (event) => {
        event.preventDefault();
        root.classList.remove("is-dragover");
      };

      root.addEventListener("dragenter", setDragover);
      root.addEventListener("dragover", setDragover);
      root.addEventListener("dragleave", clearDragover);
      root.addEventListener("drop", (event) => {
        clearDragover(event);
        const count = event.dataTransfer?.files?.length ?? 0;
        if (count > 0) {
          this.setAttribute("files-text", count === 1 ? event.dataTransfer.files[0].name : `${count} files selected`);
          this.setAttribute("filled", "");
        }
      });
    }

    if (input) {
      input.addEventListener("change", () => {
        const count = input.files?.length ?? 0;
        if (count > 0) {
          this.setAttribute("files-text", count === 1 ? input.files[0].name : `${count} files selected`);
          this.setAttribute("filled", "");
        } else {
          this.setAttribute("files-text", "No files selected");
          this.removeAttribute("filled");
        }
      });
    }
  }
}

define("uif-dropzone", UIDropzone);
export { UIDropzone };
