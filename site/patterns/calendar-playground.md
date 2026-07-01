---
layout: layouts/docs.njk
title: Calendar Playground
description: Interactive vanilla preview for calendar states and navigation.
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
  controls:
    - id: month
      type: text
      label: Month
      default: "2026-07"
    - id: selectedDate
      type: number
      label: Selected day
      default: 15
    - id: todayDate
      type: number
      label: Today
      default: 1
    - id: state
      type: select
      label: State
      options:
        - default
        - hover
        - focus
      default: default
    - id: disabled
      type: checkbox
      label: Disabled
      default: false
---

{% import "macros/calendar.njk" as cal %}

<div class="playground-stage">
  {{ cal.calendar("July 2026", selectedDate="15", todayDate="1") }}
</div>
