---
layout: layouts/docs.njk
title: Switch Playground
description: Interactive vanilla preview for switch states and checked behavior.
navTitle: Switch Playground
order: 48
permalink: /components/switch-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Switch
    url: /components/switch/
  - label: Playground
playground:
  id: switch-playground
  queryPrefix: switch
  runtime: vanilla
  renderer: switch
  controls:
    - kind: text
      name: label
      label: Label
      query: true
      default: Notifications
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
