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
    return '{{ uif.button(' + parts.join(", ") + ') }}';
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
    return "<uif-button" + (attrs.length ? " " + attrs.join(" ") : "") + ">" + quoteAttr(label) + "</uif-button>";
  }

  function njkInput(state) {
    var p = state.props;
    var parts = [];
    if (p.type && p.type !== "text") parts.push('type="' + p.type + '"');
    if (p.placeholder) parts.push('placeholder="' + quoteAttr(p.placeholder) + '"');
    if (p.value) parts.push('value="' + quoteAttr(p.value) + '"');
    if (state.meta.state === "disabled") parts.push("disabled=true");
    return "{{ uif.input(" + parts.join(", ") + ") }}";
  }

  function wcInput(state) {
    var p = state.props;
    var attrs = [];
    if (p.type && p.type !== "text") attrs.push('type="' + p.type + '"');
    if (p.placeholder) attrs.push('placeholder="' + quoteAttr(p.placeholder) + '"');
    if (p.value) attrs.push('value="' + quoteAttr(p.value) + '"');
    if (state.meta.state === "disabled") attrs.push("disabled");
    return "<uif-input" + (attrs.length ? " " + attrs.join(" ") : "") + "></uif-input>";
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
    return "{{ uif.checkbox(" + parts.join(", ") + ") }}";
  }

  function wcCheckbox(state) {
    var p = state.props;
    var label = p.label || "Accept terms";
    var checked = p.checked === true || p.checked === "true";
    var disabled = state.meta.state === "disabled";
    var attrs = ['label="' + quoteAttr(label) + '"'];
    if (checked) attrs.push("checked");
    if (disabled) attrs.push("disabled");
    return "<uif-checkbox " + attrs.join(" ") + "></uif-checkbox>";
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
    return "{{ uif.switch(" + parts.join(", ") + ") }}";
  }

  function wcSwitch(state) {
    var p = state.props;
    var label = p.label || "Notifications";
    var checked = p.checked === true || p.checked === "true";
    var disabled = state.meta.state === "disabled";
    var attrs = ['label="' + quoteAttr(label) + '"'];
    if (checked) attrs.push("checked");
    if (disabled) attrs.push("disabled");
    return "<uif-switch " + attrs.join(" ") + "></uif-switch>";
  }

  function njkIcon(state) {
    var p = state.props;
    var name = p.name || "search";
    var label = p.label || "";
    var parts = ['"' + quoteAttr(name) + '"'];
    if (label) parts.push('"' + quoteAttr(label) + '"');
    return "{{ uif.icon(" + parts.join(", ") + ") }}";
  }

  function wcIcon(state) {
    var p = state.props;
    var name = p.name || "search";
    var label = p.label || "";
    var attrs = ['name="' + quoteAttr(name) + '"'];
    if (label) attrs.push('label="' + quoteAttr(label) + '"');
    else attrs.push("decorative");
    return "<uif-icon " + attrs.join(" ") + "></uif-icon>";
  }

  function njkRadio(state) {
    var p = state.props;
    var label = p.label || "Option A";
    var checked = p.checked === true || p.checked === "true";
    return '{{ uif.radio("' + quoteAttr(label) + '"' + (checked ? ", true" : "") + ') }}';
  }

  function wcRadio(state) {
    var p = state.props;
    var label = p.label || "Option A";
    var checked = p.checked === true || p.checked === "true";
    var attrs = ['label="' + quoteAttr(label) + '"'];
    if (checked) attrs.push("checked");
    return "<uif-radio " + attrs.join(" ") + "></uif-radio>";
  }

  function njkBadge(state) {
    var p = state.props;
    var text = state.children || "Badge";
    var variant = p.variant || "default";
    var parts = ['"' + quoteAttr(text) + '"'];
    if (variant !== "default") parts.push('variant="' + variant + '"');
    return "{{ uif.badge(" + parts.join(", ") + ") }}";
  }

  function wcBadge(state) {
    var p = state.props;
    var text = state.children || "Badge";
    var variant = p.variant || "default";
    var attrs = [];
    if (variant !== "default") attrs.push('variant="' + variant + '"');
    return "<uif-badge" + (attrs.length ? " " + attrs.join(" ") : "") + ">" + quoteAttr(text) + "</uif-badge>";
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
    return "{{ uif.select(" + parts.join(", ") + ") }}";
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
    return "<uif-select " + attrs.join(" ") + ">" + options + "</uif-select>";
  }

  function njkForm(state) {
    var p = state.props;
    var borderless = p.borderless === true || p.borderless === "true";
    var labelPosition = p.labelPosition || "top";
    var invalid = p.invalid === true || p.invalid === "true";
    var actionsAlign = p.actionsAlign || "end";
    var lines = [];
    lines.push("{% call uif.form(" + (borderless ? "borderless=true" : "") + ") %}");
    lines.push("  {% call uif.formField(" + (invalid ? "invalid=true" : "") + (labelPosition === "side" ? 'labelPosition="side"' : "") + ") %}");
    lines.push('    {{ uif.fieldLabel("Email", htmlFor="email", required=true) }}');
    lines.push('    {{ uif.input(type="email", id="email", placeholder="you@example.com") }}');
    if (invalid) lines.push('    {{ uif.formHelper("Please enter a valid email address.") }}');
    lines.push("  {% endcall %}");
    lines.push("  {% call uif.formField() %}");
    lines.push('    {{ uif.fieldLabel("Password", htmlFor="pw") }}');
    lines.push('    {{ uif.input(type="password", id="pw") }}');
    lines.push("  {% endcall %}");
    lines.push('  {% call uif.formActions(' + (actionsAlign !== "end" ? 'align="' + actionsAlign + '"' : "") + ') %}');
    lines.push('    {{ uif.button("Sign in", variant="solid", type="submit") }}');
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
    lines.push("<uif-form" + (borderless ? " borderless" : "") + ">");
    lines.push("  <uif-form-field" + (invalid ? " invalid" : "") + (labelPosition === "side" ? ' label-position="side"' : "") + ">");
    lines.push('    <uif-field-label for="email" required>Email</uif-field-label>');
    lines.push('    <uif-input type="email" id="email" placeholder="you@example.com"></uif-input>');
    if (invalid) lines.push("    <uif-form-helper>Please enter a valid email address.</uif-form-helper>");
    lines.push("  </uif-form-field>");
    lines.push("  <uif-form-field>");
    lines.push('    <uif-field-label for="pw">Password</uif-field-label>');
    lines.push('    <uif-input type="password" id="pw"></uif-input>');
    lines.push("  </uif-form-field>");
    lines.push("  <uif-form-actions" + (actionsAlign !== "end" ? ' align="' + actionsAlign + '"' : "") + ">");
    lines.push('    <uif-button type="submit">Sign in</uif-button>');
    lines.push("  </uif-form-actions>");
    lines.push("</uif-form>");
    return lines.join("\n");
  }

  function njkCalendar(state) {
    var p = state.props;
    var parts = [];
    if (p.month && p.month !== "2026-07") parts.push('month="' + quoteAttr(p.month) + '"');
    if (p.selectedDate) parts.push('selectedDate="' + quoteAttr(p.selectedDate) + '"');
    if (p.rangeStart) parts.push('rangeStart="' + quoteAttr(p.rangeStart) + '"');
    if (p.rangeEnd) parts.push('rangeEnd="' + quoteAttr(p.rangeEnd) + '"');
    if (p.todayDate && p.todayDate !== "1") parts.push('todayDate="' + quoteAttr(p.todayDate) + '"');
    if (state.meta.state && state.meta.state !== "default") parts.push('state="' + quoteAttr(state.meta.state) + '"');
    if (p.disabled === true) parts.push("disabled=true");
    if (p.container === false) parts.push("container=false");
    return "{{ uif.calendar(" + parts.join(", ") + ") }}";
  }

  global.UIPlaygroundCodeGenerators = {
    njk: {
      button: njkButton, input: njkInput, checkbox: njkCheckbox,
      "switch": njkSwitch, icon: njkIcon, radio: njkRadio, badge: njkBadge,
      label: function () { return '{{ uif.labelContent("text", "icon") }}'; },
      "button-group": function () { return '{% call uif.buttonGroup() %}...{% endcall %}'; },
      select: njkSelect,
      form: njkForm,
      calendar: njkCalendar,
      divider: function (state) {
        var p = state.props;
        var parts = [];
        if (p.orientation === "vertical") parts.push('orientation="vertical"');
        if (p.variant) parts.push('variant="' + p.variant + '"');
        return "{{ uif.divider(" + parts.join(", ") + ") }}";
      },
      link: function (state) {
        var p = state.props;
        var text = state.children || "Link text";
        var parts = ['"' + quoteAttr(text) + '"'];
        if (p.href && p.href !== "#") parts.push('href="' + quoteAttr(p.href) + '"');
        if (p.startIcon) parts.push('startIcon="' + quoteAttr(p.startIcon) + '"');
        if (p.endIcon) parts.push('endIcon="' + quoteAttr(p.endIcon) + '"');
        return "{{ uif.link(" + parts.join(", ") + ") }}";
      },
      textarea: function (state) {
        var p = state.props;
        var parts = [];
        if (p.placeholder) parts.push('placeholder="' + quoteAttr(p.placeholder) + '"');
        if (p.rows) parts.push('rows="' + p.rows + '"');
        if (state.meta.state === "disabled") parts.push("disabled=true");
        return "{{ uif.textarea(" + parts.join(", ") + ") }}";
      },
      avatar: function (state) {
        var p = state.props;
        var parts = [];
        if (p.src) parts.push('src="' + quoteAttr(p.src) + '"');
        if (p.initials) parts.push('initials="' + quoteAttr(p.initials) + '"');
        if (p.size && p.size !== "md") parts.push('size="' + p.size + '"');
        return "{{ uif.avatar(" + parts.join(", ") + ") }}";
      },
      accordion: function () {
        return '{% call uif.accordion() %}\n  {% call uif.accordionItem("Section 1", open=true) %}Content{% endcall %}\n  {% call uif.accordionItem("Section 2") %}Content{% endcall %}\n{% endcall %}';
      },
      tabs: function () {
        return '{% call uif.tabList(ariaLabel="Tabs") %}\n  {{ uif.tab("Tab 1", selected=true, controls="p1") }}\n  {{ uif.tab("Tab 2", controls="p2") }}\n{% endcall %}\n{% call uif.tabPanel(id="p1") %}Panel 1{% endcall %}\n{% call uif.tabPanel(id="p2", hidden=true) %}Panel 2{% endcall %}';
      },
      tooltip: function (state) {
        var p = state.props;
        var text = p.text || "Tooltip text";
        var placement = p.placement || "top";
        return '{% call uif.tooltip("' + quoteAttr(text) + '", placement="' + placement + '") %}<button class="uif-button">Hover me</button>{% endcall %}';
      },
      table: function (state) {
        var p = state.props;
        var density = p.density && p.density !== "default" ? ', density="' + p.density + '"' : "";
        var selection = p.selection && p.selection !== "none" ? ', selection="' + p.selection + '"' : "";
        var sortable = p.sortable ? ", sortable=true" : "";
        var resizable = p.resizable ? ", resizable=true" : "";
        return '{% call uif.table(caption="Destinations"' + density + selection + sortable + resizable + ') %}\n  {% call uif.tableHead() %}\n    {{ uif.th("Destination") }}\n    {{ uif.th("Departure") }}\n    {{ uif.th("Duration") }}\n    {{ uif.th("Price") }}\n  {% endcall %}\n  {% call uif.tableBody() %}\n    {{ uif.tr(["Mallorca", "15 Aug 2025", "7 nights", "£499"]) }}\n    {{ uif.tr(["Tenerife", "22 Aug 2025", "14 nights", "£799"]) }}\n  {% endcall %}\n{% endcall %}';
      },
    },
    wc: {
      button: wcButton, input: wcInput, checkbox: wcCheckbox,
      "switch": wcSwitch, icon: wcIcon, radio: wcRadio, badge: wcBadge,
      label: function () { return "<uif-field-label>...</uif-field-label>"; },
      "button-group": function () { return "<uif-button-group>...</uif-button-group>"; },
      select: wcSelect,
      form: wcForm,
      calendar: function () {
        return "<!-- Calendar is provided as Nunjucks/static HTML in this package. -->";
      },
      divider: function (state) {
        var p = state.props;
        var attrs = [];
        if (p.orientation === "vertical") attrs.push('orientation="vertical"');
        if (p.variant) attrs.push('variant="' + p.variant + '"');
        return "<uif-divider" + (attrs.length ? " " + attrs.join(" ") : "") + "></uif-divider>";
      },
      link: function (state) {
        var p = state.props;
        var text = state.children || "Link text";
        var attrs = [];
        if (p.href && p.href !== "#") attrs.push('href="' + quoteAttr(p.href) + '"');
        if (p.startIcon) attrs.push('start-icon="' + quoteAttr(p.startIcon) + '"');
        if (p.endIcon) attrs.push('end-icon="' + quoteAttr(p.endIcon) + '"');
        return "<uif-link" + (attrs.length ? " " + attrs.join(" ") : "") + ">" + quoteAttr(text) + "</uif-link>";
      },
      textarea: function (state) {
        var p = state.props;
        var attrs = [];
        if (p.placeholder) attrs.push('placeholder="' + quoteAttr(p.placeholder) + '"');
        if (p.rows) attrs.push('rows="' + p.rows + '"');
        if (state.meta.state === "disabled") attrs.push("disabled");
        return "<uif-textarea" + (attrs.length ? " " + attrs.join(" ") : "") + "></uif-textarea>";
      },
      avatar: function (state) {
        var p = state.props;
        var attrs = [];
        if (p.src) attrs.push('src="' + quoteAttr(p.src) + '"');
        if (p.initials) attrs.push('initials="' + quoteAttr(p.initials) + '"');
        if (p.size && p.size !== "md") attrs.push('size="' + p.size + '"');
        return "<uif-avatar" + (attrs.length ? " " + attrs.join(" ") : "") + "></uif-avatar>";
      },
      accordion: function () {
        return '<uif-accordion>\n  <uif-accordion-item title="Section 1" open>Content</uif-accordion-item>\n  <uif-accordion-item title="Section 2">Content</uif-accordion-item>\n</uif-accordion>';
      },
      tabs: function () {
        return '<uif-tab-list aria-label="Tabs">\n  <uif-tab label="Tab 1" selected controls="p1"></uif-tab>\n  <uif-tab label="Tab 2" controls="p2"></uif-tab>\n</uif-tab-list>\n<uif-tab-panel id="p1">Panel 1</uif-tab-panel>\n<uif-tab-panel id="p2" hidden>Panel 2</uif-tab-panel>';
      },
      tooltip: function (state) {
        var p = state.props;
        var text = p.text || "Tooltip text";
        var placement = p.placement || "top";
        return '<uif-tooltip text="' + quoteAttr(text) + '" placement="' + placement + '">\n  <button class="uif-button">Hover me</button>\n</uif-tooltip>';
      },
      table: function () {
        return "<!-- Table is a CSS/JS pattern — no Web Component variant. Use the HTML output directly. -->";
      },
    },
  };
})(window);
