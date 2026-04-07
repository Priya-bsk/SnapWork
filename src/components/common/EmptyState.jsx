// EmptyState.jsx — shown when there are no workspaces yet
import { useState } from 'react'
import { FolderOpen, Plus, Zap } from 'lucide-react'

/**
 * @param {{ onNew: Function }} props
 */
export default function EmptyState({ onNew }) {
  const [hov, setHov] = useState(false)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', padding: 48, gap: 20,
    }}>
      {/* Icon circle */}
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'var(--accent-subtle)',
        border: '1.5px solid var(--accent-dim)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <FolderOpen size={34} color="var(--accent)" />
        <div style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 22, height: 22, borderRadius: '50%',
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid var(--bg-base)',
        }}>
          <Zap size={11} color="#0E0E10" fill="#0E0E10" />
        </div>
      </div>

      {/* Copy */}
      <div style={{ textAlign: 'center', maxWidth: 340 }}>
        <h2 style={{
          fontSize: 18, fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 8,
        }}>
          No workspaces yet
        </h2>
        <p style={{
          fontSize: 14, color: 'var(--text-secondary)',
          lineHeight: 1.65,
        }}>
          Create your first workspace to save your entire work setup and launch it in one click.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onNew}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '11px 22px',
          background: hov ? 'var(--accent-hover)' : 'var(--accent)',
          borderRadius: 'var(--radius-btn)',
          color: '#0E0E10',
          fontSize: 14, fontWeight: 700,
          transition: 'var(--transition)',
          marginTop: 4,
        }}
      >
        <Plus size={15} strokeWidth={2.5} /> Create Workspace
      </button>

      {/* Sub-hint */}
      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        Save apps, URLs, and folders all in one place
      </p>
    </div>
  )
}
