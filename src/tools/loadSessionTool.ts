import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ST } from '../config/sublime.config.js';
import { loadNamedSession } from '../services/sessionService.js';
import { toolError, toolText } from '../utils/toolResponse.js';

export function registerLoadSessionTool(server: McpServer): void {
  const cfg = ST.TOOLS.LOAD_SESSION;
  server.tool(
    cfg.NAME,
    cfg.DESCRIPTION,
    {
      name: z.string().describe(cfg.NAME_DESCRIPTION),
    },
    async ({ name }) => {
      try {
        const result = await loadNamedSession(name);
        return toolText(`Loading session "${name}" in Sublime Text:\n${result.sessionFile}`);
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
