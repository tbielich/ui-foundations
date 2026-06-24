(function initCodeGenerators(global) {
  var shared = global.UIPlaygroundShared || {};
  var quoteAttr = shared.quoteAttr || function (v) { return String(v || ""); };

  function njkButton(state) {
    var p = state.props;
    var label = state.children || "Button";
    var variant = p.variant || "";
    var disabled = Boolean(p.disabled) || state.meta.state === "disabled";
    var parts = ['"' + quoteAttr(label) + '"'];
    if (variant && variant !== "solid") parts.push('"' + variant + '"');
    else if (disabled) parts.push('""');
    if (disabled) parts.push("true");
    return '{{ ui.button(' + parts.join(", ") + ') }}';
  }

  function wcButton(state) {
    var p = state.props;
    var label = state.children || "Button";
    var variant = p.variant || "solid";
    var disabled = Boolean(p.disabled) || state.meta.state === "disabled";
    var attrs = [];
    if (variant !== "solid") attrs.push('variant="' + variant + '"');
    if (p.startIcon) attrs.push('start-icon="' + quoteAttr(p.startIcon) + '"');
    if (disabled) attrs.push("disabled");
    return "<ui-button" + (attrs.length ? " " + attrs.join(" ") : "") + ">" + quoteAttr(label) + "</ui-button>";
  }

  function njkInput(state) {
    var p = state.props;
    var parts = [];
    if (p.type && p.type !== "text") parts.push('type="' + p.type + '"');
    if (p.placeholder) parts.push('placeholder="' + quoteAttr(p.placeholder) + '"');
    if (p.value) parts.push('value="' + quoteAttr(p.value) + '"');
    if (state.meta.state === "disabled") parts.push("disabled=true");
    return "{{ ui.input(" + parts.join(", ") + ") }}";
  }

  function wcInput(state) {
    var p = state.props;
    var attrs = [];
    if (p.type && p.type !== "text") attrs.push('type="' + p.type + '"');
    if (p.placeholder) attrs.push('placeholder="' + quoteAttr(p.placeholder) + '"');
    if (p.value) attrs.push('value="' + quoteAttr(p.value) + '"');
    if (state.meta.state === "disabled") attrs.push("disabled");
    return "<ui-input" + (attrs.length ? " " + attrs.join(" ") : "") + "></ui-input>";
  }

  function njkCheckbox(state) {
    var p = state.props;
    var label = p.label || "Accept terms";
    var checked = p.checked === true || p.checked === "true";
    var disabled = state.meta.state === "disabled";
    var parts = ['"' + quoteAttr(label) + '"'];
    if (checked) parts.push("true");
    else if (disabled) parts.push("false");
    if (disabled) parts.push("true");
    return "{{ ui.checkbox(" + parts.join(", ") + ") }}";
  }

  function wcCheckbox(state) {
    var p = state.props;
    var label = p.label || "Accept terms";
    var checked = p.checked === true || p.checked === "true";
    var disabled = state.meta.state === "disabled";
    var attrs = ['label="' + quoteAttr(label) + '"'];
    if (checked) attrs.push("checked");
    if (disabled) attrs.push("disabled");
    return "<ui-checkbox " + attrs.join(" ") + "></ui-checkbox>";
  }

  function njkSwitch(state) {
    var p = state.props;
    var label = p.label || "Notifications";
    var checked = p.checked === true || p.checked === "true";
    var disabled = state.meta.state === "disabled";
    var parts = ['"' + quoteAttr(label) + '"'];
    if (checked) parts.push("true");
    else if (disabled) parts.push("false");
    if (disabled) parts.push("true");
    return "{{ ui.switch(" + parts.join(", ") + ") }}";
  }

  function wcSwitch(state) {
    var p = state.props;
    var label = p.label || "Notifications";
    var checked = p.checked === true || p.checked === "true";
    var disabled = state.meta.state === "disabled";
    var attrs = ['label="' + quoteAttr(label) + '"'];
    if (checked) attrs.push("checked");
    if (disabled) attrs.push("disabled");
    return "<ui-switch " + attrs.join(" ") + "></ui-switch>";
  }

  function njkIcon(state) {
    var p = state.props;
    var name = p.name || "search";
    var label = p.label || "";
    var parts = ['"' + quoteAttr(name) + '"'];
    if (label) parts.push('"' + quoteAttr(label) + '"');
    return "{{ ui.icon(" + parts.join(", ") + ") }}";
  }

  function wcIcon(state) {
    var p = state.props;
    var name = p.name || "search";
    var label = p.label || "";
    var attrs = ['name="' + quoteAttr(name) + '"'];
    if (label) attrs.push('label="' + quoteAttr(label) + '"');
    else attrs.push("decorative");
    return "<ui-icon " + attrs.join(" ") + "></ui-icon>";
  }

  function njkRadio(state) {
    var p = state.props;
    var label = p.label || "Option A";
    var checked = p.checked === true || p.checked === "true";
    return '{{ ui.radio("' + quoteAttr(label) + '"' + (checked ? ", true" : "") + ') }}';
  }

  function wcRadio(state) {
    var p = state.props;
    var label = p.label || "Option A";
    var checked = p.checked === true || p.checked === "true";
    var attrs = ['label="' + quoteAttr(label) + '"'];
    if (checked) attrs.push("checked");
    return "<ui-radio " + attrs.join(" ") + "></ui-radio>";
  }

  function njkBadge(state) {
    var p = state.props;
    var text = state.children || "Badge";
    var variant = p.variant || "default";
    var parts = ['"' + quoteAttr(text) + '"'];
    if (variant !== "default") parts.push('variant="' + variant + '"');
    return "{{ ui.badge(" + parts.join(", ") + ") }}";
  }

  function wcBadge(state) {
    var p = state.props;
    var text = state.children || "Badge";
    var variant = p.variant || "default";
    var attrs = [];
    if (variant !== "default") attrs.push('variant="' + variant + '"');
    return "<ui-badge" + (attrs.length ? " " + attrs.join(" ") : "") + ">" + quoteAttr(text) + "</ui-badge>";
  }

  function njkSelect(state) {
    var p = state.props;
    var placeholder = p.placeholder || "Choose an option";
    var disabled = state.meta.state === "disabled";
    var useOptgroups = p.optgroups === true || p.optgroups === "true";
    var parts = [];
    if (useOptgroups) {
      parts.push('options=[{group: "Fruits", items: [{value: "apple", label: "Apple"}, {value: "banana", label: "Banana"}]}, {group: "Vegetables", items: [{value: "carrot", label: "Carrot"}]}]');
    } else {
      parts.push('options=[{value: "opt1", label: "Option 1"}, {value: "opt2", label: "Option 2"}, {value: "opt3", label: "Option 3"}]');
    }
    parts.push('placeholder="' + quoteAttr(placeholder) + '"');
    if (disabled) parts.push("disabled=true");
    return "{{ ui.select(" + parts.join(", ") + ") }}";
  }

  function wcSelect(state) {
    var p = state.props;
    var placeholder = p.placeholder || "Choose an option";
    var disabled = state.meta.state === "disabled";
    var useOptgroups = p.optgroups === true || p.optgroups === "true";
    var attrs = ['placeholder="' + quoteAttr(placeholder) + '"'];
    if (disabled) attrs.push("disabled");
    var options = "";
    if (useOptgroups) {
      options = '\n  <optgroup label="Fruits">\n    <option value="apple">Apple</option>\n    <option value="banana">Banana</option>\n  </optgroup>\n  <optgroup label="Vegetables">\n    <option value="carrot">Carrot</option>\n  </optgroup>\n';
    } else {
      options = '\n  <option value="opt1">Option 1</option>\n  <option value="opt2">Option 2</option>\n  <option value="opt3">Option 3</option>\n';
    }
    return "<ui-select " + attrs.join(" ") + ">" + options + "</ui-select>";
  }

  function njkForm(state) {
    var p = state.props;
    var borderless = p.borderless === true || p.borderless === "true";
    var labelPosition = p.labelPosition || "top";
    var invalid = p.invalid === true || p.invalid === "true";
    var actionsAlign = p.actionsAlign || "end";
    var lines = [];
    lines.push("{% call ui.form(" + (borderless ? "borderless=true" : "") + ") %}");
    lines.push("  {% call ui.formField(" + (invalid ? "invalid=true" : "") + (labelPosition === "side" ? 'labelPosition="side"' : "") + ") %}");
    lines.push('    {{ ui.fieldLabel("Email", htmlFor="email", required=true) }}');
    lines.push('    {{ ui.input(type="email", id="email", placeholder="you@example.com") }}');
    if (invalid) lines.push('    {{ ui.formHelper("Please enter a valid email address.") }}');
    lines.push("  {% endcall %}");
    lines.push("  {% call ui.formField() %}");
    lines.push('    {{ ui.fieldLabel("Password", htmlFor="pw") }}');
    lines.push('    {{ ui.input(type="password", id="pw") }}');
    lines.push("  {% endcall %}");
    lines.push('  {% call ui.formActions(' + (actionsAlign !== "end" ? 'align="' + actionsAlign + '"' : "") + ') %}');
    lines.push('    {{ ui.button("Sign in", variant="solid", type="submit") }}');
    lines.push("  {% endcall %}");
    lines.push("{% endcall %}");
    return lines.join("\n");
  }

  function wcForm(state) {
    var p = state.props;
    var borderless = p.borderless === true || p.borderless === "true";
    var labelPosition = p.labelPosition || "top";
    var invalid = p.invalid === true || p.invalid === "true";
    var actionsAlign = p.actionsAlign || "end";
    var lines = [];
    lines.push("<ui-form" + (borderless ? " borderless" : "") + ">");
    lines.push("  <ui-form-field" + (invalid ? " invalid" : "") + (labelPosition === "side" ? ' label-position="side"' : "") + ">");
    lines.push('    <ui-field-label for="email" required>Email</ui-field-label>');
    lines.push('    <ui-input type="email" id="email" placeholder="you@example.com"></ui-input>');
    if (invalid) lines.push("    <ui-form-helper>Please enter a valid email address.</ui-form-helper>");
    lines.push("  </ui-form-field>");
    lines.push("  <ui-form-field>");
    lines.push('    <ui-field-label for="pw">Password</ui-field-label>');
    lines.push('    <ui-input type="password" id="pw"></ui-input>');
    lines.push("  </ui-form-field>");
    lines.push("  <ui-form-actions" + (actionsAlign !== "end" ? ' align="' + actionsAlign + '"' : "") + ">");
    lines.push('    <ui-button type="submit">Sign in</ui-button>');
    lines.push("  </ui-form-actions>");
    lines.push("</ui-form>");
    return lines.join("\n");
  }

  global.UIPlaygroundCodeGenerators = {
    njk: {
      button: njkButton, input: njkInput, checkbox: njkCheckbox,
      "switch": njkSwitch, icon: njkIcon, radio: njkRadio, badge: njkBadge,
      label: function () { return '{{ ui.labelContent("text", "icon") }}'; },
      "button-group": function () { return '{% call ui.buttonGroup() %}...{% endcall %}'; },
      select: njkSelect,
      form: njkForm,
      divider: function (state) {
        var p = state.props;
        var parts = [];
        if (p.orientation === "vertical") parts.push('orientation="vertical"');
        if (p.variant) parts.push('variant="' + p.variant + '"');
        return "{{ ui.divider(" + parts.join(", ") + ") }}";
      },
      link: function (state) {
        var p = state.props;
        var text = state.children || "Link text";
        var parts = ['"' + quoteAttr(text) + '"'];
        if (p.href && p.href !== "#") parts.push('href="' + quoteAttr(p.href) + '"');
        if (p.startIcon) parts.push('startIcon="' + quoteAttr(p.startIcon) + '"');
        if (p.endIcon) parts.push('endIcon="' + quoteAttr(p.endIcon) + '"');
        return "{{ ui.link(" + parts.join(", ") + ") }}";
      },
      textarea: function (state) {
        var p = state.props;
        var parts = [];
        if (p.placeholder) parts.push('placeholder="' + quoteAttr(p.placeholder) + '"');
        if (p.rows) parts.push('rows="' + p.rows + '"');
        if (state.meta.state === "disabled") parts.push("disabled=true");
        return "{{ ui.textarea(" + parts.join(", ") + ") }}";
      },
      avatar: function (state) {
        var p = state.props;
        var parts = [];
        if (p.src) parts.push('src="' + quoteAttr(p.src) + '"');
        if (p.initials) parts.push('initials="' + quoteAttr(p.initials) + '"');
        if (p.size && p.size !== "md") parts.push('size="' + p.size + '"');
        return "{{ ui.avatar(" + parts.join(", ") + ") }}";
      },
      accordion: function () {
        return '{% call ui.accordion() %}\n  {% call ui.accordionItem("Section 1", open=true) %}Content{% endcall %}\n  {% call ui.accordionItem("Section 2") %}Content{% endcall %}\n{% endcall %}';
      },
      tabs: function () {
        return '{% call ui.tabList(ariaLabel="Tabs") %}\n  {{ ui.tab("Tab 1", selected=true, controls="p1") }}\n  {{ ui.tab("Tab 2", controls="p2") }}\n{% endcall %}\n{% call ui.tabPanel(id="p1") %}Panel 1{% endcall %}\n{% call ui.tabPanel(id="p2", hidden=true) %}Panel 2{% endcall %}';
      },
      tooltip: function (state) {
        var p = state.props;
        var text = p.text || "Tooltip text";
        var placement = p.placement || "top";
        return '{% call ui.tooltip("' + quoteAttr(text) + '", placement="' + placement + '") %}<button class="button">Hover me</button>{% endcall %}';
      },
    },
    wc: {
      button: wcButton, input: wcInput, checkbox: wcCheckbox,
      "switch": wcSwitch, icon: wcIcon, radio: wcRadio, badge: wcBadge,
      label: function () { return "<ui-field-label>...</ui-field-label>"; },
      "button-group": function () { return "<ui-button-group>...</ui-button-group>"; },
      select: wcSelect,
      form: wcForm,
      divider: function (state) {
        var p = state.props;
        var attrs = [];
        if (p.orientation === "vertical") attrs.push('orientation="vertical"');
        if (p.variant) attrs.push('variant="' + p.variant + '"');
        return "<ui-divider" + (attrs.length ? " " + attrs.join(" ") : "") + "></ui-divider>";
      },
      link: function (state) {
        var p = state.props;
        var text = state.children || "Link text";
        var attrs = [];
        if (p.href && p.href !== "#") attrs.push('href="' + quoteAttr(p.href) + '"');
        if (p.startIcon) attrs.push('start-icon="' + quoteAttr(p.startIcon) + '"');
        if (p.endIcon) attrs.push('end-icon="' + quoteAttr(p.endIcon) + '"');
        return "<ui-link" + (attrs.length ? " " + attrs.join(" ") : "") + ">" + quoteAttr(text) + "</ui-link>";
      },
      textarea: function (state) {
        var p = state.props;
        var attrs = [];
        if (p.placeholder) attrs.push('placeholder="' + quoteAttr(p.placeholder) + '"');
        if (p.rows) attrs.push('rows="' + p.rows + '"');
        if (state.meta.state === "disabled") attrs.push("disabled");
        return "<ui-textarea" + (attrs.length ? " " + attrs.join(" ") : "") + "></ui-textarea>";
      },
      avatar: function (state) {
        var p = state.props;
        var attrs = [];
        if (p.src) attrs.push('src="' + quoteAttr(p.src) + '"');
        if (p.initials) attrs.push('initials="' + quoteAttr(p.initials) + '"');
        if (p.size && p.size !== "md") attrs.push('size="' + p.size + '"');
        return "<ui-avatar" + (attrs.length ? " " + attrs.join(" ") : "") + "></ui-avatar>";
      },
      accordion: function () {
        return '<ui-accordion>\n  <ui-accordion-item title="Section 1" open>Content</ui-accordion-item>\n  <ui-accordion-item title="Section 2">Content</ui-accordion-item>\n</ui-accordion>';
      },
      tabs: function () {
        return '<ui-tab-list aria-label="Tabs">\n  <ui-tab label="Tab 1" selected controls="p1"></ui-tab>\n  <ui-tab label="Tab 2" controls="p2"></ui-tab>\n</ui-tab-list>\n<ui-tab-panel id="p1">Panel 1</ui-tab-panel>\n<ui-tab-panel id="p2" hidden>Panel 2</ui-tab-panel>';
      },
      tooltip: function (state) {
        var p = state.props;
        var text = p.text || "Tooltip text";
        var placement = p.placement || "top";
        return '<ui-tooltip text="' + quoteAttr(text) + '" placement="' + placement + '">\n  <button class="button">Hover me</button>\n</ui-tooltip>';
      },
    },
  };
})(window);
