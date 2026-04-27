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

  function reactButton(state) {
    var p = state.props;
    var label = state.children || "Button";
    var variant = p.variant || "solid";
    var disabled = Boolean(p.disabled) || state.meta.state === "disabled";
    var attrs = [];
    if (variant !== "solid") attrs.push('variant="' + variant + '"');
    if (p.startIcon) attrs.push('startIcon="' + quoteAttr(p.startIcon) + '"');
    if (disabled) attrs.push("disabled");
    var open = "<Button" + (attrs.length ? " " + attrs.join(" ") : "") + ">";
    return open + quoteAttr(label) + "</Button>";
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

  function reactInput(state) {
    var p = state.props;
    var attrs = [];
    if (p.type && p.type !== "text") attrs.push('type="' + p.type + '"');
    if (p.placeholder) attrs.push('placeholder="' + quoteAttr(p.placeholder) + '"');
    if (p.value) attrs.push('value="' + quoteAttr(p.value) + '"');
    if (state.meta.state === "disabled") attrs.push("disabled");
    return "<Input" + (attrs.length ? " " + attrs.join(" ") : "") + " />";
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

  function reactCheckbox(state) {
    var p = state.props;
    var label = p.label || "Accept terms";
    var checked = p.checked === true || p.checked === "true";
    var disabled = state.meta.state === "disabled";
    var attrs = ['label="' + quoteAttr(label) + '"'];
    if (checked) attrs.push("defaultChecked");
    if (disabled) attrs.push("disabled");
    return "<Checkbox " + attrs.join(" ") + " />";
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

  function reactSwitch(state) {
    var p = state.props;
    var label = p.label || "Notifications";
    var checked = p.checked === true || p.checked === "true";
    var disabled = state.meta.state === "disabled";
    var attrs = ['label="' + quoteAttr(label) + '"'];
    if (checked) attrs.push("defaultChecked");
    if (disabled) attrs.push("disabled");
    return "<Switch " + attrs.join(" ") + " />";
  }

  function njkIcon(state) {
    var p = state.props;
    var name = p.name || "search";
    var label = p.label || "";
    var parts = ['"' + quoteAttr(name) + '"'];
    if (label) parts.push('"' + quoteAttr(label) + '"');
    return "{{ ui.icon(" + parts.join(", ") + ") }}";
  }

  function reactIcon(state) {
    var p = state.props;
    var name = p.name || "search";
    var label = p.label || "";
    var attrs = ['name="' + quoteAttr(name) + '"'];
    if (label) {
      attrs.push('label="' + quoteAttr(label) + '"');
      attrs.push("decorative={false}");
    }
    return "<Icon " + attrs.join(" ") + " />";
  }

  function njkRadio(state) {
    var p = state.props;
    var label = p.label || "Option A";
    var checked = p.checked === true || p.checked === "true";
    return '{{ ui.radio("' + quoteAttr(label) + '"' + (checked ? ", true" : "") + ') }}';
  }

  function reactRadio(state) {
    var p = state.props;
    var label = p.label || "Option A";
    var checked = p.checked === true || p.checked === "true";
    var attrs = ['label="' + quoteAttr(label) + '"'];
    if (checked) attrs.push("defaultChecked");
    return "<Radio " + attrs.join(" ") + " />";
  }

  function njkBadge(state) {
    var p = state.props;
    var text = state.children || "Badge";
    var variant = p.variant || "default";
    var parts = ['"' + quoteAttr(text) + '"'];
    if (variant !== "default") parts.push('variant="' + variant + '"');
    return "{{ ui.badge(" + parts.join(", ") + ") }}";
  }

  function reactBadge(state) {
    var p = state.props;
    var text = state.children || "Badge";
    var variant = p.variant || "default";
    var attrs = [];
    if (variant !== "default") attrs.push('variant="' + variant + '"');
    return "<Badge" + (attrs.length ? " " + attrs.join(" ") : "") + ">" + quoteAttr(text) + "</Badge>";
  }

  global.UIPlaygroundCodeGenerators = {
    njk: {
      button: njkButton, input: njkInput, checkbox: njkCheckbox,
      "switch": njkSwitch, icon: njkIcon, radio: njkRadio, badge: njkBadge,
      label: function () { return '{{ ui.labelContent("text", "icon") }}'; },
      "button-group": function () { return '{% call ui.buttonGroup() %}...{% endcall %}'; },
    },
    react: {
      button: reactButton, input: reactInput, checkbox: reactCheckbox,
      "switch": reactSwitch, icon: reactIcon, radio: reactRadio, badge: reactBadge,
      label: function () { return "<LabelContent>...</LabelContent>"; },
      "button-group": function () { return "<ButtonGroup>...</ButtonGroup>"; },
    },
  };
})(window);
