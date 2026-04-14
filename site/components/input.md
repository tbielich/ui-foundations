---
layout: layouts/docs.njk
title: Input
description: Text input pattern with token-driven interaction states.
navTitle: Input
order: 40
permalink: /components/input/
playgroundUrl: /components/input-playground/
playgroundLabel: Open Input Playground
---

{% import "macros/ui.njk" as ui %}

## Preview

<div class="docs-stack" style="max-inline-size: 28rem;">
  {{ ui.input(type="text", placeholder="Email address") }}
  {{ ui.input(type="text", value="Focus preview", state="focus") }}
  {{ ui.input(type="text", value="Disabled field", disabled=true) }}
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
<input class="input" type="text" placeholder="Email address" />
```

</div>
<div class="code-tabs-panel" data-lang="njk">

{% raw %}
```njk
{% import "macros/ui.njk" as ui %}

{{ ui.input(type="text", placeholder="Email address") }}
{{ ui.input(type="text", value="Focus preview", state="focus") }}
{{ ui.input(type="text", value="Disabled field", disabled=true) }}
```
{% endraw %}

</div>
<div class="code-tabs-panel" data-lang="react">

{% raw %}
```jsx
import { Input } from "ui-foundations/react/input";

<Input placeholder="Email address" />
<Input type="email" placeholder="name@example.com" />
<Input disabled value="Disabled field" />
```
{% endraw %}

</div>
</div>

## Used tokens

{% componentTokenTable "src/ui/patterns/input.css" %}

