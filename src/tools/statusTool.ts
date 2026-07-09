import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import fs from 'node:fs';
import { ST } from '../config/sublime.config.js';
import { env } from '../env.js';
import { getExeVersionHint, isSublimeRunning } from '../services/sublimeService.js';
import { listNamedSessions } from '../services/sessionService.js';
import { toolError, toolText } from '../utils/toolResponse.js';

export function registerStatusTool(server: McpServer): void {
  const cfg = ST.TOOLS.STATUS;
  server.tool(cfg.NAME, cfg.DESCRIPTION, {}, async () => {
    try {
      const exe = env.SUBLIME_EXE;
      const exeExists = fs.existsSync(exe);
      const running = await isSublimeRunning();
      const sessionExists = fs.existsSync(env.SUBLIME_SESSION_FILE);
      const named = listNamedSessions();
      const hint = exeExists ? getExeVersionHint(exe) : undefined;

      const lines = [
        'Sublime Text MCP status:',
        `- subl: ${exe}`,
        `- sublExists: ${exeExists}`,
        hint ? `- fileHint: ${hint}` : undefined,
        `- running: ${running}`,
        `- platform: ${process.platform}`,
        `- workdir: ${env.SUBLIME_WORKDIR}`,
        `- sessionFile: ${env.SUBLIME_SESSION_FILE}`,
        `- sessionFileExists: ${sessionExists}`,
        `- sessionStorage: ${env.SUBLIME_SESSION_STORAGE_DIR}`,
        `- namedSessions: ${named.length ? named.join(', ') : '(none)'}`,
      ].filter(Boolean) as string[];

      return toolText(lines.join('\n'), !exeExists);
    } catch (error) {
      return toolError(error);
    }
  });
}
