/**
 * launcherService.js
 * Single responsibility: wrap window.electronAPI.launcher calls.
 */

/**
 * Launches all items in a workspace and returns the result log.
 * @param {string} workspaceId
 * @returns {Promise<Array<{success: boolean, item: string, type: string, reason?: string}>>}
 */
async function launch(workspaceId) {
  const res = await window.electronAPI.launcher.launch(workspaceId)
  if (!res.success) throw new Error(res.error)
  return res.data
}

export const launcherService = { launch }
