---
layout: layouts/docs.njk
title: ComboBox Playground
description: Interactive vanilla preview for combobox states and field properties.
navTitle: ComboBox Playground
order: 43
permalink: /components/combobox-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: ComboBox
    url: /components/combobox/
  - label: Playground
playground:
  id: combobox-playground
  queryPrefix: combobox
  runtime: vanilla
  renderer: combobox
  tokenCssPath: src/ui/patterns/combobox.css
  controls:
    - kind: text
      name: placeholder
      label: Placeholder
      query: true
      default: Search destinations
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
    - kind: toggle
      name: loading
      label: Loading
      query: true
      default: false
    - kind: toggle
      name: allowCustomValue
      label: Free-form input
      query: true
      default: true
    - kind: toggle
      name: descriptions
      label: Secondary text
      query: true
      default: true
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}

<script type="module" src="/vendor/ui-foundations/elements/ui-combobox.js"></script>
