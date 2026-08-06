---
layout: layouts/docs.njk
title: Notification Playground
description: Interactive preview for toast/notification variants and auto-dismiss.
navTitle: Notification Playground
order: 50
permalink: /patterns/notification-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Notification
    url: /patterns/notification/
  - label: Playground
playground:
  id: notification-playground
  queryPrefix: notification
  runtime: vanilla
  renderer: notification
  tokenCssPath: src/ui/patterns/notification.css
  controls:
    - kind: text
      name: message
      label: Message
      query: true
      default: Changes saved successfully.
    - kind: select
      name: variant
      label: Variant
      query: true
      default: info
      options:
        - info
        - success
        - warning
        - error
    - kind: text
      name: actionLabel
      label: Action label
      query: true
      default: Undo
    - kind: text
      name: actionHref
      label: Action href
      query: true
      default: "#"
    - kind: boolean
      name: dismissible
      label: Dismissible
      valueType: boolean
      query: true
      default: true
    - kind: number
      name: duration
      label: Auto-dismiss (ms, 0 = off)
      query: true
      default: 5000
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
