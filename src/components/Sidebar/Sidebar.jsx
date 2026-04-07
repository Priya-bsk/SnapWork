// Sidebar.jsx — left navigation with category filters.
import { useState } from 'react'
import {
  Layers, Code2, BookOpen, Palette, Briefcase, Settings, ChevronRight,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'all',    label: 'All Workspaces', icon: Layers },
  null, // divider
  { id: 'dev',    label: 'Dev',            icon: Code2 },
  { id: 'study',  label: 'Study',          icon: BookOpen },
  { id: 'design', label: 'Design',         icon: Palette },
  { id: 'work',   label: 'Work',           icon: Briefcase },
]

/**
 * @param {{ active: string, onFilter: Function, workspaces: Array }} props
 */
export default function Sidebar({ active, onFilter, workspaces }) {
  return (
    <aside style={{
      width: 220,
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Workspace count badge */}
      <div style={{
        padding: '14px 16px 10px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Workspaces
        </span>
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
            {workspaces.length}
          </span>
          <span style={{
            fontSize: 11, color: 'var(--accent)',
            background: 'var(--accent-subtle)',
            padding: '2px 8px', borderRadius: 'var(--radius-pill)',
            fontWeight: 600,
          }}>saved</span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map((item, i) => {
          if (item === null) return (
            <div key={`div-${i}`} style={{ height: 1, background: 'var(--border-subtle)', margin: '6px 0' }} />
          )
          return <NavItem key={item.id} item={item} active={active === item.id} onClick={() => onFilter(item.id)} />
        })}
      </nav>
    </aside>
  )
}

function NavItem({ item, active, onClick, muted }) {
  const [hov, setHov] = useState(false)
  const Icon = item.icon

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '8px 16px',
        background: active ? 'var(--accent-subtle)' : hov ? '#FFFFFF08' : 'transparent',
        borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
        color: active
          ? 'var(--accent)'
          : muted
          ? 'var(--text-muted)'
          : hov ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        textAlign: 'left',
        transition: 'var(--transition)',
      }}
    >
      <Icon size={14} strokeWidth={active ? 2.5 : 2} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.label}
      </span>
      {active && <ChevronRight size={12} style={{ flexShrink: 0, opacity: 0.5 }} />}
    </button>
  )
}
