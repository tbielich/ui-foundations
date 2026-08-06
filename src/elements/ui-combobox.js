import { UIElement, define } from "./base.js";

const escapeHTML = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export function normalizeComboBoxOptions(options = []) {
  return options.flatMap((entry) => {
    if (!entry) return [];

    if (entry.group && Array.isArray(entry.items)) {
      return normalizeComboBoxOptions(entry.items).map((item) => ({
        ...item,
        group: item.group || String(entry.group),
      }));
    }

    const label = String(entry.label ?? entry.text ?? entry.value ?? "").trim();
    const value = String(entry.value ?? label);
    const description = String(entry.description ?? entry.meta ?? "").trim();
    const group = String(entry.group ?? "").trim();
    const keywords = Array.isArray(entry.keywords)
      ? entry.keywords.map((keyword) => String(keyword).trim()).filter(Boolean)
      : String(entry.keywords ?? "")
          .split(",")
          .map((keyword) => keyword.trim())
          .filter(Boolean);

    return [{
      value,
      label: label || value,
      description,
      group,
      keywords,
      disabled: Boolean(entry.disabled),
    }];
  });
}

export function filterComboBoxOptions(options, query) {
  const normalized = normalizeComboBoxOptions(options);
  const term = String(query ?? "").trim().toLowerCase();

  if (!term) return normalized;

  return normalized.filter((option) => {
    const haystack = [
      option.label,
      option.value,
      option.description,
      option.group,
      ...(option.keywords || []),
    ]
      .filter(Boolean)
      .join("\n")
      .toLowerCase();

    return haystack.includes(term);
  });
}

export function getNextComboBoxActiveIndex(options, startIndex, direction = 1) {
  const list = normalizeComboBoxOptions(options);
  if (!list.length) return -1;

  const step = direction < 0 ? -1 : 1;
  let index = Number.isInteger(startIndex) ? startIndex : step < 0 ? list.length : -1;

  for (let count = 0; count < list.length; count += 1) {
    index = (index + step + list.length) % list.length;
    if (!list[index].disabled) return index;
  }

  return -1;
}

function parseChildOptions(host) {
  const options = [];
  let selected = null;

  const pushOption = (node, group = "") => {
    const label = String(node.textContent ?? "").trim();
    const option = {
      value: node.getAttribute("value") ?? label,
      label,
      description: node.getAttribute("data-description") ?? "",
      group,
      keywords: String(node.getAttribute("data-keywords") ?? "")
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
      disabled: node.hasAttribute("disabled"),
    };
    options.push(option);
    if (node.hasAttribute("selected")) selected = option;
  };

  for (const child of Array.from(host.children)) {
    if (child.tagName === "OPTION") {
      pushOption(child);
      continue;
    }

    if (child.tagName === "OPTGROUP") {
      const group = child.getAttribute("label") ?? "";
      for (const option of Array.from(child.children)) {
        if (option.tagName === "OPTION") pushOption(option, group);
      }
    }
  }

  return { options, selected };
}

function hasExactMatch(options, query) {
  const term = String(query ?? "").trim().toLowerCase();
  if (!term) return false;
  return normalizeComboBoxOptions(options).some((option) => {
    if (option.disabled) return false;
    return option.label.toLowerCase() === term || option.value.toLowerCase() === term;
  });
}

function applyTemplate(templateSource, option) {
  return String(templateSource).replaceAll(/{{\s*(label|value|description|group)\s*}}/g, (_, key) => {
    return escapeHTML(option[key] ?? "");
  });
}

/**
 * <uif-combobox placeholder="Search destinations" aria-label="Destination">
 *   <option value="pmi" data-description="Spain">Palma de Mallorca</option>
 *   <option value="her" data-description="Greece">Heraklion</option>
 * </uif-combobox>
 *
 * Attributes:
 *   placeholder         — visible hint text
 *   value               — current submitted value
 *   disabled            — boolean
 *   invalid             — boolean
 *   loading             — boolean async state
 *   allow-custom-value  — boolean, allow free-form submission
 *   name                — hidden submitted field name
 *   aria-label / aria-labelledby — accessible label for the text input
 *   option-template     — template id used for custom option rendering
 */
class UIComboBox extends UIElement {
  static get observedAttributes() {
    return [
      "placeholder",
      "value",
      "disabled",
      "invalid",
      "loading",
      "allow-custom-value",
      "name",
      "aria-label",
      "aria-labelledby",
      "option-template",
    ];
  }

  constructor() {
    super();
    this._options = null;
    this._inputValue = "";
    this._selectedValue = "";
    this._open = false;
    this._activeIndex = -1;
    this._listboxId = "";
    this._syncingValue = false;
    this._restoreFocus = false;
  }

  connectedCallback() {
    if (!this._options) {
      const parsed = parseChildOptions(this);
      this._options = parsed.options;
      if (!this.hasAttribute("value") && parsed.selected) {
        this._selectedValue = parsed.selected.value;
        this._inputValue = parsed.selected.label;
      }
    }

    if (!this._listboxId) {
      const seed = this.id || Math.random().toString(36).slice(2, 10);
      this._listboxId = `${seed}-listbox`;
    }

    this._syncStateFromAttributes();
    this._initialized = true;
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "value" && this._syncingValue) return;
    this._syncStateFromAttributes();
    if (this._initialized) this.render();
  }

  get options() {
    return [...(this._options || [])];
  }

  set options(value) {
    this._options = normalizeComboBoxOptions(value);
    if (this._initialized) {
      this._syncStateFromAttributes();
      this.render();
    }
  }

  get value() {
    return this._selectedValue;
  }

  set value(nextValue) {
    if (nextValue === null || typeof nextValue === "undefined" || nextValue === "") {
      this.removeAttribute("value");
      return;
    }
    this.setAttribute("value", String(nextValue));
  }

  _syncStateFromAttributes() {
    const selectedValue = this.getAttr("value");
    const selectedOption = (this._options || []).find((option) => option.value === selectedValue);

    this._selectedValue = selectedValue;

    if (!this._inputValue || selectedOption || !this._open) {
      this._inputValue = selectedOption ? selectedOption.label : selectedValue;
    }
  }

  _setValueAttribute(nextValue) {
    this._syncingValue = true;
    if (nextValue) this.setAttribute("value", nextValue);
    else this.removeAttribute("value");
    this._syncingValue = false;
  }

  _visibleOptions() {
    return filterComboBoxOptions(this._options || [], this._inputValue);
  }

  _selectedOption() {
    return (this._options || []).find((option) => option.value === this._selectedValue) || null;
  }

  _renderOptionInner(option) {
    const templateId = this.getAttr("option-template");
    if (templateId && typeof document !== "undefined") {
      const template = document.getElementById(templateId);
      if (template) {
        return applyTemplate(template.innerHTML, option);
      }
    }

    const meta = option.description || option.group;
    return `<span class="uif-combobox-option-label">${escapeHTML(option.label)}</span>${
      meta ? `<span class="uif-combobox-option-meta">${escapeHTML(meta)}</span>` : ""
    }`;
  }

  _commitValue(value, label) {
    this._selectedValue = value;
    this._inputValue = label;
    this._setValueAttribute(value);
    this.dispatchEvent(new Event("input", { bubbles: true }));
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  _commitSelection(option, restoreFocus = false) {
    if (!option || option.disabled) return;
    this._commitValue(String(option.value), String(option.label));
    this._activeIndex = -1;
    this._open = false;
    this._restoreFocus = restoreFocus;
    this.render();
  }

  _commitCustomValue(restoreFocus = false) {
    const query = String(this._inputValue || "").trim();
    if (!query) return;
    this._commitValue(query, query);
    this._activeIndex = -1;
    this._open = false;
    this._restoreFocus = restoreFocus;
    this.render();
  }

  _restoreDisplayValue() {
    const selectedOption = this._selectedOption();
    this._inputValue = selectedOption ? selectedOption.label : this._selectedValue;
  }

  _finalizeInput() {
    const allowCustomValue = this.getBool("allow-custom-value");
    const visibleOptions = this._visibleOptions();
    const exactMatch = visibleOptions.find((option) => {
      const term = String(this._inputValue || "").trim().toLowerCase();
      return !option.disabled && (option.label.toLowerCase() === term || option.value.toLowerCase() === term);
    });

    if (exactMatch) {
      this._commitSelection(exactMatch);
      return;
    }

    if (allowCustomValue && String(this._inputValue || "").trim()) {
      this._commitCustomValue();
      return;
    }

    this._restoreDisplayValue();
    this._activeIndex = -1;
    this._open = false;
    this.render();
  }

  _bindEvents() {
    const input = this.querySelector(".uif-combobox-input");
    const toggle = this.querySelector('button[aria-label="Toggle suggestions"]');
    const clear = this.querySelector('button[aria-label="Clear input"]');
    const listbox = this.querySelector(".uif-combobox-listbox");

    if (!input || !toggle || !listbox) return;

    input.addEventListener("input", () => {
      this._inputValue = input.value;
      if (!this._inputValue) {
        this._selectedValue = "";
        this._setValueAttribute("");
      }
      this._open = true;
      this._activeIndex = getNextComboBoxActiveIndex(this._visibleOptions(), -1, 1);
      this._restoreFocus = true;
      this.render();
    });

    input.addEventListener("focus", () => {
      if (input.disabled || this._open) return;
      this._open = true;
      if (this._activeIndex === -1) {
        this._activeIndex = getNextComboBoxActiveIndex(this._visibleOptions(), -1, 1);
      }
      this._restoreFocus = true;
      this.render();
    });

    input.addEventListener("keydown", (event) => {
      const visibleOptions = this._visibleOptions();
      const lastIndex = getNextComboBoxActiveIndex(visibleOptions, 0, -1);

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          this._open = true;
          this._activeIndex = getNextComboBoxActiveIndex(visibleOptions, this._activeIndex, 1);
          this._restoreFocus = true;
          this.render();
          break;
        case "ArrowUp":
          event.preventDefault();
          this._open = true;
          this._activeIndex = getNextComboBoxActiveIndex(visibleOptions, this._activeIndex, -1);
          this._restoreFocus = true;
          this.render();
          break;
        case "Home":
          if (!this._open) break;
          event.preventDefault();
          this._activeIndex = getNextComboBoxActiveIndex(visibleOptions, -1, 1);
          this._restoreFocus = true;
          this.render();
          break;
        case "End":
          if (!this._open) break;
          event.preventDefault();
          this._activeIndex = lastIndex;
          this._restoreFocus = true;
          this.render();
          break;
        case "Enter":
          if (!this._open) break;
          event.preventDefault();
          if (this._activeIndex > -1 && visibleOptions[this._activeIndex]) {
            this._commitSelection(visibleOptions[this._activeIndex], true);
          } else if (this.getBool("allow-custom-value")) {
            this._commitCustomValue(true);
          }
          break;
        case "Escape":
          if (!this._open) break;
          event.preventDefault();
          this._restoreDisplayValue();
          this._open = false;
          this._activeIndex = -1;
          this._restoreFocus = true;
          this.render();
          break;
        case "Tab":
          this._finalizeInput();
          break;
        default:
          break;
      }
    });

    this.onfocusout = (event) => {
      if (this.contains(event.relatedTarget)) return;
      this._finalizeInput();
    };

    toggle.addEventListener("click", () => {
      if (input.disabled) return;
      this._open = !this._open;
      if (this._open && this._activeIndex === -1) {
        this._activeIndex = getNextComboBoxActiveIndex(this._visibleOptions(), -1, 1);
      }
      this._restoreFocus = true;
      this.render();
    });

    if (clear) {
      clear.addEventListener("click", () => {
        if (input.disabled) return;
        this._inputValue = "";
        this._selectedValue = "";
        this._setValueAttribute("");
        this._open = true;
        this._activeIndex = getNextComboBoxActiveIndex(this._visibleOptions(), -1, 1);
        this._restoreFocus = true;
        this.render();
      });
    }

    listbox.addEventListener("mousedown", (event) => {
      const option = event.target.closest(".uif-combobox-option");
      if (option) event.preventDefault();
    });

    listbox.addEventListener("click", (event) => {
      const option = event.target.closest(".uif-combobox-option");
      if (!option || option.hasAttribute("disabled")) return;

      if (option.hasAttribute("data-create-option")) {
        this._commitCustomValue(true);
        return;
      }

      const index = Number(option.getAttribute("data-index"));
      const visibleOptions = this._visibleOptions();
      if (!Number.isNaN(index) && visibleOptions[index]) {
        this._commitSelection(visibleOptions[index], true);
      }
    });
  }

  render() {
    const disabled = this.getBool("disabled");
    const invalid = this.getBool("invalid");
    const loading = this.getBool("loading");
    const allowCustomValue = this.getBool("allow-custom-value");
    const placeholder = this.getAttr("placeholder");
    const name = this.getAttr("name");
    const ariaLabel = this.getAttr("aria-label");
    const ariaLabelledby = this.getAttr("aria-labelledby");
    const visibleOptions = this._visibleOptions();
    const selectedOption = this._selectedOption();
    const shouldShowCreate =
      allowCustomValue &&
      String(this._inputValue || "").trim() &&
      !hasExactMatch(this._options || [], this._inputValue);

    if (!ariaLabel && !ariaLabelledby && !this.id) {
      this.warnDev("[ui-foundations] <uif-combobox> should have an id, aria-label, or aria-labelledby.");
    }

    if (this._activeIndex >= visibleOptions.length) {
      this._activeIndex = getNextComboBoxActiveIndex(visibleOptions, -1, 1);
    }

    const classes = ["uif-combobox"];
    if (disabled) classes.push("is-disabled");
    if (invalid) classes.push("is-invalid");
    if (this._open) classes.push("is-active");

    const inputAttrs = [
      'class="uif-combobox-input"',
      'type="text"',
      'role="combobox"',
      `aria-autocomplete="list"`,
      `aria-controls="${escapeHTML(this._listboxId)}"`,
      `aria-expanded="${this._open ? "true" : "false"}"`,
      'autocomplete="off"',
      'spellcheck="false"',
    ];
    if (placeholder) inputAttrs.push(`placeholder="${escapeHTML(placeholder)}"`);
    if (this._inputValue) inputAttrs.push(`value="${escapeHTML(this._inputValue)}"`);
    if (disabled) inputAttrs.push("disabled");
    if (invalid) inputAttrs.push('aria-invalid="true"');
    if (loading) inputAttrs.push('aria-busy="true"');
    if (ariaLabel) inputAttrs.push(`aria-label="${escapeHTML(ariaLabel)}"`);
    if (ariaLabelledby) inputAttrs.push(`aria-labelledby="${escapeHTML(ariaLabelledby)}"`);
    if (this.id) inputAttrs.push(`id="${escapeHTML(this.id)}"`);
    if (this._open && this._activeIndex > -1 && visibleOptions[this._activeIndex]) {
      inputAttrs.push(`aria-activedescendant="${escapeHTML(`${this._listboxId}-option-${this._activeIndex}`)}"`);
    }

    const optionMarkup = visibleOptions.map((option, index) => {
      const stateClasses = ["uif-combobox-option"];
      if (index === this._activeIndex) stateClasses.push("is-active");
      if (option.disabled) stateClasses.push("is-disabled");
      const selected = selectedOption && selectedOption.value === option.value;
      return `<button type="button" id="${escapeHTML(`${this._listboxId}-option-${index}`)}" class="${stateClasses.join(" ")}" role="option" data-index="${index}"${selected ? ' aria-selected="true"' : ' aria-selected="false"'}${option.disabled ? ' disabled' : ""}>${this._renderOptionInner(option)}</button>`;
    });

    if (shouldShowCreate) {
      optionMarkup.push(
        `<button type="button" class="uif-combobox-option" role="option" data-create-option="true"><span class="uif-combobox-option-label">Use “${escapeHTML(this._inputValue)}”</span><span class="uif-combobox-option-meta">Free-form value</span></button>`,
      );
    }

    if (loading) {
      optionMarkup.push(
        '<div class="uif-combobox-status" role="status" aria-live="polite"><span class="uif-combobox-option-label">Loading options…</span><span class="uif-combobox-option-meta">Results update when loading completes.</span></div>',
      );
    } else if (!optionMarkup.length) {
      optionMarkup.push(
        '<div class="uif-combobox-empty" role="status" aria-live="polite"><span class="uif-combobox-option-label">No matches found</span><span class="uif-combobox-option-meta">Try a different search term.</span></div>',
      );
    }

    this.innerHTML = `<div class="${classes.join(" ")}" data-open="${this._open ? "true" : "false"}" data-loading="${loading ? "true" : "false"}">
  <div class="uif-combobox-field">
    <input ${inputAttrs.join(" ")} />
    <span class="uif-combobox-control">
      ${this._inputValue && !disabled ? '<button type="button" aria-label="Clear input" tabindex="-1"><span class="uif-icon" style="--uif-icon-src: url(\'/assets/icons/cross-circled.svg\')" aria-hidden="true"></span></button>' : ""}
      ${loading ? '<span data-loading-indicator><span class="uif-icon" style="--uif-icon-src: url(\'/assets/icons/sync.svg\')" aria-hidden="true"></span></span>' : ""}
      <button type="button" aria-label="Toggle suggestions" tabindex="-1"${disabled ? ' disabled' : ""}><span class="uif-icon" style="--uif-icon-src: url(\'/assets/icons/chevron--down.svg\')" aria-hidden="true"></span></button>
    </span>
  </div>
  <input class="uif-combobox-value" type="hidden"${name ? ` name="${escapeHTML(name)}"` : ""}${this._selectedValue ? ` value="${escapeHTML(this._selectedValue)}"` : ""} />
  <div class="uif-combobox-listbox" role="listbox" id="${escapeHTML(this._listboxId)}"${this._open ? "" : " hidden"}>${optionMarkup.join("")}</div>
</div>`;

    this._bindEvents();

    if (this._restoreFocus) {
      this._restoreFocus = false;
      const nextInput = this.querySelector(".uif-combobox-input");
      if (nextInput) {
        nextInput.focus();
        const length = nextInput.value.length;
        if (typeof nextInput.setSelectionRange === "function") {
          nextInput.setSelectionRange(length, length);
        }
      }
    }
  }
}

define("uif-combobox", UIComboBox);
export { UIComboBox };
