---
layout: layouts/docs.njk
title: TreeView Playground
description: Interactive preview for the TreeView component.
navTitle: TreeView Playground
order: 23
permalink: /components/tree-view-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: TreeView
    url: /components/tree-view/
  - label: Playground
playground:
  id: tree-view-playground
  queryPrefix: tree-view
  runtime: vanilla
  renderer: tree-view
  tokenCssPath: src/ui/patterns/tree-view.css
  controls:
    - kind: select
      name: selection
      label: Selection
      query: true
      default: single
      options:
        - single
        - multi
    - kind: boolean
      name: expanded
      label: Expanded root
      query: true
      default: true
    - kind: boolean
      name: draggable
      label: Enable drag-and-drop
      query: true
      default: false
    - kind: boolean
      name: lazy
      label: Lazy child branch
      query: true
      default: false
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
