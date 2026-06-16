---
layout: layouts/docs.njk
title: System Architecture
description: How UI Foundations is structured — from atomic layers to governance and quality controls.
navTitle: Architecture
order: 1
permalink: /foundations/architecture/
---

<p class="page-intro">
  UI Foundations follows an Atomic Design model using chemistry as its mental model. Each layer builds on the previous through composition, governed by principles and heuristics.
</p>

<h2 id="layers-heading">Atomic Layers</h2>

<div class="arch-hero-table">
  <table class="docs-table">
    <thead>
      <tr>
        <th>Layer</th>
        <th>Chemistry</th>
        <th>Definition</th>
        <th>Location</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Tokens</strong></td>
        <td>Subatomic particles</td>
        <td>Raw design values — colors, spacing, radii, typography. The physical constants of the system.</td>
        <td><code>dist/tokens/</code></td>
      </tr>
      <tr>
        <td><strong>Patterns</strong></td>
        <td>Atoms</td>
        <td>Smallest self-contained UI unit. CSS-only, stateless. Works without JavaScript.</td>
        <td><code>src/ui/patterns/</code></td>
      </tr>
      <tr>
        <td><strong>Components</strong></td>
        <td>Molecules</td>
        <td>Multiple atoms bound together with vanilla JavaScript for state and interactivity.</td>
        <td><code>src/components/</code> (planned)</td>
      </tr>
      <tr>
        <td><strong>Compositions</strong></td>
        <td>Organisms</td>
        <td>Multiple molecules and atoms arranged for a specific task or use-case.</td>
        <td><code>site/examples/</code></td>
      </tr>
    </tbody>
  </table>
</div>

<p>The binding energy that turns atoms into molecules is <strong>JavaScript and state management</strong>. If it works with pure CSS, it's a pattern. If it needs JS to function, it's a component.</p>

<h2 id="token-layers-heading">Token Architecture</h2>

<p>Tokens follow a four-layer cascade. Each layer can only reference the one below it — never sideways or upward.</p>

<div class="docs-table-wrap">
  <table class="docs-table">
    <thead>
      <tr>
        <th>Layer</th>
        <th>Purpose</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Core</strong></td>
        <td>Raw values — the palette, spacing scale, font stacks</td>
        <td><code>--color-neutral-800</code>, <code>--size-spacing-300</code></td>
      </tr>
      <tr>
        <td><strong>Semantic</strong></td>
        <td>Intent-based — what a value means, not what it looks like</td>
        <td><code>--color-fill-brand</code>, <code>--color-text-danger</code></td>
      </tr>
      <tr>
        <td><strong>Component</strong></td>
        <td>Pattern-specific — scoped to a single UI element</td>
        <td><code>--button-solid-background-hover</code></td>
      </tr>
      <tr>
        <td><strong>Brand/Mode</strong></td>
        <td>Contextual overrides — adapts per brand or light/dark mode</td>
        <td><code>:root[data-brand="a"]</code>, <code>:root[data-mode="dark"]</code></td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="governance-heading">Governance &amp; Quality</h2>

<p>Every pattern and component decision is guided by three governance layers that form a quality net above the implementation:</p>

<div class="docs-table-wrap">
  <table class="docs-table">
    <thead>
      <tr>
        <th>Layer</th>
        <th>Purpose</th>
        <th>Examples</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong><a href="/foundations/principles/">Design Principles</a></strong></td>
        <td>Cross-cutting composition intent — the "why" behind layout and structure</td>
        <td>Proximity, Hierarchy, Contrast, Affordance, Cognitive Load, Consistency</td>
      </tr>
      <tr>
        <td><strong>Usability Heuristics</strong></td>
        <td>Interaction quality rules — the "how" of user experience</td>
        <td>Feedback, Error Prevention, Recognition, User Control, Accessibility</td>
      </tr>
      <tr>
        <td><strong>Design Intelligence</strong></td>
        <td>Judgment layer — evaluates quality beyond compliance</td>
        <td>Appropriateness, Complexity, Trade-offs, Emotional Fit, Confidence</td>
      </tr>
    </tbody>
  </table>
</div>

<p>Pattern rules must cite principle and heuristic IDs. Component rules must preserve the cited pattern intent. This traceability ensures every visual decision can be traced back to a documented rationale.</p>

<h2 id="theming-heading">Theming Model</h2>

<p>Brand and appearance mode are orthogonal concerns applied via data attributes:</p>

<ul>
  <li><code>data-brand="a|b|c"</code> — switches color palette, typography, and corner radii</li>
  <li><code>data-mode="light|dark"</code> — switches semantic color mappings</li>
</ul>

<p>Patterns never hardcode brand or mode values. They reference semantic tokens that resolve differently per context.</p>

<h2 id="pipeline-heading">Build Pipeline</h2>

<p>The system flows from Figma to production in a one-directional pipeline:</p>

<div class="pipeline-flow">
  <div class="pipeline-step">
    <span class="pipeline-step__label">Figma Variables</span>
  </div>
  <div class="pipeline-arrow"><span>export</span></div>
  <div class="pipeline-step">
    <span class="pipeline-step__label">figma/exports/*.tokens.json</span>
  </div>
  <div class="pipeline-arrow"><span>npm run tokens:generate</span></div>
  <div class="pipeline-step">
    <span class="pipeline-step__label">dist/tokens/css/*.css + tokens.yaml</span>
  </div>
  <div class="pipeline-arrow"><span>npm run build:css</span></div>
  <div class="pipeline-step">
    <span class="pipeline-step__label">dist/main.css (bundled, layered)</span>
  </div>
  <div class="pipeline-arrow"><span>npm run docs:site</span></div>
  <div class="pipeline-step">
    <span class="pipeline-step__label">_site/ (documentation website)</span>
  </div>
</div>

<p>Generated files in <code>dist/</code> are never edited directly. Changes flow from Figma exports through the pipeline.</p>

<h2 id="validation-heading">Validation</h2>

<p><code>npm run ci:check</code> validates the full system:</p>

<ul>
  <li>Lint — JS syntax correctness</li>
  <li>Unit tests — token pipeline logic</li>
  <li>Build — generates all dist artifacts</li>
  <li>Smoke check — verifies critical outputs exist</li>
  <li>Token validation — zero missing aliases, zero duplicates</li>
  <li>DTCG validation — schema compliance</li>
  <li>Asset check — all referenced icons/assets exist</li>
  <li>Rule pipeline — principles and heuristics are properly cited</li>
</ul>
