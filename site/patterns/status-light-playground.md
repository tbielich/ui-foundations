---
layout: layouts/docs.njk
title: Status Light Playground
description: Interactive vanilla preview for the Status Light component.
navTitle: Status Light Playground
order: 18
permalink: /patterns/status-light-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Status Light
    url: /patterns/status-light/
  - label: Playground
playground:
  id: status-light-playground
  queryPrefix: status-light
  runtime: vanilla
  renderer: status-light
  tokenCssPath: src/ui/patterns/status-light.css
  controls:
    - kind: text
      name: text
      label: Text
      source: children
      query: true
      default: Status
    - kind: select
      name: variant
      label: Variant
      query: true
      default: neutral
      options:
        - neutral
        - positive
        - negative
        - notice
        - info
    - kind: select
      name: size
      label: Size
      query: true
      default: md
      options:
        - md
        - sm
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
