---
layout: layouts/docs.njk
title: Principles
description: UI Foundations is guided by a small set of principles that inform every pattern, component, and token decision.
navTitle: Principles
order: 2
permalink: /foundations/governance/principles/
excludeFromNav: true
---

<p class="page-intro">
  Canonical design foundation knowledge is maintained in the UI Foundations Vault. This repository only documents implementation-specific usage.
</p>

<p>
  Vault reference: <a href="{{ 'foundations/design-principles.md' | vaultDocumentationUrl }}">configured vault design principles</a>
</p>

## Local implementation usage

UI Foundations applies vault principles through implementation surfaces:

- pattern and component documentation
- token-driven state, color, spacing, and typography decisions
- semantic HTML and accessibility expectations
- rule-pipeline traceability
- validation and CI checks

Pattern rules should cite local principle IDs where the rule pipeline requires
traceability. Long-form principle definitions live in the vault, not in this
runtime repository.
