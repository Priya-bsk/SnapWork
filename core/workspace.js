/**
 * workspace.js
 * Single responsibility: workspace object factory and shape constants.
 */

const { v4: uuidv4 } = require('uuid')

/**
 * Six accent colors auto-assigned to workspaces (teal, purple, coral, blue, amber, green).
 */
const WORKSPACE_COLORS = [
  '#00C9A7',
  '#7C5CFC',
  '#FF6B6B',
  '#4A9EFF',
  '#FFB020',
  '#4CAF7D',
]

/**
 * Reference shape for a workspace object.
 */
const WORKSPACE_SCHEMA = {
  id: 'uuid-v4',
  name: 'string',
  category: 'dev|study|design|work',
  color: 'hex color string',
  apps: [{ name: 'string', path: 'string', args: ['string'] }],
  urls: [{ url: 'string', profile: 'string' }],
  folders: ['string'],
  files: ['string'],
  createdAt: 'ISO-8601',
  updatedAt: 'ISO-8601',
  lastLaunched: 'ISO-8601 | null',
}

/**
 * Assigns a color from the palette based on the workspace list length.
 * @param {number} index
 * @returns {string}
 */
function assignColor(index) {
  return WORKSPACE_COLORS[index % WORKSPACE_COLORS.length]
}

/**
 * Creates a new workspace object with generated id and timestamps.
 * @param {Object} fields - { name, category, color, apps, urls, folders, files }
 * @returns {Object}
 */
function createWorkspace(fields) {
  const now = new Date().toISOString()
  return {
    id: uuidv4(),
    name: fields.name || 'Untitled Workspace',
    category: fields.category || 'dev',
    color: fields.color || WORKSPACE_COLORS[0],
    apps: fields.apps || [],
    urls: fields.urls || [],
    folders: fields.folders || [],
    files: fields.files || [],
    createdAt: now,
    updatedAt: now,
    lastLaunched: null,
  }
}

/**
 * Returns a new workspace object merging changes, with updated timestamp.
 * @param {Object} existing
 * @param {Object} changes
 * @returns {Object}
 */
function updateWorkspace(existing, changes) {
  return {
    ...existing,
    ...changes,
    id: existing.id,
    createdAt: existing.createdAt,
    color: changes.color || existing.color,
    updatedAt: new Date().toISOString(),
  }
}

module.exports = { createWorkspace, updateWorkspace, WORKSPACE_COLORS, WORKSPACE_SCHEMA, assignColor }
