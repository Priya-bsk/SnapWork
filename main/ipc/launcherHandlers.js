/**
 * launcherHandlers.js
 * Single responsibility: handle workspace launch IPC and collect per-item results.
 * Imports only from core/.
 */

const storage = require('../../core/storage')
const launcher = require('../../core/launcher')

/**
 * Registers launch IPC handlers.
 * @param {Electron.IpcMain} ipcMain
 */
function register(ipcMain) {
  /**
   * Launches all items in a workspace. Skips and logs failures — never halts.
   * Updates lastLaunched timestamp after execution.
   */
  ipcMain.handle('launcher:launch', async (_event, workspaceId) => {
    try {
      const workspaces = storage.readWorkspaces()
      const workspace = workspaces.find((w) => w.id === workspaceId)
      if (!workspace) return { success: false, error: 'Workspace not found.' }

      const log = []

      // Filter out empty items
      const validUrls = (workspace.urls || []).filter(u => {
        if (typeof u === 'string') return u && u.trim()
        return u && u.url && u.url.trim()
      })
      const validApps = (workspace.apps || []).filter(a => a && a.path && a.path.trim())
      const validFolders = (workspace.folders || []).filter(f => f && f.trim())
      const validFiles = (workspace.files || []).filter(f => f && f.trim())

      for (const url of validUrls) {
        const result = await launcher.launchUrl(url.url || url, url.profile || '')
        log.push(result)
      }

      for (const app of validApps) {
        const result = await launcher.launchApp(app.path, app.args || [])
        log.push({ ...result, item: app.name || app.path })
      }

      for (const folder of validFolders) {
        const result = await launcher.launchFolder(folder)
        log.push(result)
      }

      for (const file of validFiles) {
        const result = await launcher.launchFile(file)
        log.push(result)
      }

      // Update lastLaunched timestamp
      const idx = workspaces.findIndex((w) => w.id === workspaceId)
      if (idx !== -1) {
        workspaces[idx].lastLaunched = new Date().toISOString()
        storage.writeWorkspaces(workspaces)
      }

      return { success: true, data: log }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })
}

module.exports = { register }
