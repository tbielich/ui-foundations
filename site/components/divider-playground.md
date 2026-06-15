---
layout: layouts/docs.njk
title: Divider Playground
description: Interactive vanilla preview for the Divider pattern.
navTitle: Divider Playground
order: 17
permalink: /patterns/divider-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Divider
    url: /patterns/divider/
  - label: Playground
playground:
  id: divider-playground
  queryPrefix: divider
  runtime: vanilla
  renderer: divider
  tokenCssPath: src/ui/patterns/divider.css
  controls:
    - kind: select
      name: variant
      label: Variant
      query: true
      default: default
      options:
        - default
        - subtle
    - kind: select
      name: orientation
      label: Orientation
      query: true
      default: horizontal
      options:
        - horizontal
        - vertical
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
