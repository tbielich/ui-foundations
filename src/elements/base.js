/**
 * UIElement — Base class for all UI Foundations custom elements.
 *
 * Light DOM only. No shadow DOM. Renders semantic HTML that the
 * existing CSS patterns style directly via class names.
 */
export class UIElement extends HTMLElement {
  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    this._initialized = false;
  }

  connectedCallback() {
    if (!this._initialized) {
      this._initialized = true;
      this.render();
    }
  }

  attributeChangedCallback() {
    if (this._initialized) {
      this.render();
    }
  }

  /** Override in subclasses to produce inner HTML. */
  render() {}

  /** Read a boolean attribute (present = true). */
  getBool(name) {
    return this.hasAttribute(name);
  }

  /** Read a string attribute with a default. */
  getAttr(name, fallback = "") {
    return this.getAttribute(name) ?? fallback;
  }

  /** Warn in dev when accessibility requirements are not met. */
  warnDev(message) {
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV === "production"
    ) {
      return;
    }
    console.warn(message);
  }
}

/**
 * Safe define — only registers if not already defined.
 */
export function define(tagName, elementClass) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, elementClass);
  }
}
