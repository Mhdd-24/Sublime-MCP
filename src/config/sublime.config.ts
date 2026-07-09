export const ST = {
  SERVER: {
    NAME: '@mhdd_24/sublime-mcp',
    VERSION: '1.0.0',
    STARTUP_MESSAGE: 'Sublime Text MCP Server Started',
    FATAL_PREFIX: 'Fatal error:',
  },
  DEFAULTS: {
    WORKDIR: '',
    SESSION_SUBDIR: 'sublime-mcp-sessions',
    SESSION_FILENAME: 'Auto Save Session.sublime_session',
  },
  ENV: {
    EXE_KEYS: ['SUBLIME_EXE', 'sublimeExe'] as const,
    SESSION_FILE_KEYS: ['SUBLIME_SESSION_FILE', 'sublimeSessionFile'] as const,
    WORKDIR_KEYS: ['SUBLIME_WORKDIR', 'sublimeWorkdir'] as const,
    SESSION_STORAGE_KEYS: ['SUBLIME_SESSION_STORAGE_DIR', 'sublimeSessionStorageDir'] as const,
  },
  MESSAGES: {
    EXE_MISSING: 'Sublime Text CLI not found. Set SUBLIME_EXE to the subl executable.',
    SESSION_MISSING:
      'Session file not found. Open Sublime Text and save some files first, or set SUBLIME_SESSION_FILE.',
    NO_FILES_IN_SESSION: 'No file paths found in the live session.',
    SESSION_NOT_FOUND: 'Named session not found.',
    SESSION_INVALID: 'Session file is not valid JSON.',
  },
  TOOLS: {
    STATUS: {
      NAME: 'st_status',
      DESCRIPTION:
        'Check Sublime Text availability: subl path, whether the process is running, and resolved session/workdir paths.',
    },
    OPEN: {
      NAME: 'st_open',
      DESCRIPTION:
        'Open one or more files in Sublime Text. Paths may be absolute or relative to SUBLIME_WORKDIR.',
      PATHS_DESCRIPTION: 'File path(s) to open.',
      NEW_WINDOW_DESCRIPTION: 'If true, pass -n / --new-window so a separate window is used.',
    },
    NEW: {
      NAME: 'st_new',
      DESCRIPTION:
        'Launch Sublime Text with a new window. Optionally create and open a new file under SUBLIME_WORKDIR.',
      FILENAME_DESCRIPTION:
        'Optional new file name (relative to SUBLIME_WORKDIR or absolute). Creates an empty file if missing.',
      NEW_WINDOW_DESCRIPTION: 'If true, pass -n / --new-window (default true when no filename).',
    },
    LIST_SESSION: {
      NAME: 'st_list_session',
      DESCRIPTION:
        'List file paths from the live Sublime Text session (open buffers, file history, untitled tabs).',
    },
    SAVE_SESSION: {
      NAME: 'st_save_session',
      DESCRIPTION:
        'Copy the live session file into a named snapshot under the session storage folder.',
      NAME_DESCRIPTION: 'Session name (without extension). Letters, digits, dash, underscore.',
    },
    LOAD_SESSION: {
      NAME: 'st_load_session',
      DESCRIPTION: 'Load a named session snapshot by opening it in Sublime Text.',
      NAME_DESCRIPTION: 'Session name (without extension) previously saved with st_save_session.',
    },
    RUN: {
      NAME: 'st_run',
      DESCRIPTION: 'Escape hatch: run subl with custom CLI arguments.',
      ARGS_DESCRIPTION: 'Arguments passed to subl (e.g. ["-n", "/path/file.txt"]).',
    },
  },
} as const;
