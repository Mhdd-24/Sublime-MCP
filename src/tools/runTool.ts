import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ST } from '../config/sublime.config.js';
import { launchSubl } from '../services/sublimeService.js';
import { toolError, toolText } from '../utils/toolResponse.js';

export function registerRunTool(server: McpServer): void {
  const cfg = ST.TOOLS.RUN;
  server.tool(
    cfg.NAME,
    cfg.DESCRIPTION,
    {
      args: z.array(z.string()).default([]).describe(cfg.ARGS_DESCRIPTION),
    },
    async ({ args }) => {
      try {
        const result = await launchSubl(args);
        return toolText(
          `Launched Sublime Text (pid ${result.pid ?? 'n/a'})\nargs: ${JSON.stringify(result.args)}`,
        );
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
