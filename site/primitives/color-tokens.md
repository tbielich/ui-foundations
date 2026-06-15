---
layout: layouts/docs.njk
title: Color Palette
description: The complete color system — primitives, brand palettes, and semantic mappings.
navTitle: Color
order: 10
permalink: /primitives/color/
---

{% import "macros/ui.njk" as ui %}

<p class="page-intro">
  All color primitives available in the system, organized by family. Each row shows the full ramp from lightest to darkest.
  Generated from <code>{{ colorDocs.sourceDir }}</code>.
</p>

{% if colorDocs.palettes and colorDocs.palettes.length %}

<nav class="palette-nav" aria-label="Color sections">
  <a href="#primitives">Primitives</a>
  <a href="#brands">Brands</a>
  <a href="#semantic-light">Semantic (Light)</a>
  <a href="#semantic-dark">Semantic (Dark)</a>
</nav>

<!-- ═══════════════════════════════════════════════════
     PRIMITIVES
     ═══════════════════════════════════════════════════ -->

<section id="primitives">
<h2 id="primitives-heading">Color Primitives</h2>
<p class="section-description">Raw color values from the Core layer. These are referenced by semantic and brand tokens — never used directly in components.</p>

{% for palette in colorDocs.palettes %}
<div class="color-family" id="family-{{ palette.family | slug }}">
  <h3 id="palette-{{ palette.family | slug }}">{{ palette.family }}</h3>
  <div class="color-ramp">{% for step in palette.steps %}<div class="color-ramp__step" style="background: {{ step.hex }};" title="{{ step.name }} — {{ step.hex }}"></div>{% endfor %}</div>
  <div class="color-table-wrap">
    <table class="color-table">
      <thead>
        <tr>
          <th class="color-table__preview"></th>
          <th>Name</th>
          <th>Token</th>
          <th>Contrast <span class="th-hint">:1</span></th>
          <th>Hex</th>
        </tr>
      </thead>
      <tbody>{% for step in palette.steps %}
        <tr>
          <td class="color-table__preview"><span class="color-dot" style="background: {{ step.hex }};"></span></td>
          <td class="color-table__name">{{ palette.family }} {{ step.step }}</td>
          <td class="color-table__token"><code>{{ step.cssVar }}</code></td>
          <td class="color-table__contrast">{{ step.contrast }}</td>
          <td class="color-table__hex"><code>{{ step.hex }}</code></td>
        </tr>{% endfor %}
      </tbody>
    </table>
  </div>
</div>
{% endfor %}
</section>

<!-- ═══════════════════════════════════════════════════
     BRANDS
     ═══════════════════════════════════════════════════ -->

<section id="brands">
<h2 id="brands-heading">Brand Color Mapping</h2>
<p class="section-description">Each brand maps the same semantic keys to different primitives. Switch brands to compare.</p>

<div class="docs-header" style="margin-bottom: 1.5rem;">
  <span class="docs-hero-switch" data-hero-group="brand">
    <button type="button" class="docs-brand-switch" data-switch-brand="a" aria-pressed="true">Brand A</button>
    <button type="button" class="docs-brand-switch" data-switch-brand="b" aria-pressed="false">Brand B</button>
    <button type="button" class="docs-brand-switch" data-switch-brand="c" aria-pressed="false">Brand C</button>
  </span>
</div>

{% for brand in colorDocs.brandGroups %}
<div class="brand-section" data-brand-scope="{{ brand.id }}" {% if brand.id != "a" %}hidden{% endif %}>
  <h3>{{ brand.title }}</h3>
  <div class="color-table-wrap">
    <table class="color-table">
      <thead>
        <tr>
          <th class="color-table__preview"></th>
          <th>Role</th>
          <th>Token</th>
          <th>Resolved Value</th>
        </tr>
      </thead>
      <tbody>{% for token in brand.tokens %}
        <tr>
          <td class="color-table__preview"><span class="color-dot" style="background: var({{ token.cssVar }});"></span></td>
          <td class="color-table__name">{{ token.name | replace("brand-color-", "") }}</td>
          <td class="color-table__token"><code>{{ token.cssVar }}</code></td>
          <td class="color-table__hex"><code>{{ token.value }}</code></td>
        </tr>{% endfor %}
      </tbody>
    </table>
  </div>
</div>
{% endfor %}
</section>

<!-- ═══════════════════════════════════════════════════
     SEMANTIC LIGHT
     ═══════════════════════════════════════════════════ -->

<section id="semantic-light">
<h2 id="semantic-light-heading">Semantic Mapping — Light</h2>
<p class="section-description">Intent-based tokens for the light appearance mode. These resolve to primitives and adapt per brand.</p>

{% for group in colorDocs.lightSemantic %}
<div class="color-family">
  <h3>{{ group.category | capitalize }}</h3>
  <div class="color-table-wrap">
    <table class="color-table">
      <thead>
        <tr>
          <th class="color-table__preview"></th>
          <th>Name</th>
          <th>Token</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>{% for token in group.tokens %}
        <tr>
          <td class="color-table__preview"><span class="color-dot" style="background: var({{ token.cssVar }});"></span></td>
          <td class="color-table__name">{{ token.name | replace("color-", "") }}</td>
          <td class="color-table__token"><code>{{ token.cssVar }}</code></td>
          <td class="color-table__hex"><code>{{ token.value }}</code></td>
        </tr>{% endfor %}
      </tbody>
    </table>
  </div>
</div>
{% endfor %}
</section>

<!-- ═══════════════════════════════════════════════════
     SEMANTIC DARK
     ═══════════════════════════════════════════════════ -->

<section id="semantic-dark">
<h2 id="semantic-dark-heading">Semantic Mapping — Dark</h2>
<p class="section-description">Intent-based tokens for the dark appearance mode.</p>

{% for group in colorDocs.darkSemantic %}
<div class="color-family">
  <h3>{{ group.category | capitalize }}</h3>
  <div class="color-table-wrap">
    <table class="color-table">
      <thead>
        <tr>
          <th class="color-table__preview"></th>
          <th>Name</th>
          <th>Token</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>{% for token in group.tokens %}
        <tr>
          <td class="color-table__preview"><span class="color-dot" style="background: var({{ token.cssVar }});"></span></td>
          <td class="color-table__name">{{ token.name | replace("color-", "") }}</td>
          <td class="color-table__token"><code>{{ token.cssVar }}</code></td>
          <td class="color-table__hex"><code>{{ token.value }}</code></td>
        </tr>{% endfor %}
      </tbody>
    </table>
  </div>
</div>
{% endfor %}
</section>

{% else %}
<p>No color tokens found in <code>{{ colorDocs.sourceDir }}</code>.</p>
<p>Run <code>npm run tokens:generate</code> first.</p>
{% endif %}

<script>
(function () {
  var btns = document.querySelectorAll(".docs-brand-switch");
  if (!btns.length) return;
  var root = document.documentElement;
  var sections = document.querySelectorAll("[data-brand-scope]");
  btns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      root.dataset.brand = btn.dataset.switchBrand;
      btns.forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      sections.forEach(function (sec) {
        sec.hidden = sec.dataset.brandScope !== btn.dataset.switchBrand;
      });
    });
  });
})();

// Enhanced TOC with nested color families
(function () {
  // Remove the auto-generated TOC (from layout script) if present
  var existing = document.querySelector(".docs-toc-sidebar");
  if (existing) existing.remove();

  var main = document.querySelector(".docs-main");
  if (!main) return;

  var aside = document.createElement("aside");
  aside.className = "docs-toc-sidebar";
  aside.setAttribute("aria-label", "On this page");

  var title = document.createElement("p");
  title.className = "docs-toc-sidebar-title";
  title.textContent = "On this page";
  aside.appendChild(title);

  var ul = document.createElement("ul");
  ul.className = "docs-toc-sidebar-list";

  // Build TOC: h2[id] as top-level, h3[id] inside #primitives as nested
  var h2s = document.querySelectorAll(".docs-content h2[id]");
  h2s.forEach(function (h2) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + h2.id;
    a.textContent = h2.textContent;
    a.dataset.tocTarget = h2.id;
    li.appendChild(a);

    // If this is the primitives heading, add nested palette links
    if (h2.id === "primitives-heading") {
      var subUl = document.createElement("ul");
      subUl.className = "docs-toc-sidebar-sublist";
      var families = document.querySelectorAll("#primitives h3[id]");
      families.forEach(function (h3) {
        var subLi = document.createElement("li");
        var subA = document.createElement("a");
        subA.href = "#" + h3.id;
        subA.textContent = h3.textContent;
        subA.dataset.tocTarget = h3.id;
        subLi.appendChild(subA);
        subUl.appendChild(subLi);
      });
      li.appendChild(subUl);
    }

    ul.appendChild(li);
  });

  aside.appendChild(ul);
  main.appendChild(aside);

  // Scroll spy for all links
  var allLinks = ul.querySelectorAll("a[data-toc-target]");
  var allTargets = [];
  allLinks.forEach(function (l) {
    var target = document.getElementById(l.dataset.tocTarget);
    if (target) allTargets.push(target);
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          allLinks.forEach(function (l) { l.classList.remove("is-active"); });
          var active = ul.querySelector('[data-toc-target="' + entry.target.id + '"]');
          if (active) active.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
  );

  allTargets.forEach(function (t) { observer.observe(t); });
})();
</script>
