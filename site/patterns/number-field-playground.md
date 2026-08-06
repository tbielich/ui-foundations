---
layout: layouts/docs.njk
title: Number Field Playground
description: Interactive vanilla preview for number field states and properties.
navTitle: Number Field Playground
order: 43
permalink: /patterns/number-field-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Number Field
    url: /patterns/number-field/
  - label: Playground
playground:
  id: number-field-playground
  queryPrefix: number-field
  runtime: vanilla
  renderer: number-field
  tokenCssPath: src/ui/patterns/number-field.css
  controls:
    - kind: text
      name: value
      label: Value
      query: true
      default: "0"
    - kind: text
      name: min
      label: Min
      query: true
      default: ""
    - kind: text
      name: max
      label: Max
      query: true
      default: ""
    - kind: text
      name: step
      label: Step
      query: true
      default: ""
    - kind: select
      name: format
      label: Format
      query: true
      default: ""
      options:
        - value: ""
          label: None
        - value: currency
          label: Currency ($)
        - value: percent
          label: Percent (%)
    - kind: text
      name: placeholder
      label: Placeholder
      query: true
      default: "0"
    - kind: select
      name: state
      label: State
      source: meta
      default: default
      options:
        - default
        - hover
        - active
        - focus
        - disabled
        - readonly
        - invalid
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}

<script type="module" src="/vendor/ui-foundations/components/input-field.js"></script>
