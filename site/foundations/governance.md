---
layout: layouts/docs.njk
title: Governance & Quality
description: The three-layer quality system that guides every pattern and component decision.
navTitle: Governance
order: 3
permalink: /foundations/governance/
excludeFromNav: true
---

<p class="page-intro">
  Canonical design foundation knowledge is maintained in the UI Foundations Vault. This repository only documents implementation-specific usage.
</p>

<p>
  Vault reference: <a href="{{ 'foundations/' | vaultDocumentationUrl }}">configured vault foundations</a>
</p>

<div class="docs-grid">
  <a class="docs-card" href="/foundations/governance/principles/">
    <h2>Design Principles</h2>
    <p>Local usage notes for applying vault principles to patterns and components.</p>
  </a>
  <a class="docs-card" href="/foundations/governance/heuristics/">
    <h2>Usability Heuristics</h2>
    <p>Local heuristic IDs for rule-pipeline traceability and validation.</p>
  </a>
  <a class="docs-card" href="/foundations/governance/intelligence/">
    <h2>Design Intelligence</h2>
    <p>Local implementation review lens for system fit, reuse, and quality.</p>
  </a>
</div>

<h2 id="how-heading">How They Work Together</h2>

<p>
  Durable knowledge lives in the vault. This repository keeps the implementation
  contract that connects that knowledge to pattern rules, component rules,
  validation, and CI.
</p>

<div class="pipeline-flow">
  <div class="pipeline-step">
    <span class="pipeline-step-label">Vault foundations</span>
  </div>
  <div class="pipeline-arrow"><span>informs</span></div>
  <div class="pipeline-step">
    <span class="pipeline-step-label">Local rule IDs and pattern guidance</span>
  </div>
  <div class="pipeline-arrow"><span>validated by</span></div>
  <div class="pipeline-step">
    <span class="pipeline-step-label">Rule pipeline and CI</span>
  </div>
</div>

<h2 id="traceability-heading">Traceability Contract</h2>

<ul>
  <li>Pattern rules must cite at least one <strong>principle ID</strong> and one <strong>heuristic ID</strong>.</li>
  <li>Component rules must preserve the cited pattern intent.</li>
  <li>Validation rules must point back to principle, heuristic, pattern, or component rule IDs.</li>
  <li>Design Intelligence is applied during reviews — it does not produce citable IDs but ensures overall quality.</li>
</ul>
