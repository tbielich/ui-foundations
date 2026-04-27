---
layout: layouts/docs.njk
title: Radio Playground
description: Interactive vanilla preview for radio states and form behavior.
navTitle: Radio Playground
order: 56
permalink: /components/radio-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Radio
    url: /components/radio/
  - label: Playground
playground:
  id: radio-playground
  queryPrefix: radio
  runtime: vanilla
  renderer: radio
  tokenCssPath: src/ui/patterns/radio.css
  controls:
    - kind: text
      name: label
      label: Label
      query: true
      default: Option A
    - kind: boolean
      name: checked
      label: Checked
      valueType: boolean
      query: true
      default: false
    - kind: boolean
      name: disabled
      label: Disabled
      valueType: boolean
      query: true
      default: false
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
