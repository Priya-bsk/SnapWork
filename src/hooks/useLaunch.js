/**
 * useLaunch.js
 * Single responsibility: manage workspace launch state and result log.
 */

import { useState, useCallback } from 'react'
import { launcherService } from '../services/launcherService'

/**
 * Provides launch state and actions to components.
 * @returns {{ launchingId, log, showLog, launch, dismissLog }}
 */
export function useLaunch() {
  const [launchingId, setLaunchingId] = useState(null)
  const [log, setLog] = useState([])
  const [showLog, setShowLog] = useState(false)

  /**
   * Launches a workspace and stores the result log.
   * Only one workspace can be launching at a time.
   * @param {string} workspaceId
   */
  const launch = useCallback(async (workspaceId) => {
    try {
      setLaunchingId(workspaceId)
      const results = await launcherService.launch(workspaceId)
      setLog(results)
      setShowLog(true)
    } catch (err) {
      setLog([{ success: false, item: 'Launch failed', type: 'error', reason: err.message }])
      setShowLog(true)
    } finally {
      setLaunchingId(null)
    }
  }, [])

  /**
   * Dismisses the launch log modal.
   */
  const dismissLog = useCallback(() => {
    setShowLog(false)
    setLog([])
  }, [])

  return { launchingId, log, showLog, launch, dismissLog }
}
