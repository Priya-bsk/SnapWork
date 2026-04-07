# SnapWork

> Save your entire work setup. Restore it in one click.

SnapWork is a Windows desktop app built with Electron + React that lets you save and instantly restore complete work environments — apps, browser tabs, and folders — as named workspaces.

![SnapWork](https://img.shields.io/badge/platform-Windows-blue?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0.0--MVP-teal?style=flat-square&color=00C9A7)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Electron](https://img.shields.io/badge/Electron-29-47848F?style=flat-square&logo=electron)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)

---

## The Problem

Every time you switch projects, you spend 5–20 minutes reconstructing your environment — reopening tabs from memory, relaunching apps one by one, navigating back to folders. For people switching contexts 2–3 times a day, that's hours lost every week.

No existing tool solves this holistically. Browser bookmark folders are partial. Session managers handle only tabs. Nothing handles **apps + tabs + folders together in one click**.

SnapWork does.

---

## What It Does

Each workspace saves:

- **Applications** — with optional launch arguments (e.g. VS Code pointed at a specific project folder)
- **Browser URLs** — opens in your default browser
- **Folders** — opens in Windows Explorer

Hit **Launch** and everything opens simultaneously.

---

## Screenshots

```
┌─────────────────────────────────────────────────────┐
│  SnapWork        [search workspaces...]    [+ New]   │
├──────────┬──────────────────────────────────────────┤
│          │                                           │
│ All      │  ┌──────────────────┐ ┌────────────────┐ │
│ Recent   │  │ T  ThriveEd  ⋮  │ │ S  Study    ⋮  │ │
│ Dev      │  │                  │ │                │ │
│ Study    │  │ ● 3 apps         │ │ ● 5 URLs       │ │
│ Design   │  │ ● 5 URLs         │ │ ● 2 folders    │ │
│ Work     │  │ ● 2 folders      │ │                │ │
│          │  │ Last: 2h ago     │ │ Last: never    │ │
│          │  │ [ ▶  Launch  ]   │ │ [ ▶  Launch ]  │ │
│          │  └──────────────────┘ └────────────────┘ │
└──────────┴──────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | v18 or higher |
| npm | v9 or higher |
| Windows | 10 or 11 (x64) |

### Run in development

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/snapwork.git
cd snapwork

# 2. Install dependencies
npm install

# 3. Start the app
npm run dev
```

`npm run dev` boots Vite (the React dev server) and Electron simultaneously. The desktop window opens automatically after ~3 seconds.

### Build a Windows installer

```bash
npm run package
```

Produces a `.exe` installer in `dist-electron/`. Requires an icon at `assets/icon.ico` (256×256).

---

## Architecture

SnapWork runs in two isolated worlds connected by a secure bridge:

```
┌─────────────────────────────────────────┐
│  RENDERER  (React + Vite)               │
│  UI components, hooks, services         │
│  Sandboxed — no file system access      │
├─────────────────────────────────────────┤
│  BRIDGE  (main/preload.js)              │
│  contextBridge — the only crossing      │
├─────────────────────────────────────────┤
│  MAIN PROCESS  (Node.js + Electron)     │
│  File I/O, process spawning, OS calls   │
└─────────────────────────────────────────┘
```

### Project structure

```
snapwork/
├── main/
│   ├── index.js                  # Window creation, app lifecycle
│   ├── preload.js                # contextBridge — exposes electronAPI
│   └── ipc/
│       ├── workspaceHandlers.js  # CRUD: getAll, create, update, delete, duplicate
│       ├── launcherHandlers.js   # Launch execution — URLs, apps, folders
│       └── dialogHandlers.js     # Native file/folder picker dialogs
├── core/
│   ├── storage.js                # Atomic JSON read/write to workspaces.json
│   ├── launcher.js               # OS shell: openExternal, spawn, openPath
│   ├── validator.js              # Pure validation functions
│   ├── workspace.js              # Object factory + schema constants
│   └── logger.js                 # Dev/prod toggleable logger
├── src/
│   ├── services/
│   │   ├── workspaceService.js   # Wraps window.electronAPI.workspace.*
│   │   └── launcherService.js    # Wraps window.electronAPI.launcher.*
│   ├── hooks/
│   │   ├── useWorkspaces.js      # Workspace list state + CRUD actions
│   │   └── useLaunch.js          # Launch state, log, loading flag
│   ├── components/
│   │   ├── Titlebar/             # Custom frameless window chrome
│   │   ├── Sidebar/              # Left nav with filter categories
│   │   ├── WorkspaceList/        # Responsive card grid
│   │   ├── WorkspaceForm/        # Slide-in create/edit panel
│   │   ├── LaunchLog/            # Results modal
│   │   └── common/               # EmptyState, shared primitives
│   └── styles/
│       ├── tokens.css            # All CSS variables (colors, radii, shadows)
│       ├── animations.css        # Keyframes and transition classes
│       └── global.css            # Reset and base styles
├── index.html
├── vite.config.js
├── package.json
└── electron-builder.yml
```

### Layer rules

| Layer | Rule |
|---|---|
| `core/` | Zero knowledge of IPC, UI, or Electron APIs. Pure Node.js logic. |
| `main/ipc/` | One file per domain. Each exports `register(ipcMain)`. Never touches UI. |
| `main/preload.js` | Only exposes named methods via `contextBridge`. Raw `ipcRenderer` never exposed. |
| `src/services/` | The **only** files that call `window.electronAPI`. Everything else imports from here. |
| `src/hooks/` | Manage React state. Call services only. No JSX, no IPC. |
| `src/components/` | Zero business logic. Props in, callbacks out. |

---

## Data Model

All data is stored locally — no database, no cloud, no backend.

**Location:** `C:\Users\<You>\AppData\Roaming\SnapWork\workspaces.json`

```json
{
  "id": "uuid-v4",
  "name": "ThriveEd Backend",
  "color": "#00C9A7",
  "apps": [
    {
      "name": "VS Code",
      "path": "C:\\Program Files\\Microsoft VS Code\\Code.exe",
      "args": ["C:\\projects\\thriveed\\backend"]
    }
  ],
  "urls": [
    "https://github.com/user/thriveed",
    "https://stackoverflow.com"
  ],
  "folders": [
    "C:\\projects\\thriveed\\backend"
  ],
  "createdAt": "2025-03-28T10:00:00.000Z",
  "updatedAt": "2025-03-28T10:00:00.000Z",
  "lastLaunched": null
}
```

Writes are **atomic** — data is written to a `.tmp` file first, then renamed, so a crash never corrupts your workspaces.

---

## How Chrome Tabs Work

SnapWork stores URLs as plain strings and opens them via `shell.openExternal()`, which hands the URL to your default browser. This means:

| ✅ What's saved | ❌ What's not saved |
|---|---|
| The URL | Scroll position |
| Opens fresh on launch | Form data |
| Works with any browser | Video timestamps |
| No extension needed | Tab groups or pinned state |

**Tip:** For pages where position matters (YouTube, long docs), copy the URL at the exact moment you want to resume — many apps embed state in the URL itself (e.g. `?t=2852` for YouTube timestamps).

---

## Adding a New IPC Channel

Four files to touch, in this order:

**1.** `main/ipc/yourDomainHandlers.js` — add the handler
```js
ipcMain.handle('domain:action', async (_event, payload) => {
  try {
    // do work
    return { success: true, data: result }
  } catch (err) {
    return { success: false, error: err.message }
  }
})
```

**2.** `main/index.js` — register it
```js
const yourHandlers = require('./ipc/yourDomainHandlers')
yourHandlers.register(ipcMain)
```

**3.** `main/preload.js` — expose it
```js
yourDomain: {
  action: (payload) => ipcRenderer.invoke('domain:action', payload)
}
```

**4.** `src/services/yourDomainService.js` — wrap it
```js
async function action(payload) {
  const res = await window.electronAPI.yourDomain.action(payload)
  if (!res.success) throw new Error(res.error)
  return res.data
}
export const yourDomainService = { action }
```

---

## The Critical Security Setting

```js
// main/index.js
new BrowserWindow({
  webPreferences: {
    contextIsolation: true,  // ← NEVER disable this
    nodeIntegration: false,  // ← NEVER enable this
    preload: path.join(__dirname, 'preload.js'),
  }
})
```

Without `contextIsolation: true`, `contextBridge` silently does nothing and `window.electronAPI` will be `undefined` in the renderer. This is the #1 mistake Electron developers make.

---

## Design System

Dark-mode-first. All values are CSS variables in `src/styles/tokens.css` — no hardcoded hex in components.

| Token | Value | Used for |
|---|---|---|
| `--bg-base` | `#0E0E10` | App background |
| `--bg-surface` | `#1A1A1F` | Cards, panels |
| `--bg-elevated` | `#22222A` | Inputs, dropdowns |
| `--accent` | `#00C9A7` | Primary actions |
| `--danger` | `#FF5C5C` | Delete, errors |
| `--text-primary` | `#F0F0F5` | Main text |
| `--text-secondary` | `#8888A0` | Labels, captions |

Icons: [lucide-react](https://lucide.dev). Font: Inter.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `npm is not recognized` | Install Node.js from nodejs.org, restart terminal |
| Blank white window | Wait 5 seconds, press `Ctrl+R` in the Electron window |
| `Cannot find module 'electron'` | Run `npm install` again |
| Port 5173 in use | Change port in `vite.config.js` and `main/index.js` |
| `window.electronAPI` is undefined | Check `contextIsolation: true` and preload path in `main/index.js` |
| App launches but crashes on open | Path to executable is wrong — use the browse button to select it |

---

## Roadmap

| Phase | What's coming |
|---|---|
| **Phase 2 — Capture** | Auto-detect open apps and tabs to snapshot your current session in one click |
| **Phase 3 — Switching** | Optionally close all current apps before opening the next workspace |
| **Phase 4 — Sync** | Cloud backup, cross-device access, team workspace sharing |
| **Phase 5 — Intelligence** | AI workspace suggestions based on calendar, time of day, recent activity |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | Electron 29 |
| UI | React 18 |
| Build tool | Vite 5 |
| Packaging | electron-builder |
| Icons | lucide-react |
| IDs | uuid v4 |
| Storage | Local JSON file |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow the architecture rules in the table above — one responsibility per file
4. Test your IPC channel with the 4-touch-point pattern
5. Open a pull request

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with Electron + React &nbsp;·&nbsp; No cloud &nbsp;·&nbsp; No backend &nbsp;·&nbsp; Just your work, restored.
</p>
