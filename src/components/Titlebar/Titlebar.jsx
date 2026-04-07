// Titlebar.jsx — custom frameless window chrome with drag region, search bar, and window controls
import { useState } from 'react'
import { Search, Plus, Minus, Square, X } from 'lucide-react'

/**
 * Custom titlebar for the frameless Electron window.
 * @param {{ search: string, onSearch: Function, onNew: Function }} props
 */
export default function Titlebar({ search, onSearch, onNew }) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [newPulsed] = useState(true)

  const minimize = () => window.electronAPI?.titlebar.minimize()
  const maximize = () => window.electronAPI?.titlebar.maximize()
  const close    = () => window.electronAPI?.titlebar.close()

  return (
    <div
      style={{
        height: 52,
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px 0 20px',
        gap: 12,
        WebkitAppRegion: 'drag',
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      {/* Logo / App name */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        WebkitAppRegion: 'drag', flexShrink: 0,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: 'var(--accent)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="1" width="4" height="4" rx="1" fill="#0E0E10" />
            <rect x="7" y="1" width="4" height="4" rx="1" fill="#0E0E10" />
            <rect x="1" y="7" width="4" height="4" rx="1" fill="#0E0E10" />
            <rect x="7" y="7" width="4" height="4" rx="1" fill="#0E0E10" opacity="0.4" />
          </svg>
        </div>
        <span style={{
          fontWeight: 700, fontSize: 14,
          color: 'var(--text-primary)',
          letterSpacing: '-0.3px',
        }}>
          Snap<span style={{ color: 'var(--accent)' }}>Work</span>
        </span>
      </div>

      {/* Search bar — centred, no-drag region */}
      <div style={{
        flex: 1, display: 'flex', justifyContent: 'center',
        WebkitAppRegion: 'no-drag',
      }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Search
            size={13}
            style={{
              position: 'absolute', left: 11, top: '50%',
              transform: 'translateY(-50%)',
              color: searchFocused ? 'var(--accent)' : 'var(--text-muted)',
              pointerEvents: 'none',
              transition: 'var(--transition)',
            }}
          />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search workspaces…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 32px',
              background: 'var(--bg-elevated)',
              border: `1px solid ${searchFocused ? 'var(--border-focus)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-input)',
              color: 'var(--text-primary)',
              fontSize: 13,
              transition: 'var(--transition)',
            }}
          />
        </div>
      </div>

      {/* Actions — no-drag region */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        WebkitAppRegion: 'no-drag', flexShrink: 0,
      }}>
        <NewButton onClick={onNew} pulse={newPulsed} />

        <div style={{ width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 2px' }} />

        <WinBtn onClick={minimize} title="Minimize"><Minus size={12} /></WinBtn>
        <WinBtn onClick={maximize} title="Maximize"><Square size={11} /></WinBtn>
        <WinBtn onClick={close} title="Close" danger><X size={12} /></WinBtn>
      </div>
    </div>
  )
}

function NewButton({ onClick, pulse }) {
  const [hov, setHov] = useState(false)
  const [active, setActive] = useState(false)
  return (
    <button
      onClick={onClick}
      className={pulse ? 'animate-pulse-glow' : ''}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setActive(false) }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '6px 13px',
        background: hov ? 'var(--accent-hover)' : 'var(--accent)',
        color: '#0E0E10',
        borderRadius: 'var(--radius-btn)',
        fontSize: 13, fontWeight: 600,
        transform: active ? 'scale(0.96)' : 'scale(1)',
        transition: 'var(--transition)',
      }}
    >
      <Plus size={13} strokeWidth={2.5} />
      New
    </button>
  )
}

function WinBtn({ onClick, title, danger, children }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 28, height: 28, borderRadius: 6,
        background: hov ? (danger ? 'var(--danger)' : '#FFFFFF14') : 'transparent',
        color: hov ? '#fff' : 'var(--text-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'var(--transition)',
      }}
    >
      {children}
    </button>
  )
}
