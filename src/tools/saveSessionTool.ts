import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ST } from '../config/sublime.config.js';
import { saveNamedSession } from '../services/sessionService.js';
import { toolError, toolText } from '../utils/toolResponse.js';

export function registerSaveSessionTool(server: McpServer): void {
  const cfg = ST.TOOLS.SAVE_SESSION;
  server.tool(
    cfg.NAME,
    cfg.DESCRIPTION,
    {
      name: z.string().describe(cfg.NAME_DESCRIPTION),
    },
    async ({ name }) => {
      try {
        const result = saveNamedSession(name);
        return toolText(
          `Session saved as "${name}" → ${result.savedAs}\n(${result.fileCount} path(s) in snapshot)`,
        );
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
