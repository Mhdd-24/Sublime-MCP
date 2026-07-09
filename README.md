# @mhdd_24/sublime-mcp

MCP server for **Sublime Text** on macOS, Windows, and Linux. Use it from [Cursor](https://cursor.com), Claude Desktop, VS Code Copilot, or any MCP-compatible client to open files, check editor status, and save/load session snapshots.

Same architecture as [@mhdd_24/notepadpp-mcp](https://github.com/Mhdd-24/NotePadpp-MCP).

**Full documentation:** [docs/WIKI.md](./docs/WIKI.md)

---

## How it works (30 seconds)

```
You (chat) → MCP client → sublime-mcp → subl CLI
                                      → Auto Save Session.sublime_session
                                      → named snapshots/*.sublime_session
```

1. **Access token** not required — uses the `subl` CLI and session files on disk
2. **Status** — resolves `SUBLIME_EXE`, checks if Sublime Text is running
3. **Open / new** — launches `subl` with file paths or `-n` for a new window
4. **Sessions** — reads live session JSON; save/load named snapshots

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| **Node.js 18+** | Uses native fetch / spawn |
| **Sublime Text 4+** | `subl` must be on disk (default paths per OS) |

---

## Install

### Option A — npm (after publish)

```bash
npm install -g @mhdd_24/sublime-mcp
```

### Option B — npx

```bash
npx @mhdd_24/sublime-mcp
```

### Option C — clone and build

```bash
git clone https://github.com/Mhdd-24/Sublime-MCP.git
cd Sublime-MCP
npm install
npm run build
node dist/index.js
```

---

## Configure Cursor

Edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "sublime": {
      "command": "npx",
      "args": ["-y", "@mhdd_24/sublime-mcp"],
      "env": {
        "SUBLIME_WORKDIR": "/path/to/your/notes"
      }
    }
  }
}
```

**Local development:**

```json
"command": "node",
"args": ["/path/to/sublime-mcp/dist/index.js"]
```

Restart Cursor after saving.

---

## Environment variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `SUBLIME_EXE` | No | OS default `subl` path | Path to `subl` CLI |
| `SUBLIME_SESSION_FILE` | No | `.../Local/Auto Save Session.sublime_session` | Live session file |
| `SUBLIME_WORKDIR` | No | `~/Documents/Sublime-Notes` | Base for relative paths |
| `SUBLIME_SESSION_STORAGE_DIR` | No | `{dataDir}/sublime-mcp-sessions` | Named snapshots |

**Aliases:** `sublimeExe`, `sublimeWorkdir`, etc. (see WIKI).

---

## Tools

| Tool | Purpose |
|------|---------|
| `st_status` | Exe path, process running, session/workdir paths |
| `st_open` | Open file(s) in Sublime Text |
| `st_new` | New window or create+open a file |
| `st_list_session` | List paths from live session |
| `st_save_session` | Snapshot live session under a name |
| `st_load_session` | Open a named session snapshot |
| `st_run` | Custom `subl` CLI args |

### Chat examples

- "Run **st_status** on the sublime MCP"
- "Open `notes.txt` in Sublime Text"
- "Create a new note `ideas.md` in Sublime"
- "List my Sublime session files"
- "Save my Sublime session as `work-july`"

---

## License

ISC
