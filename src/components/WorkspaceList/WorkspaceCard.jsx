// WorkspaceCard.jsx — single workspace card with hover lift, kebab menu, and launch button
import { useState, useRef, useEffect } from 'react'
import { Play, MoreVertical, Edit2, Copy, Trash2, Loader2, Globe, AppWindow, Folder, FileText } from 'lucide-react'

/**
 * Formats an ISO timestamp to a human-readable relative string.
 * @param {string|null} iso
 * @returns {string}
 */
function timeAgo(iso) {
  if (!iso) return 'Never launched'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

/**
 * @param {{
 *   workspace: Object,
 *   isLaunching: boolean,
 *   onLaunch: Function,
 *   onEdit: Function,
 *   onDuplicate: Function,
 *   onDelete: Function
 * }} props
 */
export default function WorkspaceCard({
  workspace, isLaunching, onLaunch, onEdit, onDuplicate, onDelete,
}) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const menuRef = useRef(null)

  const initial = (workspace.name || '?')[0].toUpperCase()
  const color = workspace.color || '#00C9A7'

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    function handler(e) {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  function handleDelete() {
    setDeleting(true)
    setTimeout(() => onDelete(), 250)
  }

  const appCount    = workspace.apps?.length    || 0
  const urlCount    = workspace.urls?.length    || 0
  const folderCount = workspace.folders?.length || 0
  const fileCount   = workspace.files?.length   || 0
  const totalItems  = appCount + urlCount + folderCount + fileCount

  return (
    <div
      className={deleting ? 'card-deleting' : ''}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${hovered ? color + '55' : 'var(--border-card)'}`,
        borderRadius: 'var(--radius-card)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 8px 24px rgba(0,0,0,0.55), 0 0 0 1px ${color}20`
          : 'var(--shadow-card)',
        transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
        position: 'relative',
        cursor: 'default',
      }}
    >
      {/* ── Header row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Color initial avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: color + '22',
          border: `1.5px solid ${color}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 700, color,
          flexShrink: 0,
          letterSpacing: '-0.5px',
        }}>
          {initial}
        </div>

        <span style={{
          flex: 1,
          fontWeight: 600, fontSize: 14,
          color: 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {workspace.name}
        </span>

        {/* Kebab menu — only visible on hover */}
        <div
          ref={menuRef}
          style={{
            position: 'relative',
            opacity: hovered || menuOpen ? 1 : 0,
            transition: 'opacity 150ms ease',
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o) }}
            style={{
              width: 28, height: 28, borderRadius: 6,
              background: menuOpen ? 'var(--bg-elevated)' : 'transparent',
              color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
            onMouseLeave={e => { if (!menuOpen) e.currentTarget.style.background = 'transparent' }}
          >
            <MoreVertical size={14} />
          </button>

          {menuOpen && (
            <div
              className="animate-scale-in"
              style={{
                position: 'absolute', top: 'calc(100% + 4px)', right: 0,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-card)',
                borderRadius: 10,
                boxShadow: 'var(--shadow-modal)',
                zIndex: 30, minWidth: 148, overflow: 'hidden',
              }}
            >
              {[
                { label: 'Edit',      icon: Edit2,  color: 'var(--text-primary)', action: () => { setMenuOpen(false); onEdit() } },
                { label: 'Duplicate', icon: Copy,   color: 'var(--text-primary)', action: () => { setMenuOpen(false); onDuplicate() } },
                { label: 'Delete',    icon: Trash2, color: 'var(--danger)',       action: () => { setMenuOpen(false); handleDelete() } },
              ].map(({ label, icon: Icon, color: c, action }) => (
                <button
                  key={label}
                  onClick={action}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                    padding: '9px 14px', background: 'transparent',
                    color: c, fontSize: 13, transition: 'var(--transition)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FFFFFF08'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Item count pills ── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {appCount > 0 && (
          <Pill icon={AppWindow} label={`${appCount} app${appCount !== 1 ? 's' : ''}`} />
        )}
        {urlCount > 0 && (
          <Pill icon={Globe} label={`${urlCount} URL${urlCount !== 1 ? 's' : ''}`} />
        )}
        {folderCount > 0 && (
          <Pill icon={Folder} label={`${folderCount} folder${folderCount !== 1 ? 's' : ''}`} />
        )}
        {fileCount > 0 && (
          <Pill icon={FileText} label={`${fileCount} file${fileCount !== 1 ? 's' : ''}`} />
        )}
        {totalItems === 0 && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>No items</span>
        )}
      </div>

      {/* ── Last launched ── */}
      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: -4 }}>
        Last launched: {timeAgo(workspace.lastLaunched)}
      </span>

      {/* ── Launch button ── */}
      <LaunchButton
        color={color}
        isLaunching={isLaunching}
        onClick={onLaunch}
      />
    </div>
  )
}

function Pill({ icon: Icon, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px',
      background: '#FFFFFF09',
      borderRadius: 'var(--radius-pill)',
      fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500,
    }}>
      <Icon size={10} /> {label}
    </span>
  )
}

function LaunchButton({ color, isLaunching, onClick }) {
  const [hov, setHov] = useState(false)
  const [active, setActive] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={isLaunching}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setActive(false) }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        width: '100%',
        padding: '10px',
        background: isLaunching
          ? color + '55'
          : hov ? color + 'EE' : color,
        color: '#0E0E10',
        borderRadius: 'var(--radius-btn)',
        fontSize: 13, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        transform: active ? 'scale(0.98)' : 'scale(1)',
        transition: 'var(--transition)',
        cursor: isLaunching ? 'not-allowed' : 'pointer',
        letterSpacing: '0.01em',
      }}
    >
      {isLaunching
        ? <><Loader2 size={14} className="animate-spin" /> Launching…</>
        : <><Play size={13} fill="currentColor" strokeWidth={0} /> Launch</>
      }
    </button>
  )
}
