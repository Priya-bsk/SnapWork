/**
 * useWorkspaces.js
 * Single responsibility: manage workspace list state and CRUD actions.
 * No JSX, no direct IPC.
 */

import { useState, useEffect, useCallback } from 'react'
import { workspaceService } from '../services/workspaceService'

/**
 * Provides workspace data and mutation actions to components.
 * @returns {{ workspaces, loading, error, add, edit, remove, duplicate, refresh }}
 */
export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const data = await workspaceService.getAll()
      setWorkspaces(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  /**
   * Creates and adds a new workspace.
   * @param {Object} fields
   */
  const add = useCallback(async (fields) => {
    await workspaceService.create(fields)
    await refresh()
  }, [refresh])

  /**
   * Updates a workspace by id.
   * @param {string} id
   * @param {Object} changes
   */
  const edit = useCallback(async (id, changes) => {
    await workspaceService.update(id, changes)
    await refresh()
  }, [refresh])

  /**
   * Removes a workspace by id.
   * @param {string} id
   */
  const remove = useCallback(async (id) => {
    await workspaceService.remove(id)
    await refresh()
  }, [refresh])

  /**
   * Duplicates a workspace by id.
   * @param {string} id
   */
  const duplicate = useCallback(async (id) => {
    await workspaceService.duplicate(id)
    await refresh()
  }, [refresh])

  return { workspaces, loading, error, add, edit, remove, duplicate, refresh }
}
