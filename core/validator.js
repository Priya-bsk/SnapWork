/**
 * validator.js
 * Single responsibility: validate workspace data shapes and paths.
 * Pure functions only — no side effects, no I/O (except fs.existsSync for path checks).
 */

const fs = require('fs')

/**
 * Validates a full workspace object.
 * @param {Object} workspace
 * @returns {{valid: boolean, errors: string[]}}
 */
function validateWorkspace(workspace) {
  const errors = []

  if (!workspace.name || typeof workspace.name !== 'string' || workspace.name.trim() === '') {
    errors.push('Workspace name is required.')
  }

  // Filter out empty items
  const validApps = (workspace.apps || []).filter(a => a && a.path && a.path.trim())
  const validUrls = (workspace.urls || []).filter(u => u && (typeof u === 'string' ? u.trim() : u.url?.trim()))
  const validFolders = (workspace.folders || []).filter(f => f && f.trim())
  const validFiles = (workspace.files || []).filter(f => f && f.trim())

  const hasItems = validApps.length > 0 || validUrls.length > 0 || validFolders.length > 0 || validFiles.length > 0

  if (!hasItems) {
    errors.push('Workspace must have at least one app, URL, folder, or file.')
  }

  // Validate URLs
  validUrls.forEach((urlItem, i) => {
    const url = typeof urlItem === 'string' ? urlItem : urlItem.url
    if (url?.trim() && !validateUrl(url)) {
      errors.push(`URL "${url}" is invalid or malformed.`)
    }
  })

  // Validate file paths exist
  validFiles.forEach((filePath, i) => {
    if (!fs.existsSync(filePath)) {
      errors.push(`File not found: "${filePath}"`)
    }
  })

  // Validate folder paths exist
  validFolders.forEach((folderPath, i) => {
    if (!fs.existsSync(folderPath)) {
      errors.push(`Folder not found: "${folderPath}"`)
    }
  })

  // Validate app paths
  validApps.forEach((app, i) => {
    if (!fs.existsSync(app.path)) {
      errors.push(`App executable not found: "${app.path}"`)
    }
  })

  return { valid: errors.length === 0, errors }
}

/**
 * Checks if an executable path exists on disk.
 * @param {string} appPath
 * @returns {boolean}
 */
function validateAppPath(appPath) {
  if (!appPath || typeof appPath !== 'string') return false
  return fs.existsSync(appPath)
}

/**
 * Validates whether a string is a parseable URL.
 * @param {string} url
 * @returns {boolean}
 */
function validateUrl(url) {
  if (!url || typeof url !== 'string') return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

module.exports = { validateWorkspace, validateAppPath, validateUrl }
