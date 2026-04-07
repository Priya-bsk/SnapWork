// WorkspaceList.jsx — renders the workspace grid. Receives everything via props. Zero business logic.
import WorkspaceCard from './WorkspaceCard'
import EmptyState from '../common/EmptyState'

/**
 * @param {{
 *   workspaces: Array,
 *   loading: boolean,
 *   launchingId: string|null,
 *   onLaunch: Function,
 *   onEdit: Function,
 *   onDuplicate: Function,
 *   onDelete: Function,
 *   onNew: Function
 * }} props
 */
export default function WorkspaceList({
  workspaces, loading, launchingId,
  onLaunch, onEdit, onDuplicate, onDelete, onNew,
}) {
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', flexDirection: 'column', gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '2px solid var(--border-subtle)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 700ms linear infinite',
        }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading workspaces…</span>
      </div>
    )
  }

  if (workspaces.length === 0) {
    return <EmptyState onNew={onNew} />
  }

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      padding: 24,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 16,
      alignContent: 'start',
    }}>
      {workspaces.map(ws => (
        <WorkspaceCard
          key={ws.id}
          workspace={ws}
          isLaunching={launchingId === ws.id}
          onLaunch={() => onLaunch(ws.id)}
          onEdit={() => onEdit(ws)}
          onDuplicate={() => onDuplicate(ws.id)}
          onDelete={() => onDelete(ws.id)}
        />
      ))}
    </div>
  )
}
