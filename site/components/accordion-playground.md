---
layout: layouts/docs.njk
title: Accordion Playground
description: Interactive preview for the Accordion component.
navTitle: Accordion Playground
order: 19
permalink: /patterns/accordion-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Accordion
    url: /components/accordion/
  - label: Playground
playground:
  id: accordion-playground
  queryPrefix: accordion
  runtime: vanilla
  renderer: accordion
  tokenCssPath: src/ui/patterns/accordion.css
  controls:
    - kind: select
      name: items
      label: Items
      query: true
      default: "3"
      options:
        - "2"
        - "3"
        - "4"
        - "5"
    - kind: select
      name: openIndex
      label: Open Item
      query: true
      default: "0"
      options:
        - "0"
        - "1"
        - "2"
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
