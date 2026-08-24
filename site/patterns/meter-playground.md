---
layout: layouts/docs.njk
title: Meter Playground
description: Interactive vanilla preview for the Meter component.
navTitle: Meter Playground
order: 18
permalink: /patterns/meter-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Meter
    url: /patterns/meter/
  - label: Playground
playground:
  id: meter-playground
  queryPrefix: meter
  runtime: vanilla
  renderer: meter
  tokenCssPath: src/ui/patterns/meter.css
  controls:
    - kind: text
      name: label
      label: Label
      query: true
      default: Storage used
    - kind: number
      name: value
      label: Value
      query: true
      default: 72
      min: 0
      max: 100
      step: 1
    - kind: number
      name: min
      label: Min
      query: true
      default: 0
      step: 1
    - kind: number
      name: max
      label: Max
      query: true
      default: 100
      step: 1
    - kind: select
      name: variant
      label: Variant
      query: true
      default: default
      options:
        - default
        - positive
        - notice
        - negative
    - kind: select
      name: size
      label: Size
      query: true
      default: md
      options:
        - md
        - sm
    - kind: text
      name: valueText
      label: Value Text
      query: true
      default: ""
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
