---
layout: layouts/docs.njk
title: Tabs Playground
description: Interactive preview for the Tabs component.
navTitle: Tabs Playground
order: 20
permalink: /patterns/tabs-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Tabs
    url: /patterns/tabs/
  - label: Playground
playground:
  id: tabs-playground
  queryPrefix: tabs
  runtime: vanilla
  renderer: tabs
  tokenCssPath: src/ui/patterns/tabs.css
  controls:
    - kind: select
      name: tabs
      label: Tab Count
      query: true
      default: "3"
      options:
        - "2"
        - "3"
        - "4"
        - "5"
    - kind: select
      name: active
      label: Active Tab
      query: true
      default: "0"
      options:
        - "0"
        - "1"
        - "2"
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
