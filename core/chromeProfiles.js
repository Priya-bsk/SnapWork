/**
 * chromeProfiles.js
 * Single responsibility: detect Chrome profiles from local installation.
 * Returns profile directories and friendly names.
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

/**
 * Detects Chrome profiles from the default installation path.
 * @returns {Array<{id: string, name: string}>} Array of profile objects
 */
function detectChromeProfiles() {
  try {
    const userDataPath = path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data')
    const localStatePath = path.join(userDataPath, 'Local State')

    // Check if Chrome is installed
    if (!fs.existsSync(userDataPath)) {
      return []
    }

    const profiles = []

    // Read profile directories
    const entries = fs.readdirSync(userDataPath, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('Profile ')) {
        profiles.push({
          id: entry.name,
          name: entry.name, // Will be overridden by friendly name if available
        })
      } else if (entry.name === 'Default') {
        profiles.push({
          id: 'Default',
          name: 'Default',
        })
      }
    }

    // Try to read friendly names from Local State
    if (fs.existsSync(localStatePath)) {
      try {
        const localState = JSON.parse(fs.readFileSync(localStatePath, 'utf8'))
        const profileInfo = localState?.profile?.info_cache || {}

        for (const profile of profiles) {
          if (profileInfo[profile.id]?.name) {
            profile.name = profileInfo[profile.id].name
          }
        }
      } catch (err) {
        // Ignore JSON parse errors, use directory names
      }
    }

    return profiles
  } catch (err) {
    console.error('Error detecting Chrome profiles:', err.message)
    return []
  }
}

/**
 * Checks if Chrome is installed by looking for chrome.exe
 * @returns {boolean}
 */
function isChromeInstalled() {
  try {
    const chromePaths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    ]
    return chromePaths.some(p => fs.existsSync(p))
  } catch {
    return false
  }
}

module.exports = { detectChromeProfiles, isChromeInstalled }