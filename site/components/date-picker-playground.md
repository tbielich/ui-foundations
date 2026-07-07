---
layout: layouts/docs.njk
title: Date Picker Playground
description: Interactive preview for the Date Picker component with segmented fields and calendar dropdown.
navTitle: Date Picker Playground
order: 11
permalink: /components/date-picker-playground/
templateEngineOverride: njk
isPlayground: true
breadcrumb:
  - label: Components
    url: /components/
  - label: Date Picker
    url: /components/date-picker/
  - label: Playground
playground:
  id: date-picker-playground
  queryPrefix: datepicker
  runtime: vanilla
  renderer: datePicker
  tokenCssPath: src/ui/patterns/date-input.css
  controls:
    - kind: select
      name: state
      label: State
      source: meta
      default: default
      options:
        - default
        - open
        - disabled
    - kind: text
      name: day
      label: Day
      query: true
      default: ""
    - kind: text
      name: month
      label: Month
      query: true
      default: ""
    - kind: text
      name: year
      label: Year
      query: true
      default: ""
---

{% from "macros/playground.njk" import playground as uiPlayground with context %}

{{ uiPlayground(playground) }}
