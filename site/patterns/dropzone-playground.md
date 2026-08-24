---
layout: layouts/docs.njk
title: DropZone Playground
description: Interactive vanilla preview for dropzone upload area states.
navTitle: DropZone Playground
order: 53
permalink: /patterns/dropzone-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: DropZone
    url: /patterns/dropzone/
  - label: Playground
playground:
  id: dropzone-playground
  queryPrefix: dropzone
  runtime: vanilla
  renderer: dropzone
  tokenCssPath: src/ui/patterns/dropzone.css
  controls:
    - kind: text
      name: label
      label: Label
      query: true
      default: Drag and drop files here
    - kind: text
      name: hint
      label: Hint
      query: true
      default: or
    - kind: text
      name: buttonLabel
      label: Button label
      query: true
      default: Choose files
    - kind: text
      name: accept
      label: Accept
      query: true
      default: .pdf,.png,.jpg
    - kind: checkbox
      name: multiple
      label: Multiple
      query: true
      default: false
    - kind: select
      name: state
      label: State
      source: meta
      default: default
      options:
        - default
        - dragover
        - filled
        - disabled
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
