/**
 * launcher.js
 * Single responsibility: execute workspace items via OS shell.
 * Has zero knowledge of storage or UI.
 */

const { shell } = require('electron')
const { spawn } = require('child_process')
const chromeProfiles = require('./chromeProfiles')

/**
 * Opens a URL in the system's default browser or Chrome with profile.
 * @param {string} url
 * @param {string} [profile] - Chrome profile directory name (optional)
 * @returns {Promise<{success: boolean, item: string, type: string, reason?: string}>}
 */
async function launchUrl(url, profile) {
  try {
    // If profile specified and Chrome is installed, use Chrome with profile
    if (profile && chromeProfiles.isChromeInstalled()) {
      return await launchUrlInChrome(url, profile)
    }

    // Fallback to default browser
    await shell.openExternal(url)
    return { success: true, item: url, type: 'url' }
  } catch (err) {
    return { success: false, item: url, type: 'url', reason: err.message }
  }
}

/**
 * Opens a URL in Chrome with a specific profile.
 * @param {string} url
 * @param {string} profile - Profile directory name
 * @returns {Promise<{success: boolean, item: string, type: string, reason?: string}>}
 */
async function launchUrlInChrome(url, profile) {
  return new Promise((resolve) => {
    try {
      const chromePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      ]

      const chromeExe = chromePaths.find(p => require('fs').existsSync(p))
      if (!chromeExe) {
        throw new Error('Chrome executable not found')
      }

      const args = [`--profile-directory=${profile}`, url]

      const child = spawn(chromeExe, args, {
        detached: true,
        stdio: 'pipe',
        shell: false, // Chrome doesn't need shell on Windows
        windowsHide: true,
      })

      child.unref()

      let resolved = false

      child.on('error', (err) => {
        if (!resolved) {
          resolved = true
          resolve({ success: false, item: url, type: 'url', reason: err.message })
        }
      })

      // Assume success after 1 second (Chrome opens quickly)
      setTimeout(() => {
        if (!resolved) {
          resolved = true
          resolve({ success: true, item: url, type: 'url' })
        }
      }, 1000)

      child.on('exit', (code) => {
        if (!resolved) {
          resolved = true
          if (code !== 0 && code !== null) {
            resolve({ success: false, item: url, type: 'url', reason: `Chrome exited with code ${code}` })
          } else {
            resolve({ success: true, item: url, type: 'url' })
          }
        }
      })
    } catch (err) {
      resolve({ success: false, item: url, type: 'url', reason: err.message })
    }
  })
}

/**
 * Spawns an application process. Does not block.
 * Windows requires shell: true to execute .exe files.
 * @param {string} appPath - Absolute path to the executable
 * @param {string[]} args - Optional launch arguments
 * @returns {Promise<{success: boolean, item: string, type: string, reason?: string}>}
 */
async function launchApp(appPath, args = []) {
  return new Promise((resolve) => {
    try {
      // Quote path if it contains spaces or special chars
      const quotedPath = appPath.includes(' ') ? `"${appPath}"` : appPath
      
      // Windows requires shell: true; Unix doesn't need it but won't hurt
      const isWindows = process.platform === 'win32'
      
      const child = spawn(quotedPath, args, {
        detached: true,
        stdio: 'pipe',  // Capture output to detect launch failures
        shell: isWindows,  // REQUIRED for Windows .exe execution
        windowsHide: true,  // Don't show cmd.exe window on Windows
      })
      
      child.unref()
      
      // Track if we've already resolved (prevent resolve() being called twice)
      let resolved = false
      
      child.on('error', (err) => {
        if (!resolved) {
          resolved = true
          resolve({ success: false, item: appPath, type: 'app', reason: err.message })
        }
      })
      
      // If no error fires within 1 second, assume success
      // (process may still be initializing and inheriting streams)
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true
          resolve({ success: true, item: appPath, type: 'app' })
        }
      }, 1000)
      
      // Also resolve on process exit with non-zero code
      child.on('exit', (code) => {
        clearTimeout(timer)
        if (!resolved) {
          resolved = true
          if (code !== 0 && code !== null) {
            resolve({ success: false, item: appPath, type: 'app', reason: `Process exited with code ${code}` })
          } else {
            resolve({ success: true, item: appPath, type: 'app' })
          }
        }
      })
    } catch (err) {
      resolve({ success: false, item: appPath, type: 'app', reason: err.message })
    }
  })
}

/**
 * Opens a folder in Windows Explorer.
 * @param {string} folderPath - Absolute path to the folder
 * @returns {Promise<{success: boolean, item: string, type: string, reason?: string}>}
 */
async function launchFolder(folderPath) {
  try {
    await shell.openPath(folderPath)
    return { success: true, item: folderPath, type: 'folder' }
  } catch (err) {
    return { success: false, item: folderPath, type: 'folder', reason: err.message }
  }
}

/**
 * Opens a file with its default handler (PDF, Word doc, etc.).
 * @param {string} filePath - Absolute path to the file
 * @returns {Promise<{success: boolean, item: string, type: string, reason?: string}>}
 */
async function launchFile(filePath) {
  try {
    await shell.openPath(filePath)
    return { success: true, item: filePath, type: 'file' }
  } catch (err) {
    return { success: false, item: filePath, type: 'file', reason: err.message }
  }
}

module.exports = { launchUrl, launchApp, launchFolder, launchFile }