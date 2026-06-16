---
title: Rule Pipeline
status: active
type: agent-guide
---

# Rule Pipeline

The UI Foundations rule pipeline is:

`Principles -> Heuristics -> Pattern rules -> Component rules -> Validation -> CI`

This document explains ownership and handoffs. The executable inventory lives in
`docs/validation/rule-pipeline.manifest.json`.

## Layer Responsibilities

| Layer | Responsibility | Source artifacts |
|---|---|---|
| Principles | Cross-cutting design intent | `.kiro/steering/foundations/design-principles.md` |
| Heuristics | Observable usability behavior | `.kiro/steering/foundations/usability-heuristics.md` |
| Pattern rules | Composition rules for reusable UI patterns | `.kiro/steering/pattern-rules/*.md` |
| Component rules | Local markup, token, API, and state rules | `.kiro/steering/patterns/pattern-rule-map.md`, `.kiro/steering/patterns/pattern-css-rules.md`, `.kiro/steering/patterns/react-wrappers.md`, `docs/agentic/assistant-behavior-rules.md` |
| Validation | Deterministic checks grounded in upstream ids | `docs/validation/rule-pipeline.manifest.json`, `scripts/validate-rule-pipeline.mjs` |
| CI | Required execution | `package.json`, `.github/workflows/ci.yml` |

## Handoff Rules

1. Pattern rules must cite principle and heuristic ids.
2. Component rules must identify which pattern responsibilities they can enforce
   locally.
3. Validation must check traceability before checking implementation detail.
4. CI must run the rule-pipeline validator before technical build checks finish.
5. New rules must be added to the manifest or they are not enforceable.

## Adding a New Pattern Rule

1. Add or update a source principle or heuristic only if the intent is truly
   cross-cutting.
2. Create `.kiro/steering/pattern-rules/<pattern>.md` using the section structure
   in `.kiro/steering/workflows/rule-generation.md`.
3. Add the pattern entry to `docs/validation/rule-pipeline.manifest.json`.
4. Run `npm run rules:validate`.

## Adding a New Component Rule

1. Identify the pattern id and upstream principle or heuristic.
2. Add local guidance to the relevant steering file.
3. Register the rule surface in `docs/validation/rule-pipeline.manifest.json`
   when it should be enforced.
4. Add or update deterministic validation before relying on CI.
