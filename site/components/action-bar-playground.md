---
layout: layouts/docs.njk
title: Action Bar Playground
description: Interactive vanilla preview for the Action Bar component.
navTitle: Action Bar Playground
order: 50
permalink: /components/action-bar-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Action Bar
    url: /components/action-bar/
  - label: Playground
playground:
  id: action-bar-playground
  queryPrefix: action-bar
  runtime: vanilla
  renderer: actionBar
  tokenCssPath: src/ui/patterns/action-bar.css
  controls:
    - kind: number
      name: count
      label: Selected Count
      query: true
      default: 3
      min: 0
      max: 999
    - kind: checkbox
      name: open
      label: Open
      query: true
      default: true
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
