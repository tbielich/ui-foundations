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

<section class="palette">
{% for group in colorDocs.groups %}
<div class="palette-group" id="group-{{ group.id }}"{% if group.id == "brand-a" %} data-brand-scope="a"{% elif group.id == "brand-b" %} data-brand-scope="b"{% endif %}>
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
