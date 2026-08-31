---
layout: layouts/docs.njk
title: Tag Playground
description: Interactive vanilla preview for the Tag component.
navTitle: Tag Playground
order: 26
permalink: /patterns/tag-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Tag
    url: /patterns/tag/
  - label: Playground
playground:
  id: tag-playground
  queryPrefix: tag
  runtime: vanilla
  renderer: tag
  tokenCssPath: src/ui/patterns/tag.css
  controls:
    - kind: text
      name: text
      label: Text
      source: children
      query: true
      default: Label
    - kind: select
      name: size
      label: Size
      query: true
      default: md
      options:
        - md
        - sm
    - kind: checkbox
      name: removable
      label: Removable
      query: true
      default: false
    - kind: checkbox
      name: selected
      label: Selected
      query: true
      default: false
    - kind: select
      name: startIcon
      label: Start Icon
      optionsData: iconsWithNone
      query: true
      default: ""
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
