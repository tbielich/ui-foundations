---
layout: layouts/docs.njk
title: Badge Playground
description: Interactive vanilla preview for the Badge component.
navTitle: Badge Playground
order: 16
permalink: /components/badge-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Badge
    url: /components/badge/
  - label: Playground
playground:
  id: badge-playground
  queryPrefix: badge
  runtime: vanilla
  renderer: badge
  controls:
    - kind: text
      name: text
      label: Text
      source: children
      query: true
      default: Badge
    - kind: select
      name: variant
      label: Variant
      query: true
      default: default
      options:
        - default
        - brand
        - success
        - danger
    - kind: select
      name: size
      label: Size
      query: true
      default: md
      options:
        - md
        - sm
    - kind: select
      name: startIcon
      label: Start Icon
      optionsData: iconsWithNone
      query: true
      default: ""
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
