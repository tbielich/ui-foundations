---
layout: layouts/docs.njk
title: Form Playground
description: Interactive preview for form layout, grouping, and validation patterns.
navTitle: Form Playground
order: 71
permalink: /components/form-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Form
    url: /components/form/
  - label: Playground
playground:
  id: form-playground
  queryPrefix: form
  runtime: vanilla
  renderer: form
  tokenCssPath: src/ui/patterns/form.css
  controls:
    - kind: boolean
      name: borderless
      label: Borderless
      valueType: boolean
      query: true
      default: false
    - kind: select
      name: labelPosition
      label: Label Position
      query: true
      default: top
      options:
        - label: Top
          value: top
        - label: Side
          value: side
    - kind: boolean
      name: invalid
      label: Show Invalid
      valueType: boolean
      query: true
      default: false
    - kind: select
      name: actionsAlign
      label: Actions Align
      query: true
      default: end
      options:
        - label: Start
          value: start
        - label: End
          value: end
        - label: Stretch
          value: stretch
---

{% import "macros/ui.njk" as ui %}

<div class="docs-playground-stage" id="form-playground"></div>
