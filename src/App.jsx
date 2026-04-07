// App.jsx — view router only. Manages view state, passes hook actions as props. Zero business logic.
import { useState } from 'react'
import { useWorkspaces } from './hooks/useWorkspaces'
import { useLaunch } from './hooks/useLaunch'
import Titlebar from './components/Titlebar/Titlebar'
import Sidebar from './components/Sidebar/Sidebar'
import WorkspaceList from './components/WorkspaceList/WorkspaceList'
import WorkspaceForm from './components/WorkspaceForm/WorkspaceForm'
import LaunchLog from './components/LaunchLog/LaunchLog'

export default function App() {
  const [view, setView] = useState('list')        // 'list' | 'form'
  const [editTarget, setEditTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')  // 'all' | 'dev' | 'study' | 'design' | 'work'

  const { workspaces, loading, add, edit, remove, duplicate } = useWorkspaces()
  const { launchingId, log, showLog, launch, dismissLog } = useLaunch()

  function handleNew() {
    setEditTarget(null)
    setView('form')
  }

  function handleEdit(ws) {
    setEditTarget(ws)
    setView('form')
  }

  function handleCancel() {
    setView('list')
    setEditTarget(null)
  }

  async function handleSave(fields) {
    if (editTarget) {
      await edit(editTarget.id, fields)
    } else {
      await add(fields)
    }
    setView('list')
    setEditTarget(null)
  }

  // Filter by category first, then by search
  const filtered = workspaces
    .filter(ws => activeCategory === 'all' || ws.category === activeCategory)
    .filter(ws => ws.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Titlebar
        search={search}
        onSearch={setSearch}
        onNew={handleNew}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          active={activeCategory}
          onFilter={setActiveCategory}
          workspaces={workspaces}
        />

        <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <WorkspaceList
            workspaces={filtered}
            loading={loading}
            launchingId={launchingId}
            onLaunch={launch}
            onEdit={handleEdit}
            onDuplicate={duplicate}
            onDelete={remove}
            onNew={handleNew}
          />

          {/* Slide-in form panel with overlay */}
          {view === 'form' && (
            <>
              <div
                onClick={handleCancel}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  zIndex: 10,
                  animation: 'fadeIn 200ms ease both',
                }}
              />
              <WorkspaceForm
                initial={editTarget}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </>
          )}
        </main>
      </div>

      {/* Launch log modal */}
      {showLog && (
        <LaunchLog log={log} onDismiss={dismissLog} />
      )}
    </div>
  )
}
