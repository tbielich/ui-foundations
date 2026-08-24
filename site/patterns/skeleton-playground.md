---
layout: layouts/docs.njk
title: Skeleton Playground
description: Interactive vanilla preview for the Skeleton component.
navTitle: Skeleton Playground
order: 66
permalink: /patterns/skeleton-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Skeleton
    url: /patterns/skeleton/
  - label: Playground
playground:
  id: skeleton-playground
  queryPrefix: skeleton
  runtime: vanilla
  renderer: skeleton
  tokenCssPath: src/ui/patterns/skeleton.css
  controls:
    - kind: select
      name: shape
      label: Shape
      query: true
      default: text
      options:
        - text
        - heading
        - circle
        - rect
    - kind: select
      name: size
      label: Size
      query: true
      default: md
      options:
        - sm
        - md
        - lg
    - kind: select
      name: width
      label: Width (text only)
      query: true
      default: ""
      options:
        - ""
        - medium
        - short
    - kind: select
      name: animated
      label: Animation
      query: true
      default: "true"
      options:
        - "true"
        - "false"
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
