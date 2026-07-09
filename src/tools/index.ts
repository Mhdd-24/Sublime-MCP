import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerListSessionTool } from './listSessionTool.js';
import { registerLoadSessionTool } from './loadSessionTool.js';
import { registerNewTool } from './newTool.js';
import { registerOpenTool } from './openTool.js';
import { registerRunTool } from './runTool.js';
import { registerSaveSessionTool } from './saveSessionTool.js';
import { registerStatusTool } from './statusTool.js';

export function registerTools(server: McpServer): void {
  registerStatusTool(server);
  registerOpenTool(server);
  registerNewTool(server);
  registerListSessionTool(server);
  registerSaveSessionTool(server);
  registerLoadSessionTool(server);
  registerRunTool(server);
}
