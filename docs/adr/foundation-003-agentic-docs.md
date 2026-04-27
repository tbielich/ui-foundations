---
title: Foundation-003 – Agentic Docs Restructure
status: active
type: foundation-decision
---

# Foundation-003: Agentic Docs Restructure

## Purpose

Clarify how humans and agents should navigate the repository documentation
without changing the technical behaviour of the project.

## What changed

- Added a clearer `docs/` section architecture with readme files for major
  sections.
- Added `docs/playbook.md` as the documentation entry point under `AGENTS.md`.
- Added section-level docs for foundations, principles, patterns, components,
  agent workflows, ADRs, and validation.
- Preserved existing detailed docs in place and added cross-links rather than
  deleting knowledge.

## What did not change

- No token values changed.
- No runtime or build behaviour changed.
- Existing detailed docs such as `docs/ui-foundations-rules.md`,
  `docs/token-pipeline.md`, and `docs/foundations/foundation-*.md` remain valid.

## Agent consumption model

Agents should read:

1. `AGENTS.md`
2. `docs/playbook.md`
3. the relevant section README
4. the detailed canonical docs referenced there

## Scope

This is a documentation-only restructuring unless a file explicitly says
otherwise.
