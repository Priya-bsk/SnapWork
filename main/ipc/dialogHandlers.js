/**
 * dialogHandlers.js
 * Single responsibility: handle native file/folder picker dialogs.
 */

const { dialog } = require('electron')

/**
 * Registers dialog IPC handlers.
 * @param {Electron.IpcMain} ipcMain
 */
function register(ipcMain) {
  /**
   * Opens a native file picker for .exe files.
   * @returns {{ success: boolean, data?: string }}
   */
  ipcMain.handle('dialog:openFile', async (event) => {
    try {
      const win = require('electron').BrowserWindow.fromWebContents(event.sender)
      const result = await dialog.showOpenDialog(win, {
        title: 'Select Application',
        properties: ['openFile'],
        filters: [
          { name: 'Executables', extensions: ['exe', 'cmd', 'bat'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      })
      if (result.canceled || result.filePaths.length === 0) {
        return { success: false }
      }
      return { success: true, data: result.filePaths[0] }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  /**
   * Opens a native folder picker.
   * @returns {{ success: boolean, data?: string }}
   */
  ipcMain.handle('dialog:openFolder', async (event) => {
    try {
      const win = require('electron').BrowserWindow.fromWebContents(event.sender)
      const result = await dialog.showOpenDialog(win, {
        title: 'Select Folder',
        properties: ['openDirectory'],
      })
      if (result.canceled || result.filePaths.length === 0) {
        return { success: false }
      }
      return { success: true, data: result.filePaths[0] }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })
}

module.exports = { register }
