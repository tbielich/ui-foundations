---
layout: layouts/docs.njk
title: TextArea Playground
description: Interactive preview for the TextArea component.
navTitle: TextArea Playground
order: 17
permalink: /patterns/textarea-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: TextArea
    url: /components/textarea/
  - label: Playground
playground:
  id: textarea-playground
  queryPrefix: textarea
  runtime: vanilla
  renderer: textarea
  tokenCssPath: src/ui/patterns/textarea.css
  controls:
    - kind: text
      name: placeholder
      label: Placeholder
      query: true
      default: "Enter your message..."
    - kind: text
      name: value
      label: Value
      query: true
      default: ""
    - kind: select
      name: rows
      label: Rows
      query: true
      default: "3"
      options:
        - "2"
        - "3"
        - "5"
        - "8"
    - kind: toggle
      name: disabled
      label: Disabled
      query: true
      default: false
    - kind: toggle
      name: readonly
      label: Readonly
      query: true
      default: false
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
