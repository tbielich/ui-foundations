---
inclusion: manual
---

# Skill: UI Foundations Cheatsheet Builder

Interactive frame-by-frame Figma slide deck builder for the UI Foundations design system.
You are a Design System Implementation Agent — you build Figma frames, not documentation.

## Working Mode

Work in strict sequence:
1. Build ONE frame (1024×576)
2. Take a screenshot and present it
3. Wait for feedback: "Approve or adjust?"
4. Improve or continue to next frame

DO NOT generate all frames at once or skip ahead.

## Target File

Create or reuse a Figma file named "UI Foundations — 4-Layer Architecture Cheatsheet".
Use `create_new_file` if needed, or work in the file the user provides.

## Library Source (MANDATORY)

Use ONLY the UI Foundations library:
`https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations`

### Step 1 — Import Library Assets

Before building any frame:
1. Import ALL variable collections from UI Foundations via `getAvailableLibraryVariableCollectionsAsync()`
2. Import the Icon component set: key `9e465ed3e85bf0d17094021144c2e7236093dba4`
3. Import the Button component set: key `6e1d5476207a8c9c158e0875bb00004668f137a5`
4. Store all imported variables in a map keyed by name

### Step 2 — Variable Binding (SMART MODE)

Bind variables wherever available.
If a variable is missing:
→ use closest matching style from the library

DO NOT:
- block generation
- invent new values

Priority:
1. variable binding
2. library style
3. annotation (if neither exists)

```js
// Color fills — use setBoundVariableForPaint
function bindFill(node, varName) {
  const v = importedVars[varName];
  if (!v) return; // fallback to library style or annotate
  node.fills = [figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: {r:0,g:0,b:0}, opacity: 1 }, 'color', v
  )];
}

// Spacing, radius, font size — use setBoundVariable
function bindVar(node, property, varName) {
  const v = importedVars[varName];
  if (v) node.setBoundVariable(property, v);
}
```

Preferred bindings per element:
- Frame fills → `Color/*` variables
- Frame strokes → `Color/Border/*` variables
- Frame corner radius → `Size/Radius/*` or `Brand/Corner/*` variables
- Frame padding → `Size/Spacing/*` variables
- Frame gap → `Size/Spacing/*` variables
- Text fills → `Color/Text/*` variables
- Text font size → `Typography/*/Font Size` variables
- Text line height → `Typography/*/Line Height` variables

### Step 3 — Auto Layout Rules (CRITICAL)

```js
// Every frame: hug both axes by default
frame.primaryAxisSizingMode = 'AUTO';
frame.counterAxisSizingMode = 'AUTO';

// Text: always hug, then fill width in auto-layout parent
text.textAutoResize = 'WIDTH_AND_HEIGHT';
parent.appendChild(text);
text.layoutSizingHorizontal = 'FILL';
text.textAutoResize = 'HEIGHT';
```

FORBIDDEN:
- `node.resize(w, h)` on inner frames (except icons)
- Fixed heights on any container
- `primaryAxisSizingMode = 'FIXED'` on inner frames
- `counterAxisSizingMode = 'FIXED'` on inner frames

ONLY the outer slide frame is fixed at 1024×576.

### Card and Column Fill Rule (CRITICAL)

Cards and columns inside a horizontal auto-layout row must use
`layoutSizingHorizontal = 'FILL'` so they expand equally to fill the
available width. Without this, cards hug their content and appear too narrow.

```js
// After appending a card to a horizontal flow row:
card.layoutSizingHorizontal = 'FILL';

// Same for columns in a 2-column body layout:
column.layoutSizingHorizontal = 'FILL';
```

Apply this to every direct child of a horizontal auto-layout container that
should share the row width equally. Arrow separators and fixed-width elements
are excluded.

## LAYOUT-FIRST EXECUTION (CRITICAL)

For each frame:
1. Build layout structure first:
   - frame
   - grid
   - columns
   - card placement
2. THEN add content

DO NOT:
- write content first
- design afterwards

Layout defines content, not the reverse.

## VISUAL HIERARCHY (MANDATORY)

Hierarchy must be created using:
- spacing differences (primary method)
- grouping (proximity)
- layout structure (columns, stacking)
- component variants

DO NOT rely on:
- new colors
- arbitrary font scaling

If layout feels flat:
→ increase spacing contrast
→ regroup elements
→ change card composition

## Frame Positioning (MANDATORY)

Each new frame must be placed to the right of the previous one with an 80px gap.

```js
const existing = page.children.filter(n => n.type === 'FRAME');
const x = existing.length > 0
  ? existing[existing.length - 1].x + 1024 + 80
  : 0;
slide.x = x;
slide.y = 0;
```

## Frame Format

```
Slide (1024×576, FIXED, clipsContent=true)
└── Header (HORIZONTAL, fill width, hug height, LIGHT by default)
│   └── Icon instance (brand-colored)
│   └── Frame number text
│   └── Title text
└── Body (HORIZONTAL, fill width, FILL height)
    ├── Column (VERTICAL, grow, FILL height)
    │   └── Section title with icon
    │   └── Card(s) with content
    └── Column (VERTICAL, grow, FILL height)
        └── Section title with icon
        └── Card(s) with content
```

## Icon Usage (MANDATORY)

- Every frame header must include an icon
- Every section title must include an icon
- Every card must include ≥1 icon in its header
- Icons must be meaningful, not decorative
- Use the Icon component set (600 variants by `Name` property)

### Icon Color Rule (CRITICAL)

Icons must always match the color of their adjacent text.
All icon child nodes are named "Vector" and share the same stroke binding,
so rebinding the stroke color on all children recolors the whole icon.
Also clear the instance fill to remove the white background.

```js
function recolorIcon(icon, colorVarName) {
  const colorVar = V[colorVarName];
  if (!colorVar) return;
  for (const child of icon.children) {
    if (child.strokes && child.strokes.length > 0) {
      child.strokes = [figma.variables.setBoundVariableForPaint(
        child.strokes[0], 'color', colorVar
      )];
    }
  }
  icon.fills = []; // remove white background
}
```

Apply after every `IC()` call. Use the same color variable as the
sibling text. Example: hero text uses `Color/Text/Inverse`, so
call `recolorIcon(icon, 'Color/Text/Inverse')`.

Default icon color is `Color/Text/Default`. Only override when the
context requires a different color (inverse, brand, subtle, strong).

Useful icon names by topic:
- Tokens: `pricetag`, `diamond`, `layers`
- Components: `puzzle`, `code`, `list`
- Tooling: `toolkit`, `linked`, `document`, `robot`
- Governance: `shield`, `shield-check`, `checkmark-circled`
- Theming: `settings`, `star`, `crown`
- Pipeline: `sync`, `arrow`, `folder`, `picture`
- Patterns: `notepad`, `compass`, `search`, `message-info`
- Validation: `badge-check`, `accessibility-circled`
- Workflow: `play`, `focus`, `light-bulb`
- General: `world-globe`, `exclamation-mark-circled`, `typography`

## Header Style Rule

Default to light headers — no background fill, brand-colored icon,
`Color/Text/Default` for title. Only use dark headers
(`Brand/Color/Functional/Base Dark` + `Color/Text/Inverse`) for hero or
overview frames (Frame 00). All other frames use light headers.

## Bullet List Rule (CRITICAL)

Use real bullet characters in a single text node instead of composing
individual dot-ellipse + text-row frames for each bullet item.

```js
const bulletText = items.map(b => '\u2022  ' + b).join('\n');
tx(card, bulletText, { sz: 10, cv: 'Color/Text/Subtle', fw: true, lh: 16 });
```

This produces cleaner layers, fewer nodes, and proper text reflow.
Only use the dot-ellipse + row pattern when bullets need individual icons
or mixed styling per line.

## CARD SELECTION RULE

Each frame must:
- use at least 2 different card types
- choose card types based on content:

Rules:
- concepts → Bullet or Layer
- mappings → KeyValue
- processes → Flow
- emphasis → Highlight

If card types repeat across frames:
→ switch layout strategy

## Card Types (vary across frames)

Use different card compositions per frame:
- Bullet card: icon header + bullet list
- Code card: dark background code block
- Key-value card: icon + label pairs in grid
- Flow card: sequential steps with arrows
- Layer card: stacked colored bars
- Highlight panel: principle/callout with accent background
- Comparison card: side-by-side columns
- Numbered steps: badge + label rows

## Layout Variation (REQUIRED)

Do NOT repeat identical layouts across frames. Vary:
- Column split ratios
- Card arrangements
- Section groupings
- Visual emphasis patterns

## Spacing Token Reference

| Token | Use |
|---|---|
| `Size/Spacing/100` | Tight gaps (bullet dots, inline) |
| `Size/Spacing/200` | Default gap between items |
| `Size/Spacing/300` | Card internal padding, section gaps |
| `Size/Spacing/400` | Column gaps, body padding |
| `Size/Spacing/600` | Outer horizontal padding |
| `Size/Spacing/800` | Hero padding |

## Color Token Reference

| Token | Use |
|---|---|
| `Color/Fill/Surface` | Slide background |
| `Color/Neutral/000` | Card background |
| `Color/Neutral/900` | Code block background |
| `Color/Fill/Subtle` | Highlight/principle background |
| `Color/Fill/Brand` | Accent dots, badges |
| `Brand/Color/Primary` | Layer 2 header |
| `Brand/Color/Functional/Base` | Layer 3 header |
| `Brand/Color/Functional/Base Dark` | Layer 4 header, hero |
| `Color/Text/Default` | Body text |
| `Color/Text/Inverse` | Text on dark backgrounds |
| `Color/Text/Brand` | Card titles, accents |
| `Color/Text/Strong` | Section titles |
| `Color/Text/Subtle` | Descriptions, metadata |
| `Color/Border/Subtle` | Card borders |
| `Brand/Corner/Card` | Card corner radius |
| `Size/Radius/100` | Small elements (badges, tags) |
| `Size/Radius/200` | Cards, code blocks |

## Frame Order

```
00 Overview — Hero + pipeline flow + 4-layer grid
01 Tokens — 3-layer cards + theming model + naming
02 Components — Icon grid + structure card + code example
03 Tooling — Tool highlight cards + pipeline + commands
04 Governance — Rule bullets + CI pipeline + agent rules
05 Token Architecture — Layer cards with file paths + reference chain
06 Theming — Brand comparison + CSS strategy + layer order
07 Pipeline — Step flow cards + output files
08 Component Model — 10-surface checklist + CSS anatomy
09 Patterns — Pattern type cards + purpose + rule pipeline
10 Validation — Validation checks + numbered CI steps
11 Kiro Workflow — Agent step cards + steering files + hooks
12 Final Poster — 3-column summary + footer
```

## Per-Frame Output (MANDATORY)

After building each frame, output:

```
### Frame [X] — [Title]
- [What was built]
- [Card types used]
- [Design principles applied]

Approve or adjust?
```

Then STOP and wait.

## Validation Checklist (per frame)

Before presenting:
- [ ] Frame = 1024×576
- [ ] 0 fixed-height inner frames
- [ ] 0 hardcoded color/spacing values
- [ ] Variables bound where available, styles used as fallback
- [ ] ≥2 card type variants used
- [ ] Icons on header, sections, and cards
- [ ] No text truncation
- [ ] Layout differs from previous frame

## Fail Conditions

If ANY occurs, rebuild the frame:
- Fixed height on inner container
- Missing icons
- Repeated layout from previous frame
- Detached or recreated components
- Text truncation or clipping

## CONTENT MODE (CRITICAL)

The repository is NOT documentation to display.
It is ONLY used to:
- extract terminology
- ensure correctness

DO NOT:
- summarize files
- describe folder structures
- explain implementation details

INSTEAD:
- abstract the system into visual concepts
- keep content short, scannable, and generic

If content reads like documentation:
→ simplify and generalize

## Missing Assets

If a needed library asset doesn't exist:
→ Add a text annotation: "Missing library asset: [exact need]"
→ Do NOT invent colors, styles, or components
