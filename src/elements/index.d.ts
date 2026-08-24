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
export declare class UIComboBox extends UIElement {}
export declare class UICheckbox extends UIElement {}
export declare class UIRadio extends UIElement {}
export declare class UISwitch extends UIElement {}
export declare class UIRangeSlider extends UIElement {}
export declare class UIBadge extends UIElement {}
export declare class UIDivider extends UIElement {}
export declare class UITextarea extends UIElement {}
export declare class UIAvatar extends UIElement {}
export declare class UIIllustratedMessage extends UIElement {}
export declare class UIAccordion extends UIElement {}
export declare class UIAccordionItem extends UIElement {}
export declare class UITabList extends UIElement {}
export declare class UITab extends UIElement {}
export declare class UITabPanel extends UIElement {}
export declare class UITreeView extends UIElement {}
export declare class UITooltip extends UIElement {}
export declare class UISelect extends UIElement {}
export declare class UILink extends UIElement {}
export declare class UIFieldLabel extends UIElement {}
export declare class UIForm extends UIElement {}
export declare class UIFormGroup extends UIElement {}
export declare class UIFormField extends UIElement {}
export declare class UIFormHelper extends UIElement {}
export declare class UIFormActions extends UIElement {}
export declare class UIDropzone extends UIElement {}

// --- Custom Element Tag Name Map ---

declare global {
  interface HTMLElementTagNameMap {
    "uif-icon": UIIcon;
    "uif-button": UIButton;
    "uif-button-group": UIButtonGroup;
    "uif-input": UIInput;
    "uif-combobox": UIComboBox;
    "uif-checkbox": UICheckbox;
    "uif-radio": UIRadio;
    "uif-switch": UISwitch;
    "uif-range-slider": UIRangeSlider;
    "uif-badge": UIBadge;
    "uif-divider": UIDivider;
    "uif-textarea": UITextarea;
    "uif-avatar": UIAvatar;
    "uif-illustrated-message": UIIllustratedMessage;
    "uif-accordion": UIAccordion;
    "uif-accordion-item": UIAccordionItem;
    "uif-tab-list": UITabList;
    "uif-tab": UITab;
    "uif-tab-panel": UITabPanel;
    "uif-tree-view": UITreeView;
    "uif-tooltip": UITooltip;
    "uif-select": UISelect;
    "uif-link": UILink;
    "uif-field-label": UIFieldLabel;
    "uif-form": UIForm;
    "uif-form-group": UIFormGroup;
    "uif-form-field": UIFormField;
    "uif-form-helper": UIFormHelper;
    "uif-form-actions": UIFormActions;
    "uif-dropzone": UIDropzone;
  }
}
