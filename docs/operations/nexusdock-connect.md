# Connect AgentDock

Pair your AgentDock devices with **NexusDock Cloud** (`https://mcp.nexusdock.co`) or your self-hosted NexusDock instance, then connect your AI clients through the unified MCP endpoint.

## Pair AgentDock devices

1. Sign in to the NexusDock Web console:
   - **NexusDock Cloud:** open `https://mcp.nexusdock.co`, go to **Devices**, and create a one-time pairing code (6 digits, valid for 5 minutes, single-use).
   - **Self-hosted NexusDock:** open **Settings → System & Nodes** and choose **Pair device** to create a short-lived, single-use pairing code.
2. Complete pairing on the AgentDock device:

On the Windows or macOS desktop version of AgentDock, open the NexusDock connection section, enter the **NexusDock address** (for example `https://mcp.nexusdock.co` or your self-hosted URL) and the **one-time pairing code**, then pair and restart. You do not need to run a CLI command manually.

On Linux, servers, or other command-line environments, run the pairing command shown in the console:

```bash
sudo agentdock nexus pair --endpoint https://mcp.nexusdock.co --code <pairing-code>
```

For self-hosted instances, replace `https://mcp.nexusdock.co` with your own NexusDock HTTPS origin. On standard Linux service installations, running `sudo agentdock nexus pair` resolves the service's `AGENTDOCK_HOME` automatically and restarts the systemd/OpenRC service for you (pass `--no-restart` if you only want to save the device identity first).

After pairing, AgentDock saves its Device Token locally and connects outbound to NexusDock—no public inbound port is required on the device. You can also add an optional **device purpose description** in the NexusDock console so `agentdock_context` tells AI clients what each machine is for.

Pairing does not change the node's existing local MCP endpoint or authentication. Each AgentDock instance can still be used independently.

## Connect MCP clients

NexusDock exposes one MCP endpoint:

```text
https://mcp.nexusdock.co/mcp
```

For a self-hosted deployment, use `https://your-nexus-domain/mcp` instead.

Clients with OAuth support can connect directly and complete authorization in the browser (NexusDock Cloud also supports OAuth Device Flow for headless clients).

For clients that need a fixed token, open **Settings** in the console and generate or copy an **MCP Access Token / PAT**.

The two credentials have different purposes:

| Credential | Purpose |
| --- | --- |
| Console account sign-in | Sign in to the NexusDock Web console |
| MCP Access Token / PAT | Connect MCP or REST API clients without interactive OAuth |

## Third-party REST API integration

To discover paired devices, inspect capabilities, or invoke remote tools from non-MCP applications on NexusDock Cloud, refer to the live REST API documentation and the official Skill:

- Live API documentation: [https://mcp.nexusdock.co/docs/api](https://mcp.nexusdock.co/docs/api)
- Official Skill: [`nexusdock-rest`](https://github.com/uvwt/agentdock-skills/tree/main/skills/nexusdock-rest)

For client-specific setup, see [Connect from different clients](../guides/mcp-clients.md).
