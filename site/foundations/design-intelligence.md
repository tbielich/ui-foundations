---
layout: layouts/docs.njk
title: Design Intelligence
description: The reasoning layer that evaluates design quality beyond rule compliance.
navTitle: Design Intelligence
order: 21
permalink: /foundations/governance/intelligence/
excludeFromNav: true
---

<p class="page-intro">
  Canonical design foundation knowledge is maintained in the UI Foundations Vault. This repository only documents implementation-specific usage.
</p>

<p>
  Vault reference: <a href="{{ 'foundations/design-intelligence.md' | vaultDocumentationUrl }}">configured vault design intelligence</a>
</p>

<h2 id="system-lens-heading">Local implementation usage</h2>

<p>
  In this repository, design intelligence is applied as an implementation review
  lens for patterns, components, examples, and documentation. Use it to check
  whether a proposed implementation is appropriate for the system, traceable to
  existing rules, token-driven, accessible, and reusable.
</p>

<p>Before adding or changing a local implementation, ask:</p>

<ul>
  <li>Would this decision still make sense if repeated 100 times?</li>
  <li>Can this be reused? Can this scale?</li>
  <li>Can this be documented? Can this be automated?</li>
  <li>Can this become a pattern, token, or guidance?</li>
</ul>

<p>
  Long-form critique models, reasoning dimensions, and durable evaluation
  frameworks live in the vault.
</p>
