// LaunchLog.jsx — centered modal overlay showing per-item launch results
import { useEffect } from 'react'
import { X } from 'lucide-react'
import LaunchLogItem from './LaunchLogItem'

/**
 * @param {{
 *   log: Array<{success: boolean, type: string, item: string, reason?: string}>,
 *   onDismiss: Function
 * }} props
 */
export default function LaunchLog({ log, onDismiss }) {
  const succeeded = log.filter(i => i.success).length
  const failed    = log.length - succeeded

  // Escape key dismisses
  useEffect(() => {
    function handler(e) { if (e.key === 'Escape') onDismiss() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onDismiss])

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed', inset: 0,
        background: 'var(--overlay)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={e => { if (e.target === e.currentTarget) onDismiss() }}
    >
      <div
        className="animate-scale-in"
        style={{
          width: 480,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-modal)',
          boxShadow: 'var(--shadow-modal)',
          border: '1px solid var(--border-card)',
          overflow: 'hidden',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
              Launch Results
            </span>
            <span style={{
              marginLeft: 10, fontSize: 12,
              color: succeeded === log.length ? 'var(--accent)' : 'var(--text-muted)',
            }}>
              {succeeded}/{log.length} succeeded
            </span>
          </div>
          <CloseBtn onClick={onDismiss} />
        </div>

        {/* ── Items list ── */}
        <div style={{
          padding: '0 20px',
          maxHeight: 340,
          overflowY: 'auto',
        }}>
          {log.length === 0 && (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No items were launched.
            </div>
          )}
          {log.map((item, i) => (
            <LaunchLogItem key={i} item={item} />
          ))}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {log.length} item{log.length !== 1 ? 's' : ''}
            &nbsp;·&nbsp;
            <span style={{ color: 'var(--accent)' }}>{succeeded} succeeded</span>
            {failed > 0 && (
              <>&nbsp;·&nbsp;<span style={{ color: 'var(--danger)' }}>{failed} failed</span></>
            )}
          </span>
          <DoneBtn onClick={onDismiss} />
        </div>
      </div>
    </div>
  )
}

function CloseBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 28, height: 28, borderRadius: 6,
        background: 'transparent',
        color: 'var(--text-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'var(--transition)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
    >
      <X size={14} />
    </button>
  )
}

function DoneBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 24px',
        background: 'var(--accent)',
        borderRadius: 'var(--radius-btn)',
        color: '#0E0E10',
        fontSize: 13, fontWeight: 700,
        transition: 'var(--transition)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      Done
    </button>
  )
}
