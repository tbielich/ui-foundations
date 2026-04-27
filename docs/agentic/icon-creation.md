---
title: Icon Creation Guide
status: active
type: agent-guide
---

# Icon Creation Guide

Create missing SVG icons for the UI Foundations icon set when an icon does not
exist in `src/assets/icons/`.

## When to use

- An icon is requested by name that does not exist in `src/assets/icons/`.
- A composition or example needs an icon that is not in the set.
- Always check `ls src/assets/icons/ | grep <name>` before creating.

## Shape and naming reference

Before drawing a new icon, look up the concept in the
[Unicode Full Emoji List](https://www.unicode.org/emoji/charts/full-emoji-list.html)
to use as a visual and naming reference:

- Use the emoji glyph as a shape guide for the icon's silhouette and
  proportions. The stroke-based style stays the same — only use the emoji to
  understand the expected visual form.
- Prefer the Unicode CLDR short name (lowercase, hyphenated) as the starting
  point for the icon filename. Adapt it to match the existing naming convention
  (`<object>[-<variant>][-<modifier>]`) when needed.
- If the emoji name conflicts with an existing icon name in the set, prefer the
  existing convention.
- This step is a reference check, not a requirement to match the emoji exactly.

## Canvas

All icons share the same canvas:

```xml
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- paths here -->
</svg>
```

- Width/height: `24` × `24`
- ViewBox: `0 0 24 24`
- Fill: `none` (canvas is transparent)
- All visual content is stroke-based

## Stroke rules

Every `<path>` must use these attributes:

| Attribute          | Value       |
|--------------------|-------------|
| `stroke`           | `#9747FF`   |
| `stroke-linecap`   | `round`     |
| `stroke-linejoin`  | `round`     |
| `fill`             | omitted (inherits `none` from root) |

- Stroke width is the SVG default (`1`), never set explicitly.
- Use `fill-rule="evenodd" clip-rule="evenodd"` only on closed compound shapes
  that need a winding rule (e.g. shield outline, circled star). Simple open
  strokes never need it.
- Never use `fill` on any path. All icons are pure stroke outlines.

## Keyshapes

Icons are built on one of four keyshapes that define the outer boundary. The
inner symbol is inset from the keyshape edge.

### Circle (20 × 20, centered)

Used for: `-circled` variants, search, globe, user-circled, play-circled

```xml
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#9747FF" stroke-linecap="round" stroke-linejoin="round"/>
```

- Bounding box: `2,2` to `22,22` (20 × 20)
- Inner symbol safe area: inset ~3px → draw between `5,5` and `19,19`
- Examples: `plus-circled`, `minus-circled`, `star-circled`, `user-circled`,
  `checkmark-circled`, `play-circled`, `reduced-circled`

### Square (20 × 20, centered, rounded corners optional)

Used for: standalone square containers, badges, app-icon shapes

- Bounding box: `2,2` to `22,22`
- Corner radius: `0` (sharp) or small radius via arc commands
- Inner symbol safe area: inset ~3px → draw between `5,5` and `19,19`
- Examples: `share-box`, `square`

### Rect-landscape (wide, vertically centered)

Used for: mail, ticket, travel-documents, credit cards, banners

- Typical bounding box: `2,5` to `22,19` or `3,5` to `21,19` (wide, short)
- Inner symbol safe area: inset ~2px from rect edges
- Examples: `mail` (3,6 → 21,19.6), `travel-documents` (3,5 → 21,19),
  `ticket` (2,2 → 22,22 diagonal)

### Rect-portrait (tall, horizontally centered)

Used for: documents, bottles, doors, passports, phones

- Typical bounding box: `5,2` to `19,22` or `6,2` to `18,22` (tall, narrow)
- Inner symbol safe area: inset ~2px from rect edges
- Examples: `notepad`, `phone`, `travel-guide`

## Naming conventions

Names are lowercase kebab-case. The pattern is:

```
<object>[-<variant>][-<modifier>].svg
```

### Object (required)

The primary noun: `star`, `user`, `lock`, `shield`, `luggage`, `message`,
`seat`, `play`, `sun`, `sign`, `phone`, `picture`, `question-mark`

### Variant (optional)

A sub-type of the object:

| Pattern            | Meaning                        | Examples                          |
|--------------------|--------------------------------|-----------------------------------|
| `object-subtype`   | Specific form of the object    | `luggage-trolley`, `seat-comfort` |
| `object-action`    | Object with an action overlay  | `lock-close`, `lock-open`         |
| `object-symbol`    | Object with a symbol overlay   | `shield-check`, `lock-checkmark`  |
| `object-context`   | Object in a context            | `phone-checkin`, `user-passport`  |

### Modifier (optional, always last)

A shape or weight suffix:

| Modifier     | Meaning                                    | Examples                              |
|--------------|--------------------------------------------|---------------------------------------|
| `-circled`   | Wrapped in the circle keyshape             | `plus-circled`, `star-circled`        |
| `-heavy`     | Thicker/bolder stroke variant              | `plus-heavy`, `minus-heavy`           |
| `-bold`      | Bolder weight                              | `question-mark-bold`                  |
| `-ultrabold` | Heaviest weight                            | `question-mark-ultrabold`             |
| `-half`      | Partial/incomplete version                 | `star-half`, `sun-tui-half`           |
| `-crossed`   | Crossed-out / negated                      | `trash-crossed`                       |
| `-hidden`    | Hidden/invisible state                     | `view-hidden`                         |

### Compound names

When an object is two words, use a single hyphen: `lounge-chair`,
`lying-chair`, `travel-documents`, `water-slide`.

When a variant also has a modifier, chain with hyphens:
`luggage-hand-plus`, `luggage-suitcase-extra`, `luggage-trolley-extra`.

### Special: double-dash `--`

Used only for combined/dual-state icons: `thumbs-up--down` (shows both
thumbs-up and thumbs-down in one icon). This is rare.

## Composition rules

1. **Keyshape first** — draw the outer boundary path first in the SVG.
2. **Inner symbol second** — draw the inner detail paths after the keyshape.
3. **Inset the symbol** — inner content must not touch the keyshape edge.
   For circle keyshape: draw inner content between `5,5` and `19,19`.
   For `-circled` variants: use the same circle path as all other `-circled`
   icons (copy verbatim from `plus-circled.svg`).
4. **Reuse existing paths** — when creating a `-circled` variant of an existing
   icon, take the inner symbol from the base icon and scale/offset it to fit
   inside the circle safe area.
5. **Path order** — keyshape path first, then inner paths. This matches the
   existing convention (see `shield-check.svg`: checkmark path, then shield
   path; `star-circled.svg`: circle path, then star path).

## Checklist before creating

- [ ] Look up the concept in the [Unicode Full Emoji List](https://www.unicode.org/emoji/charts/full-emoji-list.html) for shape and naming reference
- [ ] Confirm the icon does not already exist: `ls src/assets/icons/ | grep <name>`
- [ ] Choose the correct keyshape (circle / square / rect-landscape / rect-portrait)
- [ ] Use the exact canvas template (24×24, fill="none")
- [ ] Use `stroke="#9747FF"` with `stroke-linecap="round" stroke-linejoin="round"` on every path
- [ ] Follow the naming convention: `<object>[-<variant>][-<modifier>].svg`
- [ ] Place the file in `src/assets/icons/`
- [ ] Verify it renders via the Icon component

## Example: creating `checkmark-circled.svg`

1. Base icon: `checkmark` (does not exist standalone, but the checkmark stroke
   exists inside `shield-check.svg` as `M8 13L11 16.043L16 9`)
2. Modifier: `-circled` → use the standard circle keyshape
3. Adjust checkmark coordinates to fit circle safe area: `M8 12L11 15L16 9`
4. Result:

```xml
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#9747FF" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 12L11 15L16 9" stroke="#9747FF" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```
