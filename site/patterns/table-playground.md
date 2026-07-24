---
layout: layouts/docs.njk
title: Table Playground
description: Interactive preview for the Table pattern.
navTitle: Table Playground
order: 22
permalink: /patterns/table-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Table
    url: /patterns/table/
  - label: Playground
playground:
  id: table-playground
  queryPrefix: table
  runtime: vanilla
  renderer: table
  tokenCssPath: src/ui/patterns/table.css
  controls:
    - kind: select
      name: density
      label: Density
      query: true
      default: default
      options:
        - default
        - compact
        - comfortable
        - spacious
    - kind: select
      name: selection
      label: Selection
      query: true
      default: none
      options:
        - none
        - single
        - multi
    - kind: boolean
      name: sortable
      label: Sortable headers
      valueType: boolean
      query: true
      default: false
    - kind: boolean
      name: resizable
      label: Resizable columns
      valueType: boolean
      query: true
      default: false
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}

<script type="module" src="/vendor/ui-foundations/components/table.js"></script>
