---
layout: layouts/docs.njk
title: Input Playground
description: Interactive vanilla preview for input states and field properties.
navTitle: Input Playground
order: 41
permalink: /components/input-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Input
    url: /components/input/
  - label: Playground
playground:
  id: input-playground
  queryPrefix: input
  runtime: vanilla
  renderer: input
  tokenCssPath: src/ui/patterns/input.css
  controls:
    - kind: select
      name: type
      label: Type
      query: true
      default: text
      options:
        - text
        - email
        - search
        - password
        - tel
        - url
    - kind: text
      name: placeholder
      label: Placeholder
      query: true
      default: Enter value
    - kind: text
      name: value
      label: Value
      query: true
      default: ""
    - kind: select
      name: state
      label: State
      source: meta
      default: default
      options:
        - default
        - hover
        - active
        - focus
        - disabled
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
