---
layout: layouts/docs.njk
title: Avatar Playground
description: Interactive preview for the Avatar component.
navTitle: Avatar Playground
order: 18
permalink: /components/avatar-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Avatar
    url: /components/avatar/
  - label: Playground
playground:
  id: avatar-playground
  queryPrefix: avatar
  runtime: vanilla
  renderer: avatar
  tokenCssPath: src/ui/patterns/avatar.css
  controls:
    - kind: text
      name: initials
      label: Initials
      query: true
      default: "TB"
    - kind: text
      name: src
      label: Image URL
      query: true
      default: ""
    - kind: select
      name: size
      label: Size
      query: true
      default: md
      options:
        - xs
        - sm
        - md
        - lg
        - xl
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
