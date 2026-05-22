---
layout: layouts/docs.njk
title: Tooltip Playground
description: Interactive preview for the Tooltip component.
navTitle: Tooltip Playground
order: 21
permalink: /components/tooltip-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Tooltip
    url: /components/tooltip/
  - label: Playground
playground:
  id: tooltip-playground
  queryPrefix: tooltip
  runtime: vanilla
  renderer: tooltip
  tokenCssPath: src/ui/patterns/tooltip.css
  controls:
    - kind: text
      name: text
      label: Tooltip Text
      query: true
      default: "Helpful tip"
    - kind: select
      name: placement
      label: Placement
      query: true
      default: top
      options:
        - top
        - bottom
        - left
        - right
    - kind: text
      name: children
      label: Trigger Text
      source: children
      query: true
      default: "Hover me"
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
