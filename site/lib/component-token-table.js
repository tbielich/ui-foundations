const fs = require("node:fs");
const path = require("node:path");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function extractTokenRows(cssSource) {
  const tokenUsage = new Map();
  const blockRegex = /([^{}]+)\{([^{}]*)\}/g;

  for (const block of cssSource.matchAll(blockRegex)) {
    const selector = normalizeWhitespace(block[1]);
    const body = block[2];
    if (!selector || !body) continue;

    const declarationRegex = /([-\w]+)\s*:\s*([^;]+);/g;
    for (const declaration of body.matchAll(declarationRegex)) {
      const property = normalizeWhitespace(declaration[1]);
      const value = declaration[2];
      if (!property || !value) continue;

      const tokenRegex = /var\(\s*(--[\w-]+)/g;
      for (const tokenMatch of value.matchAll(tokenRegex)) {
        const token = tokenMatch[1];
        if (!token) continue;

        if (!tokenUsage.has(token)) {
          tokenUsage.set(token, new Set());
        }

        tokenUsage.get(token).add(`${selector} -> ${property}`);
      }
    }
  }

  return [...tokenUsage.entries()]
    .map(([token, usageSet]) => ({
      token,
      usages: [...usageSet].sort((a, b) => a.localeCompare(b, undefined, {
        numeric: true,
      })),
    }))
    .sort((a, b) => a.token.localeCompare(b.token, undefined, {
      numeric: true,
    }));
}

function renderComponentTokenTable(cssPath) {
  const absolutePath = path.resolve(process.cwd(), cssPath);

  if (!fs.existsSync(absolutePath)) {
    return `<p>No token source found at <code>${escapeHtml(cssPath)}</code>.</p>`;
  }

  const cssSource = fs.readFileSync(absolutePath, "utf8");
  const rows = extractTokenRows(cssSource);

  if (rows.length === 0) {
    return `<p>No CSS variable usage found in <code>${escapeHtml(cssPath)}</code>.</p>`;
  }

  const bodyRows = rows
    .map(({ token }) => `<tr><td><code>${escapeHtml(token)}</code></td></tr>`)
    .join("");

  return `<div class="docs-table-wrap">
  <table class="docs-table">
    <thead>
      <tr>
        <th>Token</th>
      </tr>
    </thead>
    <tbody>
      ${bodyRows}
    </tbody>
  </table>
</div>`;
}

module.exports = {
  renderComponentTokenTable,
};
