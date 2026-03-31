# Figma Design-to-Code Workflow

Structured workflow for translating Figma designs into production code with visual fidelity. Content was rephrased from [openai/skills](https://github.com/openai/skills) for compliance with licensing restrictions (Figma Developer Terms apply).

## Prerequisites

- Figma MCP server connected (Desktop or REST API)
- Figma URL with node ID, or node selected in Desktop app

## Workflow

### 1. Fetch design context

Use `get_design_context` with the file key and node ID. This returns layout properties, typography, colors, tokens, component structure, and spacing.

For large designs, use `get_metadata` first to get the node map, then fetch individual children.

### 2. Capture visual reference

Use `get_screenshot` for the same node. This screenshot is the source of truth for validation.

### 3. Check existing components

Before creating anything new, check what already exists:

- `src/ui/patterns/` — existing CSS patterns
- `src/react/` — existing React wrappers
- `dist/tokens/` — available design tokens

Reuse and extend existing components rather than creating new ones (Foundation-009).

### 4. Translate to project conventions

Key principles for this repo:

- Use CSS Custom Properties from `dist/tokens/`, not hardcoded values (Foundation-001)
- Follow token naming: `Component.variant.part.property.state` (Foundation-002)
- Use semantic color tokens, not primitive values (Foundation-003)
- Keep markup minimal (Foundation-012)
- Place CSS patterns in `src/ui/patterns/`, import in `src/ui/index.css`
- Use `@layer components` for component CSS

### 5. Validate

Compare implementation against the Figma screenshot:

- Layout: spacing, alignment, sizing
- Typography: font, size, weight, line height
- Colors: exact match against tokens
- States: hover, active, disabled, focus
- Responsive behavior

### 6. Run checks

```bash
npm run lint
npm run test:unit
npm run ci:check
```

## Implementation Rules for This Repo

- Token-first: components consume semantic tokens, never raw values
- CSS layers: `@layer components` for all component patterns
- Minimal markup: flattest possible structure (Foundation-012)
- Feature branches: new components go on `feat/component-name` branches (Foundation-011)
- Proposal first: draft in `docs/proposals/` before implementation (design-ops-specialist skill)

## Common Issues

- Design context too large → use `get_metadata` then fetch children individually
- Token values differ from Figma → prefer project tokens, adjust spacing minimally
- Assets not loading → check MCP server connection, use localhost URLs directly
- Missing component → check `docs/proposals/` for drafts, or create a new proposal
