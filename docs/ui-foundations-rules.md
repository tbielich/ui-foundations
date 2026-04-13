---
title: UI Foundations Rules
status: active
type: governance
applies_to:
  - token-architecture
  - naming
  - theming
  - design-to-code
  - review
  - agent-guidance
---

# UI Foundations Rules

## Purpose

This is the governing rules document for UI Foundations.

Use it as the default decision framework for structure, naming, theming, review, and system evolution.
Use `docs/foundations/` for topic-specific architecture decisions and supporting detail.
Use `IMPLEMENTATION.md` for repository-specific implementation guidance.

---

## Core Rules

1. **Keep layers distinct**  
   Preserve clear separation between Core, Semantic, and Component tokens.

2. **Use semantics where intent matters**  
   Tokens that express purpose, state, role, or usage should not live in Core.

3. **Prefer explicit naming**  
   Names must be understandable without tribal knowledge or hidden context.

4. **Align Figma and code naming closely**  
   Minimise translation, remapping, and interpretation between design and implementation.

5. **Structure for scale**  
   Optimise for brands, modes, components, and teams — not one-off local convenience.

6. **Theme intentionally**  
   Keep brand and mode predictable and apply theme logic at the correct layer.

7. **Reduce interpretation gaps**  
   The system should make meaning obvious for humans and agents.

8. **Document exceptions**  
   If a rule must be broken, the exception must be explicit, justified, and documented.

9. **Governance is part of quality**  
   Naming discipline, layering, review criteria, and documentation are part of the system.

---

## Layer Model

### Core
Raw foundational values only.
Examples: base colors, spacing scale, typography primitives, radii, shadows, motion.

### Semantic
Reusable intent and meaning.
Examples: text default, background surface, border subtle, status success, focus ring.

### Component
Component-specific decisions where semantic tokens alone are not sufficient.
Examples: button background default, input border focus, card padding compact.

### Layer rules
- Do not mix primitive values, semantic meaning, and component decisions in one layer.
- Do not create component tokens that only duplicate semantic tokens without benefit.
- Do not use Core directly in product UI unless there is a clear documented reason.

---

## Naming Rules

- Names must express intent, role, usage, or state.
- Prefer semantic naming over visual naming where intent matters.
- Names should remain valid even if the underlying value changes.
- Avoid vague labels like `main`, `misc`, `general`, or unscoped `primary`.
- Design names so they map cleanly into code outputs such as CSS custom properties.

Good:
- `color.text.default`
- `color.background.surface`
- `component.button.background.hover`
- `component.input.border.focus`

Avoid:
- `blue500`
- `primaryColor`
- `defaultBorder`
- `buttonFinal`

---

## Theming Rules

- Keep brand and mode orthogonal where possible.
- Theme at the correct layer.
- Avoid unnecessary duplication across themes.
- Use component tokens as controlled extension points, not as a replacement for semantic structure.
- Keep CSS outputs predictable and traceable.

Preferred runtime model:
- `data-brand`
- `data-mode`

---

## Design-to-Code Rules

- Minimise translation steps from Figma to code.
- Keep names closely aligned between design and implementation.
- Outputs must be predictable across CSS, JSON, and supported formats.
- Documentation must reflect implementation reality.
- Avoid undefined meaning that forces designers, developers, or agents to guess.

---

## Agent-Readiness Rules

A good system should be understandable by new team members and by AI agents.

Prefer:
- explicit naming
- clear layer boundaries
- stable conventions
- low ambiguity
- minimal hidden assumptions
- documented exceptions

Practical rule:
If a new human reader would struggle to understand a token or rule, an agent likely will too.

---

## Review Checklist

When reviewing tokens, naming, theming, refactors, or structural changes, ask:

- Is the correct layer being used?
- Is the naming explicit and stable?
- Is the semantic intent clear?
- Is theming handled at the right layer?
- Does this improve or harm design-to-code parity?
- Is this necessary and reusable enough to exist?
- Does this reduce or increase ambiguity?

---

## Anti-Patterns

Avoid:
- mixing layers
- tokens without a clear purpose
- appearance-only naming where semantic meaning matters
- solving global theme problems only inside components
- undocumented one-off exceptions
- aliases that add indirection without meaning
- local optimisation that harms long-term system clarity

---

## Default Decision Bias

When in doubt, prefer the option that:
- reduces ambiguity
- preserves layer discipline
- improves naming clarity
- aligns design and code more closely
- scales across brands, modes, and components
- is easier to govern and document
- is easier for humans and agents to understand
