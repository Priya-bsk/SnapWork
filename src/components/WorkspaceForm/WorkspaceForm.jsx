// WorkspaceForm.jsx — slide-in right panel for creating or editing a workspace
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useWorkspaceForm, WORKSPACE_COLORS, WORKSPACE_CATEGORIES } from './useWorkspaceForm'
import UrlField from './UrlField'
import ItemField from './ItemField'

/**
 * @param {{
 *   initial: Object|null,
 *   onSave: Function,
 *   onCancel: Function
 * }} props
 */
export default function WorkspaceForm({ initial, onSave, onCancel }) {
  const { fields, errors, setName, setCategory, setColor, addItem, removeItem, updateItem, validate } = useWorkspaceForm(initial)
  const nameRef = useRef(null)
  const [chromeProfiles, setChromeProfiles] = useState([])
  const profileOptions = chromeProfiles.map((p) => ({ value: p.id, label: p.name || p.id }))

  // Auto-focus name input when panel opens
  useEffect(() => {
    const timer = setTimeout(() => nameRef.current?.focus(), 320)
    return () => clearTimeout(timer)
  }, [])

  // Load Chrome profile presets (local user profiles)
  useEffect(() => {
    async function loadProfiles() {
      try {
        const res = await window.electronAPI?.chrome.getProfiles()
        if (res?.success && Array.isArray(res.data)) {
          setChromeProfiles(res.data)
        }
      } catch (err) {
        console.error('Failed to load Chrome profiles:', err)
      }
    }

    loadProfiles()
  }, [])

  // Escape key closes panel
  useEffect(() => {
    function handler(e) { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onCancel])

  // Browse for .exe via native dialog
  async function handleBrowseApp(idx) {
    const res = await window.electronAPI?.dialog.openFile()
    if (res?.success && res.data) {
      const existing = fields.apps[idx] || {}
      // Auto-fill name from filename if empty
      const fileName = res.data.split('\\').pop().replace('.exe', '')
      updateItem('apps', idx, {
        ...existing,
        path: res.data,
        name: existing.name || fileName,
      })
    }
  }

  // Browse for folder via native dialog
  async function handleBrowseFolder(idx) {
    const res = await window.electronAPI?.dialog.openFolder()
    if (res?.success && res.data) {
      updateItem('folders', idx, res.data)
    }
  }

  // Browse for file via native dialog
  async function handleBrowseFile(idx) {
    const res = await window.electronAPI?.dialog.openFile()
    if (res?.success && res.data) {
      updateItem('files', idx, res.data)
    }
  }


  function handleSubmit() {
    if (validate()) onSave(fields)
  }

  function handleNameKeyDown(e) {
    if (e.key === 'Enter') {
      // Move focus to first URL input if it exists, else submit
      const firstInput = document.querySelector('[data-url-input]')
      if (firstInput) firstInput.focus()
      else handleSubmit()
    }
  }

  return (
    <div
      className="panel-enter"
      style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 480,
        background: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-modal)',
        display: 'flex', flexDirection: 'column',
        zIndex: 20,
      }}
    >
      {/* ── Panel header ── */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: 12,
        flexShrink: 0,
      }}>
        <button
          onClick={onCancel}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            color: 'var(--text-secondary)', fontSize: 13,
            transition: 'var(--transition)', padding: '4px 6px',
            borderRadius: 6,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-elevated)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
        <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
          {initial ? 'Edit Workspace' : 'New Workspace'}
        </span>
      </div>

      {/* ── Scrollable form body ── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 20px 8px',
        display: 'flex', flexDirection: 'column', gap: 22,
      }}>
        {/* Name field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <FieldLabel>Workspace Name</FieldLabel>
          <NameInput
            ref={nameRef}
            value={fields.name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleNameKeyDown}
            placeholder="Enter your workspace name"
          />
        </div>

        {/* Category picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <FieldLabel>Category</FieldLabel>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {WORKSPACE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '6px 12px',
                  background: fields.category === cat ? 'var(--accent)' : 'var(--bg-elevated)',
                  color: fields.category === cat ? '#0E0E10' : 'var(--text-secondary)',
                  border: `1px solid ${fields.category === cat ? 'var(--accent)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-pill)',
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => { if (fields.category !== cat) e.currentTarget.style.background = 'var(--bg-base)' }}
                onMouseLeave={e => { if (fields.category !== cat) e.currentTarget.style.background = 'var(--bg-elevated)' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <FieldLabel>Accent Color</FieldLabel>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {WORKSPACE_COLORS.map(col => (
              <button
                key={col}
                onClick={() => setColor(col)}
                style={{
                  width: 34, height: 34,
                  background: col,
                  borderRadius: 'var(--radius-pill)',
                  border: fields.color === col ? `2px solid ${col}` : '2px solid transparent',
                  outline: fields.color === col ? `1px solid #FFFFFF40` : 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  transform: fields.color === col ? 'scale(1.1)' : 'scale(1)',
                }}
                title={col}
              />
            ))}
          </div>
        </div>

        {/* Applications */}
        <ItemField
          
          label="Applications"
          type="apps"
          items={fields.apps}
          onAdd={() => addItem('apps')}
          onRemove={idx => removeItem('apps', idx)}
          onUpdate={(idx, val) => updateItem('apps', idx, val)}
          onBrowse={handleBrowseApp}
          placeholder="C:\Program Files\App\app.exe"
        />

        {/* Browser URLs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <FieldLabel>Browser URLs</FieldLabel>

          {/* URL list */}
          {fields.urls.map((urlItem, i) => (
            <UrlField
              key={i}
              url={urlItem.url || ''}
              profile={urlItem.profile || ''}
              onChange={(newItem) => updateItem('urls', i, newItem)}
              onRemove={() => removeItem('urls', i)}
              profiles={profileOptions}
              placeholder="https://github.com"
            />
          ))}
          <button
            onClick={() => addItem('urls')}
            style={{
              alignSelf: 'flex-start',
              padding: '6px 12px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-btn)',
              color: 'var(--text-secondary)',
              fontSize: 12,
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
          >
            + Add URL
          </button>
        </div>

        {/* Folders */}
        <ItemField
          label="Folders"
          type="folders"
          items={fields.folders}
          onAdd={() => addItem('folders')}
          onRemove={idx => removeItem('folders', idx)}
          onUpdate={(idx, val) => updateItem('folders', idx, val)}
          onBrowse={handleBrowseFolder}
          placeholder="C:\projects\myapp"
        />

        {/* Files */}
        <ItemField
          label="Files"
          type="files"
          items={fields.files}
          onAdd={() => addItem('files')}
          onRemove={idx => removeItem('files', idx)}
          onUpdate={(idx, val) => updateItem('files', idx, val)}
          onBrowse={handleBrowseFile}
          placeholder="C:\Documents\report.pdf"
        />

        {/* Validation errors */}
        {errors.length > 0 && (
          <div style={{
            padding: '10px 14px',
            background: 'var(--danger-dim)',
            border: '1px solid #FF5C5C35',
            borderRadius: 8,
          }}>
            {errors.map((err, i) => (
              <p key={i} style={{ fontSize: 12, color: 'var(--danger)', lineHeight: 1.6 }}>{err}</p>
            ))}
          </div>
        )}

        {/* Bottom padding so footer doesn't overlap last item */}
        <div style={{ height: 8 }} />
      </div>

      {/* ── Sticky footer ── */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', gap: 10,
        flexShrink: 0,
        background: 'var(--bg-surface)',
      }}>
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
        <PrimaryButton onClick={handleSubmit}>
          {initial ? 'Save Changes' : 'Save Workspace'}
        </PrimaryButton>
      </div>
    </div>
  )
}

// ── Small internal UI helpers ──────────────────────────────────────────────

function FieldLabel({ children }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600,
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
    }}>
      {children}
    </span>
  )
}

import { forwardRef } from 'react'
const NameInput = forwardRef(function NameInput({ value, onChange, onKeyDown, placeholder }, ref) {
  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
      onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
      style={{
        padding: '10px 14px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-input)',
        color: 'var(--text-primary)',
        fontSize: 14, fontWeight: 500,
        transition: 'border-color 150ms ease',
      }}
    />
  )
})

function GhostButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '10px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-btn)',
        color: 'var(--text-secondary)',
        fontSize: 13, fontWeight: 500,
        transition: 'var(--transition)',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-card)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
    >
      {children}
    </button>
  )
}

function PrimaryButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 2, padding: '10px',
        background: 'var(--accent)',
        borderRadius: 'var(--radius-btn)',
        color: '#0E0E10',
        fontSize: 13, fontWeight: 700,
        transition: 'var(--transition)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {children}
    </button>
  )
}
