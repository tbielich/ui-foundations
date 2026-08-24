import { UIElement, define } from "./base.js";

class UITreeView extends UIElement {
  static get observedAttributes() {
    return ["selection", "draggable"];
  }

  constructor() {
    super();
    this._wired = false;
    this._selected = new Set();
    this._anchorNode = null;
    this._dragNode = null;
    this._dropRow = null;
  }

  render() {
    this._tree = this.querySelector(":scope > .uif-tree-view, :scope > .tree-view");
    if (!this._tree) {
      this._tree = document.createElement("ul");
      this._tree.className = "uif-tree-view";
      this._tree.append(...Array.from(this.childNodes));
      this.append(this._tree);
    }

    if (!this._tree.getAttribute("role")) {
      this._tree.setAttribute("role", "tree");
    }

    this._normalizeNodes();
    this._applySelection();
    this._applyDraggable();

    if (!this._wired) {
      this._tree.addEventListener("click", (event) => this._handleClick(event));
      this._tree.addEventListener("keydown", (event) => this._handleKeydown(event));
      this._tree.addEventListener("focusin", (event) => this._handleFocusIn(event));
      this._tree.addEventListener("dragstart", (event) => this._handleDragStart(event));
      this._tree.addEventListener("dragover", (event) => this._handleDragOver(event));
      this._tree.addEventListener("drop", (event) => this._handleDrop(event));
      this._tree.addEventListener("dragend", () => this._clearDropTarget());
      this._wired = true;
    }
  }

  _selectionMode() {
    return this.getAttr("selection", "single") === "multi" ? "multi" : "single";
  }

  _nodes() {
    return Array.from(this._tree.querySelectorAll(".uif-tree-node, .tree-node"));
  }

  _normalizeNodes() {
    const nodes = this._nodes();
    let firstFocusable = null;

    for (const node of nodes) {
      node.classList.add("uif-tree-node");
      node.setAttribute("role", "treeitem");
      node.setAttribute("aria-selected", node.getAttribute("aria-selected") === "true" ? "true" : "false");

      let row = node.querySelector(":scope > .uif-tree-node-row, :scope > .tree-node-row");
      let label = node.querySelector(":scope > .uif-tree-label, :scope > .tree-label");
      if (!row) {
        row = document.createElement("div");
        row.className = "uif-tree-node-row";
        row.tabIndex = -1;

        if (!label) {
          label = document.createElement("span");
          label.className = "uif-tree-label";
          label.textContent = node.getAttribute("data-label") || "Node";
        }

        row.append(label);
        node.prepend(row);
      } else if (!row.classList.contains("uif-tree-node-row")) {
        row.classList.add("uif-tree-node-row");
      }

      if (!label) {
        label = document.createElement("span");
        label.className = "uif-tree-label";
        label.textContent = node.getAttribute("data-label") || row.textContent?.trim() || "Node";
        row.append(label);
      } else if (!label.classList.contains("uif-tree-label")) {
        label.classList.add("uif-tree-label");
      }

      let group = node.querySelector(":scope > .uif-tree-children, :scope > .tree-children");
      if (group && !group.classList.contains("uif-tree-children")) group.classList.add("uif-tree-children");
      if (group) group.setAttribute("role", "group");

      const canExpand = Boolean(group) || node.hasAttribute("data-lazy-url");
      if (canExpand) {
        if (node.getAttribute("aria-expanded") !== "true") node.setAttribute("aria-expanded", "false");
        node.classList.toggle("is-expanded", node.getAttribute("aria-expanded") === "true");
      } else {
        node.removeAttribute("aria-expanded");
        node.classList.remove("is-expanded");
      }

      let toggle = row.querySelector(".uif-tree-toggle, .tree-toggle");
      if (canExpand && !toggle) {
        toggle = document.createElement("button");
        toggle.className = "uif-tree-toggle";
        toggle.type = "button";
        toggle.setAttribute("aria-label", "Toggle node");
        row.prepend(toggle);
      } else if (!canExpand && toggle) {
        toggle.remove();
      } else if (toggle && !toggle.classList.contains("uif-tree-toggle")) {
        toggle.classList.add("uif-tree-toggle");
      }

      if (!firstFocusable && this._isNodeVisible(node)) firstFocusable = row;
      if (!row.hasAttribute("tabindex")) row.tabIndex = -1;
    }

    const activeRow = this._tree.querySelector(".uif-tree-node-row[tabindex=\"0\"]");
    if (!activeRow && firstFocusable) firstFocusable.tabIndex = 0;
  }

  _applySelection() {
    const nodes = this._nodes();
    for (const node of nodes) {
      const selected = this._selected.has(node);
      node.setAttribute("aria-selected", selected ? "true" : "false");
      node.classList.toggle("is-selected", selected);
    }
  }

  _applyDraggable() {
    const draggable = this.getBool("draggable");
    for (const row of this._tree.querySelectorAll(".uif-tree-node-row, .tree-node-row")) {
      row.draggable = draggable;
    }
  }

  _isNodeVisible(node) {
    let parent = node.parentElement?.closest(".uif-tree-node, .tree-node");
    while (parent) {
      if (parent.getAttribute("aria-expanded") === "false") return false;
      parent = parent.parentElement?.closest(".uif-tree-node, .tree-node");
    }
    return true;
  }

  _visibleNodes() {
    return this._nodes().filter((node) => this._isNodeVisible(node));
  }

  _focusNode(node) {
    if (!node) return;
    const row = node.querySelector(":scope > .uif-tree-node-row, :scope > .tree-node-row");
    if (!row) return;
    for (const candidate of this._tree.querySelectorAll(".uif-tree-node-row, .tree-node-row")) {
      candidate.tabIndex = -1;
    }
    row.tabIndex = 0;
    row.focus();
  }

  _selectNode(node, { toggle = false, range = false } = {}) {
    const mode = this._selectionMode();
    const visible = this._visibleNodes();

    if (mode === "single") {
      this._selected.clear();
      this._selected.add(node);
      this._anchorNode = node;
      this._applySelection();
      return;
    }

    if (range && this._anchorNode) {
      const start = visible.indexOf(this._anchorNode);
      const end = visible.indexOf(node);
      if (start >= 0 && end >= 0) {
        this._selected.clear();
        const [from, to] = start < end ? [start, end] : [end, start];
        for (let i = from; i <= to; i += 1) this._selected.add(visible[i]);
      }
    } else if (toggle) {
      if (this._selected.has(node)) this._selected.delete(node);
      else this._selected.add(node);
      this._anchorNode = node;
    } else {
      this._selected.clear();
      this._selected.add(node);
      this._anchorNode = node;
    }

    this._applySelection();
  }

  async _toggleNode(node, forceExpanded) {
    const current = node.getAttribute("aria-expanded");
    if (current == null) return;

    const nextExpanded = typeof forceExpanded === "boolean" ? forceExpanded : current !== "true";
    if (nextExpanded && node.hasAttribute("data-lazy-url") && !node.hasAttribute("data-lazy-loaded")) {
      await this._loadChildren(node);
    }

    node.setAttribute("aria-expanded", nextExpanded ? "true" : "false");
    node.classList.toggle("is-expanded", nextExpanded);
  }

  async _loadChildren(node) {
    const url = node.getAttribute("data-lazy-url");
    if (!url || typeof fetch !== "function") return;

    node.classList.add("is-loading");
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Lazy load failed: ${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload)) throw new Error("Lazy payload must be an array");

      let group = node.querySelector(":scope > .uif-tree-children, :scope > .tree-children");
      if (!group) {
        group = document.createElement("ul");
        group.className = "uif-tree-children";
        group.setAttribute("role", "group");
        node.append(group);
      }

      for (const item of payload) {
        const child = document.createElement("li");
        child.className = "uif-tree-node";
        if (item?.id) child.dataset.nodeId = String(item.id);
        if (item?.lazyUrl) child.setAttribute("data-lazy-url", String(item.lazyUrl));
        if (item?.expanded) child.setAttribute("aria-expanded", "true");

        const row = document.createElement("div");
        row.className = "uif-tree-node-row";
        row.tabIndex = -1;
        const label = document.createElement("span");
        label.className = "uif-tree-label";
        label.textContent = String(item?.label ?? "Node");
        row.append(label);
        child.append(row);
        group.append(child);
      }

      node.setAttribute("data-lazy-loaded", "true");
      this._normalizeNodes();
      this._applySelection();
      this._applyDraggable();
    } catch (error) {
      this.warnDev(`[ui-foundations] ${error instanceof Error ? error.message : "Tree lazy load failed."}`);
    } finally {
      node.classList.remove("is-loading");
    }
  }

  _handleClick(event) {
    const toggle = event.target.closest(".uif-tree-toggle, .tree-toggle");
    if (toggle) {
      const node = toggle.closest(".uif-tree-node, .tree-node");
      if (node) this._toggleNode(node);
      return;
    }

    const row = event.target.closest(".uif-tree-node-row, .tree-node-row");
    if (!row) return;
    const node = row.closest(".uif-tree-node, .tree-node");
    if (!node || node.classList.contains("is-disabled")) return;

    this._focusNode(node);
    this._selectNode(node, {
      toggle: event.metaKey || event.ctrlKey,
      range: event.shiftKey,
    });
  }

  _handleFocusIn(event) {
    const row = event.target.closest(".uif-tree-node-row, .tree-node-row");
    if (!row) return;

    for (const candidate of this._tree.querySelectorAll(".uif-tree-node-row, .tree-node-row")) {
      candidate.tabIndex = candidate === row ? 0 : -1;
    }
  }

  _handleKeydown(event) {
    const row = event.target.closest(".uif-tree-node-row, .tree-node-row");
    if (!row) return;
    const node = row.closest(".uif-tree-node, .tree-node");
    if (!node) return;

    const visible = this._visibleNodes();
    const index = visible.indexOf(node);
    const key = event.key;
    const hasChildren = node.getAttribute("aria-expanded") !== null;
    const expanded = node.getAttribute("aria-expanded") === "true";

    if (key === "ArrowDown" && index < visible.length - 1) {
      event.preventDefault();
      this._focusNode(visible[index + 1]);
      return;
    }
    if (key === "ArrowUp" && index > 0) {
      event.preventDefault();
      this._focusNode(visible[index - 1]);
      return;
    }
    if (key === "Home" && visible.length) {
      event.preventDefault();
      this._focusNode(visible[0]);
      return;
    }
    if (key === "End" && visible.length) {
      event.preventDefault();
      this._focusNode(visible[visible.length - 1]);
      return;
    }
    if (key === "ArrowRight") {
      event.preventDefault();
      if (hasChildren && !expanded) this._toggleNode(node, true);
      else {
        const child = node.querySelector(":scope > .uif-tree-children > .uif-tree-node, :scope > .tree-children > .tree-node");
        if (child) this._focusNode(child);
      }
      return;
    }
    if (key === "ArrowLeft") {
      event.preventDefault();
      if (hasChildren && expanded) this._toggleNode(node, false);
      else {
        const parent = node.parentElement?.closest(".uif-tree-node, .tree-node");
        if (parent) this._focusNode(parent);
      }
      return;
    }
    if (key === "Enter" || key === " ") {
      event.preventDefault();
      if (hasChildren && key === "Enter") this._toggleNode(node);
      this._selectNode(node, {
        toggle: event.metaKey || event.ctrlKey,
        range: event.shiftKey,
      });
    }
  }

  _handleDragStart(event) {
    if (!this.getBool("draggable")) return;
    const row = event.target.closest(".uif-tree-node-row, .tree-node-row");
    const node = row?.closest(".uif-tree-node, .tree-node");
    if (!row || !node) return;

    this._dragNode = node;
    row.classList.add("is-dragging");
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", node.dataset.nodeId || "");
    }
  }

  _handleDragOver(event) {
    if (!this.getBool("draggable") || !this._dragNode) return;
    const row = event.target.closest(".uif-tree-node-row, .tree-node-row");
    if (!row) return;
    event.preventDefault();

    if (this._dropRow && this._dropRow !== row) this._dropRow.classList.remove("is-drop-target");
    this._dropRow = row;
    row.classList.add("is-drop-target");
  }

  _handleDrop(event) {
    if (!this.getBool("draggable") || !this._dragNode) return;
    const row = event.target.closest(".uif-tree-node-row, .tree-node-row");
    const targetNode = row?.closest(".uif-tree-node, .tree-node");
    if (!row || !targetNode || targetNode === this._dragNode || this._dragNode.contains(targetNode)) {
      this._clearDropTarget();
      return;
    }

    event.preventDefault();
    targetNode.parentElement?.insertBefore(this._dragNode, targetNode);
    this._clearDropTarget();
    this._focusNode(this._dragNode);
  }

  _clearDropTarget() {
    if (this._dropRow) this._dropRow.classList.remove("is-drop-target");
    for (const row of this._tree.querySelectorAll(".uif-tree-node-row.is-dragging, .tree-node-row.is-dragging")) {
      row.classList.remove("is-dragging");
    }
    this._dropRow = null;
    this._dragNode = null;
  }
}

define("uif-tree-view", UITreeView);
export { UITreeView };
