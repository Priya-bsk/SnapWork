/**
 * workspaceService.js
 * Single responsibility: wrap window.electronAPI.workspace.* calls.
 * All other modules import from here — never from window.electronAPI directly.
 */

/**
 * Fetches all workspaces from storage.
 * @returns {Promise<Array<Object>>}
 */
async function getAll() {
  const res = await window.electronAPI.workspace.getAll()
  if (!res.success) throw new Error(res.error)
  return res.data
}

/**
 * Creates a new workspace.
 * @param {Object} fields
 * @returns {Promise<Object>}
 */
async function create(fields) {
  const res = await window.electronAPI.workspace.create(fields)
  if (!res.success) throw new Error(res.error)
  return res.data
}

/**
 * Updates an existing workspace by id.
 * @param {string} id
 * @param {Object} changes
 * @returns {Promise<Object>}
 */
async function update(id, changes) {
  const res = await window.electronAPI.workspace.update(id, changes)
  if (!res.success) throw new Error(res.error)
  return res.data
}

/**
 * Removes a workspace by id.
 * @param {string} id
 * @returns {Promise<void>}
 */
async function remove(id) {
  const res = await window.electronAPI.workspace.remove(id)
  if (!res.success) throw new Error(res.error)
}

/**
 * Duplicates a workspace by id.
 * @param {string} id
 * @returns {Promise<Object>}
 */
async function duplicate(id) {
  const res = await window.electronAPI.workspace.duplicate(id)
  if (!res.success) throw new Error(res.error)
  return res.data
}

export const workspaceService = { getAll, create, update, remove, duplicate }
