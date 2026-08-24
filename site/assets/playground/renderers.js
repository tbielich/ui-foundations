(function initPlaygroundRenderers(global) {
  const shared = global.UIPlaygroundShared || {};
  const quoteAttr = shared.quoteAttr || ((value) => String(value || ""));
  const normalizeIconName =
    shared.normalizeIconName || ((rawValue) => String(rawValue || "").trim());
  const asBoolean = (value) =>
    value === true || value === "true" || value === 1 || value === "1";
  const escapeHtml = (value) =>
    String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  const sanitizeHref = (value) => {
    const href = String(value || "");
    if (!href) return "";
    return /^(?:https?:|mailto:|tel:|\/|#)/.test(href) ? href : "#";
  };

  const iconLabelFromName = (name) =>
    String(name || "")
      .replace(/[-_]+/g, " ")
      .trim();

  const iconSrcFromName = (name) => `/assets/icons/${name}.svg`;

  const createIconElement = ({ name, decorative = true, label, color }) => {
    const normalizedName = normalizeIconName(name);
    if (!normalizedName) return null;

    const element = document.createElement("span");
    element.className = "uif-icon";
    element.style.setProperty(
      "--uif-icon-src",
      `url("${iconSrcFromName(normalizedName)}")`,
    );
    element.style.color = color || "inherit";

    if (decorative) {
      element.setAttribute("aria-hidden", "true");
    } else {
      element.setAttribute("role", "img");
      element.setAttribute(
        "aria-label",
        label || iconLabelFromName(normalizedName),
      );
    }

    return element;
  };

  const iconCode = ({ name, decorative = true, label, color }) => {
    const normalizedName = normalizeIconName(name);
    if (!normalizedName) return "";

    const styleEntries = [
      `--uif-icon-src: url('/assets/icons/${quoteAttr(normalizedName)}.svg')`,
    ];
    if (color) {
      styleEntries.push(`color: ${color}`);
    }

    const attrs = [
      'class="uif-icon"',
      `style="${quoteAttr(styleEntries.join("; "))}"`,
    ];

    if (decorative) {
      attrs.push('aria-hidden="true"');
    } else {
      attrs.push('role="img"');
      attrs.push(
        `aria-label="${quoteAttr(label || iconLabelFromName(normalizedName))}"`,
      );
    }

    return `<span ${attrs.join(" ")}></span>`;
  };

  const createLabelIconSlot = (name, position) => {
    const icon = createIconElement({ name, decorative: true });
    if (!icon) return null;

    icon.setAttribute("data-slot", position);
    return icon;
  };

  const labelIconCode = (name, position) => {
    const iconMarkup = iconCode({ name, decorative: true });
    if (!iconMarkup) return "";
    return iconMarkup.replace(
      'class="uif-icon"',
      `class="uif-icon" data-slot="${position}"`,
    );
  };

  const renderVanillaButton = ({ props, children, meta }) => {
    const element = document.createElement("button");
    const variant = props.variant || "solid";
    const type = props.type || "button";
    const previewState = String(meta.state || "default");
    const startIcon = normalizeIconName(props.startIcon);
    const endIcon = normalizeIconName(props.endIcon);
    const iconOnly = Boolean(props.iconOnly);
    const rawLabel =
      typeof children === "undefined" ? "Button" : String(children || "");
    const hasText = rawLabel.trim().length > 0;
    const resolvedIconOnly = iconOnly || !hasText;
    const ariaLabel = String(props.ariaLabel || "").trim();
    const iconStart = resolvedIconOnly
      ? startIcon || endIcon || "none"
      : startIcon;
    const iconEnd = resolvedIconOnly ? "" : endIcon;
    const resolvedVariant =
      variant === "outline" || variant === "ghost" ? variant : "solid";
    const classes = ["uif-button", resolvedVariant];
    if (resolvedIconOnly) classes.push("icon-only");
    if (previewState === "hover") classes.push("is-hover");
    if (previewState === "active") classes.push("is-active");
    if (previewState === "focus") classes.push("is-focus-visible");
    if (props.className) classes.push(String(props.className));

    element.className = classes.join(" ");
    element.type = type;
    element.disabled = previewState === "disabled" || Boolean(props.disabled);
    if (resolvedIconOnly) {
      element.setAttribute("aria-label", ariaLabel || "Button");
    }

    const content = document.createElement("span");
    const contentClasses = ["uif-label-content"];
    if (resolvedIconOnly) contentClasses.push("is-icon-only");
    content.className = contentClasses.join(" ");

    const startSlot = createLabelIconSlot(iconStart, "start");
    if (startSlot) content.append(startSlot);

    if (!resolvedIconOnly && hasText) {
      const textNode = document.createElement("span");
      textNode.className = "uif-label-content-text";
      textNode.textContent = rawLabel;
      content.append(textNode);
    }

    const endSlot = createLabelIconSlot(iconEnd, "end");
    if (endSlot) content.append(endSlot);

    element.append(content);

    const attrs = [
      `class="${quoteAttr(element.className)}"`,
      `type="${quoteAttr(type)}"`,
    ];
    if (element.disabled) attrs.push("disabled");
    if (resolvedIconOnly) {
      attrs.push(`aria-label="${quoteAttr(ariaLabel || "Button")}"`);
    }

    const codeContent = [
      labelIconCode(iconStart, "start"),
      !resolvedIconOnly && hasText
        ? `<span class="uif-label-content-text">${quoteAttr(rawLabel)}</span>`
        : "",
      labelIconCode(iconEnd, "end"),
    ]
      .filter(Boolean)
      .join("");

    const codeContentClasses = ["uif-label-content"];
    if (resolvedIconOnly) codeContentClasses.push("is-icon-only");

    const code = `<button ${attrs.join(" ")}><span class="${quoteAttr(codeContentClasses.join(" "))}">${codeContent}</span></button>`;

    return { element, code };
  };

  const renderVanillaIcon = ({ props }) => {
    const name = normalizeIconName(props.name) || "search";
    const lineHeight = String(props.lineHeight || "24px");
    const color = String(props.color || "").trim();
    const resolvedColor =
      color && color.toLowerCase() !== "currentcolor" ? color : "";
    const decorative = Boolean(props.decorative);
    const label = String(props.label || "").trim();

    const host = document.createElement("span");
    host.style.lineHeight = lineHeight;
    const icon = createIconElement({
      name,
      decorative,
      label,
      color: resolvedColor,
    });
    if (icon) host.append(icon);

    const hostStyleEntries = [`line-height: ${lineHeight}`];
    const hostCode = `<span style="${quoteAttr(hostStyleEntries.join("; "))}">${iconCode({ name, decorative, label, color: resolvedColor })}</span>`;

    return { element: host, code: hostCode };
  };

  const renderVanillaLabel = ({ props, children, meta }) => {
    const mode = String(meta.mode || "content");
    const iconOnly = Boolean(props.iconOnly);
    const required = Boolean(props.required);
    const text =
      typeof children === "undefined" ? "Continue" : String(children || "");
    const startIcon = normalizeIconName(props.startIcon);
    const endIcon = normalizeIconName(props.endIcon);
    const iconStart = iconOnly ? startIcon || endIcon || "none" : startIcon;
    const iconEnd = iconOnly ? "" : endIcon;
    const lineHeight = String(props.lineHeight || "24px");
    const color = String(props.color || "").trim();
    const forId = String(props.forId || "field-id");

    const host = document.createElement(mode === "field" ? "label" : "span");
    if (mode === "field") {
      host.className = "uif-field-label";
      host.setAttribute("for", forId);
    }
    host.style.lineHeight = lineHeight;
    if (color) host.style.color = color;

    const labelContent = document.createElement("span");
    labelContent.className = "uif-label-content";

    const hasText = text.trim().length > 0;
    if (iconOnly || !hasText) {
      labelContent.classList.add("is-icon-only");
    }

    const startSlot = createLabelIconSlot(iconStart, "start");
    if (startSlot) labelContent.append(startSlot);

    if (!iconOnly && hasText) {
      const textElement = document.createElement("span");
      textElement.className = "uif-label-content-text";
      textElement.textContent = text;
      labelContent.append(textElement);
    }

    const endSlot = createLabelIconSlot(iconEnd, "end");
    if (endSlot) labelContent.append(endSlot);

    host.append(labelContent);

    if (mode === "field" && required) {
      const requiredMarker = document.createElement("span");
      requiredMarker.className = "uif-field-label-required";
      requiredMarker.setAttribute("aria-hidden", "true");
      requiredMarker.textContent = "*";
      host.append(requiredMarker);

      const requiredText = document.createElement("span");
      requiredText.className = "uif-field-label-required-text";
      requiredText.textContent = " (required)";
      host.append(requiredText);
    }

    const hostStyleEntries = [`line-height: ${lineHeight}`];
    if (color) hostStyleEntries.push(`color: ${color}`);

    const contentClasses = ["uif-label-content"];
    if (iconOnly || !hasText) contentClasses.push("is-icon-only");
    const contentMarkup = [
      labelIconCode(iconStart, "start"),
      !iconOnly && hasText
        ? `<span class="uif-label-content-text">${quoteAttr(text)}</span>`
        : "",
      labelIconCode(iconEnd, "end"),
    ]
      .filter(Boolean)
      .join("");

    if (mode === "field") {
      const requiredMarkup = required
        ? '<span class="uif-field-label-required" aria-hidden="true">*</span><span class="uif-field-label-required-text"> (required)</span>'
        : "";
      const code = `<label for="${quoteAttr(forId)}" class="uif-field-label" style="${quoteAttr(hostStyleEntries.join("; "))}"><span class="${quoteAttr(contentClasses.join(" "))}">${contentMarkup}</span>${requiredMarkup}</label>`;
      return { element: host, code };
    }

    const code = `<span style="${quoteAttr(hostStyleEntries.join("; "))}"><span class="${quoteAttr(contentClasses.join(" "))}">${contentMarkup}</span></span>`;
    return { element: host, code };
  };

  const renderVanillaInput = ({ props, meta }) => {
    const previewState = String(meta.state || "default");
    const type = String(props.type || "text");
    const placeholder = String(props.placeholder || "");
    const value = String(props.value || "");
    const isDisabled = previewState === "disabled" || Boolean(props.disabled);
    const isReadonly = previewState === "readonly";

    // Always render as the UIF Input field wrapper
    const wrapper = document.createElement("div");
    const wrapperClasses = ["uif-input-field"];
    if (previewState === "hover") wrapperClasses.push("is-hover");
    if (previewState === "active") wrapperClasses.push("is-active");
    if (previewState === "focus") wrapperClasses.push("is-focus-visible");
    if (isDisabled) wrapperClasses.push("is-disabled");
    if (previewState === "invalid") wrapperClasses.push("is-invalid");
    if (props.className) wrapperClasses.push(String(props.className));
    wrapper.className = wrapperClasses.join(" ");

    const input = document.createElement("input");
    input.className = "uif-input";
    input.type = type;
    input.placeholder = placeholder;
    input.value = value;
    input.disabled = isDisabled;
    input.readOnly = isReadonly;
    wrapper.appendChild(input);

    const control = document.createElement("span");
    control.className = "uif-input-field-control";

    let controlIcons = [];
    if (type === "number") {
      controlIcons = [
        { icon: "minus-circled", label: "Decrease value", focusable: true },
        { icon: "plus-circled", label: "Increase value", focusable: true },
      ];
    } else if (type === "password") {
      controlIcons = [
        { icon: "view", label: "Toggle password visibility", focusable: true },
      ];
    } else if (type === "date") {
      controlIcons = [
        { icon: "calendar", label: "Open date picker", focusable: true },
      ];
    } else if (
      type === "text" ||
      type === "email" ||
      type === "search" ||
      type === "url" ||
      type === "tel"
    ) {
      controlIcons = [{ icon: "cross-circled", label: "Clear input", focusable: false }];
    }

    controlIcons.forEach(({ icon, label, focusable }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", label);
      if (!focusable) btn.tabIndex = -1;
      if (isDisabled) btn.disabled = true;
      const iconEl = createIconElement({ name: icon, decorative: true });
      if (iconEl) btn.appendChild(iconEl);
      control.appendChild(btn);
    });
    wrapper.appendChild(control);

    // Generate code
    const inputAttrs = [`class="uif-input"`, `type="${quoteAttr(type)}"`];
    if (placeholder) inputAttrs.push(`placeholder="${quoteAttr(placeholder)}"`);
    if (value) inputAttrs.push(`value="${quoteAttr(value)}"`);
    if (isDisabled) inputAttrs.push("disabled");

    let controlCode = "";
    if (controlIcons.length) {
      controlCode = controlIcons
        .map(({ icon, label, focusable }) => {
          const attrs = [`type="button"`, `aria-label="${quoteAttr(label)}"`];
          if (!focusable) attrs.push(`tabindex="-1"`);
          return `<button ${attrs.join(" ")}>${iconCode({ name: icon, decorative: true })}</button>`;
        })
        .join("\n    ");
    }

    const code = `<div class="${quoteAttr(wrapper.className)}">
  <input ${inputAttrs.join(" ")} />
  <span class="uif-input-field-control">
    ${controlCode}
  </span>
</div>`;

    return { element: wrapper, code };
  };

  const renderVanillaDropzone = ({ props, meta }) => {
    const previewState = String(meta.state || "default");
    const disabled = previewState === "disabled" || asBoolean(props.disabled);
    const filled = previewState === "filled" || asBoolean(props.filled);
    const label = String(props.label || "Drag and drop files here");
    const hint = String(props.hint || "or");
    const buttonLabel = String(props.buttonLabel || "Choose files");
    const accept = String(props.accept || "");
    const multiple = asBoolean(props.multiple);
    const filesText = filled
      ? String(props.filesText || (multiple ? "2 files selected" : "invoice.pdf"))
      : String(props.filesText || "No files selected");

    const wrapper = document.createElement("div");
    const classes = ["uif-dropzone"];
    if (previewState === "dragover") classes.push("is-dragover");
    if (disabled) classes.push("is-disabled");
    if (filled) classes.push("is-filled");
    if (props.className) classes.push(String(props.className));
    wrapper.className = classes.join(" ");
    wrapper.setAttribute("role", "group");
    wrapper.setAttribute("aria-label", "File upload drop zone");

    const input = document.createElement("input");
    input.className = "uif-dropzone-input";
    input.type = "file";
    if (accept) input.setAttribute("accept", accept);
    if (multiple) input.multiple = true;
    if (disabled) input.disabled = true;

    const icon = createIconElement({ name: "upload", decorative: true });
    const labelEl = document.createElement("span");
    labelEl.className = "uif-dropzone-label";
    labelEl.textContent = label;
    const hintEl = document.createElement("span");
    hintEl.className = "uif-dropzone-hint";
    hintEl.textContent = hint;
    const button = document.createElement("button");
    button.className = "uif-button outline uif-dropzone-button";
    button.type = "button";
    button.textContent = buttonLabel;
    button.disabled = disabled;
    const files = document.createElement("span");
    files.className = "uif-dropzone-files";
    files.setAttribute("aria-live", "polite");
    files.textContent = filesText;

    wrapper.append(input);
    if (icon) wrapper.append(icon);
    wrapper.append(labelEl, hintEl, button, files);

    const inputAttrs = ['class="uif-dropzone-input"', 'type="file"'];
    if (accept) inputAttrs.push(`accept="${quoteAttr(accept)}"`);
    if (multiple) inputAttrs.push("multiple");
    if (disabled) inputAttrs.push("disabled");
    const buttonAttrs = ['class="uif-button outline uif-dropzone-button"', 'type="button"'];
    if (disabled) buttonAttrs.push("disabled");
    const code = `<div class="${quoteAttr(wrapper.className)}" role="group" aria-label="File upload drop zone">
  <input ${inputAttrs.join(" ")} />
  ${iconCode({ name: "upload", decorative: true })}
  <span class="uif-dropzone-label">${quoteAttr(label)}</span>
  <span class="uif-dropzone-hint">${quoteAttr(hint)}</span>
  <button ${buttonAttrs.join(" ")}>${quoteAttr(buttonLabel)}</button>
  <span class="uif-dropzone-files" aria-live="polite">${quoteAttr(filesText)}</span>
</div>`;

    return { element: wrapper, code };
  };

  const renderVanillaCheckbox = ({ props, meta }) => {
    const previewState = String(meta.state || "default");
    const labelText = String(props.label || "Accept terms");
    const checked = asBoolean(props.checked);
    const indeterminate = previewState === "indeterminate";
    const disabled =
      previewState === "disabled" ||
      asBoolean(props.disabled);

    const wrapper = document.createElement("label");
    const wrapperClasses = ["uif-checkbox-field"];
    if (disabled) wrapperClasses.push("is-disabled");
    wrapper.className = wrapperClasses.join(" ");

    const input = document.createElement("input");
    const inputClasses = ["uif-checkbox"];
    if (checked) inputClasses.push("is-checked");
    if (indeterminate) inputClasses.push("is-indeterminate");
    if (previewState === "hover") inputClasses.push("is-hover");
    if (previewState === "active") inputClasses.push("is-active");
    if (previewState === "focus") inputClasses.push("is-focus-visible");
    if (disabled) inputClasses.push("is-disabled");

    input.className = inputClasses.join(" ");
    input.type = "checkbox";
    input.checked = checked;
    input.disabled = disabled;
    input.indeterminate = indeterminate;
    if (indeterminate) input.setAttribute("aria-checked", "mixed");

    const text = document.createElement("span");
    text.className = "uif-checkbox-field-text";
    text.textContent = labelText;

    wrapper.append(input, text);

    const attrs = [
      `class="${quoteAttr(input.className)}"`,
      'type="checkbox"',
    ];
    if (checked) attrs.push("checked");
    if (indeterminate) attrs.push('aria-checked="mixed"');
    if (disabled) attrs.push("disabled");

    const code = `<label class="${quoteAttr(wrapper.className)}"><input ${attrs.join(" ")} /><span class="uif-checkbox-field-text">${quoteAttr(labelText)}</span></label>`;
    return { element: wrapper, code };
  };

  const renderVanillaSwitch = ({ props, meta }) => {
    const previewState = String(meta.state || "default");
    const labelText = String(props.label || "Notifications");
    const checked = asBoolean(props.checked);
    const disabled =
      previewState === "disabled" ||
      asBoolean(props.disabled);

    const wrapper = document.createElement("label");
    const wrapperClasses = ["uif-switch-field"];
    if (disabled) wrapperClasses.push("is-disabled");
    wrapper.className = wrapperClasses.join(" ");

    const input = document.createElement("input");
    const inputClasses = ["uif-switch"];
    if (checked) inputClasses.push("is-checked");
    if (previewState === "hover") inputClasses.push("is-hover");
    if (previewState === "active") inputClasses.push("is-active");
    if (previewState === "focus") inputClasses.push("is-focus-visible");
    if (disabled) inputClasses.push("is-disabled");

    input.className = inputClasses.join(" ");
    input.type = "checkbox";
    input.checked = checked;
    input.disabled = disabled;
    input.setAttribute("role", "switch");

    const text = document.createElement("span");
    text.className = "uif-switch-field-text";
    text.textContent = labelText;

    wrapper.append(input, text);

    const attrs = [
      `class="${quoteAttr(input.className)}"`,
      'type="checkbox"',
      'role="switch"',
    ];
    if (checked) attrs.push("checked");
    if (disabled) attrs.push("disabled");

    const code = `<label class="${quoteAttr(wrapper.className)}"><input ${attrs.join(" ")} /><span class="uif-switch-field-text">${quoteAttr(labelText)}</span></label>`;
    return { element: wrapper, code };
  };

  const renderVanillaRangeSlider = ({ props }) => {
    const labelText = String(props.label || "Price range");
    const min = Number.isFinite(Number(props.min)) ? Number(props.min) : 0;
    const max = Number.isFinite(Number(props.max)) ? Number(props.max) : 100;
    const step = Number.isFinite(Number(props.step)) && Number(props.step) > 0
      ? Number(props.step)
      : 1;
    const disabled = asBoolean(props.disabled);
    const lowerDefault = Number.isFinite(Number(props.lowerValue))
      ? Number(props.lowerValue)
      : min;
    const upperDefault = Number.isFinite(Number(props.upperValue))
      ? Number(props.upperValue)
      : max;

    const clamp = (value) => Math.min(max, Math.max(min, value));
    const wrapper = document.createElement("div");
    const wrapperClasses = ["uif-range-slider-field"];
    if (disabled) wrapperClasses.push("is-disabled");
    wrapper.className = wrapperClasses.join(" ");

    const header = document.createElement("div");
    header.className = "uif-range-slider-header";

    const label = document.createElement("span");
    label.className = "uif-range-slider-label";
    label.textContent = labelText;

    const output = document.createElement("output");
    output.className = "uif-range-slider-value";
    output.setAttribute("aria-live", "polite");

    const lowerSpan = document.createElement("span");
    lowerSpan.className = "uif-range-slider-value-lower";
    const separator = document.createElement("span");
    separator.className = "uif-range-slider-value-separator";
    separator.textContent = "–";
    const upperSpan = document.createElement("span");
    upperSpan.className = "uif-range-slider-value-upper";
    output.append(lowerSpan, separator, upperSpan);
    header.append(label, output);

    const slider = document.createElement("div");
    slider.className = "uif-range-slider";

    const lowerInput = document.createElement("input");
    lowerInput.className = "uif-range-slider-input is-lower";
    lowerInput.type = "range";
    lowerInput.min = String(min);
    lowerInput.max = String(max);
    lowerInput.step = String(step);
    lowerInput.setAttribute("aria-label", "Minimum value");
    lowerInput.disabled = disabled;

    const upperInput = document.createElement("input");
    upperInput.className = "uif-range-slider-input is-upper";
    upperInput.type = "range";
    upperInput.min = String(min);
    upperInput.max = String(max);
    upperInput.step = String(step);
    upperInput.setAttribute("aria-label", "Maximum value");
    upperInput.disabled = disabled;

    const sync = (source) => {
      let lower = clamp(Number(lowerInput.value || lowerDefault));
      let upper = clamp(Number(upperInput.value || upperDefault));

      if (source === "lower" && lower > upper) lower = upper;
      if (source === "upper" && upper < lower) upper = lower;
      if (source !== "lower" && source !== "upper" && lower > upper) {
        lower = upper;
      }

      lowerInput.value = String(lower);
      upperInput.value = String(upper);
      slider.dataset.lowerValue = String(lower);
      slider.dataset.upperValue = String(upper);

      const range = max - min || 1;
      const lowerPercent = ((lower - min) / range) * 100;
      const upperPercent = ((upper - min) / range) * 100;
      slider.style.setProperty("--_range-slider-start", String(lowerPercent));
      slider.style.setProperty("--_range-slider-end", String(upperPercent));

      lowerSpan.textContent = String(lower);
      upperSpan.textContent = String(upper);
    };

    lowerInput.value = String(clamp(lowerDefault));
    upperInput.value = String(clamp(upperDefault));
    lowerInput.addEventListener("input", () => sync("lower"));
    upperInput.addEventListener("input", () => sync("upper"));

    slider.append(lowerInput, upperInput);
    wrapper.append(header, slider);
    sync();

    const fieldAttrs = [`class="${quoteAttr(wrapper.className)}"`];
    const inputAttrs = (position, value, ariaLabel) => {
      const attrs = [
        `class="uif-range-slider-input is-${position}"`,
        'type="range"',
        `min="${quoteAttr(min)}"`,
        `max="${quoteAttr(max)}"`,
        `step="${quoteAttr(step)}"`,
        `value="${quoteAttr(value)}"`,
        `aria-label="${quoteAttr(ariaLabel)}"`,
      ];
      if (disabled) attrs.push("disabled");
      return attrs.join(" ");
    };
    const code = `<div ${fieldAttrs.join(" ")}>
  <div class="uif-range-slider-header">
    <span class="uif-range-slider-label">${quoteAttr(labelText)}</span>
    <output class="uif-range-slider-value" aria-live="polite"><span class="uif-range-slider-value-lower">${quoteAttr(lowerInput.value)}</span><span class="uif-range-slider-value-separator">–</span><span class="uif-range-slider-value-upper">${quoteAttr(upperInput.value)}</span></output>
  </div>
  <div class="uif-range-slider" data-min="${quoteAttr(min)}" data-max="${quoteAttr(max)}" data-lower-value="${quoteAttr(lowerInput.value)}" data-upper-value="${quoteAttr(upperInput.value)}" style="--_range-slider-start: ${quoteAttr(slider.style.getPropertyValue("--_range-slider-start"))}; --_range-slider-end: ${quoteAttr(slider.style.getPropertyValue("--_range-slider-end"))};">
    <input ${inputAttrs("lower", lowerInput.value, "Minimum value")} />
    <input ${inputAttrs("upper", upperInput.value, "Maximum value")} />
  </div>
</div>`;

    return { element: wrapper, code };
  };

  const renderVanillaButtonGroup = ({ props, meta }) => {
    const element = document.createElement("div");
    const orientation =
      String(props.orientation || "horizontal") === "vertical"
        ? "vertical"
        : "horizontal";
    const justify =
      String(props.justify || "start") === "stretch" ? "stretch" : "start";
    const attached = Boolean(props.attached);
    const variant = String(props.variant || "outline");
    const mode = String(props.mode || "actions") === "toggle"
      ? "toggle"
      : "actions";
    const previewState = String(meta.state || "default");
    const selected = String(props.selected || "1");
    const groupLabel = String(props.groupLabel || "Button group").trim();

    const labels = [
      String(props.primaryLabel || "Day 1"),
      String(props.secondaryLabel || "Day 2"),
      String(props.tertiaryLabel || "Day 3"),
    ];

    element.className = "uif-button-group";
    element.setAttribute("role", "group");
    element.dataset.orientation = orientation;
    element.dataset.justify = justify;
    element.dataset.attached = attached ? "true" : "false";
    if (mode === "toggle" && groupLabel) {
      element.setAttribute("aria-label", groupLabel);
    }

    const buttonCodes = labels.map((label, index) => {
      const optionNumber = String(index + 1);
      const isSelected = mode === "toggle" && selected === optionNumber;
      const result = renderVanillaButton({
        props: {
          variant,
          type: "button",
        },
        children: label,
        meta: {
          state: isSelected ? "active" : previewState,
        },
      });

      if (mode === "toggle") {
        const ariaPressed = isSelected ? "true" : "false";
        result.element.setAttribute("aria-pressed", ariaPressed);
        result.code = result.code.replace(
          "<button ",
          `<button aria-pressed="${ariaPressed}" `,
        );
      }

      element.append(result.element);
      return result.code;
    });

    const groupAttrs = [
      'class="uif-button-group"',
      'role="group"',
      `data-orientation="${quoteAttr(orientation)}"`,
      `data-attached="${attached ? "true" : "false"}"`,
      `data-justify="${quoteAttr(justify)}"`,
    ];
    if (mode === "toggle" && groupLabel) {
      groupAttrs.push(`aria-label="${quoteAttr(groupLabel)}"`);
    }

    const code = `<div ${groupAttrs.join(" ")}>${buttonCodes.join("")}</div>`;
    return { element, code };
  };

  const renderVanillaRadio = ({ props, meta }) => {
    const previewState = String(meta.state || "default");
    const labelText = String(props.label || "Option A");
    const checked = asBoolean(props.checked);
    const disabled =
      previewState === "disabled" ||
      asBoolean(props.disabled);

    const wrapper = document.createElement("label");
    const wrapperClasses = ["uif-radio-field"];
    if (disabled) wrapperClasses.push("is-disabled");
    wrapper.className = wrapperClasses.join(" ");

    const input = document.createElement("input");
    const inputClasses = ["uif-radio"];
    if (checked) inputClasses.push("is-checked");
    if (previewState === "hover") inputClasses.push("is-hover");
    if (previewState === "active") inputClasses.push("is-active");
    if (previewState === "focus") inputClasses.push("is-focus-visible");
    if (disabled) inputClasses.push("is-disabled");

    input.className = inputClasses.join(" ");
    input.type = "radio";
    input.checked = checked;
    input.disabled = disabled;

    const text = document.createElement("span");
    text.className = "uif-radio-field-text";
    text.textContent = labelText;

    wrapper.append(input, text);

    const attrs = [
      `class="${quoteAttr(input.className)}"`,
      'type="radio"',
    ];
    if (checked) attrs.push("checked");
    if (disabled) attrs.push("disabled");

    const code = `<label class="${quoteAttr(wrapper.className)}"><input ${attrs.join(" ")} /><span class="uif-radio-field-text">${quoteAttr(labelText)}</span></label>`;
    return { element: wrapper, code };
  };

  const renderVanillaBadge = ({ props, children }) => {
    const variant = String(props.variant || "default");
    const size = String(props.size || "md");
    const startIcon = normalizeIconName(props.startIcon);
    const rawText =
      typeof children === "undefined" ? "Badge" : String(children || "");

    const element = document.createElement("span");
    const classes = ["uif-badge"];
    if (variant && variant !== "default") classes.push(variant);
    if (size === "sm") classes.push("sm");
    element.className = classes.join(" ");

    if (startIcon) {
      const icon = createIconElement({ name: startIcon, decorative: true });
      if (icon) element.append(icon);
    }

    const textSpan = document.createElement("span");
    textSpan.className = "uif-badge-text";
    textSpan.textContent = rawText;
    element.append(textSpan);

    const codeClasses = classes.map((c) => quoteAttr(c)).join(" ");
    const iconMarkup = startIcon ? iconCode({ name: startIcon, decorative: true }) : "";
    const code = `<span class="${codeClasses}">${iconMarkup}<span class="uif-badge-text">${quoteAttr(rawText)}</span></span>`;

    return { element, code };
  };

  const renderVanillaStatusLight = ({ props, children }) => {
    const variant = String(props.variant || "neutral");
    const size = String(props.size || "md");
    const rawText =
      typeof children === "undefined" ? "Status" : String(children || "");

    const element = document.createElement("span");
    const classes = ["uif-status-light"];
    if (variant && variant !== "neutral") classes.push(variant);
    if (size === "sm") classes.push("sm");
    element.className = classes.join(" ");

    const indicator = document.createElement("span");
    indicator.className = "uif-status-light-indicator";
    indicator.setAttribute("aria-hidden", "true");
    element.append(indicator);

    const textSpan = document.createElement("span");
    textSpan.className = "uif-status-light-text";
    textSpan.textContent = rawText;
    element.append(textSpan);

    const codeClasses = classes.map((c) => quoteAttr(c)).join(" ");
    const code = `<span class="${codeClasses}"><span class="uif-status-light-indicator" aria-hidden="true"></span><span class="uif-status-light-text">${quoteAttr(rawText)}</span></span>`;
    return { element, code };
  };

  const renderVanillaTextarea = ({ props }) => {
    const placeholder = String(props.placeholder || "");
    const value = String(props.value || "");
    const disabled = asBoolean(props.disabled);
    const readonly = asBoolean(props.readonly);
    const rows = props.rows || "3";

    const element = document.createElement("textarea");
    element.className = "uif-textarea";
    element.placeholder = placeholder;
    element.value = value;
    element.rows = Number(rows);
    if (disabled) { element.disabled = true; element.classList.add("is-disabled"); }
    if (readonly) element.readOnly = true;

    const attrs = [`class="uif-textarea"`, `placeholder="${quoteAttr(placeholder)}"`, `rows="${rows}"`];
    if (disabled) attrs.push("disabled");
    if (readonly) attrs.push("readonly");
    const code = `<textarea ${attrs.join(" ")}>${quoteAttr(value)}</textarea>`;

    return { element, code };
  };

  const renderVanillaAvatar = ({ props }) => {
    const initials = String(props.initials || "TB");
    const size = String(props.size || "md");
    const src = String(props.src || "");

    const element = document.createElement("span");
    const classes = ["uif-avatar"];
    if (size && size !== "md") classes.push(size);
    element.className = classes.join(" ");
    element.setAttribute("role", "img");
    element.setAttribute("aria-label", initials);

    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = initials;
      element.append(img);
    } else {
      const span = document.createElement("span");
      span.className = "uif-avatar-initials";
      span.textContent = initials;
      element.append(span);
    }

    const codeClasses = classes.join(" ");
    const inner = src
      ? `<img src="${quoteAttr(src)}" alt="${quoteAttr(initials)}" />`
      : `<span class="uif-avatar-initials">${quoteAttr(initials)}</span>`;
    const code = `<span class="${codeClasses}" role="img" aria-label="${quoteAttr(initials)}">${inner}</span>`;

    return { element, code };
  };

  const ILLUSTRATED_MESSAGE_PRESETS = {
    empty: {
      heading: "Nothing here yet",
      description: "Add content or create a new item to get started.",
      icon: "message-info",
    },
    error: {
      heading: "Something went wrong",
      description: "Try again or go back to the previous step.",
      icon: "message-alert",
    },
    "no-results": {
      heading: "No results found",
      description: "Try adjusting your filters or search terms.",
      icon: "search",
    },
  };

  const resolveIllustratedMessagePreset = (value) =>
    Object.prototype.hasOwnProperty.call(ILLUSTRATED_MESSAGE_PRESETS, value)
      ? value
      : "empty";

  const renderVanillaIllustratedMessage = ({ props }) => {
    const preset = resolveIllustratedMessagePreset(String(props.preset || "empty"));
    const defaults = ILLUSTRATED_MESSAGE_PRESETS[preset];
    const heading = String(props.heading || defaults.heading);
    const description = String(props.description || defaults.description);
    const actionLabel = String(props.actionLabel || "");
    const actionHref = sanitizeHref(props.actionHref);
    const actionVariant =
      props.actionVariant === "outline" || props.actionVariant === "ghost"
        ? String(props.actionVariant)
        : "solid";
    const illustrationIcon = normalizeIconName(props.illustrationIcon) || defaults.icon;

    const wrapper = document.createElement("div");
    wrapper.className = "uif-illustrated-message";
    wrapper.dataset.preset = preset;

    const illustration = document.createElement("div");
    illustration.className = "uif-illustrated-message-illustration";
    illustration.setAttribute("aria-hidden", "true");
    const icon = createIconElement({ name: illustrationIcon, decorative: true });
    if (icon) illustration.append(icon);

    const content = document.createElement("div");
    content.className = "uif-illustrated-message-content";

    if (heading) {
      const title = document.createElement("h2");
      title.className = "uif-illustrated-message-heading";
      title.textContent = heading;
      content.append(title);
    }

    if (description) {
      const body = document.createElement("p");
      body.className = "uif-illustrated-message-description";
      body.textContent = description;
      content.append(body);
    }

    wrapper.append(illustration, content);

    let actionCode = "";
    if (actionLabel) {
      const actions = document.createElement("div");
      actions.className = "uif-illustrated-message-actions";
      if (actionHref) {
        const actionLink = document.createElement("a");
        actionLink.className = `uif-button ${actionVariant}`;
        actionLink.href = actionHref;
        actionLink.textContent = actionLabel;
        actions.append(actionLink);
        actionCode = `<a class="uif-button ${quoteAttr(actionVariant)}" href="${quoteAttr(actionHref)}">${escapeHtml(actionLabel)}</a>`;
      } else {
        const actionButton = document.createElement("button");
        actionButton.className = `uif-button ${actionVariant}`;
        actionButton.type = "button";
        actionButton.textContent = actionLabel;
        actions.append(actionButton);
        actionCode = `<button class="uif-button ${quoteAttr(actionVariant)}" type="button">${escapeHtml(actionLabel)}</button>`;
      }
      wrapper.append(actions);
    }

    const headingCode = heading
      ? `<h2 class="uif-illustrated-message-heading">${escapeHtml(heading)}</h2>`
      : "";
    const descriptionCode = description
      ? `<p class="uif-illustrated-message-description">${escapeHtml(description)}</p>`
      : "";
    const code = `<div class="uif-illustrated-message" data-preset="${quoteAttr(preset)}"><div class="uif-illustrated-message-illustration" aria-hidden="true">${iconCode({ name: illustrationIcon, decorative: true })}</div><div class="uif-illustrated-message-content">${headingCode}${descriptionCode}</div>${actionCode ? `<div class="uif-illustrated-message-actions">${actionCode}</div>` : ""}</div>`;

    return { element: wrapper, code };
  };

  const renderVanillaProgressCircle = ({ props }) => {
    const size = String(props.size || "md");
    const indeterminate = asBoolean(props.indeterminate);
    const ariaLabel = String(props.ariaLabel || "Loading");
    const rawValue = Number.parseFloat(String(props.value || "0"));
    const value = Number.isFinite(rawValue)
      ? Math.min(100, Math.max(0, rawValue))
      : 0;

    const element = document.createElement("span");
    const classes = ["uif-progress-circle"];
    if (size === "sm" || size === "lg") classes.push(size);
    if (indeterminate) classes.push("is-indeterminate");
    element.className = classes.join(" ");
    element.setAttribute("role", "progressbar");
    element.setAttribute("aria-label", ariaLabel);

    if (!indeterminate) {
      element.setAttribute("aria-valuemin", "0");
      element.setAttribute("aria-valuemax", "100");
      element.setAttribute("aria-valuenow", String(value));
      element.style.setProperty("--_progress-circle-value", String(value));
    }

    element.innerHTML = `<svg class="uif-progress-circle-svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><circle class="uif-progress-circle-track" cx="16" cy="16" r="14" pathLength="100"></circle><circle class="uif-progress-circle-indicator" cx="16" cy="16" r="14" pathLength="100"></circle></svg>`;

    const attrs = [
      `class="${quoteAttr(element.className)}"`,
      'role="progressbar"',
      `aria-label="${quoteAttr(ariaLabel)}"`,
    ];
    if (!indeterminate) {
      attrs.push('aria-valuemin="0"');
      attrs.push('aria-valuemax="100"');
      attrs.push(`aria-valuenow="${value}"`);
      attrs.push(`style="--_progress-circle-value: ${value};"`);
    }

    const code = `<span ${attrs.join(" ")}><svg class="uif-progress-circle-svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><circle class="uif-progress-circle-track" cx="16" cy="16" r="14" pathLength="100"></circle><circle class="uif-progress-circle-indicator" cx="16" cy="16" r="14" pathLength="100"></circle></svg></span>`;
    return { element, code };
  };

  const renderVanillaMenu = ({ props }) => {
    const itemCount = Number(props.items || 4);
    const showDivider = props.divider === "true" || props.divider === true;
    const includeDisabled = props.disabled === "true" || props.disabled === true;
    const includeSelected = props.selected === "true" || props.selected === true;
    const showIcons = props.icons === "true" || props.icons === true;

    const ICONS = ["✏️", "📋", "🔗", "🗑️", "⭐", "📂", "🔔", "⚙️"];
    const wrapper = document.createElement("ul");
    wrapper.className = "uif-menu";
    wrapper.setAttribute("role", "menu");
    wrapper.setAttribute("aria-label", "Options");

    let codeLines = ['<ul class="uif-menu" role="menu" aria-label="Options">'];

    for (let i = 0; i < itemCount; i++) {
      const isDisabled = includeDisabled && i === itemCount - 1;
      const isSelected = includeSelected && i === 0;
      const dividerBefore = showDivider && i === itemCount - 1 && itemCount > 1;

      if (dividerBefore) {
        const divider = document.createElement("li");
        divider.className = "uif-menu-divider";
        divider.setAttribute("role", "separator");
        wrapper.append(divider);
        codeLines.push('  <li class="uif-menu-divider" role="separator"></li>');
      }

      const li = document.createElement("li");
      const classes = ["uif-menu-item"];
      if (isDisabled) classes.push("is-disabled");
      if (isSelected) classes.push("is-selected");
      li.className = classes.join(" ");
      li.setAttribute("role", "menuitem");
      li.setAttribute("tabindex", i === 0 ? "0" : "-1");
      if (isDisabled) li.setAttribute("aria-disabled", "true");
      if (isSelected) li.setAttribute("aria-checked", "true");

      let innerCode = "";
      if (showIcons) {
        const iconSpan = document.createElement("span");
        iconSpan.className = "uif-menu-item-icon";
        iconSpan.setAttribute("aria-hidden", "true");
        iconSpan.textContent = ICONS[i % ICONS.length];
        li.append(iconSpan);
        innerCode += `<span class="uif-menu-item-icon" aria-hidden="true">${ICONS[i % ICONS.length]}</span>`;
      }

      const label = isDisabled ? "Disabled item" : `Item ${i + 1}`;
      li.append(document.createTextNode(label));
      innerCode += label;
      wrapper.append(li);

      const attrStr = [
        isDisabled ? ' aria-disabled="true"' : "",
        isSelected ? ' aria-checked="true"' : "",
      ].join("");
      codeLines.push(`  <li class="${classes.join(" ")}" role="menuitem" tabindex="${i === 0 ? "0" : "-1"}"${attrStr}>${innerCode}</li>`);
    }

    codeLines.push("</ul>");
    return { element: wrapper, code: codeLines.join("\n") };
  };

  const renderVanillaAccordion = ({ props }) => {
    const items = Number(props.items || 3);
    const openIndex = Number(props.openIndex || 0);

    const wrapper = document.createElement("div");
    wrapper.className = "uif-accordion";

    let codeLines = ['<div class="uif-accordion">'];
    for (let i = 0; i < items; i++) {
      const details = document.createElement("details");
      details.className = "uif-accordion-item";
      if (i === openIndex) details.open = true;
      const summary = document.createElement("summary");
      summary.textContent = `Item ${i + 1}`;
      const content = document.createElement("div");
      content.className = "uif-accordion-item-content";
      content.innerHTML = `<p>Content for item ${i + 1}</p>`;
      details.append(summary, content);
      wrapper.append(details);

      const openAttr = i === openIndex ? " open" : "";
      codeLines.push(`  <details class="uif-accordion-item"${openAttr}>`);
      codeLines.push(`    <summary>Item ${i + 1}</summary>`);
      codeLines.push(`    <div class="uif-accordion-item-content"><p>Content for item ${i + 1}</p></div>`);
      codeLines.push(`  </details>`);
    }
    codeLines.push("</div>");

    return { element: wrapper, code: codeLines.join("\n") };
  };

  const renderVanillaTabs = ({ props }) => {
    const tabCount = Number(props.tabs || 3);
    const activeIndex = Number(props.active || 0);

    const wrapper = document.createElement("div");
    wrapper.className = "uif-tabs";

    const tablist = document.createElement("div");
    tablist.className = "uif-tab-list";
    tablist.setAttribute("role", "tablist");

    let codeLines = ['<div class="uif-tabs">', '  <div class="uif-tab-list" role="tablist">'];

    for (let i = 0; i < tabCount; i++) {
      const btn = document.createElement("button");
      btn.className = "uif-tab";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(i === activeIndex));
      btn.setAttribute("tabindex", i === activeIndex ? "0" : "-1");
      btn.textContent = `Tab ${i + 1}`;
      btn.type = "button";
      tablist.append(btn);

      const sel = i === activeIndex ? ' aria-selected="true" tabindex="0"' : ' aria-selected="false" tabindex="-1"';
      codeLines.push(`    <button class="uif-tab" role="tab"${sel} type="button">Tab ${i + 1}</button>`);
    }
    codeLines.push("  </div>");

    wrapper.append(tablist);

    const panel = document.createElement("div");
    panel.className = "uif-tab-panel";
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("tabindex", "0");
    panel.innerHTML = `<p>Panel content for Tab ${activeIndex + 1}</p>`;
    wrapper.append(panel);

    codeLines.push(`  <div class="uif-tab-panel" role="tabpanel" tabindex="0">`);
    codeLines.push(`    <p>Panel content</p>`);
    codeLines.push(`  </div>`);
    codeLines.push("</div>");

    return { element: wrapper, code: codeLines.join("\n") };
  };

  const renderVanillaTreeView = ({ props }) => {
    const selection = String(props.selection || "single") === "multi" ? "multi" : "single";
    const expanded = asBoolean(props.expanded);
    const draggable = asBoolean(props.draggable);
    const lazy = asBoolean(props.lazy);

    const wrapper = document.createElement("div");
    wrapper.className = "uif-tree-view-demo";

    const tree = document.createElement("ul");
    tree.className = "uif-tree-view";
    tree.setAttribute("role", "tree");
    tree.dataset.selection = selection;

    const rootA = document.createElement("li");
    rootA.className = "uif-tree-node is-selected";
    rootA.setAttribute("role", "treeitem");
    rootA.setAttribute("aria-selected", "true");
    rootA.setAttribute("aria-expanded", expanded ? "true" : "false");
    rootA.dataset.nodeId = "root-a";

    const rootARow = document.createElement("div");
    rootARow.className = "uif-tree-node-row";
    rootARow.tabIndex = 0;
    rootARow.draggable = draggable;
    rootARow.innerHTML = '<button class="uif-tree-toggle" type="button" aria-label="Toggle node"></button><span class="uif-tree-label">Projects</span>';
    rootA.append(rootARow);

    const children = document.createElement("ul");
    children.className = "uif-tree-children";
    children.setAttribute("role", "group");
    children.innerHTML = '<li class="uif-tree-node" role="treeitem" aria-selected="false" data-node-id="child-a"><div class="uif-tree-node-row" tabindex="-1"><span class="uif-tree-label">Design system</span></div></li><li class="uif-tree-node" role="treeitem" aria-selected="false" data-node-id="child-b"><div class="uif-tree-node-row" tabindex="-1"><span class="uif-tree-label">Runtime package</span></div></li>';
    rootA.append(children);

    const rootB = document.createElement("li");
    rootB.className = "uif-tree-node";
    rootB.setAttribute("role", "treeitem");
    rootB.setAttribute("aria-selected", "false");
    rootB.dataset.nodeId = "root-b";
    if (lazy) {
      rootB.setAttribute("aria-expanded", "false");
      rootB.setAttribute("data-lazy-url", "/api/tree-view/lazy.json");
    }

    const rootBRow = document.createElement("div");
    rootBRow.className = "uif-tree-node-row";
    rootBRow.tabIndex = -1;
    rootBRow.draggable = draggable;
    rootBRow.innerHTML = `${lazy ? '<button class="uif-tree-toggle" type="button" aria-label="Toggle node"></button>' : ""}<span class="uif-tree-label">Archived</span>`;
    rootB.append(rootBRow);

    tree.append(rootA, rootB);
    wrapper.append(tree);

    const codeLines = [
      `<uif-tree-view selection="${selection}"${draggable ? " draggable" : ""}>`,
      `  <ul class="uif-tree-view" role="tree">`,
      `    <li class="uif-tree-node is-selected" role="treeitem" aria-selected="true" aria-expanded="${expanded ? "true" : "false"}" data-node-id="root-a">`,
      `      <div class="uif-tree-node-row" tabindex="0">`,
      `        <button class="uif-tree-toggle" type="button" aria-label="Toggle node"></button>`,
      `        <span class="uif-tree-label">Projects</span>`,
      `      </div>`,
      `      <ul class="uif-tree-children" role="group">`,
      `        <li class="uif-tree-node" role="treeitem" aria-selected="false" data-node-id="child-a">`,
      `          <div class="uif-tree-node-row" tabindex="-1"><span class="uif-tree-label">Design system</span></div>`,
      `        </li>`,
      `        <li class="uif-tree-node" role="treeitem" aria-selected="false" data-node-id="child-b">`,
      `          <div class="uif-tree-node-row" tabindex="-1"><span class="uif-tree-label">Runtime package</span></div>`,
      `        </li>`,
      `      </ul>`,
      `    </li>`,
      `    <li class="uif-tree-node" role="treeitem" aria-selected="false"${lazy ? ' aria-expanded="false" data-lazy-url="/api/tree-view/lazy.json"' : ""} data-node-id="root-b">`,
      `      <div class="uif-tree-node-row" tabindex="-1">${lazy ? '<button class="uif-tree-toggle" type="button" aria-label="Toggle node"></button>' : ""}<span class="uif-tree-label">Archived</span></div>`,
      `    </li>`,
      `  </ul>`,
      `</uif-tree-view>`,
    ];

    return { element: wrapper, code: codeLines.join("\n") };
  };

  // ─── Divider ──────────────────────────────────

  const renderVanillaDivider = ({ props }) => {
    const variant = String(props.variant || "default");
    const orientation = String(props.orientation || "horizontal");

    const element = document.createElement("hr");
    element.className = "uif-divider";
    if (variant === "subtle") element.classList.add("subtle");
    if (orientation === "vertical") {
      element.setAttribute("aria-orientation", "vertical");
      element.style.display = "inline-block";
      element.style.blockSize = "3rem";
    }

    const classes = ["uif-divider"];
    if (variant === "subtle") classes.push("subtle");
    const attrs = [];
    if (orientation === "vertical") attrs.push('aria-orientation="vertical"');
    const code = `<hr class="${classes.join(" ")}"${attrs.length ? " " + attrs.join(" ") : ""} />`;

    return { element, code };
  };

  const renderVanillaForm = ({ props }) => {
    const borderless = asBoolean(props.borderless);
    const labelPosition = String(props.labelPosition || "top");
    const invalid = asBoolean(props.invalid);
    const actionsAlign = String(props.actionsAlign || "end");

    const form = document.createElement("form");
    const formClasses = ["uif-form"];
    if (borderless) formClasses.push("borderless");
    form.className = formClasses.join(" ");
    form.setAttribute("novalidate", "");

    // Field 1
    const field1 = document.createElement("div");
    const field1Classes = ["uif-form-field"];
    if (invalid) field1Classes.push("is-invalid");
    field1.className = field1Classes.join(" ");
    if (labelPosition === "side") field1.dataset.labelPosition = "side";

    const label1 = document.createElement("label");
    label1.className = "uif-field-label";
    label1.innerHTML = '<span class="uif-label-content"><span class="uif-label-content-text">Email</span></span><span class="uif-field-label-required" aria-hidden="true">*</span>';

    const input1 = document.createElement("input");
    input1.className = "uif-input";
    input1.type = "email";
    input1.placeholder = "you@example.com";

    if (labelPosition === "side") {
      const body1 = document.createElement("div");
      body1.className = "uif-form-field-body";
      body1.append(input1);
      if (invalid) {
        const helper = document.createElement("p");
        helper.className = "uif-form-field-helper";
        helper.textContent = "Please enter a valid email address.";
        body1.append(helper);
      }
      field1.append(label1, body1);
    } else {
      field1.append(label1, input1);
      if (invalid) {
        const helper = document.createElement("p");
        helper.className = "uif-form-field-helper";
        helper.textContent = "Please enter a valid email address.";
        field1.append(helper);
      }
    }

    // Field 2
    const field2 = document.createElement("div");
    field2.className = "uif-form-field";
    if (labelPosition === "side") field2.dataset.labelPosition = "side";

    const label2 = document.createElement("label");
    label2.className = "uif-field-label";
    label2.innerHTML = '<span class="uif-label-content"><span class="uif-label-content-text">Password</span></span>';

    const input2 = document.createElement("input");
    input2.className = "uif-input";
    input2.type = "password";

    if (labelPosition === "side") {
      const body2 = document.createElement("div");
      body2.className = "uif-form-field-body";
      body2.append(input2);
      field2.append(label2, body2);
    } else {
      field2.append(label2, input2);
    }

    // Actions
    const actions = document.createElement("div");
    actions.className = "uif-form-actions";
    if (actionsAlign !== "end") actions.dataset.align = actionsAlign;

    const btn = document.createElement("button");
    btn.className = "uif-button solid";
    btn.type = "submit";
    btn.innerHTML = '<span class="uif-label-content"><span class="uif-label-content-text">Sign in</span></span>';
    actions.append(btn);

    form.append(field1, field2, actions);

    const lp = labelPosition === "side" ? ' data-label-position="side"' : "";
    const inv = invalid ? " is-invalid" : "";
    const alignAttr = actionsAlign !== "end" ? ` data-align="${actionsAlign}"` : "";
    const helperCode = invalid ? '\n    <p class="uif-form-field-helper">Please enter a valid email address.</p>' : "";
    const code = `<form class="${formClasses.join(" ")}" novalidate>
  <div class="uif-form-field${inv}"${lp}>
    <label class="uif-field-label"><span class="uif-label-content"><span class="uif-label-content-text">Email</span></span><span class="uif-field-label-required" aria-hidden="true">*</span></label>
    <input class="uif-input" type="email" placeholder="you@example.com" />${helperCode}
  </div>
  <div class="uif-form-field"${lp}>
    <label class="uif-field-label"><span class="uif-label-content"><span class="uif-label-content-text">Password</span></span></label>
    <input class="uif-input" type="password" />
  </div>
  <div class="uif-form-actions"${alignAttr}>
    <button class="uif-button solid" type="submit"><span class="uif-label-content"><span class="uif-label-content-text">Sign in</span></span></button>
  </div>
</form>`;

    return { element: form, code };
  };

  const renderVanillaSelect = ({ props, meta }) => {
    const previewState = String(meta.state || "default");
    const placeholder = String(props.placeholder || "Choose an option");
    const useOptgroups = asBoolean(props.optgroups);
    const disabled = previewState === "disabled" || asBoolean(props.disabled);

    const element = document.createElement("select");
    const classes = ["uif-select"];

    if (previewState === "hover") classes.push("is-hover");
    if (previewState === "active") classes.push("is-active");
    if (previewState === "focus") classes.push("is-focus-visible");
    if (disabled) classes.push("is-disabled");
    classes.push("is-placeholder");

    element.className = classes.join(" ");
    element.disabled = disabled;

    const placeholderOpt = document.createElement("option");
    placeholderOpt.value = "";
    placeholderOpt.disabled = true;
    placeholderOpt.selected = true;
    placeholderOpt.textContent = placeholder;
    element.append(placeholderOpt);

    if (useOptgroups) {
      const group1 = document.createElement("optgroup");
      group1.label = "Fruits";
      ["Apple", "Banana", "Cherry"].forEach((label) => {
        const opt = document.createElement("option");
        opt.value = label.toLowerCase();
        opt.textContent = label;
        group1.append(opt);
      });
      const group2 = document.createElement("optgroup");
      group2.label = "Vegetables";
      ["Carrot", "Potato"].forEach((label) => {
        const opt = document.createElement("option");
        opt.value = label.toLowerCase();
        opt.textContent = label;
        group2.append(opt);
      });
      element.append(group1, group2);
    } else {
      ["Option 1", "Option 2", "Option 3"].forEach((label, i) => {
        const opt = document.createElement("option");
        opt.value = `opt${i + 1}`;
        opt.textContent = label;
        element.append(opt);
      });
    }

    const attrs = [
      `class="${quoteAttr(element.className)}"`,
    ];
    if (disabled) attrs.push("disabled");

    let optionsCode = "";
    optionsCode += `\n  <option value="" disabled selected>${quoteAttr(placeholder)}</option>`;
    if (useOptgroups) {
      optionsCode += `\n  <optgroup label="Fruits">`;
      optionsCode += `\n    <option value="apple">Apple</option>`;
      optionsCode += `\n    <option value="banana">Banana</option>`;
      optionsCode += `\n    <option value="cherry">Cherry</option>`;
      optionsCode += `\n  </optgroup>`;
      optionsCode += `\n  <optgroup label="Vegetables">`;
      optionsCode += `\n    <option value="carrot">Carrot</option>`;
      optionsCode += `\n    <option value="potato">Potato</option>`;
      optionsCode += `\n  </optgroup>`;
    } else {
      optionsCode += `\n  <option value="opt1">Option 1</option>`;
      optionsCode += `\n  <option value="opt2">Option 2</option>`;
      optionsCode += `\n  <option value="opt3">Option 3</option>`;
    }

    const code = `<select ${attrs.join(" ")}>${optionsCode}\n</select>`;
    return { element, code };
  };

  const renderVanillaComboBox = ({ props, meta }) => {
    const placeholder = String(props.placeholder || "Search destinations");
    const loading = asBoolean(props.loading);
    const allowCustomValue = asBoolean(props.allowCustomValue);
    const descriptions = asBoolean(props.descriptions);
    const disabled =
      String(meta.state || "default") === "disabled" || asBoolean(props.disabled);

    const element = document.createElement("uif-combobox");
    element.setAttribute("placeholder", placeholder);
    element.setAttribute("aria-label", "Destination search");
    if (loading) element.setAttribute("loading", "");
    if (allowCustomValue) element.setAttribute("allow-custom-value", "");
    if (disabled) element.setAttribute("disabled", "");

    element.options = descriptions
      ? [
          { value: "pmi", label: "Palma de Mallorca", description: "Spain" },
          { value: "her", label: "Heraklion", description: "Greece" },
          { value: "fue", label: "Fuerteventura", description: "Canary Islands" },
        ]
      : [
          { value: "pmi", label: "Palma de Mallorca" },
          { value: "her", label: "Heraklion" },
          { value: "fue", label: "Fuerteventura" },
        ];

    const attrs = [
      `placeholder="${quoteAttr(placeholder)}"`,
      'aria-label="Destination search"',
    ];
    if (loading) attrs.push("loading");
    if (allowCustomValue) attrs.push("allow-custom-value");
    if (disabled) attrs.push("disabled");

    const optionsCode = descriptions
      ? `\n  <option value="pmi" data-description="Spain">Palma de Mallorca</option>\n  <option value="her" data-description="Greece">Heraklion</option>\n  <option value="fue" data-description="Canary Islands">Fuerteventura</option>`
      : `\n  <option value="pmi">Palma de Mallorca</option>\n  <option value="her">Heraklion</option>\n  <option value="fue">Fuerteventura</option>`;

    return {
      element,
      code: `<uif-combobox ${attrs.join(" ")}>${optionsCode}\n</uif-combobox>`,
    };
  };

  const renderVanillaTooltip = ({ props, children }) => {
    const text = String(props.text || "Tooltip");
    const placement = String(props.placement || "top");

    const trigger = document.createElement("span");
    trigger.className = "uif-tooltip-trigger";

    const btn = document.createElement("button");
    btn.className = "uif-button outline";
    btn.type = "button";
    btn.textContent = String(children || "Hover me");
    trigger.append(btn);

    const tip = document.createElement("span");
    tip.className = "uif-tooltip is-visible";
    tip.setAttribute("role", "tooltip");
    tip.setAttribute("data-placement", placement);
    tip.textContent = text;
    trigger.append(tip);

    const code = `<span class="uif-tooltip-trigger">
  <button class="uif-button outline" type="button">${quoteAttr(String(children || "Hover me"))}</button>
  <span class="uif-tooltip" role="tooltip" data-placement="${quoteAttr(placement)}">${quoteAttr(text)}</span>
</span>`;

    return { element: trigger, code };
  };

  const renderVanillaPopover = ({ props, children }) => {
    const placement = String(props.placement || "bottom");
    const showArrow = props.arrow === true || props.arrow === "true";
    const content = String(props.content || "Popover content");
    const triggerText = String(children || "Open");

    const container = document.createElement("span");
    container.className = "uif-popover-container";

    const btn = document.createElement("button");
    btn.className = "uif-button outline";
    btn.type = "button";
    btn.textContent = triggerText;
    container.append(btn);

    const panel = document.createElement("div");
    panel.className = "uif-popover is-open";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("data-placement", placement);

    if (showArrow) {
      const arrow = document.createElement("span");
      arrow.className = "uif-popover-arrow";
      arrow.setAttribute("aria-hidden", "true");
      panel.append(arrow);
    }

    const contentEl = document.createElement("div");
    contentEl.className = "uif-popover-content";
    contentEl.textContent = content;
    panel.append(contentEl);
    container.append(panel);

    const arrowMarkup = showArrow
      ? `\n  <span class="uif-popover-arrow" aria-hidden="true"></span>`
      : "";
    const code = `<span class="uif-popover-container">
  <button class="uif-button outline" type="button">${quoteAttr(triggerText)}</button>
  <div class="uif-popover" role="dialog" aria-modal="false" data-placement="${quoteAttr(placement)}">${arrowMarkup}
    <div class="uif-popover-content">${quoteAttr(content)}</div>
  </div>
</span>`;

    return { element: container, code };
  };

  const renderVanillaLink = ({ props, children, meta }) => {
    const previewState = String(meta.state || "default");
    const rawText =
      typeof children === "undefined" ? "Learn more" : String(children || "");
    const href = String(props.href || "#");
    const startIcon = normalizeIconName(props.startIcon);
    const endIcon = normalizeIconName(props.endIcon);
    const disabled =
      previewState === "disabled" || asBoolean(props.disabled);

    const element = document.createElement("a");
    const classes = ["uif-link"];

    if (previewState === "hover") classes.push("is-hover");
    if (previewState === "active") classes.push("is-active");
    if (previewState === "visited") classes.push("is-visited");
    if (previewState === "focus") classes.push("is-focus-visible");
    if (disabled) classes.push("is-disabled");

    element.className = classes.join(" ");
    if (disabled) {
      element.removeAttribute("href");
      element.setAttribute("aria-disabled", "true");
      element.tabIndex = -1;
    } else {
      element.href = href;
    }

    if (startIcon) {
      const icon = createIconElement({ name: startIcon, decorative: true });
      if (icon) element.append(icon);
    }

    const textNode = document.createTextNode(rawText);
    element.append(textNode);

    if (endIcon) {
      const icon = createIconElement({ name: endIcon, decorative: true });
      if (icon) element.append(icon);
    }

    const attrs = [`class="${quoteAttr(element.className)}"`];
    if (!disabled) attrs.push(`href="${quoteAttr(href)}"`);
    if (disabled) {
      attrs.push('aria-disabled="true"');
      attrs.push('tabindex="-1"');
    }

    const startIconMarkup = startIcon
      ? iconCode({ name: startIcon, decorative: true })
      : "";
    const endIconMarkup = endIcon
      ? iconCode({ name: endIcon, decorative: true })
      : "";

    const code = `<a ${attrs.join(" ")}>${startIconMarkup}${quoteAttr(rawText)}${endIconMarkup}</a>`;
    return { element, code };
  };

  // ─── ActionBar ────────────────────────────────────────────────────
  const renderVanillaActionBar = ({ props }) => {
    const count = Math.max(0, parseInt(String(props.count || "3"), 10) || 0);
    const isOpen = asBoolean(props.open !== undefined ? props.open : true);
    const countText = count === 1 ? "1 item selected" : `${count} items selected`;

    const bar = document.createElement("div");
    const classes = ["uif-action-bar"];
    if (isOpen) classes.push("is-open");
    bar.className = classes.join(" ");
    bar.setAttribute("role", "toolbar");
    bar.setAttribute("aria-label", "Bulk actions");

    const countSpan = document.createElement("span");
    countSpan.className = "uif-action-bar-count";
    countSpan.textContent = countText;
    bar.append(countSpan);

    const actions = document.createElement("div");
    actions.className = "uif-action-bar-actions";
    for (const label of ["Delete", "Export"]) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "uif-button ghost sm";
      btn.textContent = label;
      actions.append(btn);
    }
    bar.append(actions);

    const spacer = document.createElement("span");
    spacer.className = "uif-action-bar-spacer";
    spacer.setAttribute("aria-hidden", "true");
    bar.append(spacer);

    const dismiss = document.createElement("button");
    dismiss.type = "button";
    dismiss.className = "uif-action-bar-dismiss";
    dismiss.setAttribute("aria-label", "Dismiss");
    const icon = createIconElement({ name: "close", decorative: true });
    if (icon) dismiss.append(icon);
    bar.append(dismiss);

    const codeLines = [
      `<div class="${classes.join(" ")}" role="toolbar" aria-label="Bulk actions">`,
      `  <span class="uif-action-bar-count">${quoteAttr(countText)}</span>`,
      `  <div class="uif-action-bar-actions">`,
      `    <button type="button" class="uif-button ghost sm">Delete</button>`,
      `    <button type="button" class="uif-button ghost sm">Export</button>`,
      `  </div>`,
      `  <span class="uif-action-bar-spacer" aria-hidden="true"></span>`,
      `  <button type="button" class="uif-action-bar-dismiss" aria-label="Dismiss">`,
      `    ${iconCode({ name: "close", decorative: true })}`,
      `  </button>`,
      `</div>`,
    ];
    const code = codeLines.join("\n");

    return { element: bar, code };
  };

  const renderVanillaBreadcrumbs = ({ props }) => {
    const depth = Math.max(2, Number(props.depth || 4));
    const separator = String(props.separator || "/");
    const collapse = String(props.collapse || "responsive");
    const maxItems = Math.max(2, Number(props.maxItems || 4));

    const labels = [
      "Home",
      "Category",
      "Collection",
      "Details",
      "Current page with a long label",
    ];

    const items = labels.slice(0, depth).map((label, index, arr) => ({
      label,
      href: index === arr.length - 1 ? "" : `#${index + 1}`,
      current: index === arr.length - 1,
    }));

    const alwaysCollapsed = collapse === "always" && items.length > maxItems;
    const responsiveCollapse = collapse === "responsive" && items.length > 2;
    const listClasses = ["uif-breadcrumbs-list"];
    if (alwaysCollapsed) listClasses.push("is-collapsed");
    if (responsiveCollapse) listClasses.push("is-responsive");

    const list = document.createElement("ol");
    list.className = listClasses.join(" ");
    list.dataset.separator = separator;
    list.dataset.collapse = collapse;

    const renderedItems = alwaysCollapsed
      ? [items[0], { overflow: true }, ...items.slice(-(maxItems - 1))]
      : items;

    const renderItem = (item, itemIndex, total) => {
      const li = document.createElement("li");
      li.className = "uif-breadcrumb-item";
      li.dataset.separator = separator;

      if (responsiveCollapse && itemIndex > 0 && itemIndex < total - 1 && !item.overflow) {
        li.classList.add("is-middle");
      }

      if (item.overflow) {
        li.classList.add("is-overflow");
        const overflow = document.createElement("span");
        overflow.className = "uif-breadcrumb-overflow";
        overflow.setAttribute("aria-hidden", "true");
        overflow.textContent = "…";
        li.append(overflow);
        return li;
      }

      if (item.current || itemIndex === total - 1) {
        const current = document.createElement("span");
        current.className = "uif-breadcrumb-current";
        current.setAttribute("aria-current", "page");
        current.textContent = item.label;
        li.append(current);
        return li;
      }

      const anchor = document.createElement("a");
      anchor.className = "uif-breadcrumb-link";
      anchor.href = item.href || "#";
      anchor.textContent = item.label;
      li.append(anchor);
      return li;
    };

    renderedItems.forEach((item, index) => {
      list.append(renderItem(item, index, renderedItems.length));
      if (responsiveCollapse && index === 0) {
        list.append(renderItem({ overflow: true }, index + 1, renderedItems.length + 1));
      }
    });

    const nav = document.createElement("nav");
    nav.className = "uif-breadcrumbs";
    nav.setAttribute("aria-label", "Breadcrumb");
    nav.append(list);

    const codeLines = [
      `<nav class="uif-breadcrumbs" aria-label="Breadcrumb">`,
      `  <ol class="${quoteAttr(list.className)}" data-separator="${quoteAttr(separator)}" data-collapse="${quoteAttr(collapse)}">`,
    ];

    const pushCodeItem = (item, index, total) => {
      const middleClass = responsiveCollapse && index > 0 && index < total - 1 && !item.overflow ? " is-middle" : "";
      if (item.overflow) {
        codeLines.push(`    <li class="uif-breadcrumb-item is-overflow" data-separator="${quoteAttr(separator)}"><span class="uif-breadcrumb-overflow" aria-hidden="true">…</span></li>`);
        return;
      }
      if (item.current || index === total - 1) {
        codeLines.push(`    <li class="uif-breadcrumb-item${middleClass}" data-separator="${quoteAttr(separator)}"><span class="uif-breadcrumb-current" aria-current="page">${quoteAttr(item.label)}</span></li>`);
        return;
      }
      codeLines.push(`    <li class="uif-breadcrumb-item${middleClass}" data-separator="${quoteAttr(separator)}"><a class="uif-breadcrumb-link" href="${quoteAttr(item.href || "#")}">${quoteAttr(item.label)}</a></li>`);
    };

    renderedItems.forEach((item, index) => {
      pushCodeItem(item, index, renderedItems.length);
      if (responsiveCollapse && index === 0) {
        pushCodeItem({ overflow: true }, index + 1, renderedItems.length + 1);
      }
    });

    codeLines.push("  </ol>");
    codeLines.push("</nav>");

    return { element: nav, code: codeLines.join("\n") };
  };

  // ─── Calendar ─────────────────────────────────────────────────────
  const renderVanillaCalendar = ({ props, meta }) => {
    const month = String(props.month || "2026-07");
    const selectedDate = String(props.selectedDate || "");
    const rangeStart = Number(props.rangeStart || 0);
    const rangeEnd = Number(props.rangeEnd || 0);
    const hasRange = rangeStart > 0 && rangeEnd >= rangeStart;
    const todayDate = String(props.todayDate || "1");
    const previewState = String(meta.state || "default");
    const hasContainer = props.container !== false;
    const disabled = asBoolean(props.disabled);

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [yearValue, monthValue] = month.split("-");
    const selectedYear = Number(yearValue) || 2026;
    const selectedMonth = Math.max(0, Math.min(11, (Number(monthValue) || 7) - 1));
    const disabledAttr = disabled ? " disabled" : "";

    // Build header with selects
    let headerHtml = `<div class="uif-calendar-header">`;
    headerHtml += `<button type="button" class="uif-button ghost" aria-label="Previous month"${disabledAttr}><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/chevron--left.svg');" aria-hidden="true"></span></button>`;
    headerHtml += `<span class="uif-calendar-selectors">`;
    headerHtml += `<select class="uif-select uif-calendar-header-select" name="month" aria-label="Month"${disabledAttr}>`;
    months.forEach((m, i) => { headerHtml += `<option value="${i}"${i === selectedMonth ? " selected" : ""}>${m}</option>`; });
    headerHtml += `</select>`;
    headerHtml += `<select class="uif-select uif-calendar-header-select" name="year" aria-label="Year"${disabledAttr}>`;
    for (let y = 2020; y <= 2030; y++) { headerHtml += `<option value="${y}"${y === selectedYear ? " selected" : ""}>${y}</option>`; }
    headerHtml += `</select></span>`;
    headerHtml += `<button type="button" class="uif-button ghost" aria-label="Next month"${disabledAttr}><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/chevron.svg');" aria-hidden="true"></span></button>`;
    headerHtml += `</div>`;

    // Build table
    const theadHtml = `<thead><tr>${weekdays.map((d) => `<th scope="col" abbr="${d}">${d}</th>`).join("")}</tr></thead>`;

    let tbodyHtml = "<tbody>";
    let day = 1;
    for (let week = 0; week < 5; week++) {
      tbodyHtml += "<tr>";
      for (let dow = 0; dow < 7; dow++) {
        if (day <= 31) {
          const classes = ["uif-calendar-cell"];
          if (previewState === "hover" && day === 15) classes.push("is-hover");
          if (previewState === "focus" && day === 15) classes.push("is-focus-visible");
          if (selectedDate === String(day)) classes.push("is-selected");
          if (hasRange && day === rangeStart) classes.push("is-range-start");
          if (hasRange && day > rangeStart && day < rangeEnd) classes.push("is-range-middle");
          if (hasRange && day === rangeEnd) classes.push("is-range-end");
          if (todayDate === String(day)) classes.push("is-today");
          if (disabled) classes.push("is-disabled");

          const selected = selectedDate === String(day) || (hasRange && day >= rangeStart && day <= rangeEnd) ? "true" : "false";
          const tabindex = day === 1 ? "0" : "-1";
          tbodyHtml += `<td><button type="button" class="${classes.join(" ")}" aria-selected="${selected}" tabindex="${tabindex}"${disabledAttr}>${day}</button></td>`;
          day++;
        } else {
          tbodyHtml += "<td></td>";
        }
      }
      tbodyHtml += "</tr>";
    }
    tbodyHtml += "</tbody>";

    const calendarClasses = ["uif-calendar"];
    if (hasContainer) calendarClasses.push("has-container");
    const html = `<div class="${calendarClasses.join(" ")}">${headerHtml}<table class="uif-calendar-table" role="grid" aria-label="${quoteAttr(month)}">${theadHtml}${tbodyHtml}</table></div>`;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    const element = wrapper.firstElementChild;

    const code = html;
    return { element, code };
  };

  // ─── Number Field ─────────────────────────────────────────────────
  const renderVanillaNumberField = ({ props, meta }) => {
    const previewState = String(meta.state || "default");
    const value = props.value != null ? String(props.value) : "";
    const min = String(props.min || "");
    const max = String(props.max || "");
    const step = String(props.step || "");
    const format = String(props.format || "");
    const placeholder = String(props.placeholder || "0");
    const isDisabled = previewState === "disabled" || Boolean(props.disabled);
    const isReadonly = previewState === "readonly";

    const wrapper = document.createElement("div");
    const wrapperClasses = ["uif-input-field", "uif-number-field"];
    if (previewState === "hover") wrapperClasses.push("is-hover");
    if (previewState === "active") wrapperClasses.push("is-active");
    if (previewState === "focus") wrapperClasses.push("is-focus-visible");
    if (isDisabled) wrapperClasses.push("is-disabled");
    if (previewState === "invalid") wrapperClasses.push("is-invalid");
    wrapper.className = wrapperClasses.join(" ");

    if (format === "currency") {
      const prefix = document.createElement("span");
      prefix.className = "uif-number-field-prefix";
      prefix.setAttribute("aria-hidden", "true");
      prefix.textContent = "$";
      wrapper.appendChild(prefix);
    }

    const input = document.createElement("input");
    input.className = "uif-input";
    input.type = "number";
    input.placeholder = placeholder;
    input.value = value;
    input.disabled = isDisabled;
    input.readOnly = isReadonly;
    if (min) input.min = min;
    if (max) input.max = max;
    if (step) input.step = step;
    wrapper.appendChild(input);

    if (format === "percent") {
      const suffix = document.createElement("span");
      suffix.className = "uif-number-field-suffix";
      suffix.setAttribute("aria-hidden", "true");
      suffix.textContent = "%";
      wrapper.appendChild(suffix);
    }

    const control = document.createElement("span");
    control.className = "uif-input-field-control";
    const controlIcons = [
      { icon: "minus-circled", label: "Decrease value" },
      { icon: "plus-circled", label: "Increase value" },
    ];
    controlIcons.forEach(({ icon, label }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", label);
      if (isDisabled) btn.disabled = true;
      const iconEl = createIconElement({ name: icon, decorative: true });
      if (iconEl) btn.appendChild(iconEl);
      control.appendChild(btn);
    });
    wrapper.appendChild(control);

    // Generate code
    const inputAttrs = [`class="uif-input"`, `type="number"`];
    if (placeholder) inputAttrs.push(`placeholder="${quoteAttr(placeholder)}"`);
    if (value) inputAttrs.push(`value="${quoteAttr(value)}"`);
    if (min) inputAttrs.push(`min="${quoteAttr(min)}"`);
    if (max) inputAttrs.push(`max="${quoteAttr(max)}"`);
    if (step) inputAttrs.push(`step="${quoteAttr(step)}"`);
    if (isDisabled) inputAttrs.push("disabled");

    const prefixCode = format === "currency"
      ? `<span class="uif-number-field-prefix" aria-hidden="true">$</span>\n  ` : "";
    const suffixCode = format === "percent"
      ? `\n  <span class="uif-number-field-suffix" aria-hidden="true">%</span>` : "";
    const controlCode = controlIcons
      .map(({ icon, label }) => `<button type="button" aria-label="${quoteAttr(label)}">${iconCode({ name: icon, decorative: true })}</button>`)
      .join("\n    ");

    const code = `<div class="${quoteAttr(wrapper.className)}">
  ${prefixCode}<input ${inputAttrs.join(" ")} />${suffixCode}
  <span class="uif-input-field-control">
    ${controlCode}
  </span>
</div>`;

    return { element: wrapper, code };
  };

  // ─── Date Picker ──────────────────────────────────────────────────
  const renderVanillaDatePicker = ({ props, meta }) => {
    const previewState = String(meta.state || "default");
    const isOpen = previewState === "open";
    const disabled = previewState === "disabled";
    const day = String(props.day || "");
    const month = String(props.month || "");
    const year = String(props.year || "");
    const disabledAttr = disabled ? " disabled" : "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = Number(day);
    const selectedMonth = Number(month);
    const selectedYear = Number(year);
    const visibleYear = selectedYear >= 1900 && selectedYear <= 2100
      ? selectedYear
      : today.getFullYear();
    const visibleMonth = selectedMonth >= 1 && selectedMonth <= 12
      ? selectedMonth - 1
      : today.getMonth();
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const weekdayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

    const rootClasses = ["uif-input-field", "date"];
    if (isOpen) rootClasses.push("is-open");

    let html = `<div class="uif-form-field date-picker-field">`;
    html += `<label class="uif-field-label" id="date-picker-playground-label" for="date-picker-playground-day"><span class="uif-label-content"><span class="uif-label-content-text">Travel date</span></span></label>`;
    html += `<div class="${rootClasses.join(" ")}" role="group" aria-labelledby="date-picker-playground-label">`;
    html += `<div class="date-segments">`;
    html += `<input class="date-segment day" id="date-picker-playground-day" type="text" inputmode="numeric" maxlength="2" placeholder="DD" aria-label="Day" value="${quoteAttr(day)}"${disabledAttr}>`;
    html += `<span class="date-separator">/</span>`;
    html += `<input class="date-segment month" id="date-picker-playground-month" type="text" inputmode="numeric" maxlength="2" placeholder="MM" aria-label="Month" value="${quoteAttr(month)}"${disabledAttr}>`;
    html += `<span class="date-separator">/</span>`;
    html += `<input class="date-segment year" id="date-picker-playground-year" type="text" inputmode="numeric" maxlength="4" placeholder="YYYY" aria-label="Year" value="${quoteAttr(year)}"${disabledAttr}>`;
    html += `</div>`;
    html += `<span class="uif-input-field-control">`;
    html += `<button type="button" aria-label="Open calendar" aria-expanded="${isOpen}" aria-haspopup="grid" aria-controls="date-picker-playground-calendar"${disabledAttr}>`;
    html += `<span class="uif-icon" style="--uif-icon-src: url('/assets/icons/calendar.svg');" aria-hidden="true"></span>`;
    html += `</button></span>`;
    html += `<div class="uif-calendar" id="date-picker-playground-calendar"><div class="uif-calendar-header">`;
    html += `<button type="button" class="uif-button ghost" aria-label="Previous month"><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/chevron--left.svg');" aria-hidden="true"></span></button>`;
    html += `<span class="uif-calendar-selectors"><select class="uif-select uif-calendar-header-select" name="month" aria-label="Month">`;
    monthNames.forEach((m, i) => { html += `<option value="${i}"${i === visibleMonth ? " selected" : ""}>${m}</option>`; });
    html += `</select><select class="uif-select uif-calendar-header-select" name="year" aria-label="Year">`;
    for (let y = 2020; y <= 2030; y++) { html += `<option value="${y}"${y === visibleYear ? " selected" : ""}>${y}</option>`; }
    html += `</select></span>`;
    html += `<button type="button" class="uif-button ghost" aria-label="Next month"><span class="uif-icon" style="--uif-icon-src: url('/assets/icons/chevron.svg');" aria-hidden="true"></span></button>`;
    const monthLabel = `${monthNames[visibleMonth]} ${visibleYear}`;
    html += `</div><table class="uif-calendar-table" role="grid" aria-label="${monthLabel}"><thead><tr>`;
    weekdayNames.forEach((d) => { html += `<th scope="col">${d}</th>`; });
    html += `</tr></thead><tbody>`;
    const firstDay = new Date(visibleYear, visibleMonth, 1);
    const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();
    const startDow = (firstDay.getDay() + 6) % 7;
    let d = 1;
    let started = false;
    for (let w = 0; w < 6; w++) {
      if (d > daysInMonth) break;
      html += "<tr>";
      for (let dow = 0; dow < 7; dow++) {
        if (!started && dow < startDow) {
          html += "<td></td>";
        } else if (d <= daysInMonth) {
          started = true;
          const date = new Date(visibleYear, visibleMonth, d);
          const classes = ["uif-calendar-cell"];
          const isSelected = selectedDay === d && selectedMonth === visibleMonth + 1 && selectedYear === visibleYear;
          const isToday = date.toDateString() === today.toDateString();
          if (isSelected) classes.push("is-selected");
          if (isToday) classes.push("is-today");
          html += `<td><button type="button" class="${classes.join(" ")}" aria-selected="${isSelected ? "true" : "false"}" tabindex="${d === 1 ? "0" : "-1"}">${d}</button></td>`;
          d++;
        } else {
          html += "<td></td>";
        }
      }
      html += "</tr>";
    }
    html += `</tbody></table></div></div></div>`;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    const element = wrapper.firstElementChild;

    return { element, code: html };
  };

  // ─── Table ────────────────────────────────────

  const TABLE_ROWS = [
    ["Mallorca", "15 Aug 2025", "7 nights", "€499"],
    ["Tenerife", "22 Aug 2025", "14 nights", "€799"],
    ["Lanzarote", "01 Sep 2025", "10 nights", "€649"],
    ["Fuerteventura", "10 Sep 2025", "7 nights", "€529"],
    ["Rhodes", "18 Sep 2025", "7 nights", "€589"],
  ];

  const renderVanillaTable = ({ props }) => {
    const density = String(props.density || "default");
    const selection = String(props.selection || "none");
    const sortable = props.sortable === true || props.sortable === "true";
    const resizable = props.resizable === true || props.resizable === "true";

    const tableClasses = ["uif-table"];
    if (density !== "default") tableClasses.push(`uif-table--${density}`);
    const tableAttrs = [`class="${tableClasses.join(" ")}"`];
    if (selection !== "none") tableAttrs.push(`data-selection="${selection}"`);

    const hasCheckboxes = selection === "multi";
    const headers = ["Destination", "Departure", "Duration", "Price"];

    let theadCells = "";
    if (hasCheckboxes) {
      theadCells += `<th><input type="checkbox" aria-label="Select all" /></th>`;
    }
    headers.forEach((h) => {
      const sortAttr = sortable ? ' aria-sort="none"' : "";
      const resizeAttr = resizable ? " data-resizable" : "";
      theadCells += `<th${sortAttr}${resizeAttr}>${h}</th>`;
    });

    let tbodyRows = "";
    TABLE_ROWS.forEach((row) => {
      let cells = "";
      if (hasCheckboxes) cells += `<td><input type="checkbox" /></td>`;
      row.forEach((cell) => { cells += `<td>${cell}</td>`; });
      tbodyRows += `<tr>${cells}</tr>`;
    });

    const html = `<div class="uif-table-wrapper"><table ${tableAttrs.join(" ")}><thead><tr>${theadCells}</tr></thead><tbody>${tbodyRows}</tbody></table></div>`;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    const element = wrapper.firstElementChild;

    return { element, code: html };
  };

  const renderVanillaInlineAlert = ({ props }) => {
    const variant = String(props.variant || "info");
    const title = String(props.title || "");
    const description = String(props.description || "");
    const dismissible = asBoolean(props.dismissible);

    const iconMap = {
      info: "info-circled",
      positive: "checkmark-circled",
      negative: "cross-circled",
      notice: "exclamation-mark-circled",
    };
    const icon = iconMap[variant] || "info-circled";

    const classes = ["uif-inline-alert"];
    if (variant) classes.push(variant);

    const wrapper = document.createElement("div");
    wrapper.className = classes.join(" ");
    wrapper.setAttribute("role", "alert");

    const iconSpan = document.createElement("span");
    iconSpan.className = "uif-inline-alert-icon";
    const iconEl = createIconElement({ name: icon, decorative: true });
    if (iconEl) iconSpan.append(iconEl);
    wrapper.append(iconSpan);

    const content = document.createElement("div");
    content.className = "uif-inline-alert-content";

    if (title) {
      const titleEl = document.createElement("strong");
      titleEl.className = "uif-inline-alert-title";
      titleEl.textContent = title;
      content.append(titleEl);
    }

    if (description) {
      const descEl = document.createElement("p");
      descEl.className = "uif-inline-alert-description";
      descEl.textContent = description;
      content.append(descEl);
    }

    wrapper.append(content);

    if (dismissible) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "uif-inline-alert-dismiss";
      btn.setAttribute("aria-label", "Dismiss");
      const crossIcon = createIconElement({ name: "cross", decorative: true });
      if (crossIcon) btn.append(crossIcon);
      btn.addEventListener("click", () => wrapper.classList.add("is-hidden"));
      wrapper.append(btn);
    }

    const codeClasses = classes.map((c) => quoteAttr(c)).join(" ");
    const iconMarkup = iconCode({ name: icon, decorative: true });
    const titleMarkup = title ? `<strong class="uif-inline-alert-title">${quoteAttr(title)}</strong>` : "";
    const descMarkup = description ? `<p class="uif-inline-alert-description">${quoteAttr(description)}</p>` : "";
    const dismissMarkup = dismissible
      ? `<button type="button" class="uif-inline-alert-dismiss" aria-label="Dismiss">${iconCode({ name: "cross", decorative: true })}</button>`
      : "";
    const code = `<div class="${codeClasses}" role="alert"><span class="uif-inline-alert-icon">${iconMarkup}</span><div class="uif-inline-alert-content">${titleMarkup}${descMarkup}</div>${dismissMarkup}</div>`;

    return { element: wrapper, code };
  };

  const renderVanillaCard = ({ props, children }) => {
    const title =
      typeof children === "undefined" ? "Card title" : String(children || "Card title");
    const body = String(props.body || "A short description of the card content goes here.");
    const layout = String(props.layout || "vertical");
    const interactive = asBoolean(props.interactive);
    const selected = asBoolean(props.selected);
    const showMedia = asBoolean(props.showMedia);
    const showFooter = props.showFooter === undefined ? true : asBoolean(props.showFooter);

    const classes = ["uif-card"];
    if (layout === "horizontal") classes.push("horizontal");
    if (interactive) classes.push("interactive");
    if (selected) classes.push("is-selected");

    const card = document.createElement("article");
    card.className = classes.join(" ");
    if (interactive) card.setAttribute("tabindex", "0");
    if (selected) card.setAttribute("aria-selected", "true");
    card.style.maxInlineSize = layout === "horizontal" ? "100%" : "22rem";

    if (showMedia) {
      const media = document.createElement("div");
      media.className = "uif-card-media";
      const placeholder = document.createElement("div");
      placeholder.style.cssText =
        "background: var(--color-fill-subtle); block-size: 10rem;";
      media.append(placeholder);
      card.append(media);
    }

    const header = document.createElement("div");
    header.className = "uif-card-header";
    const strong = document.createElement("strong");
    strong.textContent = title;
    header.append(strong);
    card.append(header);

    const bodyEl = document.createElement("div");
    bodyEl.className = "uif-card-body";
    const p = document.createElement("p");
    p.textContent = body;
    bodyEl.append(p);
    card.append(bodyEl);

    if (showFooter) {
      const footer = document.createElement("div");
      footer.className = "uif-card-footer";
      const btn = document.createElement("button");
      btn.className = "uif-button solid";
      btn.type = "button";
      btn.innerHTML = '<span class="uif-label-content"><span class="uif-label-content-text">Action</span></span>';
      footer.append(btn);
      card.append(footer);
    }

    const mediaCode = showMedia
      ? `\n  <div class="uif-card-media"><div style="background: var(--color-fill-subtle); block-size: 10rem;"></div></div>`
      : "";
    const footerCode = showFooter
      ? `\n  <div class="uif-card-footer"><button class="uif-button solid" type="button"><span class="uif-label-content"><span class="uif-label-content-text">Action</span></span></button></div>`
      : "";
    const currentAttr = selected ? ' aria-selected="true"' : "";
    const tabAttr = interactive ? ' tabindex="0"' : "";
    const code = `<article class="${quoteAttr(classes.join(" "))}"${tabAttr}${currentAttr}>${mediaCode}\n  <div class="uif-card-header"><strong>${quoteAttr(title)}</strong></div>\n  <div class="uif-card-body"><p>${quoteAttr(body)}</p></div>${footerCode}\n</article>`;

    return { element: card, code };
  };

  const renderVanillaSkeleton = ({ props }) => {
    const shape = String(props.shape || "text");
    const size = String(props.size || "md");
    const width = String(props.width || "");
    const animated = props.animated !== false && props.animated !== "false";

    const classes = ["uif-skeleton"];
    if (shape) classes.push(shape);
    if (size === "sm") classes.push("sm");
    if (size === "lg") classes.push("lg");
    if (width === "short" || width === "medium") classes.push(width);
    if (!animated) classes.push("no-animation");

    const element = document.createElement("span");
    element.className = classes.join(" ");
    element.setAttribute("role", "status");
    element.setAttribute("aria-label", "Loading\u2026");
    element.setAttribute("aria-busy", "true");

    const codeClasses = classes.map((c) => quoteAttr(c)).join(" ");
    const code = `<span class="${codeClasses}" role="status" aria-label="Loading\u2026" aria-busy="true"></span>`;

    return { element, code };
  };

  global.UIPlaygroundRenderers = {
    renderers: {
      badge: renderVanillaBadge,
      "status-light": renderVanillaStatusLight,
      button: renderVanillaButton,
      "button-group": renderVanillaButtonGroup,
      card: renderVanillaCard,
      checkbox: renderVanillaCheckbox,
      divider: renderVanillaDivider,
      icon: renderVanillaIcon,
      input: renderVanillaInput,
      dropzone: renderVanillaDropzone,
      label: renderVanillaLabel,
      link: renderVanillaLink,
      "range-slider": renderVanillaRangeSlider,
      "progress-circle": renderVanillaProgressCircle,
      breadcrumbs: renderVanillaBreadcrumbs,
      radio: renderVanillaRadio,
      switch: renderVanillaSwitch,
      textarea: renderVanillaTextarea,
      avatar: renderVanillaAvatar,
      "illustrated-message": renderVanillaIllustratedMessage,
      accordion: renderVanillaAccordion,
      tabs: renderVanillaTabs,
      "tree-view": renderVanillaTreeView,
      tooltip: renderVanillaTooltip,
      popover: renderVanillaPopover,
      select: renderVanillaSelect,
      combobox: renderVanillaComboBox,
      form: renderVanillaForm,
      actionBar: renderVanillaActionBar,
      calendar: renderVanillaCalendar,
      datePicker: renderVanillaDatePicker,
      table: renderVanillaTable,
      "inline-alert": renderVanillaInlineAlert,
      skeleton: renderVanillaSkeleton,
      "number-field": renderVanillaNumberField,
      menu: renderVanillaMenu,
    },
  };
})(window);
