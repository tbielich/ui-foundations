# Accessibility Audit — Interactive Components (Workflow-First)

Date: 2026-05-04

## Objective of this PR

This PR intentionally focuses on establishing a **reusable audit workflow** and **finding format** before broad component remediation.

## Primary deliverable

Use the reusable skill document:

- `docs/agentic/skills/component-accessibility-audit.md`

This skill defines:
- required governance references
- repeatable audit workflow
- severity model (blocker/high/medium/low)
- standardized findings template
- minimal-fix strategy
- manual screen reader validation requirements
- example single-component audit prompt

## Follow-up plan

After this workflow-first PR, create **small component-specific PRs** that:
1. run the skill for one component,
2. publish findings using the standard template,
3. apply minimal scoped fixes,
4. add/adjust tests and docs for that component only.
