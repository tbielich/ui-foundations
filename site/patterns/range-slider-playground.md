---
layout: layouts/docs.njk
title: Range Slider Playground
description: Interactive vanilla preview for range slider bounds and values.
navTitle: Range Slider Playground
order: 58
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
      valueType: number
      default: 0
    - kind: text
      name: max
      label: Max
      query: true
      valueType: number
      default: 100
    - kind: text
      name: lowerValue
      label: Lower value
      query: true
      valueType: number
      default: 20
    - kind: text
      name: upperValue
      label: Upper value
      query: true
      valueType: number
      default: 80
    - kind: text
      name: step
      label: Step
      query: true
      valueType: number
      default: 5
    - kind: boolean
      name: disabled
      label: Disabled
      valueType: boolean
      query: true
      default: false
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}

<script type="module" src="/vendor/ui-foundations/components/range-slider.js"></script>
