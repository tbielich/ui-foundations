---
layout: layouts/docs.njk
title: Icon Playground
description: Interactive vanilla preview for decorative and accessible icon usage.
navTitle: Icon Playground
order: 21
permalink: /patterns/icon-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Icon
    url: /patterns/icon/
  - label: Playground
playground:
  id: icon-playground
  queryPrefix: icon
  runtime: vanilla
  renderer: icon
  tokenCssPath: src/ui/patterns/icon.css
  controls:
    - kind: select
      name: name
      label: Icon Name
      optionsData: icons
      query: true
      default: search
    - kind: boolean
      name: decorative
      label: Decorative
      valueType: boolean
      query: true
      default: true
    - kind: text
      name: label
      label: Accessible Label
      query: true
      default: Search
    - kind: select
      name: lineHeight
      label: Line Height
      query: true
      default: 24px
      options:
        - 16px
        - 20px
        - 24px
        - 28px
        - 32px
    - kind: color
      name: color
      label: Color
      query: true
      default: currentColor
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
