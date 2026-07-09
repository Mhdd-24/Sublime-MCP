import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import fs from 'node:fs';
import { ST } from '../config/sublime.config.js';
import { launchSubl } from '../services/sublimeService.js';
import { resolvePath } from '../utils/paths.js';
import { toolError, toolText } from '../utils/toolResponse.js';

export function registerOpenTool(server: McpServer): void {
  const cfg = ST.TOOLS.OPEN;
  server.tool(
    cfg.NAME,
    cfg.DESCRIPTION,
    {
      paths: z.union([z.string(), z.array(z.string()).min(1)]).describe(cfg.PATHS_DESCRIPTION),
      newWindow: z.boolean().optional().describe(cfg.NEW_WINDOW_DESCRIPTION),
    },
    async ({ paths, newWindow }) => {
      try {
        const list = (Array.isArray(paths) ? paths : [paths]).map(resolvePath);
        const missing = list.filter((p) => !fs.existsSync(p));
        if (missing.length === list.length) {
          return toolText(`None of the paths exist:\n${missing.map((p) => `- ${p}`).join('\n')}`, true);
        }

        const args: string[] = [];
        if (newWindow) {
          args.push('-n');
        }
        args.push(...list);

        const result = await launchSubl(args);
        const warn =
          missing.length > 0
            ? `\nWarning — missing paths still passed to Sublime Text:\n${missing.map((p) => `- ${p}`).join('\n')}`
            : '';

        return toolText(
          `Opened in Sublime Text (pid ${result.pid ?? 'n/a'}):\n${list.map((p) => `- ${p}`).join('\n')}${warn}`,
        );
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
