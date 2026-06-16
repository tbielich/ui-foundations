---
title: Rule Pipeline Audit
status: active
type: audit
---

# Rule Pipeline Audit

## Findings

What exists:
- Token governance exists in `docs/ui-foundations-rules.md` and `docs/foundations/`.
- Component implementation rules exist in `docs/agentic/assistant-behavior-rules.md`
  and Kiro steering files.
- Technical validation exists through lint, unit tests, build, smoke checks, token
  schema validation, asset checks, and docs build.
- Kiro specs describe future token drift, mode, accessibility, and scaffolding
  validators.

What was missing:
- Principles and heuristics were referenced by rule-generation guidance but were
  not versioned in the repository.
- Pattern rules for forms, cards, navigation, modals, tables, and
  search/filter did not exist.
- Component rules did not explicitly map back to pattern intent.
- CI did not enforce design-rule traceability.

What was inconsistent:
- Rule generation pointed to external `~/.kiro/skills` inputs, creating unclear
  ownership for repository behavior.
- `ci:check` enforced technical correctness but not the design-intent pipeline.
- Pattern-rule output paths were documented before the output existed.

What should be kept:
- Keep `docs/ui-foundations-rules.md` and `docs/foundations/` as governance for
  token, naming, theming, and implementation decisions.
- Keep Kiro steering as the agent-facing design intent layer.
- Keep existing technical checks and planned validator specs.

What should change:
- Treat local Kiro steering files as the source of truth for principles and
  heuristics.
- Require pattern rules to cite those source ids.
- Require CI to validate rule-pipeline structure and traceability.

## Target Architecture

`Principles -> Heuristics -> Pattern rules -> Component rules -> Validation -> CI`

| Stage | Owner | Artifact |
|---|---|---|
| Principles | Design system governance | `.kiro/steering/foundations/design-principles.md` |
| Heuristics | Design system governance | `.kiro/steering/foundations/usability-heuristics.md` |
| Pattern rules | Pattern governance | `.kiro/steering/pattern-rules/*.md` |
| Component rules | Component governance | `.kiro/steering/patterns/pattern-rule-map.md`, existing component steering |
| Validation | Engineering governance | `docs/validation/rule-pipeline.manifest.json`, `scripts/validate-rule-pipeline.mjs` |
| CI | Repository automation | `package.json`, `.github/workflows/ci.yml` |

## Implementation Plan

1. Version local source-of-truth principle and heuristic steering files.
2. Add the six required pattern-rule files with strict sections and traceability.
3. Add a component rule map to connect patterns to current component surfaces.
4. Add a validation manifest that lists source files, pattern files, component
   rule files, and CI script ownership.
5. Add a deterministic validator and run it from `ci:check`.
6. Update README and agent guidance so humans and agents discover the pipeline.

## Gap Table

| Layer | Status | Existing artifacts | Missing pieces | Recommended action |
|---|---|---|---|---|
| Principles | Added | `.kiro/steering/foundations/design-principles.md` | Future principle changes need governance review | Keep local steering as source of truth |
| Heuristics | Added | `.kiro/steering/foundations/usability-heuristics.md` | Future heuristic changes need governance review | Keep ids stable and cite them downstream |
| Pattern rules | Added | `.kiro/steering/pattern-rules/*.md` | No generated rule tooling yet | Maintain manually until generator exists |
| Component rules | Partial | `assistant-behavior-rules.md`, component steering, `.kiro/steering/patterns/pattern-rule-map.md` | Per-component executable contracts are still shallow | Extend validator when component specs mature |
| Validation | Added scaffold | `rule-pipeline.manifest.json`, `validate-rule-pipeline.mjs` | Does not yet inspect rendered DOM or token contrast | Keep planned a11y/mode/drift validators as next layer |
| CI | Updated | `ci:check`, GitHub Actions | CI now checks traceability, not full semantic behavior | Add future validators as they become deterministic |

## Open Risks

- Pattern rules are currently authored manually, not generated from a formal rule
  generator.
- Validation enforces traceability and structure, not full UI behavior.
- Accessibility, mode validation, and token drift specs are still requirements,
  not implemented validators.
- External agent tools may still carry stale context unless they read the updated
  Kiro steering and rule-pipeline docs.
