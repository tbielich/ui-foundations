---
layout: layouts/docs.njk
title: Breadcrumbs Playground
description: Interactive preview for the Breadcrumbs component.
navTitle: Breadcrumbs Playground
order: 65
permalink: /patterns/breadcrumbs-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Breadcrumbs
    url: /patterns/breadcrumbs/
  - label: Playground
playground:
  id: breadcrumbs-playground
  queryPrefix: breadcrumbs
  runtime: vanilla
  renderer: breadcrumbs
  tokenCssPath: src/ui/patterns/breadcrumbs.css
  controls:
    - kind: select
      name: depth
      label: Depth
      query: true
      default: "4"
      options:
        - "2"
        - "3"
        - "4"
        - "5"
    - kind: select
      name: collapse
      label: Collapse
      query: true
      default: responsive
      options:
        - responsive
        - always
        - none
    - kind: select
      name: maxItems
      label: Max items (always)
      query: true
      default: "4"
      options:
        - "2"
        - "3"
        - "4"
        - "5"
    - kind: select
      name: separator
      label: Separator
      query: true
      default: /
      options:
        - /
        - ">"
        - "→"
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
