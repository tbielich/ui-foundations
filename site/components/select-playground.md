---
layout: layouts/docs.njk
title: Select Playground
description: Interactive vanilla preview for select states and field properties.
navTitle: Select Playground
order: 46
permalink: /components/select-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Select
    url: /components/select/
  - label: Playground
playground:
  id: select-playground
  queryPrefix: select
  runtime: vanilla
  renderer: select
  tokenCssPath: src/ui/patterns/select.css
  controls:
    - kind: text
      name: placeholder
      label: Placeholder
      query: true
      default: Choose an option
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
    - kind: toggle
      name: optgroups
      label: Option groups
      query: true
      default: false
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
