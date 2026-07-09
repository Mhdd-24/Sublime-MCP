import { execFile, spawn } from 'node:child_process';
import fs from 'node:fs';
import { promisify } from 'node:util';
import { env } from '../env.js';
import { assertExeExists } from '../utils/paths.js';

const execFileAsync = promisify(execFile);

function processPattern(): string {
  switch (process.platform) {
    case 'win32':
      return 'sublime_text.exe';
    case 'darwin':
      return 'Sublime Text';
    default:
      return 'sublime_text';
  }
}

export async function isSublimeRunning(): Promise<boolean> {
  const pattern = processPattern();
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execFileAsync('tasklist', ['/FI', `IMAGENAME eq ${pattern}`, '/NH']);
      return stdout.toLowerCase().includes(pattern.toLowerCase());
    }
    const { stdout } = await execFileAsync('pgrep', ['-fl', pattern]);
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
}

export function launchSubl(args: string[] = []): Promise<{ pid?: number; args: string[] }> {
  const exe = assertExeExists();
  return new Promise((resolve, reject) => {
    const child = spawn(exe, args, {
      detached: true,
      stdio: 'ignore',
      windowsHide: false,
      cwd: env.SUBLIME_WORKDIR,
    });
    child.unref();
    child.on('error', reject);
    setImmediate(() => {
      resolve({ pid: child.pid, args });
    });
  });
}

export function getExeVersionHint(exe: string): string | undefined {
  try {
    const stat = fs.statSync(exe);
    return `size=${stat.size} mtime=${stat.mtime.toISOString()}`;
  } catch {
    return undefined;
  }
}
