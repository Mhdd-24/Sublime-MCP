import dotenv from 'dotenv';
import os from 'node:os';
import path from 'node:path';
import { ST } from './config/sublime.config.js';

dotenv.config();

function readEnv(keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }
  return undefined;
}

export function defaultDataDir(): string {
  const home = os.homedir();
  switch (process.platform) {
    case 'darwin':
      return path.join(home, 'Library', 'Application Support', 'Sublime Text');
    case 'win32':
      return path.join(process.env.APPDATA ?? path.join(home, 'AppData', 'Roaming'), 'Sublime Text');
    default:
      return path.join(home, '.config', 'sublime-text');
  }
}

function defaultExe(): string {
  switch (process.platform) {
    case 'darwin':
      return '/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl';
    case 'win32':
      return path.join(
        process.env.LOCALAPPDATA ?? path.join(os.homedir(), 'AppData', 'Local'),
        'Programs',
        'Sublime Text',
        'subl.exe',
      );
    default:
      return '/usr/bin/subl';
  }
}

function defaultSessionFile(): string {
  return path.join(defaultDataDir(), 'Local', ST.DEFAULTS.SESSION_FILENAME);
}

function defaultSessionStorage(): string {
  return path.join(defaultDataDir(), ST.DEFAULTS.SESSION_SUBDIR);
}

function defaultWorkdir(): string {
  if (ST.DEFAULTS.WORKDIR.trim()) {
    return ST.DEFAULTS.WORKDIR;
  }
  return path.join(os.homedir(), 'Documents', 'Sublime-Notes');
}

export const env = {
  SUBLIME_EXE: readEnv(ST.ENV.EXE_KEYS) ?? defaultExe(),
  SUBLIME_SESSION_FILE: readEnv(ST.ENV.SESSION_FILE_KEYS) ?? defaultSessionFile(),
  SUBLIME_WORKDIR: readEnv(ST.ENV.WORKDIR_KEYS) ?? defaultWorkdir(),
  SUBLIME_SESSION_STORAGE_DIR: readEnv(ST.ENV.SESSION_STORAGE_KEYS) ?? defaultSessionStorage(),
};

export function validateEnv(): void {
  // Soft validation only — tools report concrete errors if exe/session missing.
}
