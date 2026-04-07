/**
 * preload.js
 * Single responsibility: expose a safe, typed electronAPI via contextBridge.
 * Raw ipcRenderer is NEVER exposed — only named methods.
 */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  workspace: {
    /** @returns {Promise<{success: boolean, data: Array}>} */
    getAll: () => ipcRenderer.invoke('workspace:getAll'),

    /** @param {Object} fields @returns {Promise<{success: boolean, data: Object}>} */
    create: (fields) => ipcRenderer.invoke('workspace:create', fields),

    /** @param {string} id @param {Object} changes @returns {Promise} */
    update: (id, changes) => ipcRenderer.invoke('workspace:update', { id, changes }),

    /** @param {string} id @returns {Promise} */
    remove: (id) => ipcRenderer.invoke('workspace:delete', id),

    /** @param {string} id @returns {Promise} */
    duplicate: (id) => ipcRenderer.invoke('workspace:duplicate', id),
  },

  launcher: {
    /** @param {string} workspaceId @returns {Promise<{success: boolean, data: Array}>} */
    launch: (workspaceId) => ipcRenderer.invoke('launcher:launch', workspaceId),
  },

  dialog: {
    /** @returns {Promise<{success: boolean, data?: string}>} */
    openFile: () => ipcRenderer.invoke('dialog:openFile'),

    /** @returns {Promise<{success: boolean, data?: string}>} */
    openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
  },



  chrome: {
    /** @returns {Promise<{success: boolean, data?: Array}>} */
    getProfiles: () => ipcRenderer.invoke('chrome:getProfiles'),
  },

  titlebar: {
    minimize: () => ipcRenderer.invoke('titlebar:minimize'),
    maximize: () => ipcRenderer.invoke('titlebar:maximize'),
    close: () => ipcRenderer.invoke('titlebar:close'),
  },
})
