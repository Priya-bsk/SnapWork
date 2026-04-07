// ItemField.jsx — reusable row for adding/removing/editing a list of items (apps, URLs, folders)
import { useState } from 'react'
import { X, FolderOpen } from 'lucide-react'


/**
 * @param {{
 *   label: string,
 *   type: 'apps'|'urls'|'folders'|'files',
 *   items: Array,
 *   onAdd: Function,
 *   onRemove: Function,
 *   onUpdate: Function,
 *   onBrowse?: Function,
 *   placeholder?: string
 * }} props
 */
export default function ItemField({ label, type, items, onAdd, onRemove, onUpdate, onBrowse, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Section label */}
      <span style={{
        fontSize: 11, fontWeight: 600,
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
      }}>
        {label}
      </span>

      {/* Existing item rows */}
      {items.map((item, idx) => (
        <ItemRow
          key={idx}
          type={type}
          item={item}
          idx={idx}
          onRemove={onRemove}
          onUpdate={onUpdate}
          onBrowse={onBrowse}
          placeholder={placeholder}
        />
      ))}

      {/* Add new row */}
      <AddRow label={label} onAdd={onAdd} />
    </div>
  )
}

function ItemRow({ type, item, idx, onRemove, onUpdate, onBrowse, placeholder }) {
  const [pathFocused, setPathFocused] = useState(false)
  const [nameFocused, setNameFocused] = useState(false)

  const isEmpty = (str) => !str || !str.toString().trim()

  if (type === 'apps') {
    const isInvalid = item.path && !/\.(exe|bat|cmd)$/i.test(item.path)
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* App display name */}
          <input
            value={item.name || ''}
            placeholder="App name"
            onChange={e => onUpdate(idx, { ...item, name: e.target.value })}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            style={{
              ...inputBase,
              border: `1px solid ${nameFocused ? 'var(--border-focus)' : 'var(--border-subtle)'}`,
              flex: '0 0 140px',
            }}
          />
          {/* Exe path with validation */}
          <input
            value={item.path || ''}
            placeholder="C:\path\to\app.exe"
            onChange={e => onUpdate(idx, { ...item, path: e.target.value })}
            onFocus={() => setPathFocused(true)}
            onBlur={() => setPathFocused(false)}
            style={{
              ...inputBase,
              border: `1px solid ${pathFocused ? 'var(--border-focus)' : isEmpty(item.path) ? 'var(--border-subtle)' : isInvalid ? '#FF5C5C' : 'var(--border-subtle)'}`,
              flex: 1,
              backgroundColor: isInvalid ? '#FF5C5C15' : 'var(--bg-elevated)',
            }}
          />
          {onBrowse && <IconBtn title="Browse for .exe" onClick={() => onBrowse(idx)}><FolderOpen size={13} /></IconBtn>}
          <IconBtn title="Remove" onClick={() => onRemove(idx)} danger><X size={13} /></IconBtn>
        </div>
        {isInvalid && (
          <span style={{ fontSize: 11, color: 'var(--danger)', marginLeft: 6 }}>
            Must end with .exe, .bat, or .cmd
          </span>
        )}
      </div>
    )
  }

  // URLs, Folders, Files
  const isEmpty_item = isEmpty(item)
  let isInvalid = false
  let errorMsg = ''

  if (type === 'urls' && item) {
    const isValidUrl = item.startsWith('http://') || item.startsWith('https://')
    isInvalid = !isValidUrl
    errorMsg = 'URL must start with http:// or https://'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input
          value={item || ''}
          placeholder={placeholder || `Add ${label}`}
          onChange={e => onUpdate(idx, e.target.value)}
          onFocus={() => setPathFocused(true)}
          onBlur={() => setPathFocused(false)}
          style={{
            ...inputBase,
            flex: 1,
            border: `1px solid ${pathFocused ? 'var(--border-focus)' : isEmpty_item ? 'var(--border-subtle)' : isInvalid ? '#FF5C5C' : 'var(--border-subtle)'}`,
            backgroundColor: isInvalid ? '#FF5C5C15' : 'var(--bg-elevated)',
          }}
        />
        {onBrowse && <IconBtn title="Browse" onClick={() => onBrowse(idx)}><FolderOpen size={13} /></IconBtn>}
        <IconBtn title="Remove" onClick={() => onRemove(idx)} danger><X size={13} /></IconBtn>
      </div>
      {isInvalid && (
        <span style={{ fontSize: 11, color: 'var(--danger)', marginLeft: 6 }}>
          {errorMsg}
        </span>
      )}
    </div>
  )
}

function AddRow({ label, onAdd }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onAdd}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '9px 14px',
        background: hov ? '#FFFFFF07' : 'transparent',
        border: '1px dashed #FFFFFF1E',
        borderRadius: 'var(--radius-input)',
        color: hov ? 'var(--text-secondary)' : 'var(--text-muted)',
        fontSize: 13,
        textAlign: 'left',
        transition: 'var(--transition)',
      }}
    >
      + Add {label.toLowerCase()}
    </button>
  )
}

function IconBtn({ title, onClick, danger, children }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 34, height: 34, borderRadius: 7,
        background: hov ? (danger ? 'var(--danger-dim)' : 'var(--bg-base)') : 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hov && danger ? 'var(--danger)' : 'var(--text-secondary)',
        flexShrink: 0,
        transition: 'var(--transition)',
      }}
    >
      {children}
    </button>
  )
}

const inputBase = {
  padding: '8px 12px',
  background: 'var(--bg-elevated)',
  borderRadius: 'var(--radius-input)',
  color: 'var(--text-primary)',
  fontSize: 13,
  transition: 'border-color 150ms ease',
  minWidth: 0,
}
