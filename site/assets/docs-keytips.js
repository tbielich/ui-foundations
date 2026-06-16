/**
 * NavigationKeyTips — Experimental PoC
 *
 * Adds Alt-triggered numeric key tips to the main documentation navigation.
 * Pressing Alt (short tap, no other key during) activates the mode.
 * Pressing the corresponding number navigates to that link.
 * Escape, Alt, pointer click, or navigation dismisses the mode.
 *
 * Principles:
 * - No extra DOM nodes; visuals via CSS ::after on [data-keytip]
 * - No interference with normal keyboard navigation
 * - Cleans up all listeners on destroy()
 */
(function () {
  "use strict";

  var SCOPE_ATTR = "data-keytip-scope";
  var TIP_ATTR = "data-keytip";
  var MODE_ATTR = "data-keytip-mode";
  var ACTIVE_VALUE = "active";

  // Threshold: Alt must be held less than this to count as a short tap
  var ALT_TAP_THRESHOLD = 400;

  function NavigationKeyTips(scopeSelector) {
    this._scopeSelector = scopeSelector || "[" + SCOPE_ATTR + "]";
    this._active = false;
    this._altDownTime = 0;
    this._altCombo = false; // true if another key was pressed while Alt held
    this._destroyed = false;

    // Bind handlers for clean removal
    this._onKeyDown = this._handleKeyDown.bind(this);
    this._onKeyUp = this._handleKeyUp.bind(this);
    this._onPointerDown = this._handlePointerDown.bind(this);
    this._onVisibilityChange = this._handleVisibilityChange.bind(this);

    this._validate();
    this._attach();
  }

  NavigationKeyTips.prototype._validate = function () {
    var scope = document.querySelector(this._scopeSelector);
    if (!scope) {
      console.warn("[NavigationKeyTips] No scope element found:", this._scopeSelector);
      return;
    }

    var tips = scope.querySelectorAll("[" + TIP_ATTR + "]");
    var seen = {};
    tips.forEach(function (el) {
      var val = el.getAttribute(TIP_ATTR);
      if (!val || val.trim() === "") {
        console.warn("[NavigationKeyTips] Empty data-keytip on:", el);
        return;
      }
      if (seen[val]) {
        console.warn("[NavigationKeyTips] Duplicate data-keytip value:", val, el);
      }
      seen[val] = true;
    });
  };

  NavigationKeyTips.prototype._attach = function () {
    document.addEventListener("keydown", this._onKeyDown, true);
    document.addEventListener("keyup", this._onKeyUp, true);
    document.addEventListener("pointerdown", this._onPointerDown, true);
    document.addEventListener("visibilitychange", this._onVisibilityChange);
  };

  NavigationKeyTips.prototype.destroy = function () {
    if (this._destroyed) return;
    this._destroyed = true;
    this._deactivate();
    document.removeEventListener("keydown", this._onKeyDown, true);
    document.removeEventListener("keyup", this._onKeyUp, true);
    document.removeEventListener("pointerdown", this._onPointerDown, true);
    document.removeEventListener("visibilitychange", this._onVisibilityChange);
  };

  NavigationKeyTips.prototype._activate = function () {
    if (this._active) return;
    this._active = true;
    document.documentElement.setAttribute(MODE_ATTR, ACTIVE_VALUE);
  };

  NavigationKeyTips.prototype._deactivate = function () {
    if (!this._active) return;
    this._active = false;
    document.documentElement.removeAttribute(MODE_ATTR);
  };

  NavigationKeyTips.prototype._handleKeyDown = function (e) {
    // Track Alt press start
    if (e.key === "Alt") {
      if (!this._altDownTime) {
        this._altDownTime = Date.now();
        this._altCombo = false;
      }
      // Prevent default to suppress menu bar activation on Windows/Linux
      // but only when we might use this as a key-tip trigger
      return;
    }

    // If Alt is held and another key is pressed, it's a combo (Alt+Tab etc.)
    if (e.altKey) {
      this._altCombo = true;
    }

    if (!this._active) return;

    // Escape dismisses
    if (e.key === "Escape") {
      e.preventDefault();
      this._deactivate();
      return;
    }

    // Number keys 1-9 select a tip
    var num = parseInt(e.key, 10);
    if (num >= 1 && num <= 9) {
      e.preventDefault();
      this._selectTip(String(num));
      return;
    }

    // Any other key while active: close without action
    if (e.key !== "Alt" && e.key !== "Shift" && e.key !== "Control" && e.key !== "Meta") {
      this._deactivate();
    }
  };

  NavigationKeyTips.prototype._handleKeyUp = function (e) {
    if (e.key !== "Alt") return;

    var elapsed = Date.now() - this._altDownTime;
    this._altDownTime = 0;

    // Only toggle if it was a short tap without combo
    if (this._altCombo || elapsed > ALT_TAP_THRESHOLD) {
      this._altCombo = false;
      return;
    }

    this._altCombo = false;

    if (this._active) {
      this._deactivate();
    } else {
      this._activate();
    }
  };

  NavigationKeyTips.prototype._handlePointerDown = function () {
    if (this._active) {
      this._deactivate();
    }
  };

  NavigationKeyTips.prototype._handleVisibilityChange = function () {
    if (document.hidden && this._active) {
      this._deactivate();
    }
  };

  NavigationKeyTips.prototype._selectTip = function (value) {
    var scope = document.querySelector(this._scopeSelector);
    if (!scope) return;

    var target = scope.querySelector("[" + TIP_ATTR + '="' + value + '"]');
    if (!target) return;

    // Check visibility and enabled state
    if (this._isHiddenOrInert(target)) return;

    this._deactivate();

    // Focus then activate the link
    target.focus();
    target.click();
  };

  NavigationKeyTips.prototype._isHiddenOrInert = function (el) {
    // Walk up the tree checking for hidden/inert/disabled
    var node = el;
    while (node && node !== document.documentElement) {
      if (node.hidden || node.inert || node.hasAttribute("disabled")) return true;
      var style = window.getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") return true;
      node = node.parentElement;
    }
    return false;
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    // Expose instance for testing and potential future teardown
    window.__navigationKeyTips = new NavigationKeyTips();
  }
})();
