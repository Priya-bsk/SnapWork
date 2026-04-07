// LaunchLogItem.jsx — single row in the launch result log modal
import { CheckCircle2, XCircle, Globe, AppWindow, Folder } from 'lucide-react'

const TYPE_ICON = {
  url:    Globe,
  app:    AppWindow,
  folder: Folder,
  error:  XCircle,
}

/**
 * @param {{
 *   item: {
 *     success: boolean,
 *     type: string,
 *     item: string,
 *     reason?: string
 *   }
 * }} props
 */
export default function LaunchLogItem({ item }) {
  const TypeIcon = TYPE_ICON[item.type] || AppWindow

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '10px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* Status icon */}
      {item.success
        ? <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
        : <XCircle      size={16} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />
      }

      {/* Item text + reason */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontSize: 13, color: 'var(--text-primary)', fontWeight: 500,
          display: 'block',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.item}
        </span>
        {item.reason && (
          <span style={{
            fontSize: 11, color: 'var(--text-muted)',
            display: 'block', marginTop: 2, lineHeight: 1.5,
          }}>
            {item.reason}
          </span>
        )}
      </div>

      {/* Type badge */}
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: 11, color: 'var(--text-muted)',
        background: 'var(--bg-elevated)',
        padding: '2px 8px', borderRadius: 'var(--radius-pill)',
        flexShrink: 0,
      }}>
        <TypeIcon size={10} /> {item.type}
      </span>
    </div>
  )
}
