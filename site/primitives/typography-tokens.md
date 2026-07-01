---
layout: layouts/docs.njk
title: Typography
description: Typefaces, type scale, weights, and line heights — the complete typography system.
navTitle: Typography
order: 11
permalink: /primitives/typography/
---

<p class="page-intro">
  Typography brings consistency across experiences and platforms. All type tokens are defined in the Core layer and referenced by component tokens.
  Generated from <code>{{ typographyDocs.sourceDir }}</code>.
</p>

<!-- TYPEFACES -->

<section id="typefaces">
<h2 id="typefaces-heading">Typefaces</h2>
<p class="section-description">Three typeface families — sans-serif for UI, serif for editorial content, monospace for code.</p>

<div class="type-specimens">{% for family in typographyDocs.families %}
  <div class="type-specimen">
    <div class="type-specimen-sample" style="font-family: var({{ family.cssVar }});">
      <span class="type-specimen-large">Aa</span>
      <span class="type-specimen-alphabet">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
      <span class="type-specimen-alphabet">abcdefghijklmnopqrstuvwxyz 0123456789</span>
    </div>
    <div class="type-specimen-meta">
      <span class="type-specimen-name">{{ family.value }}</span>
      <code class="type-specimen-token">{{ family.cssVar }}</code>
    </div>
  </div>{% endfor %}
</div>
</section>

<!-- HEADING SCALE -->

<section id="heading-scale">
<h2 id="heading-scale-heading">Heading Scale</h2>
<p class="section-description">Headings create typographic hierarchy. Each size maps to an HTML element and a utility class.</p>

<div class="type-scale-table-wrap">
  <table class="type-scale-table">
    <thead>
      <tr>
        <th>Size</th>
        <th>Class / Element</th>
        <th>Sample</th>
      </tr>
    </thead>
    <tbody>{% for item in typographyDocs.headingScale %}
      <tr>
        <td class="type-scale-table-size">{{ item.label }}</td>
        <td class="type-scale-table-class"><code>.{{ item.class }}</code> / <code>&lt;{{ item.element }}&gt;</code></td>
        <td class="type-scale-table-sample"><span class="{{ item.class }}">The quick brown fox</span></td>
      </tr>{% endfor %}
    </tbody>
  </table>
</div>
</section>

<!-- TEXT SCALE -->

<section id="text-scale">
<h2 id="text-scale-heading">Text Scale</h2>
<p class="section-description">Body text sizes for running copy, labels, and captions.</p>

<div class="type-scale-table-wrap">
  <table class="type-scale-table">
    <thead>
      <tr>
        <th>Size</th>
        <th>Class</th>
        <th>Sample</th>
      </tr>
    </thead>
    <tbody>{% for item in typographyDocs.textScale %}
      <tr>
        <td class="type-scale-table-size">{{ item.label }}</td>
        <td class="type-scale-table-class"><code>.{{ item.class }}</code></td>
        <td class="type-scale-table-sample"><span class="{{ item.class }}">Clear schedules, gentle spacing, and readable copy for every screen.</span></td>
      </tr>{% endfor %}
    </tbody>
  </table>
</div>
</section>

<!-- FONT SIZES -->

<section id="font-sizes">
<h2 id="font-sizes-heading">Font Sizes</h2>
<p class="section-description">All available size tokens. Each step follows a consistent scale ratio.</p>

<div class="type-token-table-wrap">
  <table class="type-token-table">
    <thead>
      <tr>
        <th>Token</th>
        <th>Value</th>
        <th>Preview</th>
      </tr>
    </thead>
    <tbody>{% for size in typographyDocs.sizes %}
      <tr>
        <td><code>{{ size.cssVar }}</code></td>
        <td class="type-token-table-value">{{ size.value }}</td>
        <td class="type-token-table-preview"><span style="font-size: var({{ size.cssVar }}); line-height: 1.2;">Ag</span></td>
      </tr>{% endfor %}
    </tbody>
  </table>
</div>
</section>

<!-- FONT WEIGHTS -->

<section id="font-weights">
<h2 id="font-weights-heading">Font Weights</h2>
<p class="section-description">Numeric weight tokens available in the system.</p>

<div class="type-token-table-wrap">
  <table class="type-token-table">
    <thead>
      <tr>
        <th>Token</th>
        <th>Value</th>
        <th>Preview</th>
      </tr>
    </thead>
    <tbody>{% for weight in typographyDocs.weights %}
      <tr>
        <td><code>{{ weight.cssVar }}</code></td>
        <td class="type-token-table-value">{{ weight.value }}</td>
        <td class="type-token-table-preview"><span style="font-weight: var({{ weight.cssVar }});">The quick brown fox</span></td>
      </tr>{% endfor %}
    </tbody>
  </table>
</div>
</section>

<!-- LINE HEIGHT -->

<section id="line-height">
<h2 id="line-height-heading">Line Height</h2>
<p class="section-description">Line height tokens ensure readable vertical rhythm across all text sizes.</p>

<div class="type-token-table-wrap">
  <table class="type-token-table">
    <thead>
      <tr>
        <th>Token</th>
        <th>Value</th>
        <th>Preview</th>
      </tr>
    </thead>
    <tbody>{% for lh in typographyDocs.lineHeights %}
      <tr>
        <td><code>{{ lh.cssVar }}</code></td>
        <td class="type-token-table-value">{{ lh.value }}</td>
        <td class="type-token-table-preview"><span style="line-height: var({{ lh.cssVar }}); display: inline-block; border-left: 2px solid var(--docs-accent); padding-left: 8px;">Line height<br>demonstration</span></td>
      </tr>{% endfor %}
    </tbody>
  </table>
</div>
</section>

<!-- USAGE GUIDELINES -->

<section id="usage">
<h2 id="usage-heading">Usage Guidelines</h2>

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <span class="heading-lg">Use defined type tokens</span>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Always use font-size tokens from the scale. Custom pixel values break consistency.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <span style="font-size: 17px;">Avoid arbitrary sizes</span>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use arbitrary px or rem values that aren't in the token scale.</p>
    </div>
  </div>
</div>

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <span style="max-width: 45ch; display: block;">Paragraphs of text should be roughly 50–80 characters wide for comfortable reading.</span>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Keep line lengths between 50 and 80 characters for body text.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <span style="max-width: 20ch; display: block;">Text too narrow is hard to read and wastes space.</span>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't let paragraph widths get too thin or too wide.</p>
    </div>
  </div>
</div>

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <span class="heading-md" style="font-family: var(--font-family-sans);">Use brand font tokens</span>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Reference <code>--brand-font-base</code> and <code>--brand-font-lead</code> so fonts adapt per brand.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <span style="font-family: Arial;">Don't hardcode font names</span>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Never hardcode font-family values like <code>"Inter"</code> or <code>"Arial"</code> directly.</p>
    </div>
  </div>
</div>

</section>
