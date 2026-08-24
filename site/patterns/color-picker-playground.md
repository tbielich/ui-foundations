---
layout: layouts/docs.njk
title: Color Picker Playground
description: Interactive preview for color selection surfaces and value formats.
navTitle: Color Picker Playground
order: 47
permalink: /patterns/color-picker-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Color Picker
    url: /patterns/color-picker/
  - label: Playground
playground:
  id: color-picker-playground
  queryPrefix: colorPicker
  runtime: vanilla
  renderer: colorPicker
  tokenCssPath: src/ui/patterns/color-picker.css
  controls:
    - kind: color
      name: value
      label: Value
      query: true
      default: "#6366f1"
    - kind: select
      name: format
      label: Format
      query: true
      default: hex
      options:
        - hex
        - rgb
        - hsl
    - kind: select
      name: state
      label: State
      source: meta
      default: default
      options:
        - default
        - disabled
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
