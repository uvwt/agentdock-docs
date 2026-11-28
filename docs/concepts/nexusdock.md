# What is NexusDock?

NexusDock is the unified control center and remote connection hub for your AgentDock devices. It is available both as managed **NexusDock Cloud** (`https://mcp.nexusdock.co`) and as the open-source self-hosted **NexusDock** server.

It brings your Macs, Windows PCs, Linux hosts, and servers into one web console, lets them share Recall and Workflow data, and provides one MCP endpoint for AI clients—without exposing every machine directly to the internet.

Even with a single machine, NexusDock Cloud is the simplest way to reach AgentDock remotely without configuring Cloudflare Tunnels or a custom domain. If you only connect local clients on the same machine, you can still use AgentDock directly without NexusDock.

## What you can do

- connect to multiple AgentDock devices through one MCP endpoint;
- manage paired AgentDock devices, online status, and optional device purpose descriptions (surfaced in `agentdock_context` to help AI clients pick the right machine);
- inspect node-local tasks, Skills, Plugins, and dynamic MCP servers from one place;
- share Recall memory and Workflow data across devices;
- configure an AI client once instead of connecting to each AgentDock separately;
- fall back to `node_tool_search` and `node_tool_call` when a client's cached MCP tool schema lags behind a node's live tools.

AgentDock still runs the actual work on each device. NexusDock brings those devices together; it does not replace them.

## Cloud vs. self-hosted

| Deployment | Endpoint & console | Best for |
| --- | --- | --- |
| **NexusDock Cloud** | `https://mcp.nexusdock.co` | Fastest remote access, managed Recall/Workflow hosting, and third-party REST API integration |
| **Self-hosted NexusDock** | Your own HTTPS domain (`uvwt/nexusdock`) | Running the control center, SQLite state, and Recall files on your own infrastructure |

## Programmatic REST API (NexusDock Cloud)

For scripts, services, and automation workflows that call devices outside an MCP client, NexusDock Cloud provides a third-party REST API (devices, capability catalog, and remote tool executions). Rather than duplicating OpenAPI schemas here, use the live API documentation and official Skill as the source of truth:

- Live REST API reference: [https://mcp.nexusdock.co/docs/api](https://mcp.nexusdock.co/docs/api)
- Official REST integration Skill: [`nexusdock-rest`](https://github.com/uvwt/agentdock-skills/tree/main/skills/nexusdock-rest)

## Next steps

- [Connect AgentDock](../operations/nexusdock-connect.md)
- [Install and maintain self-hosted NexusDock](../operations/nexusdock.md)
- [Recall memory](./recalldock.md)
- [Workflow](./workflow.md)
