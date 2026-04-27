---
layout: layouts/docs.njk
title: All Tokens
description: Tabular overview of all tokens from the central YAML export.
navTitle: All Tokens
order: 12
permalink: /foundations/all-tokens/
templateEngineOverride: njk
---

{% if tokensTable.rows and tokensTable.rows.length %}
<p class="page-intro">Source: <code>{{ tokensTable.sourceDir }}</code> ({{ tokensTable.count }} tokens)</p>
<div class="docs-filter-bar" aria-label="Token filters">
<label class="docs-filter">
<span>Scope</span>
<select id="token-scope-filter">
<option value="">All</option>
{% for scope in tokensTable.scopes %}
<option value="{{ scope }}">{{ scope }}</option>
{% endfor %}
</select>
</label>
<label class="docs-filter">
<span>Token Type</span>
<select id="token-type-filter">
<option value="">All</option>
{% for kind in tokensTable.kinds %}
<option value="{{ kind }}">{{ kind }}</option>
{% endfor %}
</select>
</label>
<button id="token-filter-reset" class="button ghost" type="button">Reset</button>
</div>
<p class="page-intro token-filter-summary" id="token-filter-summary">{{ tokensTable.count }} of {{ tokensTable.count }} tokens shown</p>

<div class="docs-table-wrap">
<table class="docs-table">
<thead>
<tr><th>Name</th><th>Scope</th><th>Value</th></tr>
</thead>
<tbody>
{% for token in tokensTable.rows %}
<tr data-token-row data-token-scope="{{ token.scope }}" data-token-type="{{ token.kind }}">
<td><code>{{ token.name }}</code></td>
<td><code>{{ token.scope }}</code></td>
<td><code>{{ token.value }}</code></td>
</tr>
{% endfor %}
</tbody>
</table>
</div>
{% else %}
<p>No tokens found. Run <code>npm run tokens:generate</code> first.</p>
{% endif %}

<script>
  var scopeFilter = document.getElementById("token-scope-filter");
  var typeFilter = document.getElementById("token-type-filter");
  var resetBtn = document.getElementById("token-filter-reset");
  var summary = document.getElementById("token-filter-summary");
  var rows = Array.from(document.querySelectorAll("[data-token-row]"));
  if (scopeFilter && typeFilter && resetBtn && summary && rows.length) {
    function applyTokenFilters() {
      var s = scopeFilter.value, t = typeFilter.value, v = 0;
      rows.forEach(function (r) {
        var show = (!s || r.dataset.tokenScope === s) && (!t || r.dataset.tokenType === t);
        r.hidden = !show;
        if (show) v++;
      });
      summary.textContent = v + " of " + rows.length + " tokens shown";
    }
    scopeFilter.addEventListener("change", applyTokenFilters);
    typeFilter.addEventListener("change", applyTokenFilters);
    resetBtn.addEventListener("click", function () { scopeFilter.value = ""; typeFilter.value = ""; applyTokenFilters(); });
  }
</script>
