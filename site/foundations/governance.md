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
  Every pattern and component decision is guided by three governance layers that form a quality net above the implementation.
</p>

<div class="docs-grid">
  <a class="docs-card" href="/foundations/governance/principles/">
    <h2>Design Principles</h2>
    <p>Cross-cutting composition intent — proximity, hierarchy, contrast, affordance, cognitive load, consistency.</p>
  </a>
  <a class="docs-card" href="/foundations/governance/heuristics/">
    <h2>Usability Heuristics</h2>
    <p>Interaction quality rules — feedback, error prevention, recognition, user control, accessibility.</p>
  </a>
  <a class="docs-card" href="/foundations/governance/intelligence/">
    <h2>Design Intelligence</h2>
    <p>Judgment layer — evaluates quality beyond compliance through structured reasoning and critique.</p>
  </a>
</div>

<h2 id="how-heading">How They Work Together</h2>

<p>The layers stack from concrete to abstract:</p>

<div class="pipeline-flow">
  <div class="pipeline-step">
    <span class="pipeline-step-label">Design Principles — the "why" of composition</span>
  </div>
  <div class="pipeline-arrow"><span>informs</span></div>
  <div class="pipeline-step">
    <span class="pipeline-step-label">Usability Heuristics — the "how" of interaction</span>
  </div>
  <div class="pipeline-arrow"><span>evaluated by</span></div>
  <div class="pipeline-step">
    <span class="pipeline-step-label">Design Intelligence — the "is this good?" judgment</span>
  </div>
</div>

<h2 id="traceability-heading">Traceability Contract</h2>

<ul>
  <li>Pattern rules must cite at least one <strong>principle ID</strong> and one <strong>heuristic ID</strong>.</li>
  <li>Component rules must preserve the cited pattern intent.</li>
  <li>Validation rules must point back to principle, heuristic, pattern, or component rule IDs.</li>
  <li>Design Intelligence is applied during reviews — it does not produce citable IDs but ensures overall quality.</li>
</ul>
