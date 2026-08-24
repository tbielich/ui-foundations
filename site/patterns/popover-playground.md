---
layout: layouts/docs.njk
title: Popover Playground
description: Interactive preview for the Popover component.
navTitle: Popover Playground
order: 22
permalink: /patterns/popover-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Popover
    url: /patterns/popover/
  - label: Playground
playground:
  id: popover-playground
  queryPrefix: popover
  runtime: vanilla
  renderer: popover
  tokenCssPath: src/ui/patterns/popover.css
  controls:
    - kind: select
      name: placement
      label: Placement
      query: true
      default: bottom
      options:
        - top
        - bottom
        - left
        - right
    - kind: toggle
      name: arrow
      label: Arrow
      query: true
      default: false
    - kind: text
      name: content
      label: Content
      query: true
      default: "Popover content"
    - kind: text
      name: children
      label: Trigger Text
      source: children
      query: true
      default: "Open"
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
