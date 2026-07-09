import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ST } from '../config/sublime.config.js';
import { listLiveSessionFiles } from '../services/sessionService.js';
import { toolError, toolText } from '../utils/toolResponse.js';

export function registerListSessionTool(server: McpServer): void {
  const cfg = ST.TOOLS.LIST_SESSION;
  server.tool(cfg.NAME, cfg.DESCRIPTION, {}, async () => {
    try {
      const { sessionPath, files } = listLiveSessionFiles();
      if (files.length === 0) {
        return toolText(`${ST.MESSAGES.NO_FILES_IN_SESSION}\n(session: ${sessionPath})`, true);
      }
      return toolText(
        `Files in session (${sessionPath}):\n\n${files.map((f) => `- ${f}`).join('\n')}`,
      );
    } catch (error) {
      return toolError(error);
    }
  });
}
