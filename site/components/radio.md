---
layout: layouts/docs.njk
title: Radio
description: Selection control for mutually exclusive choices within a group.
navTitle: Radio
order: 55
permalink: /components/radio/
playgroundUrl: /components/radio-playground/
playgroundLabel: Open Radio Playground
---

{% import "macros/ui.njk" as ui %}

## Preview

<div class="docs-stack">
  {{ ui.radio("Option A", false, false, "default", "", "", "", "demo-group", "a") }}
  {{ ui.radio("Option B", true, false, "default", "", "", "", "demo-group", "b") }}
  {{ ui.radio("Option C", false, false, "default", "", "", "", "demo-group", "c") }}
  {{ ui.radio("Disabled option", false, true, "default", "", "", "", "demo-disabled", "d") }}
</div>

## Usage

<div class="code-tabs">
{% call ui.buttonGroup(true, "horizontal", "start", "Code format", "code-tabs-bar") %}
  {{ ui.toggleButton("HTML", "lang", "html", "outline") }}
  {{ ui.toggleButton("Nunjucks", "lang", "njk", "outline") }}
  {{ ui.toggleButton("React", "lang", "react", "outline") }}
{% endcall %}
<div class="code-tabs-panel" data-lang="html">

```html
<label class="radio-field">
  <input class="radio" type="radio" name="group" value="a" />
  <span class="radio-field__text">Option A</span>
</label>

<label class="radio-field">
  <input class="radio" type="radio" name="group" value="b" checked />
  <span class="radio-field__text">Option B</span>
</label>

<label class="radio-field is-disabled">
  <input class="radio is-disabled" type="radio" name="group" value="c" disabled />
  <span class="radio-field__text">Disabled option</span>
</label>
```

</div>
<div class="code-tabs-panel" data-lang="njk">

{% raw %}
```njk
{% import "macros/ui.njk" as ui %}

{{ ui.radio("Option A", false, false, "default", "", "", "", "group", "a") }}
{{ ui.radio("Option B", true, false, "default", "", "", "", "group", "b") }}
{{ ui.radio("Disabled option", false, true, "default", "", "", "", "group", "c") }}
```
{% endraw %}

</div>
<div class="code-tabs-panel" data-lang="react">

{% raw %}
```jsx
import { Radio } from "ui-foundations/react";

<Radio name="group" value="a" label="Option A" />
<Radio name="group" value="b" defaultChecked label="Option B" />
<Radio name="group" value="c" disabled label="Disabled option" />
```
{% endraw %}

</div>
</div>

## Used tokens

{% componentTokenTable "src/ui/patterns/radio.css" %}
