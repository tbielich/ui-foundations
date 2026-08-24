---
layout: layouts/docs.njk
title: Menu Playground
description: Interactive preview for the Menu component.
navTitle: Menu Playground
order: 22
permalink: /patterns/menu-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Menu
    url: /patterns/menu/
  - label: Playground
playground:
  id: menu-playground
  queryPrefix: menu
  runtime: vanilla
  renderer: menu
  tokenCssPath: src/ui/patterns/menu.css
  controls:
    - kind: number
      name: items
      label: Item Count
      query: true
      default: 4
      min: 1
      max: 8
    - kind: toggle
      name: divider
      label: Show Divider
      query: true
      default: false
    - kind: toggle
      name: disabled
      label: Include Disabled Item
      query: true
      default: false
    - kind: toggle
      name: selected
      label: Include Selected Item
      query: true
      default: false
    - kind: toggle
      name: icons
      label: Show Icons
      query: true
      default: false
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
