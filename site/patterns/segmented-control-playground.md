---
layout: layouts/docs.njk
title: Segmented Control Playground
description: Interactive vanilla preview for the Segmented Control component.
navTitle: Segmented Control Playground
order: 22
permalink: /patterns/segmented-control-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Segmented Control
    url: /patterns/segmented-control/
  - label: Playground
playground:
  id: segmented-control-playground
  queryPrefix: segmented-control
  runtime: vanilla
  renderer: segmented-control
  tokenCssPath: src/ui/patterns/segmented-control.css
  controls:
    - kind: select
      name: segments
      label: Segment Count
      query: true
      default: "3"
      options:
        - "2"
        - "3"
        - "4"
        - "5"
    - kind: select
      name: active
      label: Active Segment
      query: true
      default: "0"
      options:
        - "0"
        - "1"
        - "2"
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
