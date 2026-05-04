# Component Accessibility Audit Skill

## Purpose

Create a repeatable, component-level accessibility audit workflow before implementation fixes.

Use this skill to evaluate one interactive component at a time and produce findings in a consistent format that can drive small follow-up PRs.

## Governance references (must read first)

1. `DESIGN.md`
2. `AGENTS.md`
3. `docs/playbook.md`
4. `docs/working-context.md`
5. `docs/ui-foundations-rules.md`
6. `docs/foundations/`
7. `docs/agentic/assistant-behavior-rules.md`
8. `IMPLEMENTATION.md`

Never contradict these sources. Prefer explicit, verifiable findings over assumptions.

## Scope

Apply this skill to interactive components (e.g., Button, Link, Input, Select, Checkbox, Radio, Switch, Tabs, Accordion, Modal, Flyout, Dropdown, Tooltip, Pagination, Show More/Show Less, Tags).

Do not use this skill to implement broad fixes in the same PR. This skill is audit-first.

## Audit workflow (repeatable)

1. **Plan**
   - Select exactly one component target.
   - Confirm component surfaces in scope (CSS pattern, macro/template, React wrapper, docs, tests).

2. **Collect evidence**
   - Inspect source implementation files.
   - Inspect usage examples and docs.
   - Inspect test coverage.
   - Record exact file paths and relevant lines.

3. **Run checks**
   - Semantic HTML
   - Accessible names
   - Keyboard behavior
   - Focus management
   - ARIA/state handling
   - Form association (where relevant)
   - Icon-only usage
   - Contrast/token risks
   - Test coverage
   - Documentation gaps
   - Manual screen reader validation needs

4. **Score severity**
   - Assign one severity per finding using the model below.

5. **Propose minimal fix**
   - Suggest the smallest safe change that resolves the finding.
   - Keep fixes scoped to one component per follow-up PR.

6. **Report**
   - Output findings using the template in this document.

## Severity model

Use one of these labels:

- **blocker**
  - Breaks core accessibility behavior (e.g., no accessible name, unusable keyboard path, broken form semantics, missing focus trap in modal).
  - Should be fixed before release.

- **high**
  - Major accessibility risk with likely user impact, but possible workaround exists.
  - Prioritize immediately after blockers.

- **medium**
  - Important gap or drift that reduces accessibility quality/reliability.
  - Schedule in near-term follow-up.

- **low**
  - Minor issue, documentation gap, or optimization with limited immediate impact.
  - Track and resolve in routine improvements.

## Findings template

Use this exact structure for each finding:

- **Component:**
- **Check area:** (semantic HTML / accessible name / keyboard / focus / ARIA-state / form association / icon-only / contrast-token / tests / docs / manual SR)
- **Observed behavior:**
- **Expected behavior:**
- **Evidence:** (file paths + line refs)
- **Severity:** blocker | high | medium | low
- **Minimal fix strategy:**
- **Follow-up test need:**
- **Manual SR validation need:**

## Minimal-fix strategy

When proposing a fix:

1. Prefer native semantics over custom ARIA.
2. Change the smallest surface that safely resolves the issue.
3. Keep API compatibility unless current API is inherently inaccessible.
4. Update docs and tests in the same small PR when behavior changes.
5. Avoid cross-component refactors in accessibility fix PRs.

## Manual screen reader validation guidance

For each audited component, explicitly state whether manual SR validation is needed and why.

Recommended baseline matrix:
- VoiceOver + Safari (macOS)
- NVDA + Firefox (Windows)
- Optional: JAWS + Chrome for enterprise parity

Validate at minimum:
- role announcement
- name announcement
- state announcement
- focus order
- action feedback after interaction

## Example audit prompt (single component)

> Audit the `Link` component only using the Component Accessibility Audit Skill. Check semantic HTML, accessible names, keyboard behavior, focus management, ARIA/state handling, icon-only usage, contrast/token risks, tests, docs, and manual screen reader validation needs. Output findings using the required template and assign severity with blocker/high/medium/low. Do not implement fixes.

## Output expectations

- Be explicit and evidence-based.
- Distinguish verified findings from assumptions.
- Keep findings actionable for small follow-up PRs.
- If not verified, mark as "not verified".
