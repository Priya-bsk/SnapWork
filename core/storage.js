/**
 * storage.js
 * Single responsibility: atomic read/write of workspace data to local JSON.
 * Has zero knowledge of IPC, UI, or launch logic.
 */

const fs = require('fs')
const path = require('path')
const { app } = require('electron')

/**
 * Returns the absolute path to workspaces.json in userData directory.
 * @returns {string}
 */
function getStoragePath() {
  return path.join(app.getPath('userData'), 'workspaces.json')
}

/**
 * Reads and parses workspaces from disk.
 * Returns an empty array if the file does not exist yet.
 * @returns {Array<Object>}
 */
function readWorkspaces() {
  const filePath = getStoragePath()
  try {
    if (!fs.existsSync(filePath)) return []
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    return []
  }
}

/**
 * Atomically writes the workspaces array to disk.
 * Writes to a temp file first, then renames to prevent corruption on crash.
 * @param {Array<Object>} workspaces
 * @returns {void}
 */
function writeWorkspaces(workspaces) {
  const filePath = getStoragePath()
  const tmpPath = filePath + '.tmp'
  const serialized = JSON.stringify(workspaces, null, 2)
  fs.writeFileSync(tmpPath, serialized, 'utf-8')
  fs.renameSync(tmpPath, filePath)
}

module.exports = { readWorkspaces, writeWorkspaces, getStoragePath }
