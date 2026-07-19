# Accessibility Audit — Interactive Components (Workflow-First)

Date: 2026-05-04

## Purpose

This page documents the **workflow** for Runtime accessibility audits of
interactive components.

For the high-level principle surface, use:

- `docs/principles/accessibility.md`

## Objective of this PR

This workflow intentionally focuses on reusable audit execution and finding
format before broad component remediation.

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

## Principle vs practice boundary

- Principles: `docs/principles/accessibility.md`
- Practice workflow: this page and the audit skill

## Follow-up plan

After this workflow-first PR, create small component-specific PRs that:

1. run the skill for one component,
2. publish findings using the standard template,
3. apply minimal scoped fixes,
4. add or adjust tests and docs for that component only.
