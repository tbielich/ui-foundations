---
layout: layouts/docs.njk
title: Card Playground
description: Interactive vanilla preview for the Card component.
navTitle: Card Playground
order: 22
permalink: /patterns/card-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Card
    url: /patterns/card/
  - label: Playground
playground:
  id: card-playground
  queryPrefix: card
  runtime: vanilla
  renderer: card
  tokenCssPath: src/ui/patterns/card.css
  controls:
    - kind: text
      name: title
      label: Title
      source: children
      query: true
      default: Card title
    - kind: text
      name: body
      label: Body
      query: true
      default: A short description of the card content goes here.
    - kind: select
      name: layout
      label: Layout
      query: true
      default: vertical
      options:
        - vertical
        - horizontal
    - kind: select
      name: interactive
      label: Interactive
      query: true
      default: "false"
      options:
        - "false"
        - "true"
    - kind: select
      name: selected
      label: Selected
      query: true
      default: "false"
      options:
        - "false"
        - "true"
    - kind: select
      name: showMedia
      label: Show Media
      query: true
      default: "false"
      options:
        - "false"
        - "true"
    - kind: select
      name: showFooter
      label: Show Footer
      query: true
      default: "true"
      options:
        - "true"
        - "false"
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
