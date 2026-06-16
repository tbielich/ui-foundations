/**
 * NavigationKeyTips — Testable utility functions
 *
 * Pure logic extracted for unit testing without DOM.
 */

/**
 * Determines whether an Alt key release should be treated as a short tap
 * that toggles key-tip mode.
 *
 * @param {number} elapsed - Time in ms between keydown and keyup
 * @param {boolean} hadCombo - Whether another key was pressed during the hold
 * @param {number} threshold - Maximum ms for a valid tap
 * @returns {boolean}
 */
function isAltTap(elapsed, hadCombo, threshold) {
  if (hadCombo) return false;
  if (elapsed <= 0) return false;
  return elapsed <= threshold;
}

/**
 * Validates data-keytip assignments within a scope.
 * Returns an object with arrays of warnings.
 *
 * @param {Array<{value: string, element?: any}>} tips - Array of tip entries
 * @returns {{ duplicates: string[], empties: number }}
 */
function validateTips(tips) {
  var seen = {};
  var duplicates = [];
  var empties = 0;

  for (var i = 0; i < tips.length; i++) {
    var val = tips[i].value;
    if (!val || val.trim() === "") {
      empties++;
      continue;
    }
    if (seen[val]) {
      duplicates.push(val);
    }
    seen[val] = true;
  }

  return { duplicates: duplicates, empties: empties };
}

/**
 * Determines whether a key press during active mode should select a tip.
 *
 * @param {string} key - The pressed key
 * @returns {string|null} The tip value to select, or null
 */
function getTipFromKey(key) {
  var num = parseInt(key, 10);
  if (isNaN(num) || num < 1 || num > 9) return null;
  return String(num);
}

/**
 * Determines whether a key should dismiss the key-tip mode.
 *
 * @param {string} key - The pressed key
 * @returns {boolean}
 */
function shouldDismissOnKey(key) {
  if (key === "Escape") return true;
  // Modifier keys do not dismiss
  var modifiers = ["Alt", "Shift", "Control", "Meta"];
  if (modifiers.indexOf(key) !== -1) return false;
  // Number keys 1-9 are handled by selection, not dismissal
  var num = parseInt(key, 10);
  if (num >= 1 && num <= 9) return false;
  // All other keys dismiss
  return true;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { isAltTap, validateTips, getTipFromKey, shouldDismissOnKey };
}
