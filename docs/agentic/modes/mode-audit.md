# Mode — Audit

## Purpose

Inspect the system for drift, inconsistency, or rule violations without making
changes.

## Rules

- Read-only — do not modify files
- Compare Figma exports against dist output
- Flag naming mismatches, missing tokens, value drift
- Report findings structured by severity

## Output

- List of issues with file paths and token names
- Severity: critical / warning / info
- Suggested remediation (do not apply)
