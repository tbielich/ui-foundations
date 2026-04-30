/**
 * Log a warning in non-production environments.
 * Shared across React wrappers to avoid copy-pasting the same guard.
 */
export function warnDev(message) {
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV === "production"
  ) {
    return;
  }

  console.warn(message);
}
