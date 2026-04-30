---
inclusion: manual
---

# Pull Request Conventions

When creating PRs with `gh pr create`, always include:

## Required properties

- **Label**: Choose from repo labels based on the change type:
  - `documentation` — docs, README, steering, copy changes
  - `enhancement` — new features, components, capabilities
  - `bug` — fixes for broken behavior
- **Project**: `--project "@tbielich's ui-foundations"` (project number 5)
- **Description**: Structured body with Summary and What Changed sections

## Example

```bash
gh pr create \
  --title "docs: update README" \
  --body "## Summary\n\n- Fixed component list\n- Added Brand C" \
  --label documentation \
  --project "@tbielich's ui-foundations"
```

## Label mapping from commit prefix

| Prefix | Label |
|--------|-------|
| `docs:` | `documentation` |
| `chore:` | `documentation` or `enhancement` depending on scope |
| `feat:` | `enhancement` |
| `fix:` | `bug` |
