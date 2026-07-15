---
title: Agentic Docs Migration Log
status: active
type: changelog
---

# Agentic Docs — Migration Log

This file documents why files were removed from `docs/agentic/` and where their responsibilities moved.

## Current structure (historical snapshot)

```
docs/agentic/
  assistant-behavior-rules.md   ← single source of truth for agent behavior
  MIGRATION.md                  ← this file
```

At the time of that cleanup, all other agent guidance lived in:
- `AGENTS.md` — operational rules, decision bias, validation
- `IMPLEMENTATION.md` — file locations, build pipeline, component workflow
- `docs/ui-foundations-rules.md` — governance (naming, layering, theming, review)
- `docs/foundations/` — architecture decisions

Agent-specific configs (Kiro Steering, Goose Recipes) lived locally, not in the repo.

## Current structure after the docs architecture pass

The repo now also includes:

- `docs/playbook.md`
- `docs/agentic/README.md`
- `docs/agentic/assistant-behavior-rules.md`
- `docs/agentic/{kiro,goose,codex}-workflow.md`
- `docs/agentic/skills/`

The detailed checklist remains in `assistant-behavior-rules.md`.

---

## Removed files and rationale

### `figma-plugin-api-reference.md`
Documented the Token Foundry Figma plugin API (async variable calls, mode handling, sandbox gotchas). The plugin was deprecated in favor of Figma MCP integration. MCP tools (`get_design_context`, `get_variable_defs`, `get_metadata`) replaced all plugin functionality. The plugin source in `figma/plugin/` is also deprecated.

### `figma-code-connect-workflow.md`
Step-by-step workflow for creating Code Connect mappings. Now covered by `assistant-behavior-rules.md` rule 8 (component creation checklist includes Code Connect) and `IMPLEMENTATION.md` (file locations and component workflow).

### `figma-design-to-code-workflow.md`
Workflow for translating Figma designs to code. Redundant with `IMPLEMENTATION.md` (Figma MCP integration flow, component workflow) and `assistant-behavior-rules.md` rules 8-13 (complete component creation checklist with token validation, CSS conventions, and Web Component patterns).

### `team-ai-playbook.md`
Comprehensive AI copilot playbook covering component incubation, token roundtrips, drift reconciliation, prompt templates, and worked examples. Operational content consolidated into `assistant-behavior-rules.md` (rules 7-13) and `AGENTS.md` (token workflow, validation). Prompt templates and worked examples are better served by agent-specific local configs.

### `skills/` (entire directory)
Contained `design-ops-specialist` and `design-system-architect` skill definitions. These were agent-specific persona configs that duplicated guidance already in `assistant-behavior-rules.md`, `ui-foundations-rules.md`, and `docs/foundations/`. Agent-specific personas now live in local configs, not in the repo.

---

## How to recover removed content

All removed files are preserved in Git history:

```bash
git log --all --full-history -- docs/agentic/<filename>
git show <commit>:docs/agentic/<filename>
```
