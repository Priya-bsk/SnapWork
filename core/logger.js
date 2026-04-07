/**
 * logger.js
 * Single responsibility: provide a toggleable logger for dev vs production.
 * Use this everywhere instead of console.log directly.
 */

const isDev = process.env.NODE_ENV !== 'production'

const logger = {
  /**
   * @param {...any} args
   */
  log: (...args) => { if (isDev) console.log('[SnapWork]', ...args) },

  /**
   * @param {...any} args
   */
  warn: (...args) => { if (isDev) console.warn('[SnapWork]', ...args) },

  /**
   * @param {...any} args
   */
  error: (...args) => console.error('[SnapWork]', ...args), // always log errors
}

module.exports = logger
