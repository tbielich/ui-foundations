---
layout: layouts/docs.njk
title: Internationalization
description: RTL support, locale considerations, and bi-directional layout guidance.
navTitle: Internationalization
order: 6
permalink: /foundations/internationalization/
---

UI Foundations uses logical properties and directional-aware patterns so
interfaces work correctly in both LTR and RTL languages.

## Logical properties

All component CSS uses logical properties (`margin-inline-start`,
`padding-block-end`, `border-inline-end`, etc.) instead of physical directions.
This ensures layouts mirror automatically in RTL contexts.

## RTL behavior

- Icons that imply direction (arrows, chevrons) are mirrored in RTL.
- Icons that are symmetrical or represent objects (search, settings) are not
  mirrored.
- Text alignment follows the document direction — no hardcoded `text-align: left`.

## Component considerations

- Button icons swap sides in RTL (icon moves from start to end).
- Navigation and breadcrumb order reverses visually.
- Form field layouts, including label placement, follow the inline direction.

## Testing

Set `dir="rtl"` on the root element to verify layout mirroring. Every component
should be visually reviewed in both directions before reaching stable status.
