import { UIElement, define } from "./base.js";

/**
 * <ui-form borderless>
 *   <ui-form-group title="Personal">...</ui-form-group>
 *   <ui-form-actions>...</ui-form-actions>
 * </ui-form>
 */
class UIForm extends UIElement {
  static get observedAttributes() {
    return ["borderless"];
  }

  render() {
    const borderless = this.getBool("borderless");
    const children = this.innerHTML;

    const classes = ["form"];
    if (borderless) classes.push("borderless");

    this.innerHTML = `<form class="${classes.join(" ")}" novalidate>${children}</form>`;
  }
}

define("ui-form", UIForm);
export { UIForm };

/**
 * <ui-form-group title="Contact Info">...</ui-form-group>
 */
class UIFormGroup extends UIElement {
  static get observedAttributes() {
    return ["title"];
  }

  render() {
    const title = this.getAttr("title");
    const children = this.innerHTML;

    const legend = title ? `<legend class="form-group__title">${title}</legend>` : "";
    this.innerHTML = `<fieldset class="form-group">${legend}${children}</fieldset>`;
  }
}

define("ui-form-group", UIFormGroup);
export { UIFormGroup };

/**
 * <ui-form-field label-position="side" invalid>...</ui-form-field>
 */
class UIFormField extends UIElement {
  static get observedAttributes() {
    return ["label-position", "invalid"];
  }

  render() {
    const labelPosition = this.getAttr("label-position", "top");
    const invalid = this.getBool("invalid");
    const children = this.innerHTML;

    const classes = ["form-field"];
    if (invalid) classes.push("is-invalid");

    const attrs = [`class="${classes.join(" ")}"`];
    if (labelPosition === "side") attrs.push('data-label-position="side"');

    this.innerHTML = `<div ${attrs.join(" ")}>${children}</div>`;
  }
}

define("ui-form-field", UIFormField);
export { UIFormField };

/**
 * <ui-form-helper>Must be at least 8 characters</ui-form-helper>
 */
class UIFormHelper extends UIElement {
  render() {
    const text = this.textContent.trim();
    this.innerHTML = `<p class="form-field__helper">${text}</p>`;
  }
}

define("ui-form-helper", UIFormHelper);
export { UIFormHelper };

/**
 * <ui-form-actions align="end">...</ui-form-actions>
 */
class UIFormActions extends UIElement {
  static get observedAttributes() {
    return ["align"];
  }

  render() {
    const align = this.getAttr("align", "end");
    const children = this.innerHTML;

    const attrs = ['class="form-actions"'];
    if (align !== "end") attrs.push(`data-align="${align}"`);

    this.innerHTML = `<div ${attrs.join(" ")}>${children}</div>`;
  }
}

define("ui-form-actions", UIFormActions);
export { UIFormActions };
