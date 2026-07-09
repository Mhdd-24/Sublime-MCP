import fs from 'node:fs';
import path from 'node:path';
import { ST } from '../config/sublime.config.js';
import { env } from '../env.js';
import { ensureDir, sanitizeSessionName } from '../utils/paths.js';
import { launchSubl } from './sublimeService.js';

const SESSION_EXT = '.sublime_session';

function isFilesystemPath(value: string): boolean {
  if (value.startsWith('res://')) {
    return false;
  }
  return path.isAbsolute(value) || /^[A-Za-z]:[\\/]/.test(value);
}

/** Extract file paths and untitled buffers from Sublime Text session JSON. */
export function parseSessionFilePaths(jsonText: string): string[] {
  let data: unknown;
  try {
    data = JSON.parse(jsonText);
  } catch {
    throw new Error(ST.MESSAGES.SESSION_INVALID);
  }

  const paths = new Set<string>();

  if (typeof data === 'object' && data !== null) {
    const root = data as Record<string, unknown>;
    if (Array.isArray(root.file_history)) {
      for (const entry of root.file_history) {
        if (typeof entry === 'string' && isFilesystemPath(entry)) {
          paths.add(entry);
        }
      }
    }
  }

  function walk(node: unknown): void {
    if (node === null || node === undefined) {
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) {
        walk(item);
      }
      return;
    }
    if (typeof node === 'object') {
      const obj = node as Record<string, unknown>;
      if (typeof obj.file === 'string' && isFilesystemPath(obj.file)) {
        paths.add(obj.file);
      }
      if (typeof obj.auto_name === 'string' && typeof obj.file !== 'string') {
        paths.add(`untitled: ${obj.auto_name}`);
      }
      for (const value of Object.values(obj)) {
        walk(value);
      }
    }
  }

  walk(data);
  return [...paths];
}

export function listLiveSessionFiles(): { sessionPath: string; files: string[] } {
  const sessionPath = env.SUBLIME_SESSION_FILE;
  if (!fs.existsSync(sessionPath)) {
    throw new Error(ST.MESSAGES.SESSION_MISSING);
  }
  const json = fs.readFileSync(sessionPath, 'utf8');
  const files = parseSessionFilePaths(json);
  return { sessionPath, files };
}

export function listNamedSessions(): string[] {
  const dir = env.SUBLIME_SESSION_STORAGE_DIR;
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(SESSION_EXT))
    .map((f) => path.basename(f, SESSION_EXT))
    .sort();
}

export function saveNamedSession(name: string): { savedAs: string; fileCount: number } {
  const safe = sanitizeSessionName(name);
  const { sessionPath, files } = listLiveSessionFiles();
  if (files.length === 0) {
    throw new Error(ST.MESSAGES.NO_FILES_IN_SESSION);
  }
  ensureDir(env.SUBLIME_SESSION_STORAGE_DIR);
  const dest = path.join(env.SUBLIME_SESSION_STORAGE_DIR, `${safe}${SESSION_EXT}`);
  fs.copyFileSync(sessionPath, dest);
  return { savedAs: dest, fileCount: files.length };
}

export async function loadNamedSession(name: string): Promise<{ sessionFile: string }> {
  const safe = sanitizeSessionName(name);
  const sessionFile = path.join(env.SUBLIME_SESSION_STORAGE_DIR, `${safe}${SESSION_EXT}`);
  if (!fs.existsSync(sessionFile)) {
    throw new Error(`${ST.MESSAGES.SESSION_NOT_FOUND}: ${safe}`);
  }
  await launchSubl([sessionFile]);
  return { sessionFile };
}
