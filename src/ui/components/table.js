/**
 * Table — Progressive Enhancement
 *
 * Enhances `.uif-table` elements with:
 * - Sortable headers with keyboard support
 * - Single and multi-row selection
 * - Resizable columns
 * - Automatic enhancement for dynamically inserted tables
 *
 * Usage:
 *   import { enhanceTable } from "ui-foundations/ui/components/table.js";
 *   enhanceTable();           // enhances all .uif-table on the page
 *   enhanceTable(container);  // enhances only within a container
 */

const TABLE_SELECTOR = ":is(.uif-table, .table)";
const SORTABLE_HEADER_SELECTOR = "th[aria-sort]";
const RESIZABLE_HEADER_SELECTOR = "th[data-resizable]";
const ROW_SELECTOR = "tbody tr";
const CHECKBOX_SELECTOR = 'input[type="checkbox"]';
const RESIZE_HANDLE_WIDTH = 16;
const MIN_COLUMN_WIDTH = 96;
const RESIZE_CLICK_SUPPRESSION_MS = 120;
const INTERACTIVE_SELECTOR =
  'a[href], button, input:not([type="checkbox"]), select, textarea, [contenteditable="true"], [role="button"]';
const resizeState = {
  header: null,
  startX: 0,
  startWidth: 0,
  pendingClientX: 0,
  frame: 0,
  lastResizeEndedAt: 0,
};
let resizeListenersBound = false;

function getTables(root) {
  const container = root || document;
  const tables = [];

  if (container.matches && container.matches(TABLE_SELECTOR)) {
    tables.push(container);
  }

  if (container.querySelectorAll) {
    tables.push(...container.querySelectorAll(TABLE_SELECTOR));
  }

  return tables;
}

function getColumnIndex(header) {
  if (!header || !header.parentElement) return -1;
  return Array.from(header.parentElement.children).indexOf(header);
}

function getNextSortDirection(direction) {
  if (direction === "ascending") return "descending";
  if (direction === "descending") return "none";
  return "ascending";
}

function getSelectionMode(table) {
  return table.dataset.selection || "";
}

function getSelectedRows(table) {
  return Array.from(table.querySelectorAll(`${ROW_SELECTOR}[aria-selected="true"]`));
}

function syncRowCheckbox(row, selected) {
  const checkbox = row.querySelector(CHECKBOX_SELECTOR);
  if (checkbox) {
    checkbox.checked = selected;
  }
}

function isSelectableRow(table, row) {
  if (!row || !table.contains(row) || row.closest("thead, tfoot")) return false;

  const selectionMode = getSelectionMode(table);
  if (selectionMode === "single") return true;
  if (selectionMode === "multi") {
    return row.getAttribute("role") === "row" && Boolean(row.querySelector(CHECKBOX_SELECTOR));
  }

  return false;
}

function enhanceSortableHeaders(table) {
  table.querySelectorAll(SORTABLE_HEADER_SELECTOR).forEach((header) => {
    if (!header.hasAttribute("tabindex")) {
      header.tabIndex = 0;
    }
  });
}

function enhanceSelectableRows(table) {
  table.querySelectorAll(ROW_SELECTOR).forEach((row) => {
    if (!isSelectableRow(table, row) || row.hasAttribute("tabindex")) return;
    row.tabIndex = 0;
  });
}

function dispatchSortEvent(table, header, direction) {
  table.dispatchEvent(
    new CustomEvent("uif:sort", {
      bubbles: true,
      detail: {
        column: header,
        direction,
        columnIndex: getColumnIndex(header),
      },
    }),
  );
}

function dispatchSelectEvent(table, row) {
  const selectedRows = getSelectedRows(table);
  const detail =
    getSelectionMode(table) === "multi"
      ? { row, selectedRows, rows: selectedRows }
      : {
          row,
          selected: row.getAttribute("aria-selected") === "true",
        };

  table.dispatchEvent(
    new CustomEvent("uif:select", {
      bubbles: true,
      detail,
    }),
  );
}

function sortColumn(table, header) {
  const nextDirection = getNextSortDirection(header.getAttribute("aria-sort"));

  table.querySelectorAll(SORTABLE_HEADER_SELECTOR).forEach((candidate) => {
    if (candidate !== header) {
      candidate.setAttribute("aria-sort", "none");
    }
  });

  header.setAttribute("aria-sort", nextDirection);
  dispatchSortEvent(table, header, nextDirection);
}

function selectRow(table, row, explicitSelected) {
  const selectionMode = getSelectionMode(table);
  const selected =
    typeof explicitSelected === "boolean"
      ? explicitSelected
      : row.getAttribute("aria-selected") !== "true";

  if (selectionMode === "single") {
    table.querySelectorAll(ROW_SELECTOR).forEach((candidate) => {
      const isSelected = candidate === row ? selected : false;
      candidate.setAttribute("aria-selected", String(isSelected));
      syncRowCheckbox(candidate, isSelected);
    });
  } else if (selectionMode === "multi") {
    row.setAttribute("aria-selected", String(selected));
    syncRowCheckbox(row, selected);
  }

  dispatchSelectEvent(table, row);
}

function shouldSkipRowSelection(event) {
  return Boolean(event.target.closest(INTERACTIVE_SELECTOR));
}

function shouldStartResize(header, event) {
  const rect = header.getBoundingClientRect();
  const offset = rect.right - event.clientX;
  return offset >= 0 && offset <= RESIZE_HANDLE_WIDTH;
}

function flushResizeFrame() {
  if (!resizeState.header) {
    resizeState.frame = 0;
    return;
  }

  const nextWidth = Math.max(
    resizeState.startWidth + (resizeState.pendingClientX - resizeState.startX),
    MIN_COLUMN_WIDTH,
  );

  resizeState.header.style.setProperty("--uif-table-col-width", `${nextWidth}px`);
  resizeState.header.style.width = `${nextWidth}px`;
  resizeState.header.style.inlineSize = `${nextWidth}px`;
  resizeState.frame = 0;
}

function handleResizeMouseMove(event) {
  if (!resizeState.header) return;

  resizeState.pendingClientX = event.clientX;
  if (resizeState.frame) return;

  resizeState.frame = window.requestAnimationFrame(flushResizeFrame);
}

function handleResizeMouseUp() {
  if (!resizeState.header) return;

  if (resizeState.frame) {
    window.cancelAnimationFrame(resizeState.frame);
    flushResizeFrame();
  }

  resizeState.header = null;
  resizeState.lastResizeEndedAt = Date.now();
}

function bindResizeListeners() {
  if (resizeListenersBound || typeof document === "undefined") return;

  document.addEventListener("mousemove", handleResizeMouseMove);
  document.addEventListener("mouseup", handleResizeMouseUp);
  resizeListenersBound = true;
}

function enhanceTableElement(table) {
  if (table.dataset.enhanced) return;
  table.dataset.enhanced = "true";

  enhanceSortableHeaders(table);
  enhanceSelectableRows(table);
  bindResizeListeners();

  table.addEventListener("mousedown", function (event) {
    const header = event.target.closest(RESIZABLE_HEADER_SELECTOR);
    if (!header || !table.contains(header) || !shouldStartResize(header, event)) return;

    resizeState.header = header;
    resizeState.startX = event.clientX;
    resizeState.startWidth = header.getBoundingClientRect().width;
    event.preventDefault();
  });

  table.addEventListener("click", function (event) {
    if (Date.now() - resizeState.lastResizeEndedAt < RESIZE_CLICK_SUPPRESSION_MS) return;

    const header = event.target.closest(SORTABLE_HEADER_SELECTOR);
    if (header && table.contains(header)) {
      sortColumn(table, header);
      return;
    }

    const row = event.target.closest(ROW_SELECTOR);
    if (!isSelectableRow(table, row) || shouldSkipRowSelection(event)) return;

    const checkbox = event.target.closest(CHECKBOX_SELECTOR);
    const explicitSelected = checkbox ? checkbox.checked : undefined;
    selectRow(table, row, explicitSelected);
  });

  table.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;

    const header = event.target.closest(SORTABLE_HEADER_SELECTOR);
    if (header && table.contains(header)) {
      event.preventDefault();
      sortColumn(table, header);
      return;
    }

    if (event.target.closest(CHECKBOX_SELECTOR)) return;

    const row = event.target.closest(ROW_SELECTOR);
    if (!isSelectableRow(table, row)) return;

    event.preventDefault();
    selectRow(table, row);
  });
}

/**
 * Enhance all `.uif-table` elements within a root.
 * @param {Element|Document} [root=document] - Container to search within
 */
export function enhanceTable(root) {
  getTables(root).forEach(enhanceTableElement);
}

/**
 * Observe a root for dynamically added `.uif-table` elements.
 * @param {Element|Document} [root=document.body]
 */
export function observeTable(root) {
  const target = root || document.body;
  const observer = new MutationObserver(function (mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        getTables(node).forEach(enhanceTableElement);
      }
    }
  });

  observer.observe(target, { childList: true, subtree: true });
  return observer;
}

/**
 * Auto-enhance on DOMContentLoaded if loaded as a script tag.
 * Module consumers should call enhanceTable() manually.
 */
if (typeof window !== "undefined" && !window.__TABLE_NO_AUTO) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      enhanceTable();
      observeTable();
    });
  } else {
    enhanceTable();
    observeTable();
  }
}
