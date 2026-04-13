---
title: Foundation-011 – Branching and Release Governance
status: active
type: foundation-decision
---

# Foundation-011: Branching and Release Governance

## Purpose

Keep delivery safe and predictable by enforcing feature-branch development and protected `main` releases.

## Rules

1. Development happens on feature branches only:
   - naming: `feat/*`, `fix/*`, `chore/*`, `docs/*`
   - no direct commits to `main`

2. Merge to `main` only via pull request:
   - at least one review required
   - required status checks must pass (`lint`, `test:unit`, `ci:check`)
   - no force pushes to `main`
   - no branch deletion protection bypass

3. Releases are cut from clean `main` only:
   - run `npm run release:patch|minor|major`
   - push commit + tag with `npm run release:push`
   - publish with `npm run release:publish` (or `npm publish --otp=<code>`)

## Recommended GitHub Branch Protection (`main`)

- Require a pull request before merging
- Require approvals: 1+
- Dismiss stale approvals on new commits
- Require status checks:
  - `lint`
  - `test:unit`
  - `ci:check`
- Require branches to be up to date before merging
- Restrict who can push (optional, recommended for shared repos)
- Disallow force pushes
- Disallow deletions

## Implications

- Main stays releasable.
- Releases become repeatable and auditable.
- Risk of accidental or unreviewed production changes is reduced.
