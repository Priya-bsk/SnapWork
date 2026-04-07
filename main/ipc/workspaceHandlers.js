/**
 * workspaceHandlers.js
 * Single responsibility: register all workspace CRUD ipcMain handlers.
 * Imports only from core/. Returns structured { success, data?, error? }.
 */

const storage = require('../../core/storage')
const { createWorkspace, updateWorkspace } = require('../../core/workspace')
const { validateWorkspace } = require('../../core/validator')

/**
 * Registers all workspace IPC handlers on the given ipcMain instance.
 * @param {Electron.IpcMain} ipcMain
 */
function register(ipcMain) {
  /**
   * Returns all saved workspaces.
   */
  ipcMain.handle('workspace:getAll', async () => {
    try {
      const workspaces = storage.readWorkspaces()
      return { success: true, data: workspaces }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  /**
   * Creates a new workspace after validation.
   */
  ipcMain.handle('workspace:create', async (_event, fields) => {
    try {
      const validation = validateWorkspace(fields)
      if (!validation.valid) {
        return { success: false, error: validation.errors.join(' ') }
      }
      const workspaces = storage.readWorkspaces()
      const newWorkspace = createWorkspace(fields)
      workspaces.push(newWorkspace)
      storage.writeWorkspaces(workspaces)
      return { success: true, data: newWorkspace }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  /**
   * Updates an existing workspace by id.
   */
  ipcMain.handle('workspace:update', async (_event, { id, changes }) => {
    try {
      const validation = validateWorkspace(changes)
      if (!validation.valid) {
        return { success: false, error: validation.errors.join(' ') }
      }
      const workspaces = storage.readWorkspaces()
      const idx = workspaces.findIndex((w) => w.id === id)
      if (idx === -1) return { success: false, error: 'Workspace not found.' }
      workspaces[idx] = updateWorkspace(workspaces[idx], changes)
      storage.writeWorkspaces(workspaces)
      return { success: true, data: workspaces[idx] }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  /**
   * Deletes a workspace by id.
   */
  ipcMain.handle('workspace:delete', async (_event, id) => {
    try {
      let workspaces = storage.readWorkspaces()
      workspaces = workspaces.filter((w) => w.id !== id)
      storage.writeWorkspaces(workspaces)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  /**
   * Duplicates an existing workspace with a new id and "(Copy)" name suffix.
   */
  ipcMain.handle('workspace:duplicate', async (_event, id) => {
    try {
      const workspaces = storage.readWorkspaces()
      const source = workspaces.find((w) => w.id === id)
      if (!source) return { success: false, error: 'Workspace not found.' }
      const copy = createWorkspace(
        { ...source, name: source.name + ' (Copy)' }
      )
      workspaces.push(copy)
      storage.writeWorkspaces(workspaces)
      return { success: true, data: copy }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })
}

module.exports = { register }
