import { UIElement, define } from "./base.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function parseItems(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        label: String(item?.label || "").trim(),
        href: item?.href ? String(item.href) : "",
        current: item?.current === true,
      }))
      .filter((item) => item.label.length > 0);
  } catch {
    return [];
  }
}

function normalizeCollapse(value) {
  if (value === "always" || value === "none") return value;
  return "responsive";
}

function toInt(value, fallback) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function collapseAlways(items, maxItems) {
  if (!Array.isArray(items) || items.length <= maxItems || maxItems < 2) return items;
  const tailCount = Math.max(1, maxItems - 1);
  const tail = items.slice(-tailCount);
  return [items[0], { overflow: true }, ...tail];
}

function renderItem(item, index, total, isResponsiveCollapse, separator) {
  if (item.overflow) {
    return `<li class="uif-breadcrumb-item is-overflow" data-separator="${escapeAttr(separator)}">` +
      `<span class="uif-breadcrumb-overflow" aria-hidden="true">…</span>` +
      `</li>`;
  }

  const isCurrent = item.current || index === total - 1;
  const middleClass = isResponsiveCollapse && index > 0 && index < total - 1 ? " is-middle" : "";
  if (isCurrent) {
    return `<li class="uif-breadcrumb-item${middleClass}" data-separator="${escapeAttr(separator)}">` +
      `<span class="uif-breadcrumb-current" aria-current="page">${escapeHtml(item.label)}</span>` +
      `</li>`;
  }
  const href = item.href || "#";
  return `<li class="uif-breadcrumb-item${middleClass}" data-separator="${escapeAttr(separator)}">` +
    `<a class="uif-breadcrumb-link" href="${escapeAttr(href)}">${escapeHtml(item.label)}</a>` +
    `</li>`;
}

/**
 * <uif-breadcrumbs
 *   items='[{"label":"Home","href":"/"},{"label":"Products","href":"/products"},{"label":"Shoes","current":true}]'
 *   separator="/"
 *   collapse="responsive"
 *   max-items="4"
 *   aria-label="Breadcrumb"
 * ></uif-breadcrumbs>
 */
class UIBreadcrumbs extends UIElement {
  static get observedAttributes() {
    return ["items", "separator", "collapse", "max-items", "aria-label"];
  }

  render() {
    const items = parseItems(this.getAttr("items", ""));
    const separator = this.getAttr("separator", "/");
    const collapse = normalizeCollapse(this.getAttr("collapse", "responsive"));
    const maxItems = Math.max(2, toInt(this.getAttr("max-items", "4"), 4));
    const ariaLabel = this.getAttr("aria-label", "Breadcrumb");

    if (items.length === 0) {
      this.innerHTML = "";
      return;
    }

    const alwaysCollapsed = collapse === "always" && items.length > maxItems;
    const responsiveCollapse = collapse === "responsive" && items.length > 2;
    const renderedItems = alwaysCollapsed ? collapseAlways(items, maxItems) : items;

    const listClasses = ["uif-breadcrumbs-list"];
    if (alwaysCollapsed) listClasses.push("is-collapsed");
    if (responsiveCollapse) listClasses.push("is-responsive");

    const outputItems = [];
    for (let index = 0; index < renderedItems.length; index++) {
      const item = renderedItems[index];
      outputItems.push(renderItem(item, index, renderedItems.length, responsiveCollapse, separator));
      if (responsiveCollapse && index === 0) {
        outputItems.push(
          `<li class="uif-breadcrumb-item is-overflow" data-separator="${escapeAttr(separator)}">` +
            `<span class="uif-breadcrumb-overflow" aria-hidden="true">…</span>` +
          `</li>`,
        );
      }
    }

    this.innerHTML = `<nav class="uif-breadcrumbs" aria-label="${escapeAttr(ariaLabel)}">` +
      `<ol class="${listClasses.join(" ")}" data-separator="${escapeAttr(separator)}" data-collapse="${escapeAttr(collapse)}">` +
      outputItems.join("") +
      `</ol></nav>`;
  }
}

define("uif-breadcrumbs", UIBreadcrumbs);
export { UIBreadcrumbs };
