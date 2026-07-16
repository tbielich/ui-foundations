import { UIElement, define } from "./base.js";

/**
 * <uif-form borderless>
 *   <uif-form-group title="Personal">...</uif-form-group>
 *   <uif-form-actions>...</uif-form-actions>
 * </uif-form>
 */
class UIForm extends UIElement {
  static get observedAttributes() {
    return ["borderless"];
  }

  render() {
    const borderless = this.getBool("borderless");
    const children = this.innerHTML;

    const classes = ["uif-form"];
    if (borderless) classes.push("borderless");

    this.innerHTML = `<form class="${classes.join(" ")}" novalidate>${children}</form>`;
  }
}

define("uif-form", UIForm);
export { UIForm };

/**
 * <uif-form-group title="Contact Info">...</uif-form-group>
 */
class UIFormGroup extends UIElement {
  static get observedAttributes() {
    return ["title"];
  }

  render() {
    const title = this.getAttr("title");
    const children = this.innerHTML;

    const legend = title ? `<legend class="uif-form-group-title">${title}</legend>` : "";
    this.innerHTML = `<fieldset class="uif-form-group">${legend}${children}</fieldset>`;
  }
}

define("uif-form-group", UIFormGroup);
export { UIFormGroup };

/**
 * <uif-form-field label-position="side" invalid>...</uif-form-field>
 */
class UIFormField extends UIElement {
  static get observedAttributes() {
    return ["label-position", "invalid"];
  }

  render() {
    const labelPosition = this.getAttr("label-position", "top");
    const invalid = this.getBool("invalid");
    const children = this.innerHTML;

    const classes = ["uif-form-field"];
    if (invalid) classes.push("is-invalid");

    const attrs = [`class="${classes.join(" ")}"`];
    if (labelPosition === "side") attrs.push('data-label-position="side"');

    this.innerHTML = `<div ${attrs.join(" ")}>${children}</div>`;
  }
}

define("uif-form-field", UIFormField);
export { UIFormField };

/**
 * <uif-form-helper>Must be at least 8 characters</uif-form-helper>
 */
class UIFormHelper extends UIElement {
  render() {
    const text = this.textContent.trim();
    this.innerHTML = `<p class="uif-form-field-helper">${text}</p>`;
  }
}

define("uif-form-helper", UIFormHelper);
export { UIFormHelper };

/**
 * <uif-form-actions align="end">...</uif-form-actions>
 */
class UIFormActions extends UIElement {
  static get observedAttributes() {
    return ["align"];
  }

  render() {
    const align = this.getAttr("align", "end");
    const children = this.innerHTML;

    const attrs = ['class="uif-form-actions"'];
    if (align !== "end") attrs.push(`data-align="${align}"`);

    this.innerHTML = `<div ${attrs.join(" ")}>${children}</div>`;
  }
}

define("uif-form-actions", UIFormActions);
export { UIFormActions };
