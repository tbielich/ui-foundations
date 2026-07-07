---
layout: layouts/docs.njk
title: Usability Heuristics
description: Interaction quality rules that ensure patterns are usable, accessible, and predictable.
navTitle: Usability Heuristics
order: 20
permalink: /foundations/governance/heuristics/
excludeFromNav: true
---

<p class="page-intro">
  Canonical design foundation knowledge is maintained in the UI Foundations Vault. This repository only documents implementation-specific usage.
</p>

<p>
  Vault reference: <a href="{{ 'foundations/usability-heuristics.md' | vaultDocumentationUrl }}">configured vault usability heuristics</a>
</p>

<h2 id="heuristics-heading">Local heuristic IDs</h2>

<p>
  These IDs are implementation hooks for pattern-rule citations and validation.
  The durable heuristic definitions live in the vault.
</p>

<div class="docs-table-wrap">
  <table class="docs-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Implementation usage</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>heuristic.feedback</code></td>
        <td>Feedback</td>
        <td>Used when a pattern must expose state, messages, focus, or updated content.</td>
      </tr>
      <tr>
        <td><code>heuristic.consistency</code></td>
        <td>Consistency</td>
        <td>Used when related controls must share naming, placement, state, or interaction behavior.</td>
      </tr>
      <tr>
        <td><code>heuristic.error-prevention</code></td>
        <td>Error Prevention</td>
        <td>Used when labels, grouping, required cues, disabled states, or constraints reduce avoidable mistakes.</td>
      </tr>
      <tr>
        <td><code>heuristic.recognition</code></td>
        <td>Recognition</td>
        <td>Used when actions and context must be visible rather than hidden behind memory or convention.</td>
      </tr>
      <tr>
        <td><code>heuristic.user-control</code></td>
        <td>User Control</td>
        <td>Used when a pattern needs reversible choices, cancellation, recovery, or clear current state.</td>
      </tr>
      <tr>
        <td><code>heuristic.accessibility</code></td>
        <td>Accessibility</td>
        <td>Used when semantic HTML, accessible names, keyboard access, visible focus, or assistive state communication are required.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="traceability-heading">Traceability</h2>

<ul>
  <li>Pattern rules must cite the heuristic IDs they rely on.</li>
  <li>Component rules must implement the cited heuristics with semantic markup, state classes, tokens, or documented behavior.</li>
  <li>Validation prefers deterministic checks tied to these IDs.</li>
</ul>

<h2 id="usage-heading">Usage in Pattern Rules</h2>

<p>When documenting a pattern rule, reference heuristics like this:</p>

<pre><code>Cites: heuristic.feedback, heuristic.accessibility
Rationale: Checkbox checked state must be communicated via
:checked pseudo-class AND aria-checked for screen readers.</code></pre>
