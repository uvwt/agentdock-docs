# Connect AgentDock

After NexusDock is running, pair your AgentDock devices and connect the MCP clients you want to use.

## Pair AgentDock devices

Sign in to the Web console, open **Settings → System & Nodes**, and choose **Pair device**.

NexusDock generates a one-time pairing code and shows a command-line example:

```bash
agentdock nexus pair --endpoint https://nexus.example.com --code pair_xxx
```

On the Windows or macOS desktop version of AgentDock, you can pair directly from the NexusDock section in the graphical interface: enter the **NexusDock address** and **one-time pairing code**, then choose **Pair and restart**. You do not need to run the command above manually.

On Linux, servers, or other command-line environments, use the command above to pair. After pairing, AgentDock connects to NexusDock without requiring a public inbound port on the device.

Pairing does not change the node's existing local MCP endpoint or authentication. Each AgentDock instance can still be used independently.

## Connect MCP clients

NexusDock exposes one MCP endpoint:

```text
https://your-nexus-domain/mcp
```

Clients with OAuth support can connect directly and complete authorization in the browser.

For clients that need a fixed token, open **Settings → MCP Access** and use the dedicated MCP Access Token.

The two credentials have different purposes:

| Credential | Purpose |
| --- | --- |
| Administrator username and password | Sign in to the Web console |
| MCP Access Token | Connect clients to `/mcp` without OAuth |

For client-specific setup, see [Connect from different clients](../guides/mcp-clients.md).
