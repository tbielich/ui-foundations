---
layout: layouts/docs.njk
title: Progress Circle Playground
description: Interactive preview for determinate and indeterminate progress circles.
navTitle: Progress Circle Playground
order: 58
permalink: /patterns/progress-circle-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Progress Circle
    url: /patterns/progress-circle/
  - label: Playground
playground:
  id: progress-circle-playground
  queryPrefix: progress-circle
  runtime: vanilla
  renderer: progress-circle
  tokenCssPath: src/ui/patterns/progress-circle.css
  controls:
    - kind: text
      name: ariaLabel
      label: Aria label
      query: true
      default: Loading account summary
    - kind: text
      name: value
      label: Value
      query: true
      default: "65"
    - kind: boolean
      name: indeterminate
      label: Indeterminate
      valueType: boolean
      query: true
      default: false
    - kind: select
      name: size
      label: Size
      query: true
      default: md
      options:
        - sm
        - md
        - lg
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
