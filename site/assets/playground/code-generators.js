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

  function njkComboBox(state) {
    var p = state.props;
    var placeholder = p.placeholder || "Search destinations";
    var loading = p.loading === true || p.loading === "true";
    var allowCustomValue =
      p.allowCustomValue === true || p.allowCustomValue === "true";
    var descriptions = p.descriptions === true || p.descriptions === "true";
    var disabled = state.meta.state === "disabled";
    var parts = [];
    parts.push(
      "options=[" +
        (descriptions
          ? '{value: "pmi", label: "Palma de Mallorca", description: "Spain"}, {value: "her", label: "Heraklion", description: "Greece"}, {value: "fue", label: "Fuerteventura", description: "Canary Islands"}'
          : '{value: "pmi", label: "Palma de Mallorca"}, {value: "her", label: "Heraklion"}, {value: "fue", label: "Fuerteventura"}') +
        "]",
    );
    parts.push('placeholder="' + quoteAttr(placeholder) + '"');
    if (loading) parts.push("loading=true");
    if (allowCustomValue) parts.push("allowCustomValue=true");
    if (disabled) parts.push("disabled=true");
    return "{{ uif.combobox(" + parts.join(", ") + ") }}";
  }

  function wcComboBox(state) {
    var p = state.props;
    var placeholder = p.placeholder || "Search destinations";
    var loading = p.loading === true || p.loading === "true";
    var allowCustomValue =
      p.allowCustomValue === true || p.allowCustomValue === "true";
    var descriptions = p.descriptions === true || p.descriptions === "true";
    var disabled = state.meta.state === "disabled";
    var attrs = [
      'placeholder="' + quoteAttr(placeholder) + '"',
      'aria-label="Destination search"',
    ];
    if (loading) attrs.push("loading");
    if (allowCustomValue) attrs.push("allow-custom-value");
    if (disabled) attrs.push("disabled");
    var options = descriptions
      ? '\n  <option value="pmi" data-description="Spain">Palma de Mallorca</option>\n  <option value="her" data-description="Greece">Heraklion</option>\n  <option value="fue" data-description="Canary Islands">Fuerteventura</option>\n'
      : '\n  <option value="pmi">Palma de Mallorca</option>\n  <option value="her">Heraklion</option>\n  <option value="fue">Fuerteventura</option>\n';
    return "<uif-combobox " + attrs.join(" ") + ">" + options + "</uif-combobox>";
  }

  function njkSearchField(state) {
    var p = state.props;
    var parts = [];
    if (p.placeholder) parts.push('placeholder="' + quoteAttr(p.placeholder) + '"');
    if (p.value) parts.push('value="' + quoteAttr(p.value) + '"');
    if (state.meta.state && state.meta.state !== "default") {
      parts.push('state="' + quoteAttr(state.meta.state) + '"');
    }
    if (p.quiet === true || p.quiet === "true") parts.push("quiet=true");
    if (
      (p.disabled === true || p.disabled === "true") &&
      state.meta.state !== "disabled"
    ) {
      parts.push("disabled=true");
    }
    if (
      (p.readonly === true || p.readonly === "true") &&
      state.meta.state !== "readonly"
    ) {
      parts.push("readonly=true");
    }
    return "{{ uif.searchField(" + parts.join(", ") + ") }}";
  }

  function wcSearchField(state) {
    var p = state.props;
    var attrs = [];
    if (p.placeholder) attrs.push('placeholder="' + quoteAttr(p.placeholder) + '"');
    if (p.value) attrs.push('value="' + quoteAttr(p.value) + '"');
    if (p.quiet === true || p.quiet === "true") attrs.push("quiet");
    if (state.meta.state === "disabled") attrs.push("disabled");
    if (state.meta.state === "readonly") attrs.push("readonly");
    return "<uif-search-field" + (attrs.length ? " " + attrs.join(" ") : "") + "></uif-search-field>";
  }

  function njkModal(state) {
    var p = state.props;
    var title = p.title || "Confirm action";
    var description = p.description || "This action requires your confirmation.";
    var variant = p.variant || "confirmation";
    var size = p.size || "m";
    var dismissible = p.dismissible === undefined ? true : (p.dismissible === true || p.dismissible === "true");
    var open = p.open === undefined ? true : (p.open === true || p.open === "true");
    var confirmLabel = p.confirmLabel || "Confirm";
    var cancelLabel = p.cancelLabel || "Cancel";
    return '{% call uif.modal(title="' + quoteAttr(title) + '", description="' + quoteAttr(description) + '", variant="' + quoteAttr(variant) + '", size="' + quoteAttr(size) + '", dismissible=' + (dismissible ? "true" : "false") + ", open=" + (open ? "true" : "false") + ', confirmLabel="' + quoteAttr(confirmLabel) + '", cancelLabel="' + quoteAttr(cancelLabel) + '") %}Modal content{% endcall %}';
  }

  function wcModal(state) {
    var p = state.props;
    var title = p.title || "Confirm action";
    var description = p.description || "This action requires your confirmation.";
    var variant = p.variant || "confirmation";
    var size = p.size || "m";
    var dismissible = p.dismissible === undefined ? true : (p.dismissible === true || p.dismissible === "true");
    var open = p.open === undefined ? true : (p.open === true || p.open === "true");
    var attrs = [
      'title="' + quoteAttr(title) + '"',
      'description="' + quoteAttr(description) + '"',
      'variant="' + quoteAttr(variant) + '"',
      'size="' + quoteAttr(size) + '"',
      'dismissible="' + (dismissible ? "true" : "false") + '"',
    ];
    if (open) attrs.push("open");
    return "<uif-modal " + attrs.join(" ") + ">Modal content</uif-modal>";
  }

  global.UIPlaygroundCodeGenerators = {
    njk: {
      button: njkButton, input: njkInput, checkbox: njkCheckbox,
      "switch": njkSwitch, icon: njkIcon, radio: njkRadio, badge: njkBadge,
      label: function () { return '{{ uif.labelContent("text", "icon") }}'; },
      "button-group": function () { return '{% call uif.buttonGroup() %}...{% endcall %}'; },
      select: njkSelect,
      colorPicker: njkColorPicker,
      combobox: njkComboBox,
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
      notification: function (state) {
        var p = state.props;
        var message = p.message || "Notification";
        var variant = p.variant || "info";
        var dismissible = !(p.dismissible === false || p.dismissible === "false");
        var actionLabel = p.actionLabel || "";
        var actionHref = p.actionHref || "";
        var duration = Number.parseInt(p.duration || 0, 10);
        var attrs = ['"' + quoteAttr(message) + '"'];
        if (variant !== "info") attrs.push('variant="' + quoteAttr(variant) + '"');
        if (!dismissible) attrs.push("dismissible=false");
        if (actionLabel) attrs.push('actionLabel="' + quoteAttr(actionLabel) + '"');
        if (actionLabel && actionHref) attrs.push('actionHref="' + quoteAttr(actionHref) + '"');
        if (duration > 0) attrs.push("duration=" + String(duration));
        return "{{ uif.notification(" + attrs.join(", ") + ") }}";
      },
      "search-field": njkSearchField,
      breadcrumbs: function (state) {
        var p = state.props;
        var depth = Math.max(2, Number(p.depth || 4));
        var labels = ["Home", "Category", "Collection", "Details", "Current page"];
        var parts = [];
        for (var i = 0; i < depth; i++) {
          var item = '{label: "' + quoteAttr(labels[i] || ("Level " + (i + 1))) + '"';
          if (i < depth - 1) item += ', url: "#' + (i + 1) + '"';
          if (i === depth - 1) item += ", current: true";
          item += "}";
          parts.push(item);
        }
        var args = ["items=[" + parts.join(", ") + "]"];
        if (p.separator && p.separator !== "/") args.push('separator="' + quoteAttr(p.separator) + '"');
        return "{{ uif.breadcrumbs(" + args.join(", ") + ") }}";
      },
      card: function () { return '{% call uif.card() %}\n  {% call uif.cardBody() %}Card content{% endcall %}\n{% endcall %}'; },
      "inline-alert": function (state) { var p = state.props; return '{{ uif.inlineAlert(title="' + quoteAttr(p.title || "Alert") + '", variant="' + (p.variant || "info") + '") }}'; },
      skeleton: function (state) { var p = state.props; return '{{ uif.skeleton(shape="' + (p.shape || "text") + '") }}'; },
      "range-slider": function (state) { var p = state.props; return '{{ uif.rangeSlider(min=' + (p.min || 0) + ', max=' + (p.max || 100) + ') }}'; },
      "progress-circle": function (state) { var p = state.props; return '{{ uif.progressCircle(value=' + (p.value || 50) + ') }}'; },
      "progress-bar": function (state) { var p = state.props; return '{{ uif.progressBar(value=' + (p.value || 50) + ') }}'; },
      meter: function (state) { var p = state.props; return '{{ uif.meter(value=' + (p.value || 50) + ', max=' + (p.max || 100) + ') }}'; },
      "number-field": function (state) { var p = state.props; return '{{ uif.numberField(value=' + (p.value || 0) + ') }}'; },
      "status-light": function (state) { var p = state.props; return '{{ uif.statusLight(variant="' + (p.variant || "positive") + '", label="' + quoteAttr(p.label || "Active") + '") }}'; },
      "illustrated-message": function (state) { var p = state.props; return '{{ uif.illustratedMessage(preset="' + (p.preset || "empty") + '") }}'; },
      "segmented-control": function () { return '{{ uif.segmentedControl(items=["Option 1", "Option 2", "Option 3"]) }}'; },
      actionBar: function () { return '{{ uif.actionBar() }}'; },
      "tree-view": function () { return '{% call uif.treeView() %}...{% endcall %}'; },
      dropzone: function () { return '{{ uif.dropzone() }}'; },
      colorPicker: njkColorPicker,
      popover: function (state) { var p = state.props; return '{% call uif.popover(placement="' + (p.placement || "bottom") + '") %}Content{% endcall %}'; },
      tag: function (state) { var p = state.props; return '{{ uif.tag("' + quoteAttr(p.label || "Tag") + '") }}'; },
      table: function () { return '{% call uif.table() %}...{% endcall %}'; },
      menu: function () { return '{% call uif.menu() %}\n  {{ uif.menuItem("Action 1") }}\n  {{ uif.menuItem("Action 2") }}\n{% endcall %}'; },
    },
    wc: {
      button: wcButton, input: wcInput, checkbox: wcCheckbox,
      "switch": wcSwitch, icon: wcIcon, radio: wcRadio, badge: wcBadge,
      label: function () { return "<uif-field-label>...</uif-field-label>"; },
      "button-group": function () { return "<uif-button-group>...</uif-button-group>"; },
      select: wcSelect,
      colorPicker: wcColorPicker,
      combobox: wcComboBox,
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
      notification: function (state) {
        var p = state.props;
        var message = p.message || "Notification";
        var variant = p.variant || "info";
        var dismissible = !(p.dismissible === false || p.dismissible === "false");
        var actionLabel = p.actionLabel || "";
        var actionHref = p.actionHref || "";
        var duration = Number.parseInt(p.duration || 0, 10);
        var attrs = ['message="' + quoteAttr(message) + '"'];
        if (variant !== "info") attrs.push('variant="' + quoteAttr(variant) + '"');
        if (dismissible) attrs.push("dismissible");
        if (actionLabel) attrs.push('action-label="' + quoteAttr(actionLabel) + '"');
        if (actionLabel && actionHref) attrs.push('action-href="' + quoteAttr(actionHref) + '"');
        if (duration > 0) attrs.push('duration="' + duration + '"');
        return "<uif-notification " + attrs.join(" ") + "></uif-notification>";
      },
      "search-field": wcSearchField,
      breadcrumbs: function (state) {
        var p = state.props;
        var depth = Math.max(2, Number(p.depth || 4));
        var labels = ["Home", "Category", "Collection", "Details", "Current page"];
        var items = [];
        for (var i = 0; i < depth; i++) {
          var entry = { label: labels[i] || ("Level " + (i + 1)) };
          if (i < depth - 1) entry.url = "#" + (i + 1);
          if (i === depth - 1) entry.current = true;
          items.push(entry);
        }
        var attrs = ["items='" + JSON.stringify(items) + "'"];
        if (p.separator && p.separator !== "/") attrs.push('separator="' + quoteAttr(p.separator) + '"');
        return "<uif-breadcrumbs " + attrs.join(" ") + "></uif-breadcrumbs>";
      },
      card: function () { return "<uif-card>\n  <p>Card content</p>\n</uif-card>"; },
      "inline-alert": function (state) { var p = state.props; return '<uif-inline-alert variant="' + (p.variant || "info") + '" title="' + quoteAttr(p.title || "Alert") + '"></uif-inline-alert>'; },
      skeleton: function (state) { var p = state.props; return '<uif-skeleton shape="' + (p.shape || "text") + '"></uif-skeleton>'; },
      "range-slider": function (state) { var p = state.props; return '<uif-range-slider min="' + (p.min || 0) + '" max="' + (p.max || 100) + '"></uif-range-slider>'; },
      "progress-circle": function (state) { var p = state.props; return '<uif-progress-circle value="' + (p.value || 50) + '"></uif-progress-circle>'; },
      "progress-bar": function (state) { var p = state.props; return '<uif-progress-bar value="' + (p.value || 50) + '"></uif-progress-bar>'; },
      meter: function (state) { var p = state.props; return '<uif-meter value="' + (p.value || 50) + '" max="' + (p.max || 100) + '"></uif-meter>'; },
      "number-field": function (state) { var p = state.props; return '<uif-number-field value="' + (p.value || 0) + '"></uif-number-field>'; },
      "status-light": function (state) { var p = state.props; return '<uif-status-light variant="' + (p.variant || "positive") + '">' + quoteAttr(p.label || "Active") + '</uif-status-light>'; },
      "illustrated-message": function (state) { var p = state.props; return '<uif-illustrated-message preset="' + (p.preset || "empty") + '"></uif-illustrated-message>'; },
      "segmented-control": function () { return '<uif-segmented-control>\n  <button>Option 1</button>\n  <button>Option 2</button>\n</uif-segmented-control>'; },
      actionBar: function () { return "<uif-action-bar>...</uif-action-bar>"; },
      "tree-view": function () { return "<uif-tree-view>...</uif-tree-view>"; },
      dropzone: function () { return "<uif-dropzone></uif-dropzone>"; },
      colorPicker: wcColorPicker,
      popover: function (state) { var p = state.props; return '<uif-popover placement="' + (p.placement || "bottom") + '">Content</uif-popover>'; },
      tag: function (state) { var p = state.props; return '<uif-tag>' + quoteAttr(p.label || "Tag") + '</uif-tag>'; },
      table: function () { return "<uif-table>...</uif-table>"; },
      menu: function () { return '<uif-menu>\n  <uif-menu-item>Action 1</uif-menu-item>\n  <uif-menu-item>Action 2</uif-menu-item>\n</uif-menu>'; },
    },
  };
})(window);