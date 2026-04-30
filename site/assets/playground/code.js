(function initPlaygroundCode(global) {
  const HTML_VOID_TAGS = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ]);

  const formatHtmlSnippet = (input) => {
    const compact = String(input || "")
      .replace(/\r\n/g, "\n")
      .replace(/>\s+</g, "><")
      .trim();
    if (!compact) return "";

    const tokens = compact.match(/<\/?[^>]+>|[^<]+/g) || [];
    const lines = [];
    let depth = 0;

    tokens.forEach((rawToken) => {
      const token = rawToken.trim();
      if (!token) return;

      if (token.startsWith("</")) {
        depth = Math.max(depth - 1, 0);
        lines.push(`${"  ".repeat(depth)}${token}`);
        return;
      }

      if (token.startsWith("<")) {
        lines.push(`${"  ".repeat(depth)}${token}`);

        const isSelfClosing = token.endsWith("/>");
        const tagMatch = token.match(/^<([a-zA-Z0-9-]+)/);
        const tagName = tagMatch ? tagMatch[1].toLowerCase() : "";
        if (!isSelfClosing && !HTML_VOID_TAGS.has(tagName)) {
          depth += 1;
        }
        return;
      }

      lines.push(`${"  ".repeat(depth)}${token}`);
    });

    return lines.join("\n");
  };

  const renderHighlightedMarkup = (codeNode, formattedCode) => {
    const prism = window.Prism;

    if (
      prism &&
      prism.languages &&
      prism.languages.markup &&
      typeof prism.highlight === "function"
    ) {
      const highlighted = prism.highlight(
        formattedCode,
        prism.languages.markup,
        "markup",
      );

      // Sanitize Prism output: strip all event handler attributes and dangerous tags
      // before writing to DOM. This is defense-in-depth — Prism should already encode.
      if (typeof highlighted === "string") {
        const sanitized = highlighted
          .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
          .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "")
          .replace(/<embed\b[^>]*>/gi, "")
          .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
        codeNode.innerHTML = sanitized;
        return;
      }
    }

    codeNode.textContent = formattedCode;
  };

  global.UIPlaygroundCode = {
    formatHtmlSnippet,
    renderHighlightedMarkup,
  };
})(window);
