---
layout: layouts/docs.njk
title: Button Group Playground
description: Interactive grouped button layouts for attached rows and toggle states.
navTitle: Button Group Playground
order: 21
permalink: /patterns/button-group-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Button
    url: /components/button/
  - label: Group Playground
playground:
  id: button-group-playground
  queryPrefix: button-group
  runtime: vanilla
  renderer: button-group
  tokenCssPath: src/ui/patterns/button.css
  controls:
    - kind: text
      name: primaryLabel
      label: Primary Label
      query: true
      default: Day 1
    - kind: text
      name: secondaryLabel
      label: Secondary Label
      query: true
      default: Day 2
    - kind: text
      name: tertiaryLabel
      label: Tertiary Label
      query: true
      default: Day 3
    - kind: select
      name: mode
      label: Group Mode
      query: true
      default: actions
      options:
        - value: actions
          label: Action Group
        - value: toggle
          label: Toggle Group
    - kind: text
      name: groupLabel
      label: Group Aria Label
      query: true
      default: Select period
      visibleWhen:
        mode: toggle
    - kind: select
      name: selected
      label: Selected
      query: true
      default: 1
      options:
        - value: none
          label: None
        - value: 1
          label: First
        - value: 2
          label: Second
        - value: 3
          label: Third
      visibleWhen:
        mode: toggle
    - kind: select
      name: variant
      label: Variant
      query: true
      default: outline
      options:
        - solid
        - outline
        - ghost
    - kind: select
      name: orientation
      label: Orientation
      query: true
      default: horizontal
      options:
        - horizontal
        - vertical
    - kind: select
      name: justify
      label: Justify
      query: true
      default: start
      options:
        - start
        - stretch
    - kind: boolean
      name: attached
      label: Attached (No Gap)
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
        - focus
        - disabled
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
