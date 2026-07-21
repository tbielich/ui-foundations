---
layout: layouts/docs.njk
title: Range Slider Playground
description: Interactive vanilla preview for range slider properties and states.
navTitle: Range Slider Playground
order: 50
permalink: /patterns/range-slider-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Range Slider
    url: /patterns/range-slider/
  - label: Playground
playground:
  id: range-slider-playground
  queryPrefix: range-slider
  runtime: vanilla
  renderer: range-slider
  tokenCssPath: src/ui/patterns/range-slider.css
  controls:
    - kind: text
      name: label
      label: Label
      query: true
      default: Price range
    - kind: text
      name: min
      label: Min
      query: true
      default: "0"
    - kind: text
      name: max
      label: Max
      query: true
      default: "100"
    - kind: text
      name: valueMin
      label: Value Min
      query: true
      default: "20"
    - kind: text
      name: valueMax
      label: Value Max
      query: true
      default: "80"
    - kind: text
      name: step
      label: Step
      query: true
      default: "1"
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
        - hover
        - active
        - focus
        - disabled
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
