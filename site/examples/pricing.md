---
layout: layouts/docs.njk
title: Pricing
description: Three-tier pricing comparison with side-by-side cards, feature lists, and CTA buttons.
navTitle: Pricing
order: 15
permalink: /examples/pricing/
templateEngineOverride: njk
breadcrumb:
  - label: Examples
    url: /examples/
  - label: Pricing
---

{% import "macros/ui.njk" as ui %}

<style>
  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--size-spacing-600);
    align-items: stretch;
  }

  @media (max-width: 760px) {
    .pricing-grid {
      grid-template-columns: 1fr;
    }
  }

  .pricing-card {
    display: flex;
    flex-direction: column;
    gap: var(--size-spacing-500);
    border-style: solid;
    border-width: var(--size-border-100);
    border-color: var(--color-border-subtle, #ccc);
    border-radius: var(--corner-card-radius, var(--size-radius-500));
    background: var(--color-fill-surface, #fff);
    padding: var(--size-spacing-700);
  }

  .pricing-card--recommended {
    border-color: var(--color-border-brand);
    border-width: var(--size-border-200);
    box-shadow: var(--docs-shadow-md);
    position: relative;
  }

  .pricing-card--recommended > .badge {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 50%;
    transform: translate(-50%, -50%);
  }

  .pricing-card__header {
    display: grid;
    gap: var(--size-spacing-200);
    text-align: center;
  }

  .pricing-card__plan {
    margin: 0;
    font-family: var(--typography-heading-font-family);
    font-size: var(--typography-heading-font-size-md);
    font-weight: var(--typography-heading-font-weight);
    line-height: var(--typography-heading-line-height-md);
    color: var(--color-text-default);
  }

  .pricing-card__price {
    margin: 0;
    font-family: var(--typography-heading-font-family);
    font-size: var(--typography-heading-font-size-xl);
    font-weight: var(--font-weight-800);
    line-height: var(--typography-heading-line-height-xl);
    color: var(--color-text-default);
  }

  .pricing-card__price-period {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-400);
    color: var(--color-text-subtle);
  }

  .pricing-card__subtitle {
    margin: 0;
    font-size: var(--font-size-sm);
    line-height: var(--line-height-sm);
    color: var(--color-text-subtle);
  }

  .pricing-card__features {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--size-spacing-300);
    flex: 1;
  }

  .pricing-card__feature {
    display: flex;
    align-items: flex-start;
    gap: var(--size-spacing-200);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-sm);
    color: var(--color-text-default);
  }

  .pricing-card__feature .icon {
    flex-shrink: 0;
    color: var(--color-text-success);
  }

  .pricing-card__cta {
    margin-block-start: auto;
  }

  .pricing-card__cta .button {
    inline-size: 100%;
    justify-content: center;
  }
</style>

<h2>Preview</h2>

<div class="docs-hero-preview">
  <div class="docs-hero-preview-controls">
    <span class="docs-hero-switch" data-hero-group="brand">
      <button type="button" data-hero-brand="a" aria-pressed="true">Brand A</button>
      <button type="button" data-hero-brand="b" aria-pressed="false">Brand B</button>
      <button type="button" data-hero-brand="c" aria-pressed="false">Brand C</button>
    </span>
    <span class="docs-hero-switch" data-hero-group="mode">
      <button type="button" data-hero-mode="light" aria-pressed="true">Light</button>
      <button type="button" data-hero-mode="dark" aria-pressed="false">Dark</button>
    </span>
  </div>
  <div class="docs-hero-preview-stage">

<div class="pricing-grid" role="list" aria-label="Pricing plans">

  {# ── Starter ── #}
  <article class="pricing-card" role="listitem">
    <div class="pricing-card__header">
      <h3 class="pricing-card__plan">Starter</h3>
      <p class="pricing-card__price">$9<span class="pricing-card__price-period"> / mo</span></p>
      <p class="pricing-card__subtitle">For individuals getting started.</p>
    </div>
    <ul class="pricing-card__features">
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>5 projects</span>
      </li>
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>1 GB storage</span>
      </li>
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>Email support</span>
      </li>
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>Basic analytics</span>
      </li>
    </ul>
    <div class="pricing-card__cta">
      {{ ui.button(label="Get Started", variant="outline") }}
    </div>
  </article>

  {# ── Pro (recommended) ── #}
  <article class="pricing-card pricing-card--recommended" role="listitem">
    {{ ui.badge("Recommended", variant="brand", size="sm") }}
    <div class="pricing-card__header">
      <h3 class="pricing-card__plan">Pro</h3>
      <p class="pricing-card__price">$29<span class="pricing-card__price-period"> / mo</span></p>
      <p class="pricing-card__subtitle">For growing teams that need more.</p>
    </div>
    <ul class="pricing-card__features">
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>Unlimited projects</span>
      </li>
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>50 GB storage</span>
      </li>
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>Priority support</span>
      </li>
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>Advanced analytics</span>
      </li>
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>Custom integrations</span>
      </li>
    </ul>
    <div class="pricing-card__cta">
      {{ ui.button(label="Get Started", variant="solid") }}
    </div>
  </article>

  {# ── Business ── #}
  <article class="pricing-card" role="listitem">
    <div class="pricing-card__header">
      <h3 class="pricing-card__plan">Business</h3>
      <p class="pricing-card__price">$79<span class="pricing-card__price-period"> / mo</span></p>
      <p class="pricing-card__subtitle">For organizations at scale.</p>
    </div>
    <ul class="pricing-card__features">
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>Unlimited projects</span>
      </li>
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>500 GB storage</span>
      </li>
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>Dedicated support</span>
      </li>
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>Advanced analytics</span>
      </li>
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>SSO &amp; audit logs</span>
      </li>
      <li class="pricing-card__feature">
        {{ ui.icon("shield-check", "Included") }}
        <span>SLA guarantee</span>
      </li>
    </ul>
    <div class="pricing-card__cta">
      {{ ui.button(label="Contact Sales", variant="outline") }}
    </div>
  </article>

</div>

  </div>
</div>

<h2>Scope</h2>

<ul>
  <li>Organism-level example composing Badge, Button, Icon, and Label components in a pricing comparison layout.</li>
  <li>Three-column grid (<code>repeat(3, 1fr)</code>) collapses to single-column below <code>--breakpoint-200</code> (760px).</li>
  <li>Pro tier uses <code>--color-border-brand</code>, <code>--color-fill-brand</code>, and <code>--docs-shadow-md</code> for visual emphasis.</li>
  <li>Feature lists use the Icon component (<code>shield-check</code>) colored with <code>--color-text-success</code>.</li>
  <li>Cards stretch to equal height via <code>align-items: stretch</code> on the grid and <code>flex-direction: column</code> with <code>margin-block-start: auto</code> on the CTA.</li>
  <li>All color and spacing values reference semantic or core tokens. Shadow uses the docs-layer <code>--docs-shadow-md</code> variable.</li>
</ul>
