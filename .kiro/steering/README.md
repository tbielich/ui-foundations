# Steering Files — Task Index

This file maps common task types to the steering files an agent should load.
Use it to reduce ambiguity when multiple steering files could apply.

## Always Loaded (foundations)

These are included in every prompt automatically:

- `foundations/design-system-context.md` — token architecture, file locations, rules, language policy
- `foundations/design-principles.md` — composition principles with traceability IDs
- `foundations/usability-heuristics.md` — interaction heuristics with traceability IDs

## Task → Steering Map

### Creating a pattern

1. `workflows/component-creation.md`
2. `components/component-patterns.md`
3. `components/react-wrappers.md`
4. `components/component-rule-map.md`
5. `foundations/token-exports.md` (if token work needed)
6. `components/playground-system.md` (for playground page)

### Writing documentation

1. `components/component-doc-template.md`

### Working with the playground

1. `components/playground-system.md`

### Working with site data files

1. `components/site-data.md`

### Pattern rule work

1. `workflows/rule-generation.md`
2. `foundations/design-principles.md`
3. `foundations/usability-heuristics.md`
4. Pattern rules in `pattern-rules/` relevant to the domain

### Figma library sync

1. Activate skill: `figma-library-sync`
2. `figma/figma-components.md`
3. `figma/figma-connections.md`

### Building cheatsheet slides

1. `figma/cheatsheet-builder-rules.md` (layout, style, cards)
2. `figma/cheatsheet-builder-frames.md` (per-frame content)

### Figma reconciliation

1. `figma/figma-reconciliation.md`
2. `figma/figma-components.md`

### Pull requests

1. `workflows/pull-requests.md`

### Writing tests

1. `workflows/testing.md`

### Release / deployment

1. `workflows/release-deploy.md`

### Understanding build pipeline

1. `foundations/build-pipeline.md`

### Choosing agent mode

1. `workflows/agent-modes.md`

## Specs Ready for Implementation

These specs have requirements, design, and tasks complete — ready to pick up:

- `seo-indexing` — sitemap, robots.txt, structured metadata, canonical URLs
- `mcp-remote-deployment` — remote HTTP MCP server for AI agent access

## Inclusion Modes

| Mode | Front-matter | Behavior |
|---|---|---|
| Always | _(none or `inclusion: always`)_ | Loaded every prompt |
| Manual | `inclusion: manual` | Only loaded when user references via `#` |
| File match | `inclusion: fileMatch` + `fileMatchPattern` | Loaded when matching file enters context |
