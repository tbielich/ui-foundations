---
title: Figma Code Connect Workflow
status: active
type: agent-guide
---

# Figma Code Connect Workflow

Workflow for connecting Figma design components to code implementations using Code Connect. Content was rephrased from [openai/skills](https://github.com/openai/skills) for compliance with licensing restrictions (Figma Developer Terms apply).

## Prerequisites

- Figma MCP server connected (Desktop or REST API)
- Components must be published to a team library
- Code Connect requires Organization or Enterprise plan

## Workflow

### 1. Identify unmapped components

Use the MCP `get_code_connect_suggestions` tool or manually inspect components in Figma Dev Mode. Identify which Figma components lack a code mapping.

### 2. Scan codebase for matches

For each unmapped component, search the codebase:

- Match by name: Figma "Button" → `src/ui/patterns/button.css`, `src/react/button.js`
- Match by structure: compare Figma variants/properties with CSS classes or React props
- Check `figma/connections/` for existing Code Connect files

Search paths in this repo:
- `src/ui/patterns/` — CSS component patterns
- `src/react/` — React wrappers
- `figma/connections/` — existing Code Connect mappings

### 3. Present matches for review

Before creating mappings, present findings:

```
Unmapped components:
- Button → src/ui/patterns/button.css (variants: solid, outline, ghost)
- Input → src/ui/patterns/input.css
- Link → not yet implemented (see docs/proposals/link-component.md)
```

### 4. Create mappings

Create Code Connect files in `figma/connections/`:

```ts
// figma/connections/web-button.figma.ts
import figma from "@figma/code-connect";

figma.connect("https://figma.com/design/:fileKey/:fileName?node-id=1-2", {
  props: { variant: figma.enum("Variant", { Solid: "solid", Outline: "outline", Ghost: "ghost" }) },
  example: (props) => `<button class="button ${props.variant}">Label</button>`,
});
```

### 5. Verify

After mapping, check in Figma Dev Mode that the code snippet appears correctly for the component.

## Existing Connections in This Repo

```
figma/connections/
  web-button.figma.ts
  web-button-group.figma.ts
  web-form.figma.ts
  web-icon.figma.ts
  web-input.figma.ts
  web-label.figma.ts
```

## Common Issues

- "No published components found" → component needs to be published to team library first
- "Component is already mapped" → mapping exists, update or remove the old one
- Node ID format: URLs use `node-id=1-2`, tools expect `1:2` (hyphen → colon)
