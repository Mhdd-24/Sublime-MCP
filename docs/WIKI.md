# Sublime Text MCP — Wiki

## Table of contents

1. [What this project does](#what-this-project-does)
2. [High-level architecture](#high-level-architecture)
3. [Environment variables](#environment-variables)
4. [Project folder structure](#project-folder-structure)
5. [Publishing checklist](#publishing-checklist)
6. [Troubleshooting](#troubleshooting)

---

## What this project does

`@mhdd_24/sublime-mcp` is a **stdio MCP server** that controls **Sublime Text** through the **`subl` CLI** and session files on disk — no plugin required.

| Tool | Purpose |
|------|---------|
| `st_status` | Verify `subl` path and running process |
| `st_open` | Open one or more files |
| `st_new` | New window or create+open file |
| `st_list_session` | Parse live `Auto Save Session.sublime_session` |
| `st_save_session` | Copy live session to named snapshot |
| `st_load_session` | Open named snapshot in Sublime |
| `st_run` | Arbitrary `subl` arguments |

Built with the same layout as `@mhdd_24/notepadpp-mcp`.

---

## High-level architecture

```
MCP client (Cursor, Claude Desktop, …)
        │  stdio JSON-RPC
        ▼
src/index.ts  →  McpServer + registerTools()
        │
   ┌────┴────┬────────────────────┐
   ▼         ▼                    ▼
subl CLI    Auto Save Session     sublime-mcp-sessions/
(spawn)     .sublime_session      {name}.sublime_session
            (live JSON parse)     (copy / open)
```

| Layer | Responsibility |
|-------|----------------|
| `tools/*` | MCP schemas + thin handlers |
| `services/sublimeService.ts` | Process check, `subl` spawn |
| `services/sessionService.ts` | Session JSON parse, snapshot I/O |
| `env.ts` | Platform defaults for paths |
| `config/sublime.config.ts` | Names, messages, tool metadata |

---

## Environment variables

| Variable | Aliases | Default (macOS) |
|----------|---------|-----------------|
| `SUBLIME_EXE` | `sublimeExe` | `/Applications/Sublime Text.app/.../subl` |
| `SUBLIME_SESSION_FILE` | `sublimeSessionFile` | `~/Library/Application Support/Sublime Text/Local/Auto Save Session.sublime_session` |
| `SUBLIME_WORKDIR` | `sublimeWorkdir` | `~/Documents/Sublime-Notes` |
| `SUBLIME_SESSION_STORAGE_DIR` | `sublimeSessionStorageDir` | `{dataDir}/sublime-mcp-sessions` |

Windows defaults use `%LOCALAPPDATA%` and `%APPDATA%`. Linux uses `~/.config/sublime-text`.

Never commit secrets or machine-specific paths in git — use MCP `env` or a local `.env`.

---

## Project folder structure

```
Sublime-MCP/
├── src/
│   ├── index.ts
│   ├── env.ts
│   ├── config/sublime.config.ts
│   ├── services/
│   │   ├── sublimeService.ts
│   │   └── sessionService.ts
│   ├── tools/
│   └── utils/
├── docs/WIKI.md
├── package.json
└── README.md
```

---

## Publishing checklist

1. Bump `version` in `package.json` and `ST.SERVER.VERSION` in `sublime.config.ts`
2. `npm run build` and smoke-test with local `mcp.json`
3. `npm publish --access public`
4. Users restart MCP — `npx` picks up the new version

Current package version: **1.0.0**.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `subl` not found | Set `SUBLIME_EXE` to your `subl` path |
| Empty session list | Open/save files in Sublime, then retry |
| Session file missing | Launch Sublime once so auto-save creates the file |
| `pgrep` fails on Linux | Ensure `procps` is installed |

---

## Parity with Notepad++ MCP

| Notepad++ | Sublime Text |
|-----------|--------------|
| `npp_status` | `st_status` |
| `npp_open` | `st_open` |
| `npp_new` | `st_new` |
| `npp_list_session` | `st_list_session` |
| `npp_save_session` | `st_save_session` |
| `npp_load_session` | `st_load_session` |
| `npp_run` | `st_run` |
| `-multiInst` | `-n` / `--new-window` |
| `session.xml` | `Auto Save Session.sublime_session` |
| `-openSession` | open snapshot path via `subl` |
