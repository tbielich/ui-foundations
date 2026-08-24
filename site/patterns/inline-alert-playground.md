---
layout: layouts/docs.njk
title: Inline Alert Playground
description: Interactive vanilla preview for the Inline Alert component.
navTitle: Inline Alert Playground
order: 23
permalink: /patterns/inline-alert-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Inline Alert
    url: /patterns/inline-alert/
  - label: Playground
playground:
  id: inline-alert-playground
  queryPrefix: inline-alert
  runtime: vanilla
  renderer: inline-alert
  tokenCssPath: src/ui/patterns/inline-alert.css
  controls:
    - kind: text
      name: title
      label: Title
      source: prop
      query: true
      default: "Information"
    - kind: text
      name: description
      label: Description
      source: prop
      query: true
      default: "Here is some helpful context for this situation."
    - kind: select
      name: variant
      label: Variant
      query: true
      default: info
      options:
        - default
        - info
        - positive
        - negative
        - notice
    - kind: checkbox
      name: dismissible
      label: Dismissible
      query: true
      default: false
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
