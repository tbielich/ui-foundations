---
layout: layouts/docs.njk
title: Search Field Playground
description: Interactive vanilla preview for SearchField states and options.
navTitle: Search Field Playground
order: 43
permalink: /patterns/search-field-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Search Field
    url: /patterns/search-field/
  - label: Playground
playground:
  id: search-field-playground
  queryPrefix: search-field
  runtime: vanilla
  renderer: search-field
  tokenCssPath: src/ui/patterns/search-field.css
  controls:
    - kind: text
      name: placeholder
      label: Placeholder
      query: true
      default: Search
    - kind: text
      name: value
      label: Value
      query: true
      default: ""
    - kind: boolean
      name: quiet
      label: Quiet variant
      valueType: boolean
      query: true
      default: false
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
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}

<script type="module" src="/vendor/ui-foundations/components/search-field.js"></script>
