---
inclusion: manual
---

# Pattern Rule Generation Spec

## Objective

Generate pattern-level UI rules by translating design principles and usability heuristics into concrete composition guidance.

## Inputs

Read these local steering files first:
- `.kiro/steering/design-principles.md`
- `.kiro/steering/usability-heuristics.md`

These files represent the source of truth for design intent in this repository.
External skills may provide supporting examples, but they must not override the
local steering files.

---

## Output

Generate pattern rules in:
`.kiro/steering/pattern-rules/`

Each pattern must be a separate markdown file.

Register generated or updated pattern rules in:
`docs/validation/rule-pipeline.manifest.json`

Run `npm run rules:validate` after changes.

---

## Target patterns

Always generate rules for:
- forms
- cards
- navigation
- modals
- tables
- search-and-filter

If additional patterns are detected in the system, include them.

---

## Transformation logic

### Step 1 — Extract rules

From each principle and heuristic:
- identify core rule statements
- identify "apply when" contexts
- identify failure signals

---

### Step 2 — Map to patterns

For each pattern:
- select only relevant principles and heuristics
- ignore unrelated ones
- prioritise:
  - proximity
  - hierarchy
  - cognitive load
  - consistency
  - feedback

---

### Step 3 — Translate into composition rules

Convert abstract rules into:
- layout structure
- grouping logic
- spacing relationships
- hierarchy definition
- interaction expectations

Rules must be:
- concrete
- testable
- UI-specific
- non-abstract

---

## Output format (strict)

Each file must follow this structure:

```md
# Pattern: {name}

## Rule type
pattern composition rule

## Scope
pattern

## Applies to
- {pattern name}

## Purpose
Explain what this pattern solves.

## Structure
Describe layout and composition.

## Rules
- concrete rule
- concrete rule
- concrete rule

## Interaction rules
- feedback
- states
- transitions

## Accessibility considerations
- contrast
- focus
- readability

## Applied principles
- reference principle names

## Applied heuristics
- reference heuristic names

## Failure signals
- what indicates bad implementation

## Agent check
- verifiable checks
- must be deterministic
```
