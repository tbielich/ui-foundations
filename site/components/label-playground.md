---
layout: layouts/docs.njk
title: Label Playground
description: Interactive vanilla preview for LabelContent and FieldLabel patterns.
navTitle: Label Playground
order: 31
permalink: /patterns/label-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Label
    url: /components/label/
  - label: Playground
playground:
  id: label-playground
  queryPrefix: label
  runtime: vanilla
  renderer: label
  tokenCssPath: src/ui/patterns/label.css
  controls:
    - kind: select
      name: mode
      label: Mode
      source: meta
      query: true
      default: content
      options:
        - content
        - field
    - kind: text
      name: text
      label: Text
      source: children
      query: true
      default: Continue
    - kind: select
      name: startIcon
      label: Start Icon
      optionsData: iconsWithNone
      query: true
      default: search
    - kind: select
      name: endIcon
      label: End Icon
      optionsData: iconsWithNone
      query: true
      default: ""
      visibleWhen:
        iconOnly: false
    - kind: boolean
      name: iconOnly
      label: Icon Only
      valueType: boolean
      query: true
      default: false
    - kind: boolean
      name: required
      label: Required Marker
      valueType: boolean
      query: true
      default: false
    - kind: text
      name: forId
      label: For ID
      query: true
      default: email
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
