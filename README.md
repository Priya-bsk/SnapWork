# ⚡ SnapWork ⚡

> Save your entire work setup. Restore it in one click.

SnapWork is a Windows desktop app built with Electron + React that lets you save and instantly restore complete work environments as named workspaces.

Each workspace can include apps, browser URLs, folders, and files.

![SnapWork](https://img.shields.io/badge/platform-Windows-blue?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0.0--MVP-teal?style=flat-square&color=00C9A7)
![Electron](https://img.shields.io/badge/Electron-29-47848F?style=flat-square&logo=electron)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)

------

## 📌 Table of Contents

- [The Problem](#the-problem)
- [Features](#-features)
- [UI Preview](#-screenshots)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Data Model](#-data-model)
- [URL Launching](#-how-url-launching-works)
- [Adding IPC Channel](#-adding-a-new-ipc-channel)
- [Security](#-security-baseline)
- [Design System](#-design-system)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Tech Stack](#-tech-stack)

---

## The Problem

Switching projects shouldn’t feel like starting from scratch.

Yet every time you switch, you end up:
- Reopening tabs from memory
- Restarting your IDE and terminals
- Relaunching apps one by one
- Digging through folders to find the right files  

That’s **5–20 minutes lost per switch** — turning into **hours every week** and constantly breaking your flow.

Most tools solve only one slice:

- Bookmark folders save links, not apps and files
- Session managers restore tabs, not dev tools and folders
- OS startup tools launch apps, not project-specific tab sets

SnapWork solves the full context-switch loop: apps + URLs + folders + files in one launch flow.
SnapWork eliminates setup time by restoring your full workspace instantly.

## ⚡ The Solution
SnapWork brings everything together.
Launch your full workspace — **apps, browser tabs, folders, and files** — in one click.
Exactly how you left them.

No repetition. No context rebuilding.  
Just switch projects and **keep your momentum going**.

---

## What It Does

Each workspace saves:

- **Applications** — with optional launch arguments (e.g. VS Code pointed at a specific project folder)
- **Browser URLs** — opens in your default browser
- **Folders** — opens in Windows Explorer
- **Files** — opne your files

Hit **Launch** and everything opens simultaneously.

---
## ✨ Features

SnapWork currently supports:

- **Workspace CRUD**: create, edit, duplicate, delete
- **Category system**: `dev`, `study`, `design`, `work` + `all`
- **Search**: filter workspaces by name
- **Launch orchestration**: launch all items in a workspace from one button
- **Launch result log**: per-item success/failure in a modal
- **Chrome profile support** for URLs:
  - Detects local Chrome profiles
  - Lets you bind a URL to a profile
  - Falls back to default browser if profile launch is unavailable
- **Native pickers**:
  - File picker for app executable and file paths
  - Folder picker for folder paths
- **Local persistence**:
  - Stores workspaces in local JSON
  - Uses atomic writes to reduce corruption risk

---

## Screenshots
<img width="1178" height="600" alt="img1" src="https://github.com/user-attachments/assets/aad71030-db2e-40a4-9aa7-36117b52d885" />
<img width="796" height="661" alt="img2" src="https://github.com/user-attachments/assets/02ad58bf-c216-41d0-b491-e4d39f218ac3" />
<img width="528" height="681" alt="img3" src="https://github.com/user-attachments/assets/baf40a12-b4ea-419a-a6f0-e6fae1b37f86" />
<img width="476" height="787" alt="img4" src="https://github.com/user-attachments/assets/b47d2d53-48f7-4ccc-aff1-819fb617c28c" />
<img width="770" height="387" alt="img5" src="https://github.com/user-attachments/assets/1c318593-2510-4c52-aa3a-222f3ce99ead" />
<img width="1007" height="632" alt="img6" src="https://github.com/user-attachments/assets/735cc7b4-bfec-4163-bf72-6ac01b5ca237" />
<img width="912" height="349" alt="img7" src="https://github.com/user-attachments/assets/fa22edba-9613-4527-9177-7b41bd2f0434" />

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
# 1) Clone the repo
git clone https://github.com/yourusername/snapwork.git
cd snapwork

# 2) Install dependencies
npm install

# 3) Start app (Vite + Electron)
npm run dev
```

`npm run dev` starts Vite on port `5173`, waits for it to be ready, then starts Electron.

### Build a Windows installer

```bash
npm run package
```

Build output is created in `dist-electron/`.

---

## Architecture

SnapWork runs in isolated layers connected through a secure preload bridge.

```text
┌─────────────────────────────────────────┐
│ RENDERER (React + Vite)                │
│ UI components, hooks, services         │
│ No direct Node/Electron access         │
├─────────────────────────────────────────┤
│ PRELOAD (main/preload.js)              │
│ contextBridge exposes safe API         │
├─────────────────────────────────────────┤
│ MAIN PROCESS (Electron + Node.js)      │
│ IPC handlers, filesystem, process spawn│
└─────────────────────────────────────────┘
```

### 📂 Project structure

```text
snapwork/
├── main/
│   ├── index.js                  # Window lifecycle and IPC registration
│   ├── preload.js                # Safe API bridge (window.electronAPI)
│   └── ipc/
│       ├── workspaceHandlers.js  # CRUD handlers
│       ├── launcherHandlers.js   # Workspace launch handlers
│       └── dialogHandlers.js     # Native open file/folder dialogs
├── core/
│   ├── storage.js                # Atomic JSON persistence
│   ├── launcher.js               # URL/app/folder/file launch logic
│   ├── validator.js              # Workspace validation
│   ├── workspace.js              # Workspace model helpers
│   ├── chromeProfiles.js         # Chrome profile detection
│   └── logger.js
├── src/
│   ├── services/
│   │   ├── workspaceService.js   # Renderer wrapper for workspace IPC
│   │   └── launcherService.js    # Renderer wrapper for launch IPC
│   ├── hooks/
│   │   ├── useWorkspaces.js      # Workspace list and CRUD state
│   │   └── useLaunch.js          # Launch state + launch logs
│   ├── components/
│   │   ├── Titlebar/
│   │   ├── Sidebar/
│   │   ├── WorkspaceList/
│   │   ├── WorkspaceForm/
│   │   ├── LaunchLog/
│   │   └── common/
│   └── styles/
│       ├── tokens.css
│       ├── animations.css
│       └── global.css
├── electron-builder.yml
├── vite.config.js
└── package.json
```

### Layer rules

| Layer | Rule |
|---|---|
| `core/` | Business logic only. No UI and no renderer concerns. |
| `main/ipc/` | One domain per handler file. Returns structured `{ success, data?, error? }`. |
| `main/preload.js` | Exposes allowed methods only. Does not expose raw `ipcRenderer`. |
| `src/services/` | Single access point to `window.electronAPI` from renderer. |
| `src/hooks/` | State and async orchestration, no direct Electron calls. |
| `src/components/` | Presentation and user interaction only. |

---

## Data Model

All data is local-first. No backend, no cloud dependency.

**Storage location (Windows):** `C:\Users\<You>\AppData\Roaming\SnapWork\workspaces.json`

```json
{
  "id": "uuid-v4",
  "name": "ThriveEd Backend",
  "category": "dev",
  "color": "#00C9A7",
  "apps": [
    {
      "name": "VS Code",
      "path": "C:\\Program Files\\Microsoft VS Code\\Code.exe",
      "args": ["C:\\projects\\thriveed\\backend"]
    }
  ],
  "urls": [
    {
      "url": "https://github.com/user/thriveed",
      "profile": "Default"
    },
    {
      "url": "https://stackoverflow.com",
      "profile": ""
    }
  ],
  "folders": [
    "C:\\projects\\thriveed\\backend"
  ],
  "files": [
    "C:\\Users\\Priya\\Documents\\Notes.md"
  ],
  "createdAt": "2026-04-07T10:00:00.000Z",
  "updatedAt": "2026-04-07T10:00:00.000Z",
  "lastLaunched": null
}
```

Writes are **atomic**: SnapWork writes to a temporary `.tmp` file first, then renames it.

---

## How URL Launching Works

SnapWork supports two URL launch paths:

1. **Default browser path** via `shell.openExternal(url)`
2. **Chrome profile path** when a profile is selected and Chrome is installed

What this gives you:

- Open URLs in specific Chrome profiles for account separation
- Keep personal/work accounts cleanly isolated
- Fall back gracefully to default browser if needed

What it does not currently do:

- Restore tab groups
- Restore scroll position or transient form state
- Restore exact browser session internals

---

## Adding a New IPC Channel

Four files to touch, in order:

**1.** `main/ipc/yourDomainHandlers.js`

```js
ipcMain.handle('domain:action', async (_event, payload) => {
  try {
    const result = await doWork(payload)
    return { success: true, data: result }
  } catch (err) {
    return { success: false, error: err.message }
  }
})
```

**2.** `main/index.js` (register handler)

```js
const yourHandlers = require('./ipc/yourDomainHandlers')
yourHandlers.register(ipcMain)
```

**3.** `main/preload.js` (expose safe bridge)

```js
yourDomain: {
  action: (payload) => ipcRenderer.invoke('domain:action', payload)
}
```

**4.** `src/services/yourDomainService.js` (renderer wrapper)

```js
async function action(payload) {
  const res = await window.electronAPI.yourDomain.action(payload)
  if (!res.success) throw new Error(res.error)
  return res.data
}

export const yourDomainService = { action }
```

---

## 🔐 Security Baseline

SnapWork enforces Electron security defaults that should stay unchanged:

```js
new BrowserWindow({
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    preload: path.join(__dirname, 'preload.js')
  }
})
```

This ensures renderer code cannot directly access Node APIs and can only call methods intentionally exposed by preload.

---

## 🎨 Design System

Dark-mode-first UI built from CSS tokens in `src/styles/tokens.css`.

| Token | Value | Purpose |
|---|---|---|
| `--bg-base` | `#0E0E10` | Window base background |
| `--bg-surface` | `#1A1A1F` | Cards and panels |
| `--bg-elevated` | `#22222A` | Inputs and controls |
| `--accent` | `#00C9A7` | Primary actions |
| `--danger` | `#FF5C5C` | Error and destructive actions |
| `--text-primary` | `#F0F0F5` | Primary text |
| `--text-secondary` | `#8888A0` | Secondary text |

Icons are provided by `lucide-react`.

---

## 🛠️ Troubleshooting

| Symptom | Fix |
|---|---|
| `npm is not recognized` | Install Node.js from nodejs.org and restart terminal |
| Blank/failed app load in dev | Ensure Vite port `5173` is available and `npm run dev` succeeds |
| `Cannot find module 'electron'` | Reinstall dependencies with `npm install` |
| URL profile launch fails | Verify Chrome is installed and selected profile exists |
| `window.electronAPI` is undefined | Check preload path, `contextIsolation: true`, and `nodeIntegration: false` |
| Launch item fails | Re-select app/folder/file path with browse dialogs |

---

## Roadmap

| Phase | Plan |
|---|---|
| Phase 2 | Workspace templates and faster capture flow |
| Phase 3 | Stronger session restore options |
| Phase 4 | Optional sync and backup |
| Phase 5 | Smart suggestions and launch recommendations |

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Desktop runtime | Electron 29 |
| UI | React 18 |
| Build tool | Vite 5 |
| Packaging | electron-builder + NSIS |
| Icons | lucide-react |
| ID generation | uuid |
| Storage | Local JSON file |

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Keep layer boundaries intact (`core` -> `ipc` -> `preload` -> `services` -> `hooks/components`)
4. Test the full flow in dev mode
5. Open a pull request with clear scope

---

