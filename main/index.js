/**
 * index.js
 * Single responsibility: Electron entry point.
 * Owns window lifecycle, IPC registration, and app events only.
 */

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const workspaceHandlers = require('./ipc/workspaceHandlers')
const launcherHandlers = require('./ipc/launcherHandlers')
const dialogHandlers = require('./ipc/dialogHandlers')
const chromeProfiles = require('../core/chromeProfiles')

const isDev = process.env.NODE_ENV !== 'production'

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 780,
    minWidth: 800,
    minHeight: 600,
    x: undefined,
    y: undefined,
    frame: true,            // (debug) use native window frame for visibility
    backgroundColor: '#0E0E10',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,   // REQUIRED for contextBridge to work
      nodeIntegration: false,   // REQUIRED for security
      sandbox: false,           // Allow preload to use require
    },
    show: true,
  })

  win.once('ready-to-show', () => {
    console.log('[main] window ready to show')
    win.show()
  })

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('[main] failed to load URL', { errorCode, errorDescription, validatedURL })
  })

  win.webContents.on('dom-ready', () => {
    console.log('[main] dom-ready, URL:', win.webContents.getURL())
  })

  win.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    console.log(`[renderer] level=${level} message=${message} line=${line} source=${sourceId}`)
  })

  if (isDev) {
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'
    console.log('[main] loading dev URL:', devUrl)
    win.loadURL(devUrl)
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    const prodUrl = path.join(__dirname, '../dist/index.html')
    console.log('[main] loading prod file:', prodUrl)
    win.loadFile(prodUrl)
  }

  return win
}

app.whenReady().then(() => {
    app.on('browser-window-created', (_event, win) => {
      console.log('[main] browser-window-created, id:', win.id)
    })

    app.on('activate', () => {
      console.log('[main] app.activate event')
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    console.log('[main] registering IPC handlers')
    workspaceHandlers.register(ipcMain)
    launcherHandlers.register(ipcMain)
    dialogHandlers.register(ipcMain)

    ipcMain.handle('chrome:getProfiles', async () => {
      try {
        const profiles = chromeProfiles.detectChromeProfiles()
        return { success: true, data: profiles }
      } catch (err) {
        console.error('chrome:getProfiles error:', err.message)
        return { success: false, error: err.message }
      }
    })

  // Window control handlers
  ipcMain.handle('titlebar:minimize', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize()
  })
  ipcMain.handle('titlebar:maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win?.isMaximized()) win.unmaximize()
    else win?.maximize()
  })
  ipcMain.handle('titlebar:close', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close()
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
