---
title: AI Playbook
status: active
type: agent-guide
---

# AI Playbook

This playbook defines how to use AI as an engineering copilot in this repository.

## Goal

Use AI to speed up component incubation and implementation while keeping output:

- token-first
- reviewable in Git
- consistent with existing architecture

## Principles

1. Keep changes small and incremental.
2. Prefer existing patterns over introducing new abstractions.
3. Keep Figma and code aligned through explicit token roundtrips.
4. Always validate with local checks before pushing.

## Component Boundary Check (Mandatory)

Run this decision gate before implementing a "new component":

1. Start with composition-first:
   - If the new idea is primarily grouping, layout, or orchestration of existing components, implement it as composition within the existing component family and document it there.
2. Promote to standalone only when needed:
   - The candidate introduces distinct semantics (own role/responsibility), a stable API surface, or independent lifecycle/behavior that is not just a wrapper.
3. Apply a utility test ("Snowflake check"):
   - One-off/local case -> keep it local or document as composition.
   - Reusable across contexts/products -> valid candidate for system-level component.
4. Keep token work independent:
   - New tokens may be needed in both paths.
   - Token creation does not automatically justify a new standalone component.
5. Source of truth:
   - `docs/foundations/foundation-009-component-boundaries-and-utility.md`

## Standard Workflow: New Component

1. Run the Component Boundary Check and decide:
   - standalone component, or
   - composition inside existing component docs/API.
2. Ask AI for a first proposal:
   - structure: HTML/CSS/React
   - token names and states
   - docs + playground example
3. Review and adjust naming before implementation.
4. Add/import proposed tokens in Figma.
5. Export tokens from Figma to `figma/exports/`.
6. Let AI integrate implementation:
   - `src/ui/patterns/<component>.css`
   - `src/react/<component>.js` and `src/react/index.js` (if needed)
   - `site/components/<component>.md`
   - `site/components/<component>-playground.md`
   - `figma/connections/web-<component>.figma.ts` (if needed)
7. Run validation:
   - `npm run ci:check`
8. Iterate naming/states/a11y until stable.

## Skill selection

Use the repo skills intentionally:

- `design-ops-specialist` for tactical, proposal-first component work
- `design-system-architect` for strategic, system-level reviews and decisions

See also:
- `docs/agentic/skills/README.md`

## Proposal Mode: Design Ops Specialist

Use this mode when the request is explicitly a proposal (no implementation yet).

1. Confirm scope and constraints first:
   - component name
   - variants/sizes/states/parts
   - platform constraints
2. Review source rules before proposing:
   - `docs/foundations/`
   - `docs/agentic/assistant-behavior-rules.md`
   - this playbook
3. Deliver a concise proposal with these sections:
   - token naming proposal (variants/parts/states)
   - CSS pattern structure under `src/ui/patterns`
   - optional React wrapper API (only if requested/needed)
   - docs + playground integration plan
4. Keep recommendations minimal and non-breaking by default.

## Standard Workflow: Token Roundtrip

1. Create or update tokens in Figma.
2. Export into `figma/exports/*.tokens.json`.
3. Run:
   - `npm run build:all`
   - `npm run tokens:validate`
4. Check output consistency:
   - `dist/tokens/css/*.tokens.css`
   - `dist/tokens/json/*.json`
   - `dist/tokens/tokens.yaml`
5. If warnings appear (missing/invalid WEB syntax, alias issues), fix in Figma first.

## Standard Workflow: Figma Drift Reconciliation

Use this when the component was scaffolded in code first and component variables/variants are created or changed in Figma afterwards.

1. Define the contract first:
   - component API (props/states/semantics)
   - token names and expected usage
2. Update Figma variables/variants and export tokens:
   - `figma/exports/*.tokens.json`
3. Rebuild token artifacts:
   - `npm run build:all`
   - `npm run tokens:validate`
4. Reconcile Code Connect mappings:
   - update `figma/connections/web-<component>.figma.ts`
   - align node-id targets and property names with actual Figma top-level component/component set
   - run `figma connect parse`
   - run `figma connect publish --dry-run`
5. Reconcile implementation only where needed:
   - adjust CSS/React/docs/playground to match agreed contract
   - avoid broad rewrites; keep changes minimal
6. Validate and stabilize:
   - `npm run lint`
   - `npm run test:unit`
   - `npm run ci:check`
7. Commit with explicit scope, for example:
   - `chore(figma): reconcile <component> code-connect mapping`
   - `feat(<component>): align states and tokens with figma`

## Standard Workflow: Refactor and Quality

1. Ask AI to identify one small refactor target.
2. Implement only one focused change set.
3. Add or update tests when behavior is touched.
4. Run:
   - `npm run lint`
   - `npm run test:unit`
   - `npm run ci:check`
5. Commit with clear scope in message.

## Prompt Templates

### 1) New component incubation

```text
You are my Design OPS Manager. Propose a token-first setup for a new <component>.
Include:
- token naming proposal (variants/parts/states)
- CSS pattern structure under src/ui/patterns
- optional React wrapper API
- docs + playground integration
Keep changes minimal and aligned with existing repository conventions.
```

### 2) Token integration after Figma export

```text
I updated figma/exports. Please run the token/build pipeline, review warnings,
and apply minimal fixes so docs and bundles are green.
```

### 3) Safe refactor

```text
Refactor <target file/module> for maintainability in small steps only.
No behavior changes. Add tests if needed. Keep ci:check green.
```

### 4) Prompt to UI component (scaffold + implement)

```text
Scaffold and implement a new UI component named <component-name> in this repository.

Follow these sources strictly:
- docs/agentic/team-ai-playbook.md
- docs/agentic/assistant-behavior-rules.md
- docs/foundations/*

Execution requirements:
1) Run the Component Boundary Check first and state the decision (composition vs standalone).
2) Keep scope small, incremental, and reviewable in Git.
3) Implement token-first and reuse existing patterns:
   - src/ui/patterns/<component>.css
   - src/react/<component>.js and src/react/index.js (if needed)
   - site/components/<component>.md
   - site/components/<component>-playground.md
   - figma/connections/web-<component>.figma.ts (only if a publishable top-level Figma component/component-set exists)
4) Validate before handoff:
   - npm run lint
   - npm run test:unit
   - npm run ci:check

Mandatory progress tracker for this task type:
- Start with: Tasks completion: 0/4
- Update after each phase: 1/4, 2/4, 3/4, 4/4

Handoff format:
- boundary decision result
- files changed
- validation results
- open follow-ups (if any)
```

## Definition of Done (AI Task)

- Scope is clear and minimal.
- Affected files are easy to review.
- No broken exports or docs.
- `npm run ci:check` passes.
- README/docs updated when behavior or workflow changes.

## Worked example: Button Group

This repository now includes a concrete walkthrough based on a `Button Group`:

1. AI proposal:
   - layout model (`orientation`, `attached`, `justify`)
   - token proposal (`--button-group-gap`, `--button-group-border-radius`)
2. Implementation in code:
   - integrated button family CSS: `src/ui/patterns/button.css`
   - React wrapper API in `src/react/button.js` (`ButtonGroup`)
3. Documentation:
   - integrated in `site/components/button.md` under grouped usage
4. Validation:
   - `npm run ci:check`

Use this pattern as the reference baseline for future AI-assisted component incubation where wrappers extend an existing component family.
