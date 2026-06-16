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
  These heuristics define what "good interaction" means in UI Foundations. Every pattern rule must cite at least one heuristic ID.
</p>

<h2 id="heuristics-heading">Heuristics</h2>

<div class="docs-table-wrap">
  <table class="docs-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Definition</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>heuristic.feedback</code></td>
        <td>Feedback</td>
        <td>User actions must produce visible, semantic, or assistive feedback through states, messages, focus, or updated content.</td>
      </tr>
      <tr>
        <td><code>heuristic.consistency</code></td>
        <td>Consistency</td>
        <td>Similar controls and patterns must behave, read, and respond consistently across surfaces.</td>
      </tr>
      <tr>
        <td><code>heuristic.error-prevention</code></td>
        <td>Error Prevention</td>
        <td>Structure should prevent avoidable mistakes before they happen through clear labels, grouping, required/optional cues, disabled states, and constrained choices.</td>
      </tr>
      <tr>
        <td><code>heuristic.recognition</code></td>
        <td>Recognition</td>
        <td>Interfaces should make available actions and context visible instead of relying on memory, hidden conventions, or implied relationships.</td>
      </tr>
      <tr>
        <td><code>heuristic.user-control</code></td>
        <td>User Control</td>
        <td>Users should be able to understand the current state, change reversible choices, cancel where appropriate, and recover from mistakes.</td>
      </tr>
      <tr>
        <td><code>heuristic.accessibility</code></td>
        <td>Accessibility</td>
        <td>Patterns must preserve semantic HTML, programmatic names, keyboard access, visible focus, and assistive-technology state communication.</td>
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
