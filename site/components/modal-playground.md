---
layout: layouts/docs.njk
title: Modal Playground
description: Interactive preview for the Modal component.
navTitle: Modal Playground
order: 22
permalink: /components/modal-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Modal
    url: /components/modal/
  - label: Playground
playground:
  id: modal-playground
  queryPrefix: modal
  runtime: vanilla
  renderer: modal
  tokenCssPath: src/ui/patterns/modal.css
  controls:
    - kind: text
      name: title
      label: Title
      query: true
      default: Confirm action
    - kind: text
      name: description
      label: Description
      query: true
      default: This action requires your confirmation.
    - kind: select
      name: variant
      label: Variant
      query: true
      default: confirmation
      options:
        - confirmation
        - alert
    - kind: select
      name: size
      label: Size
      query: true
      default: m
      options:
        - s
        - m
        - l
    - kind: toggle
      name: dismissible
      label: Dismissible
      query: true
      default: true
    - kind: toggle
      name: open
      label: Open
      query: true
      default: true
    - kind: text
      name: confirmLabel
      label: Confirm Label
      query: true
      default: Confirm
    - kind: text
      name: cancelLabel
      label: Cancel Label
      query: true
      default: Cancel
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
