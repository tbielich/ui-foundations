---
layout: layouts/docs.njk
title: Checkbox Playground
description: Interactive vanilla preview for checkbox states and form behavior.
navTitle: Checkbox Playground
order: 46
permalink: /components/checkbox-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Checkbox
    url: /components/checkbox/
  - label: Playground
playground:
  id: checkbox-playground
  queryPrefix: checkbox
  runtime: vanilla
  renderer: checkbox
  controls:
    - kind: text
      name: label
      label: Label
      query: true
      default: Accept terms
    - kind: boolean
      name: checked
      label: Checked
      valueType: boolean
      query: true
      default: false
    - kind: boolean
      name: disabled
      label: Disabled
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
        - indeterminate
        - hover
        - active
        - focus
        - disabled
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
