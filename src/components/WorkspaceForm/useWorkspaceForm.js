// useWorkspaceForm.js — all form state, add/remove/update items, dirty tracking, and validation
import { useState, useEffect } from 'react'

const WORKSPACE_COLORS = ['#00C9A7', '#7C5CFC', '#FF6B6B', '#4A9EFF', '#FFB020', '#4CAF7D']
const WORKSPACE_CATEGORIES = ['dev', 'study', 'design', 'work']

const EMPTY_APP = () => ({ name: '', path: '', args: [] })
const EMPTY_URL = () => ({ url: '', profile: '' })
const EMPTY = () => ({ 
  name: '', 
  category: 'dev',
  color: WORKSPACE_COLORS[0],
  apps: [], 
  urls: [], 
  folders: [], 
  files: [] 
})

/**
 * Manages all state for the workspace create/edit form.
 * @param {Object|null} initial - existing workspace for edit mode, null for create
 * @returns {{ fields, errors, setName, addItem, removeItem, updateItem, validate }}
 */
export function useWorkspaceForm(initial) {
  const [fields, setFields] = useState(() =>
    initial
      ? {
          name:     initial.name     || '',
          category: initial.category || 'dev',
          color:    initial.color    || WORKSPACE_COLORS[0],
          apps:     (initial.apps    || []).map(a => ({ ...a })),
          urls:     [...(initial.urls    || [])],
          folders:  [...(initial.folders || [])],
          files:    [...(initial.files   || [])],
        }
      : EMPTY()
  )
  const [errors, setErrors] = useState([])

  // Reset when the target workspace changes (switching from create to edit or back)
  useEffect(() => {
    if (initial) {
      setFields({
        name:     initial.name     || '',
        category: initial.category || 'dev',
        color:    initial.color    || WORKSPACE_COLORS[0],
        apps:     (initial.apps    || []).map(a => ({ ...a })),
        urls:     (initial.urls    || []).map(u => typeof u === 'string' ? { url: u, profile: '' } : { ...u }),
        folders:  [...(initial.folders || [])],
        files:    [...(initial.files   || [])],
      })
    } else {
      setFields(EMPTY())
    }
    setErrors([])
  }, [initial?.id])

  /**
   * Updates the workspace name.
   * @param {string} name
   */
  function setName(name) {
    setFields(f => ({ ...f, name }))
  }

  /**
   * Updates the workspace category.
   * @param {string} category - 'dev'|'study'|'design'|'work'
   */
  function setCategory(category) {
    setFields(f => ({ ...f, category }))
  }

  /**
   * Updates the workspace color.
   * @param {string} color - hex color string
   */
  function setColor(color) {
    setFields(f => ({ ...f, color }))
  }

  /**
   * Adds a new item to apps / urls / folders / files.
   * @param {'apps'|'urls'|'folders'|'files'} type
   */
  function addItem(type) {
    setFields(f => ({
      ...f,
      [type]: [...f[type], type === 'apps' ? EMPTY_APP() : type === 'urls' ? EMPTY_URL() : ''],
    }))
  }

  /**
   * Removes an item at the given index from the specified collection.
   * @param {'apps'|'urls'|'folders'|'files'} type
   * @param {number} idx
   */
  function removeItem(type, idx) {
    setFields(f => ({ ...f, [type]: f[type].filter((_, i) => i !== idx) }))
  }

  /**
   * Updates a single item in the specified collection.
   * @param {'apps'|'urls'|'folders'} type
   * @param {number} idx
   * @param {string|Object} value
   */
  function updateItem(type, idx, value) {
    setFields(f => {
      const copy = [...f[type]]
      copy[idx] = value
      return { ...f, [type]: copy }
    })
  }

  /**
   * Validates the current fields. Sets error messages and returns validity.
   * Filters out empty items and validates formats.
   * @returns {boolean}
   */
  function validate() {
    const errs = []
    if (!fields.name.trim()) {
      errs.push('Workspace name is required.')
    }

    // Filter out empty items
    const validApps = fields.apps.filter(a => a.path?.trim())
    const validUrls = fields.urls.filter(u => (typeof u === 'string' ? u : u.url)?.trim())
    const validFolders = fields.folders.filter(f => f?.trim())
    const validFiles = fields.files.filter(f => f?.trim())

    const total = validApps.length + validUrls.length + validFolders.length + validFiles.length
    if (total === 0) {
      errs.push('Add at least one app, URL, folder, or file.')
    }

    // Validate app paths
    fields.apps.forEach((app, i) => {
      if (app.path?.trim() && !/\.(exe|bat|cmd)$/i.test(app.path)) {
        errs.push(`App #${i + 1} path must end with .exe, .bat, or .cmd`)
      }
    })

    // Validate URLs
    fields.urls.forEach((urlItem, i) => {
      const url = typeof urlItem === 'string' ? urlItem : urlItem.url
      if (url?.trim() && !url.startsWith('http://') && !url.startsWith('https://')) {
        errs.push(`URL #${i + 1} must start with http:// or https://`)
      }
    })

    setErrors(errs)
    return errs.length === 0
  }

  return { fields, errors, setName, setCategory, setColor, addItem, removeItem, updateItem, validate }
}

export { WORKSPACE_COLORS, WORKSPACE_CATEGORIES }
