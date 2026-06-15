---
layout: layouts/docs.njk
title: Link Playground
description: Interactive vanilla preview for the Link component.
navTitle: Link Playground
order: 61
permalink: /patterns/link-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Link
    url: /patterns/link/
  - label: Playground
playground:
  id: link-playground
  queryPrefix: link
  runtime: vanilla
  renderer: link
  tokenCssPath: src/ui/patterns/link.css
  controls:
    - kind: text
      name: text
      label: Text
      source: children
      query: true
      default: Learn more
    - kind: text
      name: href
      label: URL
      query: true
      default: "#"
    - kind: select
      name: startIcon
      label: Start Icon
      optionsData: iconsWithNone
      query: true
      default: ""
    - kind: select
      name: endIcon
      label: End Icon
      optionsData: iconsWithNone
      query: true
      default: ""
    - kind: select
      name: state
      label: State
      source: meta.state
      query: true
      default: default
      options:
        - default
        - hover
        - active
        - visited
        - focus
        - disabled
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
