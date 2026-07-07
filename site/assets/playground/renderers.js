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
    const contentClasses = ["label-content"];
    if (resolvedIconOnly) contentClasses.push("is-icon-only");
    content.className = contentClasses.join(" ");

    const startSlot = createLabelIconSlot(iconStart, "start");
    if (startSlot) content.append(startSlot);

    if (!resolvedIconOnly && hasText) {
      const textNode = document.createElement("span");
      textNode.className = "label-content-text";
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
        ? `<span class="label-content-text">${quoteAttr(rawLabel)}</span>`
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
      textElement.className = "label-content-text";
      textElement.textContent = text;
      labelContent.append(textElement);
    }

    const endSlot = createLabelIconSlot(iconEnd, "end");
    if (endSlot) labelContent.append(endSlot);

    host.append(labelContent);

    if (mode === "field" && required) {
      const requiredMarker = document.createElement("span");
      requiredMarker.className = "field-label-required";
      requiredMarker.setAttribute("aria-hidden", "true");
      requiredMarker.textContent = "*";
      host.append(requiredMarker);

      const requiredText = document.createElement("span");
      requiredText.className = "field-label-required-text";
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
        ? `<span class="label-content-text">${quoteAttr(text)}</span>`
        : "",
      labelIconCode(iconEnd, "end"),
    ]
      .filter(Boolean)
      .join("");

    if (mode === "field") {
      const requiredMarkup = required
        ? '<span class="field-label-required" aria-hidden="true">*</span><span class="field-label-required-text"> (required)</span>'
        : "";
      const code = `<label for="${quoteAttr(forId)}" class="field-label" style="${quoteAttr(hostStyleEntries.join("; "))}"><span class="${quoteAttr(contentClasses.join(" "))}">${contentMarkup}</span>${requiredMarkup}</label>`;
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

    // Always render as .input-field wrapper
    const wrapper = document.createElement("div");
    const wrapperClasses = ["input-field"];
    if (previewState === "hover") wrapperClasses.push("is-hover");
    if (previewState === "active") wrapperClasses.push("is-active");
    if (previewState === "focus") wrapperClasses.push("is-focus-visible");
    if (isDisabled) wrapperClasses.push("is-disabled");
    if (previewState === "invalid") wrapperClasses.push("is-invalid");
    if (props.className) wrapperClasses.push(String(props.className));
    wrapper.className = wrapperClasses.join(" ");

    const input = document.createElement("input");
    input.className = "input";
    input.type = type;
    input.placeholder = placeholder;
    input.value = value;
    input.disabled = isDisabled;
    input.readOnly = isReadonly;
    wrapper.appendChild(input);

    const control = document.createElement("span");
    control.className = "input-field-control";

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
    const inputAttrs = [`class="input"`, `type="${quoteAttr(type)}"`];
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
  <span class="input-field-control">
    ${controlCode}
  </span>
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
    text.className = "checkbox-field-text";
    text.textContent = labelText;

    wrapper.append(input, text);

    const attrs = [
      `class="${quoteAttr(input.className)}"`,
      'type="checkbox"',
    ];
    if (checked) attrs.push("checked");
    if (indeterminate) attrs.push('aria-checked="mixed"');
    if (disabled) attrs.push("disabled");

    const code = `<label class="${quoteAttr(wrapper.className)}"><input ${attrs.join(" ")} /><span class="checkbox-field-text">${quoteAttr(labelText)}</span></label>`;
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
    text.className = "switch-field-text";
    text.textContent = labelText;

    wrapper.append(input, text);

    const attrs = [
      `class="${quoteAttr(input.className)}"`,
      'type="checkbox"',
      'role="switch"',
    ];
    if (checked) attrs.push("checked");
    if (disabled) attrs.push("disabled");

    const code = `<label class="${quoteAttr(wrapper.className)}"><input ${attrs.join(" ")} /><span class="switch-field-text">${quoteAttr(labelText)}</span></label>`;
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

  const renderVanillaRadio = ({ props, meta }) => {
    const previewState = String(meta.state || "default");
    const labelText = String(props.label || "Option A");
    const checked = asBoolean(props.checked);
    const disabled =
      previewState === "disabled" ||
      asBoolean(props.disabled);

    const wrapper = document.createElement("label");
    const wrapperClasses = ["radio-field"];
    if (disabled) wrapperClasses.push("is-disabled");
    wrapper.className = wrapperClasses.join(" ");

    const input = document.createElement("input");
    const inputClasses = ["radio"];
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
    text.className = "radio-field-text";
    text.textContent = labelText;

    wrapper.append(input, text);

    const attrs = [
      `class="${quoteAttr(input.className)}"`,
      'type="radio"',
    ];
    if (checked) attrs.push("checked");
    if (disabled) attrs.push("disabled");

    const code = `<label class="${quoteAttr(wrapper.className)}"><input ${attrs.join(" ")} /><span class="radio-field-text">${quoteAttr(labelText)}</span></label>`;
    return { element: wrapper, code };
  };

  const renderVanillaBadge = ({ props, children }) => {
    const variant = String(props.variant || "default");
    const size = String(props.size || "md");
    const startIcon = normalizeIconName(props.startIcon);
    const rawText =
      typeof children === "undefined" ? "Badge" : String(children || "");

    const element = document.createElement("span");
    const classes = ["badge"];
    if (variant && variant !== "default") classes.push(variant);
    if (size === "sm") classes.push("sm");
    element.className = classes.join(" ");

    if (startIcon) {
      const icon = createIconElement({ name: startIcon, decorative: true });
      if (icon) element.append(icon);
    }

    const textSpan = document.createElement("span");
    textSpan.className = "badge-text";
    textSpan.textContent = rawText;
    element.append(textSpan);

    const codeClasses = classes.map((c) => quoteAttr(c)).join(" ");
    const iconMarkup = startIcon ? iconCode({ name: startIcon, decorative: true }) : "";
    const code = `<span class="${codeClasses}">${iconMarkup}<span class="badge-text">${quoteAttr(rawText)}</span></span>`;

    return { element, code };
  };

  const renderVanillaTextarea = ({ props }) => {
    const placeholder = String(props.placeholder || "");
    const value = String(props.value || "");
    const disabled = asBoolean(props.disabled);
    const readonly = asBoolean(props.readonly);
    const rows = props.rows || "3";

    const element = document.createElement("textarea");
    element.className = "textarea";
    element.placeholder = placeholder;
    element.value = value;
    element.rows = Number(rows);
    if (disabled) { element.disabled = true; element.classList.add("is-disabled"); }
    if (readonly) element.readOnly = true;

    const attrs = [`class="textarea"`, `placeholder="${quoteAttr(placeholder)}"`, `rows="${rows}"`];
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
    const classes = ["avatar"];
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
      span.className = "avatar-initials";
      span.textContent = initials;
      element.append(span);
    }

    const codeClasses = classes.join(" ");
    const inner = src
      ? `<img src="${quoteAttr(src)}" alt="${quoteAttr(initials)}" />`
      : `<span class="avatar-initials">${quoteAttr(initials)}</span>`;
    const code = `<span class="${codeClasses}" role="img" aria-label="${quoteAttr(initials)}">${inner}</span>`;

    return { element, code };
  };

  const renderVanillaAccordion = ({ props }) => {
    const items = Number(props.items || 3);
    const openIndex = Number(props.openIndex || 0);

    const wrapper = document.createElement("div");
    wrapper.className = "accordion";

    let codeLines = ['<div class="accordion">'];
    for (let i = 0; i < items; i++) {
      const details = document.createElement("details");
      details.className = "accordion-item";
      if (i === openIndex) details.open = true;
      const summary = document.createElement("summary");
      summary.textContent = `Item ${i + 1}`;
      const content = document.createElement("div");
      content.className = "accordion-item-content";
      content.innerHTML = `<p>Content for item ${i + 1}</p>`;
      details.append(summary, content);
      wrapper.append(details);

      const openAttr = i === openIndex ? " open" : "";
      codeLines.push(`  <details class="accordion-item"${openAttr}>`);
      codeLines.push(`    <summary>Item ${i + 1}</summary>`);
      codeLines.push(`    <div class="accordion-item-content"><p>Content for item ${i + 1}</p></div>`);
      codeLines.push(`  </details>`);
    }
    codeLines.push("</div>");

    return { element: wrapper, code: codeLines.join("\n") };
  };

  const renderVanillaTabs = ({ props }) => {
    const tabCount = Number(props.tabs || 3);
    const activeIndex = Number(props.active || 0);

    const wrapper = document.createElement("div");
    wrapper.className = "tabs";

    const tablist = document.createElement("div");
    tablist.className = "tab-list";
    tablist.setAttribute("role", "tablist");

    let codeLines = ['<div class="tabs">', '  <div class="tab-list" role="tablist">'];

    for (let i = 0; i < tabCount; i++) {
      const btn = document.createElement("button");
      btn.className = "tab";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(i === activeIndex));
      btn.setAttribute("tabindex", i === activeIndex ? "0" : "-1");
      btn.textContent = `Tab ${i + 1}`;
      btn.type = "button";
      tablist.append(btn);

      const sel = i === activeIndex ? ' aria-selected="true" tabindex="0"' : ' aria-selected="false" tabindex="-1"';
      codeLines.push(`    <button class="tab" role="tab"${sel} type="button">Tab ${i + 1}</button>`);
    }
    codeLines.push("  </div>");

    wrapper.append(tablist);

    const panel = document.createElement("div");
    panel.className = "tab-panel";
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("tabindex", "0");
    panel.innerHTML = `<p>Panel content for Tab ${activeIndex + 1}</p>`;
    wrapper.append(panel);

    codeLines.push(`  <div class="tab-panel" role="tabpanel" tabindex="0">`);
    codeLines.push(`    <p>Panel content</p>`);
    codeLines.push(`  </div>`);
    codeLines.push("</div>");

    return { element: wrapper, code: codeLines.join("\n") };
  };

  // ─── Divider ──────────────────────────────────

  const renderVanillaDivider = ({ props }) => {
    const variant = String(props.variant || "default");
    const orientation = String(props.orientation || "horizontal");

    const element = document.createElement("hr");
    element.className = "divider";
    if (variant === "subtle") element.classList.add("subtle");
    if (orientation === "vertical") {
      element.setAttribute("aria-orientation", "vertical");
      element.style.display = "inline-block";
      element.style.blockSize = "3rem";
    }

    const classes = ["divider"];
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
    const formClasses = ["form"];
    if (borderless) formClasses.push("borderless");
    form.className = formClasses.join(" ");
    form.setAttribute("novalidate", "");

    // Field 1
    const field1 = document.createElement("div");
    const field1Classes = ["form-field"];
    if (invalid) field1Classes.push("is-invalid");
    field1.className = field1Classes.join(" ");
    if (labelPosition === "side") field1.dataset.labelPosition = "side";

    const label1 = document.createElement("label");
    label1.className = "field-label";
    label1.innerHTML = '<span class="label-content"><span class="label-content-text">Email</span></span><span class="field-label-required" aria-hidden="true">*</span>';

    const input1 = document.createElement("input");
    input1.className = "input";
    input1.type = "email";
    input1.placeholder = "you@example.com";

    if (labelPosition === "side") {
      const body1 = document.createElement("div");
      body1.className = "form-field-body";
      body1.append(input1);
      if (invalid) {
        const helper = document.createElement("p");
        helper.className = "form-field-helper";
        helper.textContent = "Please enter a valid email address.";
        body1.append(helper);
      }
      field1.append(label1, body1);
    } else {
      field1.append(label1, input1);
      if (invalid) {
        const helper = document.createElement("p");
        helper.className = "form-field-helper";
        helper.textContent = "Please enter a valid email address.";
        field1.append(helper);
      }
    }

    // Field 2
    const field2 = document.createElement("div");
    field2.className = "form-field";
    if (labelPosition === "side") field2.dataset.labelPosition = "side";

    const label2 = document.createElement("label");
    label2.className = "field-label";
    label2.innerHTML = '<span class="label-content"><span class="label-content-text">Password</span></span>';

    const input2 = document.createElement("input");
    input2.className = "input";
    input2.type = "password";

    if (labelPosition === "side") {
      const body2 = document.createElement("div");
      body2.className = "form-field-body";
      body2.append(input2);
      field2.append(label2, body2);
    } else {
      field2.append(label2, input2);
    }

    // Actions
    const actions = document.createElement("div");
    actions.className = "form-actions";
    if (actionsAlign !== "end") actions.dataset.align = actionsAlign;

    const btn = document.createElement("button");
    btn.className = "button solid";
    btn.type = "submit";
    btn.innerHTML = '<span class="label-content"><span class="label-content-text">Sign in</span></span>';
    actions.append(btn);

    form.append(field1, field2, actions);

    const lp = labelPosition === "side" ? ' data-label-position="side"' : "";
    const inv = invalid ? " is-invalid" : "";
    const alignAttr = actionsAlign !== "end" ? ` data-align="${actionsAlign}"` : "";
    const helperCode = invalid ? '\n    <p class="form-field-helper">Please enter a valid email address.</p>' : "";
    const code = `<form class="${formClasses.join(" ")}" novalidate>
  <div class="form-field${inv}"${lp}>
    <label class="field-label"><span class="label-content"><span class="label-content-text">Email</span></span><span class="field-label-required" aria-hidden="true">*</span></label>
    <input class="input" type="email" placeholder="you@example.com" />${helperCode}
  </div>
  <div class="form-field"${lp}>
    <label class="field-label"><span class="label-content"><span class="label-content-text">Password</span></span></label>
    <input class="input" type="password" />
  </div>
  <div class="form-actions"${alignAttr}>
    <button class="button solid" type="submit"><span class="label-content"><span class="label-content-text">Sign in</span></span></button>
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
    const classes = ["select"];

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

  const renderVanillaTooltip = ({ props, children }) => {
    const text = String(props.text || "Tooltip");
    const placement = String(props.placement || "top");

    const trigger = document.createElement("span");
    trigger.className = "tooltip-trigger";

    const btn = document.createElement("button");
    btn.className = "button outline";
    btn.type = "button";
    btn.textContent = String(children || "Hover me");
    trigger.append(btn);

    const tip = document.createElement("span");
    tip.className = "tooltip is-visible";
    tip.setAttribute("role", "tooltip");
    tip.setAttribute("data-placement", placement);
    tip.textContent = text;
    trigger.append(tip);

    const code = `<span class="tooltip-trigger">
  <button class="button outline" type="button">${quoteAttr(String(children || "Hover me"))}</button>
  <span class="tooltip" role="tooltip" data-placement="${quoteAttr(placement)}">${quoteAttr(text)}</span>
</span>`;

    return { element: trigger, code };
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
    const classes = ["link"];

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
    let headerHtml = `<div class="calendar-header">`;
    headerHtml += `<button type="button" class="button ghost" aria-label="Previous month"${disabledAttr}><span class="icon" style="--icon-src: url('/assets/icons/chevron--left.svg');" aria-hidden="true"></span></button>`;
    headerHtml += `<span class="calendar-selectors">`;
    headerHtml += `<select class="select calendar-header-select" name="month" aria-label="Month"${disabledAttr}>`;
    months.forEach((m, i) => { headerHtml += `<option value="${i}"${i === selectedMonth ? " selected" : ""}>${m}</option>`; });
    headerHtml += `</select>`;
    headerHtml += `<select class="select calendar-header-select" name="year" aria-label="Year"${disabledAttr}>`;
    for (let y = 2020; y <= 2030; y++) { headerHtml += `<option value="${y}"${y === selectedYear ? " selected" : ""}>${y}</option>`; }
    headerHtml += `</select></span>`;
    headerHtml += `<button type="button" class="button ghost" aria-label="Next month"${disabledAttr}><span class="icon" style="--icon-src: url('/assets/icons/chevron.svg');" aria-hidden="true"></span></button>`;
    headerHtml += `</div>`;

    // Build table
    const theadHtml = `<thead><tr>${weekdays.map((d) => `<th scope="col" abbr="${d}">${d}</th>`).join("")}</tr></thead>`;

    let tbodyHtml = "<tbody>";
    let day = 1;
    for (let week = 0; week < 5; week++) {
      tbodyHtml += "<tr>";
      for (let dow = 0; dow < 7; dow++) {
        if (day <= 31) {
          const classes = ["calendar-cell"];
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

    const calendarClasses = ["calendar"];
    if (hasContainer) calendarClasses.push("has-container");
    const html = `<div class="${calendarClasses.join(" ")}">${headerHtml}<table class="calendar-table" role="grid" aria-label="${quoteAttr(month)}">${theadHtml}${tbodyHtml}</table></div>`;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    const element = wrapper.firstElementChild;

    const code = html;
    return { element, code };
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

    const rootClasses = ["input-field", "date"];
    if (isOpen) rootClasses.push("is-open");

    let html = `<div class="form-field date-picker-field">`;
    html += `<label class="field-label" id="date-picker-playground-label" for="date-picker-playground-day"><span class="label-content"><span class="label-content-text">Travel date</span></span></label>`;
    html += `<div class="${rootClasses.join(" ")}" role="group" aria-labelledby="date-picker-playground-label">`;
    html += `<div class="date-segments">`;
    html += `<input class="date-segment day" id="date-picker-playground-day" type="text" inputmode="numeric" maxlength="2" placeholder="DD" aria-label="Day" value="${quoteAttr(day)}"${disabledAttr}>`;
    html += `<span class="date-separator">/</span>`;
    html += `<input class="date-segment month" id="date-picker-playground-month" type="text" inputmode="numeric" maxlength="2" placeholder="MM" aria-label="Month" value="${quoteAttr(month)}"${disabledAttr}>`;
    html += `<span class="date-separator">/</span>`;
    html += `<input class="date-segment year" id="date-picker-playground-year" type="text" inputmode="numeric" maxlength="4" placeholder="YYYY" aria-label="Year" value="${quoteAttr(year)}"${disabledAttr}>`;
    html += `</div>`;
    html += `<span class="input-field-control">`;
    html += `<button type="button" aria-label="Open calendar" aria-expanded="${isOpen}" aria-haspopup="grid" aria-controls="date-picker-playground-calendar"${disabledAttr}>`;
    html += `<span class="icon" style="--icon-src: url('/assets/icons/calendar.svg');" aria-hidden="true"></span>`;
    html += `</button></span>`;
    html += `<div class="calendar" id="date-picker-playground-calendar"><div class="calendar-header">`;
    html += `<button type="button" class="button ghost" aria-label="Previous month"><span class="icon" style="--icon-src: url('/assets/icons/chevron--left.svg');" aria-hidden="true"></span></button>`;
    html += `<span class="calendar-selectors"><select class="select calendar-header-select" name="month" aria-label="Month">`;
    monthNames.forEach((m, i) => { html += `<option value="${i}"${i === visibleMonth ? " selected" : ""}>${m}</option>`; });
    html += `</select><select class="select calendar-header-select" name="year" aria-label="Year">`;
    for (let y = 2020; y <= 2030; y++) { html += `<option value="${y}"${y === visibleYear ? " selected" : ""}>${y}</option>`; }
    html += `</select></span>`;
    html += `<button type="button" class="button ghost" aria-label="Next month"><span class="icon" style="--icon-src: url('/assets/icons/chevron.svg');" aria-hidden="true"></span></button>`;
    const monthLabel = `${monthNames[visibleMonth]} ${visibleYear}`;
    html += `</div><table class="calendar-table" role="grid" aria-label="${monthLabel}"><thead><tr>`;
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
          const classes = ["calendar-cell"];
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

  global.UIPlaygroundRenderers = {
    renderers: {
      badge: renderVanillaBadge,
      button: renderVanillaButton,
      "button-group": renderVanillaButtonGroup,
      checkbox: renderVanillaCheckbox,
      divider: renderVanillaDivider,
      icon: renderVanillaIcon,
      input: renderVanillaInput,
      label: renderVanillaLabel,
      link: renderVanillaLink,
      radio: renderVanillaRadio,
      switch: renderVanillaSwitch,
      textarea: renderVanillaTextarea,
      avatar: renderVanillaAvatar,
      accordion: renderVanillaAccordion,
      tabs: renderVanillaTabs,
      tooltip: renderVanillaTooltip,
      select: renderVanillaSelect,
      form: renderVanillaForm,
      calendar: renderVanillaCalendar,
      datePicker: renderVanillaDatePicker,
    },
  };
})(window);
