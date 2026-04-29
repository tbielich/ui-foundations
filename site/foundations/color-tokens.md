---
layout: layouts/docs.njk
title: Color Tokens
description: Brand, neutral, and overlay tokens including mode and brand switching.
navTitle: Color
order: 10
permalink: /foundations/color/
---

{% import "macros/ui.njk" as ui %}

{% if colorDocs.groups and colorDocs.groups.length %}
<p class="page-intro">This page is generated automatically from <code>{{ colorDocs.sourceDir }}</code>.</p>

<div class="docs-header" style="margin-bottom: 1.5rem;">
  <span class="docs-hero-switch" data-hero-group="brand">
    <button type="button" class="docs-brand-switch" data-switch-brand="a" aria-pressed="true">Brand A</button>
    <button type="button" class="docs-brand-switch" data-switch-brand="b" aria-pressed="false">Brand B</button>
    <button type="button" class="docs-brand-switch" data-switch-brand="c" aria-pressed="false">Brand C</button>
  </span>
</div>

<section class="palette">
{% for group in colorDocs.groups %}
<div class="palette-group" id="group-{{ group.id }}"{% if group.id == "brand-a" %} data-brand-scope="a"{% elif group.id == "brand-b" %} data-brand-scope="b"{% elif group.id == "brand-c" %} data-brand-scope="c"{% endif %}>
<h2>{{ group.title }}</h2>
{% if group.description %}<p class="palette-note">{{ group.description }}</p>{% endif %}
<div class="swatch-grid">
{% for token in group.tokens %}
{{ ui.colorChip(token) }}
{% endfor %}
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
  btns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      root.dataset.brand = btn.dataset.switchBrand;
      btns.forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
    });
  });
})();
</script>
