---
layout: layouts/docs.njk
title: Illustrated Message Playground
description: Interactive preview for the Illustrated Message component.
navTitle: Illustrated Message Playground
order: 19
permalink: /patterns/illustrated-message-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Illustrated Message
    url: /patterns/illustrated-message/
  - label: Playground
playground:
  id: illustrated-message-playground
  queryPrefix: illustratedMessage
  runtime: vanilla
  renderer: illustrated-message
  tokenCssPath: src/ui/patterns/illustrated-message.css
  controls:
    - kind: select
      name: preset
      label: Preset
      query: true
      default: empty
      options:
        - empty
        - error
        - no-results
    - kind: text
      name: heading
      label: Heading override
      query: true
      default: ""
    - kind: text
      name: description
      label: Description override
      query: true
      default: ""
    - kind: text
      name: illustrationIcon
      label: Illustration icon override
      query: true
      default: ""
    - kind: text
      name: actionLabel
      label: Action label
      query: true
      default: ""
    - kind: text
      name: actionHref
      label: Action href
      query: true
      default: ""
    - kind: select
      name: actionVariant
      label: Action variant
      query: true
      default: solid
      options:
        - solid
        - outline
        - ghost
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
