import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';
import { ST } from '../config/sublime.config.js';
import { launchSubl } from '../services/sublimeService.js';
import { ensureDir, resolvePath } from '../utils/paths.js';
import { toolError, toolText } from '../utils/toolResponse.js';

export function registerNewTool(server: McpServer): void {
  const cfg = ST.TOOLS.NEW;
  server.tool(
    cfg.NAME,
    cfg.DESCRIPTION,
    {
      filename: z.string().optional().describe(cfg.FILENAME_DESCRIPTION),
      newWindow: z.boolean().optional().describe(cfg.NEW_WINDOW_DESCRIPTION),
    },
    async ({ filename, newWindow }) => {
      try {
        const args: string[] = [];
        const openNewWindow = newWindow ?? !filename;
        if (openNewWindow) {
          args.push('-n');
        }

        let created: string | undefined;
        if (filename) {
          const target = resolvePath(filename);
          ensureDir(path.dirname(target));
          if (!fs.existsSync(target)) {
            fs.writeFileSync(target, '', 'utf8');
            created = target;
          }
          args.push(target);
        }

        const result = await launchSubl(args);
        const detail = created
          ? `Created and opened: ${created}`
          : filename
            ? `Opened existing: ${resolvePath(filename)}`
            : 'Launched Sublime Text with a new window (-n)';

        return toolText(`${detail}\n(pid ${result.pid ?? 'n/a'})`);
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
