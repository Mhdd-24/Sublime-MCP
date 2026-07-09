import fs from 'node:fs';
import path from 'node:path';
import { env } from '../env.js';

export function resolvePath(input: string): string {
  if (path.isAbsolute(input)) {
    return path.normalize(input);
  }
  return path.normalize(path.join(env.SUBLIME_WORKDIR, input));
}

export function assertExeExists(): string {
  const exe = env.SUBLIME_EXE;
  if (!fs.existsSync(exe)) {
    throw new Error(`Sublime Text CLI not found at: ${exe}`);
  }
  return exe;
}

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function sanitizeSessionName(name: string): string {
  const trimmed = name.trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    throw new Error('Session name must use only letters, digits, dash, or underscore.');
  }
  return trimmed;
}
