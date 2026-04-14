(function initPlaygroundRenderers(global) {
  const shared = global.UIPlaygroundShared || {};
  const quoteAttr = shared.quoteAttr || ((value) => String(value || ""));
  const normalizeIconName =
    shared.normalizeIconName || ((rawValue) => String(rawValue || "").trim());
  const asBoolean = (value) =>
    value === true || value === "true" || value === 1 || value === "1";

  const iconLabelFromName = (name) =>
    String(name || "")
      .replace(/[-_]+/g, " ")
      .trim();

  const iconSrcFromName = (name) => `/assets/icons/${name}.svg`;

  const createIconElement = ({ name, decorative = true, label, color }) => {
    const normalizedName = normalizeIconName(name);
    if (!normalizedName) return null;

    const element = document.createElement("span");
    element.className = "icon";
    element.style.setProperty(
      "--icon-src",
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
      `--icon-src: url('/assets/icons/${quoteAttr(normalizedName)}.svg')`,
    ];
    if (color) {
      styleEntries.push(`color: ${color}`);
    }

    const attrs = [
      'class="icon"',
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
      'class="icon"',
      `class="icon" data-slot="${position}"`,
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
    const classes = ["button"];

    if (variant === "outline") classes.push("outline");
    if (variant === "ghost") classes.push("ghost");
    if (resolvedIconOnly) classes.push("button--icon-only");
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
    const contentClasses = ["label-content"];
    if (resolvedIconOnly) contentClasses.push("is-icon-only");
    content.className = contentClasses.join(" ");

    const startSlot = createLabelIconSlot(iconStart, "start");
    if (startSlot) content.append(startSlot);

    if (!resolvedIconOnly && hasText) {
      const textNode = document.createElement("span");
      textNode.className = "label-content__text";
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
        ? `<span class="label-content__text">${quoteAttr(rawLabel)}</span>`
        : "",
      labelIconCode(iconEnd, "end"),
    ]
      .filter(Boolean)
      .join("");

    const codeContentClasses = ["label-content"];
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
      host.className = "field-label";
      host.setAttribute("for", forId);
    }
    host.style.lineHeight = lineHeight;
    if (color) host.style.color = color;

    const labelContent = document.createElement("span");
    labelContent.className = "label-content";

    const hasText = text.trim().length > 0;
    if (iconOnly || !hasText) {
      labelContent.classList.add("is-icon-only");
    }

    const startSlot = createLabelIconSlot(iconStart, "start");
    if (startSlot) labelContent.append(startSlot);

    if (!iconOnly && hasText) {
      const textElement = document.createElement("span");
      textElement.className = "label-content__text";
      textElement.textContent = text;
      labelContent.append(textElement);
    }

    const endSlot = createLabelIconSlot(iconEnd, "end");
    if (endSlot) labelContent.append(endSlot);

    host.append(labelContent);

    if (mode === "field" && required) {
      const requiredMarker = document.createElement("span");
      requiredMarker.className = "field-label__required";
      requiredMarker.setAttribute("aria-hidden", "true");
      requiredMarker.textContent = "*";
      host.append(requiredMarker);

      const requiredText = document.createElement("span");
      requiredText.className = "field-label__required-text";
      requiredText.textContent = " (required)";
      host.append(requiredText);
    }

    const hostStyleEntries = [`line-height: ${lineHeight}`];
    if (color) hostStyleEntries.push(`color: ${color}`);

    const contentClasses = ["label-content"];
    if (iconOnly || !hasText) contentClasses.push("is-icon-only");
    const contentMarkup = [
      labelIconCode(iconStart, "start"),
      !iconOnly && hasText
        ? `<span class="label-content__text">${quoteAttr(text)}</span>`
        : "",
      labelIconCode(iconEnd, "end"),
    ]
      .filter(Boolean)
      .join("");

    if (mode === "field") {
      const requiredMarkup = required
        ? '<span class="field-label__required" aria-hidden="true">*</span><span class="field-label__required-text"> (required)</span>'
        : "";
      const code = `<label for="${quoteAttr(forId)}" class="field-label" style="${quoteAttr(hostStyleEntries.join("; "))}"><span class="${quoteAttr(contentClasses.join(" "))}">${contentMarkup}</span>${requiredMarkup}</label>`;
      return { element: host, code };
    }

    const code = `<span style="${quoteAttr(hostStyleEntries.join("; "))}"><span class="${quoteAttr(contentClasses.join(" "))}">${contentMarkup}</span></span>`;
    return { element: host, code };
  };

  const renderVanillaInput = ({ props, meta }) => {
    const element = document.createElement("input");
    const previewState = String(meta.state || "default");
    const type = String(props.type || "text");
    const placeholder = String(props.placeholder || "");
    const value = String(props.value || "");
    const classes = ["input"];

    if (previewState === "hover") classes.push("is-hover");
    if (previewState === "active") classes.push("is-active");
    if (previewState === "focus") classes.push("is-focus-visible");
    if (previewState === "disabled") classes.push("is-disabled");
    if (props.className) classes.push(String(props.className));

    element.className = classes.join(" ");
    element.type = type;
    element.placeholder = placeholder;
    element.value = value;
    element.disabled = previewState === "disabled" || Boolean(props.disabled);

    const attrs = [
      `class="${quoteAttr(element.className)}"`,
      `type="${quoteAttr(type)}"`,
    ];
    if (placeholder) attrs.push(`placeholder="${quoteAttr(placeholder)}"`);
    if (value) attrs.push(`value="${quoteAttr(value)}"`);
    if (element.disabled) attrs.push("disabled");

    const code = `<input ${attrs.join(" ")} />`;
    return { element, code };
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
    const wrapperClasses = ["checkbox-field"];
    if (disabled) wrapperClasses.push("is-disabled");
    wrapper.className = wrapperClasses.join(" ");

    const input = document.createElement("input");
    const inputClasses = ["checkbox"];
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
    text.className = "checkbox-field__text";
    text.textContent = labelText;

    wrapper.append(input, text);

    const attrs = [
      `class="${quoteAttr(input.className)}"`,
      'type="checkbox"',
    ];
    if (checked) attrs.push("checked");
    if (indeterminate) attrs.push('aria-checked="mixed"');
    if (disabled) attrs.push("disabled");

    const code = `<label class="${quoteAttr(wrapper.className)}"><input ${attrs.join(" ")} /><span class="checkbox-field__text">${quoteAttr(labelText)}</span></label>`;
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
    const wrapperClasses = ["switch-field"];
    if (disabled) wrapperClasses.push("is-disabled");
    wrapper.className = wrapperClasses.join(" ");

    const input = document.createElement("input");
    const inputClasses = ["switch"];
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
    text.className = "switch-field__text";
    text.textContent = labelText;

    wrapper.append(input, text);

    const attrs = [
      `class="${quoteAttr(input.className)}"`,
      'type="checkbox"',
      'role="switch"',
    ];
    if (checked) attrs.push("checked");
    if (disabled) attrs.push("disabled");

    const code = `<label class="${quoteAttr(wrapper.className)}"><input ${attrs.join(" ")} /><span class="switch-field__text">${quoteAttr(labelText)}</span></label>`;
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

    element.className = "button-group";
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
      'class="button-group"',
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

  global.UIPlaygroundRenderers = {
    renderers: {
      button: renderVanillaButton,
      "button-group": renderVanillaButtonGroup,
      checkbox: renderVanillaCheckbox,
      icon: renderVanillaIcon,
      input: renderVanillaInput,
      label: renderVanillaLabel,
      switch: renderVanillaSwitch,
    },
  };
})(window);
