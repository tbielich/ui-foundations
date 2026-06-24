/**
 * UI Foundations — Web Components Type Definitions
 */

/** Base class for all UI Foundations custom elements. */
export declare class UIElement extends HTMLElement {
  static get observedAttributes(): string[];
  render(): void;
  getBool(name: string): boolean;
  getAttr(name: string, fallback?: string): string;
  warnDev(message: string): void;
}

export declare function define(tagName: string, elementClass: CustomElementConstructor): void;

// --- Elements ---

export declare class UIIcon extends UIElement {}
export declare class UIButton extends UIElement {}
export declare class UIButtonGroup extends UIElement {}
export declare class UIInput extends UIElement {}
export declare class UICheckbox extends UIElement {}
export declare class UIRadio extends UIElement {}
export declare class UISwitch extends UIElement {}
export declare class UIBadge extends UIElement {}
export declare class UIDivider extends UIElement {}
export declare class UITextarea extends UIElement {}
export declare class UIAvatar extends UIElement {}
export declare class UIAccordion extends UIElement {}
export declare class UIAccordionItem extends UIElement {}
export declare class UITabList extends UIElement {}
export declare class UITab extends UIElement {}
export declare class UITabPanel extends UIElement {}
export declare class UITooltip extends UIElement {}
export declare class UISelect extends UIElement {}
export declare class UILink extends UIElement {}
export declare class UIFieldLabel extends UIElement {}
export declare class UIForm extends UIElement {}
export declare class UIFormGroup extends UIElement {}
export declare class UIFormField extends UIElement {}
export declare class UIFormHelper extends UIElement {}
export declare class UIFormActions extends UIElement {}

// --- Custom Element Tag Name Map ---

declare global {
  interface HTMLElementTagNameMap {
    "ui-icon": UIIcon;
    "ui-button": UIButton;
    "ui-button-group": UIButtonGroup;
    "ui-input": UIInput;
    "ui-checkbox": UICheckbox;
    "ui-radio": UIRadio;
    "ui-switch": UISwitch;
    "ui-badge": UIBadge;
    "ui-divider": UIDivider;
    "ui-textarea": UITextarea;
    "ui-avatar": UIAvatar;
    "ui-accordion": UIAccordion;
    "ui-accordion-item": UIAccordionItem;
    "ui-tab-list": UITabList;
    "ui-tab": UITab;
    "ui-tab-panel": UITabPanel;
    "ui-tooltip": UITooltip;
    "ui-select": UISelect;
    "ui-link": UILink;
    "ui-field-label": UIFieldLabel;
    "ui-form": UIForm;
    "ui-form-group": UIFormGroup;
    "ui-form-field": UIFormField;
    "ui-form-helper": UIFormHelper;
    "ui-form-actions": UIFormActions;
  }
}
