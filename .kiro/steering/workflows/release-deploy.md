---
inclusion: manual
---

# Release & Deployment

## Environments

| Environment | URL | Trigger |
|-------------|-----|---------|
| Production docs | https://ui-foundations.netlify.app | Auto-deploy on push to `main` |
| npm package | https://www.npmjs.com/package/ui-foundations | Manual tag push |

No staging environment exists. Preview deploys on Netlify PRs are available
via Netlify's default deploy preview feature.

## Docs Deployment (Netlify)

Automatic on every push. Configuration in `.netlify/netlify.toml`:

- Build command: `npm run docs:site`
- Publish directory: `_site/`
- Node version: 20
- Security headers: CSP, X-Frame-Options DENY, nosniff

No manual steps needed for docs deployment.

## npm Package Release

### Prerequisites

- `NPM_TOKEN` set in GitHub Actions secrets
- Clean working tree
- All CI checks passing

### Workflow

```bash
# 1. Ensure everything passes
npm run release:check    # runs ci:check + pack:check (dry-run)

# 2. Bump version (choose one)
npm run release:patch    # 0.7.0 → 0.7.1
npm run release:minor    # 0.7.0 → 0.8.0
npm run release:major    # 0.7.0 → 1.0.0

# 3. Push the tag
npm run release:push     # git push origin main --follow-tags

# 4. CI auto-publishes (or manual)
npm run release:publish  # npm publish (runs automatically via GitHub Actions)
```

### What `release:check` validates

1. `npm run ci:check` — full pipeline (lint, test, build, validate)
2. `npm run pack:check` — dry-run of `npm pack` to verify package contents

### GitHub Actions publish trigger

The `.github/workflows/publish.yml` workflow triggers on `v*` tags:
1. Checkout
2. Install dependencies
3. Run `ci:check` again
4. `npm publish --access public`

### Package Contents (`files` in package.json)

```
dist/**
README.md
docs/foundations/**
docs/agentic/assistant-behavior-rules.md
docs/agentic/team-ai-playbook.md
docs/agentic/skills/**
```

## CI Pipeline

`.github/workflows/ci.yml` runs on every push and PR:
- Matrix: Node 20 + Node 22
- Steps: `npm ci` → `npm run ci:check`

## Version Strategy

- Patch: bug fixes, token value corrections, doc typos
- Minor: new components, new tokens, new features
- Major: breaking API changes (CSS class renames, removed exports, token renames)

Current version: check `package.json` → `version` field.
