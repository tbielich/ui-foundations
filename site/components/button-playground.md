---
layout: layouts/docs.njk
title: Button Playground
description: Interactive vanilla example with live button props.
navTitle: Button Playground
order: 20
permalink: /components/button-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Button
    url: /components/button/
  - label: Playground
playground:
  id: button-playground
  queryPrefix: button
  runtime: vanilla
  renderer: button
  tokenCssPath: src/ui/patterns/button.css
  controls:
    - kind: text
      name: label
      label: Label
      default: Book now
      source: children
      query: true
      visibleWhen:
        iconOnly: false
    - kind: select
      name: startIcon
      label: Start Icon
      optionsData: iconsWithNone
      query: true
      default: ""
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
    - kind: text
      name: ariaLabel
      label: Aria Label
      query: true
      default: Open menu
      visibleWhen:
        iconOnly: true
    - kind: select
      name: variant
      label: Variant
      query: true
      default: solid
      options:
        - solid
        - outline
        - ghost
    - kind: select
      name: state
      label: State
      default: default
      source: meta
      options:
        - default
        - hover
        - active
        - focus
        - disabled
    - kind: select
      name: type
      label: Type
      default: button
      options:
        - button
        - submit
        - reset
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
