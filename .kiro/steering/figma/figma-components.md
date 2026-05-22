---
inclusion: manual
---

# Figma Component Creation Rules

When creating or updating Figma components via the Plugin API, these rules apply.

## Workflow Order (CRITICAL)

When building a Figma component, ALWAYS follow this order:

1. **Identify tokens first** — find existing Core/Semantic variables for every
   property (fill, stroke, radius, spacing, text color, font size, border width).
2. **Create missing tokens** if needed (in the correct collection).
3. **Build the component** with all properties bound to variables from step 1.
4. **Never create a component with hardcoded values** — not even temporarily.

This mirrors the CSS approach: `var(--token)` for everything, never raw values.

## Variant Properties

### Disabled is always a Boolean
- `Disabled` is ALWAYS a separate boolean property — never part of a State enum.
- Pattern: `State=Default|Hover|Focus|Active` + `Disabled=true|false`
- This matches the CSS pattern where `:disabled` is independent of `:hover`/`:focus`.

### State is always an Enum
- Interactive states: `Default`, `Hover`, `Active`, `Focus`
- Never include `Disabled` in the State enum.

### Text content is always a Component Property
- Every visible text element must be exposed as a Text component property.
- Property names: `Label`, `Text`, `Title`, `Placeholder` (context-dependent).
- Set via `componentSet.addComponentProperty(name, "TEXT", defaultValue)` and
  link with `textNode.componentPropertyReferences = { characters: propKey }`.

## Visual Requirements

### Shapes must maintain their geometry
- Circular components (Avatar): use `cornerRadius = size / 2` + `clipsContent = true`
  + fixed `primaryAxisSizingMode` and `counterAxisSizingMode`.
- Rounded rectangles: use explicit `cornerRadius` values.

### Auto Layout
- All components should use Auto Layout (`layoutMode`).
- Horizontal components: `layoutSizingHorizontal = "FILL"` so they stretch in containers.
- Vertical components: `layoutSizingVertical = "FILL"`.
- Fixed-size components (Avatar, Icon): use `"FIXED"` for both axes.

### Color Binding
- All fill and stroke colors must be bound to semantic variables from
  "Appearance (Modes)" collection using `figma.variables.setBoundVariableForPaint()`.
- All text fills must be bound to semantic text color variables
  (`Color/Text/Default`, `Color/Text/Disabled`, `Color/Text/Inverse`, `Color/Text/Brand`).
- Never use hardcoded colors without variable binding.

### All Properties Use Tokens
- **Border radius**: bind to Core `Size/Radius/*` variables via `setBoundVariable("topLeftRadius", var)` etc.
- **Spacing/padding**: bind to Core `Size/Spacing/*` variables where possible.
- **Border width**: bind to Core `Size/Border/*` variables.
- **Font size/weight**: bind to Core `Font Size/*` and `Font Weight/*` variables.
- Rule: if a property has a corresponding token in Core or Semantics, bind it. Never hardcode numeric values.

## Naming Conventions

### Component Set name
- PascalCase, singular: `Button`, `TextArea`, `Accordion Item`, `Tab`

### Variant property values
- Enum values: PascalCase (`Default`, `Hover`, `Active`)
- Boolean values: lowercase (`true`, `false`)
- Size values: lowercase (`xs`, `sm`, `md`, `lg`, `xl`)

## Placement

- Small/atomic components → Atoms section (node `2530:523` on Components page)
- Compound/molecule components → Molecules section
- Always position new component sets after existing ones (increment x position)

## After Creation

1. Add text component properties for all visible text
2. Bind colors to semantic variables
3. Verify shapes render correctly (circular, rounded, etc.)
4. Publish to team library before registering Code Connect
