---
layout: layouts/docs.njk
title: Calendar Playground
description: Interactive preview for calendar states, selection, and keyboard navigation.
navTitle: Calendar Playground
order: 81
permalink: /patterns/calendar-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Patterns
    url: /patterns/
  - label: Calendar
    url: /patterns/calendar/
  - label: Playground
playground:
  id: calendar-playground
  queryPrefix: calendar
  runtime: vanilla
  renderer: calendar
  tokenCssPath: src/ui/patterns/calendar.css
  controls:
    - kind: text
      name: month
      label: Month
      query: true
      default: "2026-07"
    - kind: text
      name: selectedDate
      label: Selected day
      query: true
      default: ""
    - kind: text
      name: todayDate
      label: Today
      query: true
      default: "1"
    - kind: select
      name: state
      label: State
      source: meta
      default: default
      options:
        - default
        - hover
        - focus
    - kind: boolean
      name: container
      label: Container
      valueType: boolean
      query: true
      default: true
    - kind: boolean
      name: disabled
      label: Disabled
      valueType: boolean
      query: true
      default: false
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
