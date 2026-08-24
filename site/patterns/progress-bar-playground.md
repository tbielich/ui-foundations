---
layout: layouts/docs.njk
title: Progress Bar Playground
description: Interactive vanilla preview for the Progress Bar component.
navTitle: Progress Bar Playground
order: 83
permalink: /patterns/progress-bar-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Progress Bar
    url: /patterns/progress-bar/
  - label: Playground
playground:
  id: progress-bar-playground
  queryPrefix: progress-bar
  runtime: vanilla
  renderer: progress-bar
  tokenCssPath: src/ui/patterns/progress-bar.css
  controls:
    - kind: number
      name: value
      label: Value (0–100)
      query: true
      default: 60
      min: 0
      max: 100
    - kind: select
      name: variant
      label: Variant
      query: true
      default: default
      options:
        - default
        - positive
        - negative
    - kind: select
      name: size
      label: Size
      query: true
      default: md
      options:
        - sm
        - md
        - lg
    - kind: text
      name: label
      label: Label
      query: true
      default: Loading…
    - kind: toggle
      name: showValue
      label: Show value
      query: true
      default: false
    - kind: toggle
      name: indeterminate
      label: Indeterminate
      query: true
      default: false
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
