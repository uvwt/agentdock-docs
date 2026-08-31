# Connect AgentDock from different clients

AgentDock connects to Claude Desktop, ChatGPT, Claude Code, Cursor, VS Code, Codex, TRAE, and WorkBuddy over Streamable HTTP MCP. Every example on this page uses:

```text
https://agentdock.example.com/mcp
```

Replace it with your own AgentDock MCP URL.

:::note
Menu names, plan restrictions, and workspace policies may change between client releases. This page uses common current labels. When an entry is not visible, search settings for `MCP`, `Plugins`, or `Connectors`.
:::

## Before connecting

For a public client or cloud service, confirm that:

- AgentDock is available through a public HTTPS domain.
- The MCP URL ends with `/mcp` (for example, `https://agentdock.example.com/mcp`).
- Authentication is configured: remote clients typically require OAuth browser authorization or a Bearer Token in the HTTP request header. For full environment variable setup, see [OAuth configuration](../reference/configuration.md#oauth-configuration).
- The reverse proxy forwards `/mcp`, `/register`, `/oauth/*`, and `/.well-known/*`.

A local client running on the same computer as AgentDock may also connect to:

```text
http://127.0.0.1:8765/mcp
```

A cloud client cannot reach `127.0.0.1` on your computer or server.

:::caution
Keep real Bearer Tokens and OAuth credentials out of shell history and version-controlled workspace files. Use the client's secret-management capability or a restricted environment variable when available.
:::

## Claude Desktop

Availability of custom MCP connections and the number of servers you can add depend on the current plan and workspace policy.

1. Open Claude Desktop and go to **Customize > Connectors**.
2. Select **+**, then **Add Connector**.
3. Enter `AgentDock` as the name.
4. Enter this MCP Server URL:

   ```text
   https://agentdock.example.com/mcp
   ```

5. Save and select **Connect**.
6. When the browser opens the AgentDock authorization page, enter `AGENTDOCK_OAUTH_PASSWORD`.

## ChatGPT

ChatGPT connects to AgentDock over Streamable HTTP MCP using a public HTTPS URL and OAuth browser authorization. Custom MCP plugins require Developer mode to be enabled in ChatGPT settings.

For the complete step-by-step walkthrough, screenshots, and troubleshooting, see [Connect ChatGPT to AgentDock](./chatgpt.md).

## Claude Code

### OAuth

Run:

```bash
claude mcp add --transport http agentdock https://agentdock.example.com/mcp
```

Then run this inside Claude Code:

```text
/mcp
```

Select AgentDock and complete OAuth authorization in the browser.

### Bearer Token

```bash
claude mcp add --transport http agentdock https://agentdock.example.com/mcp \
  --header "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Cursor

1. Open **Cursor Settings**.
2. Select **Tools & MCP**.
3. Select **Add Custom MCP**.
4. Edit `.cursor/mcp.json` in the project:

```json
{
  "mcpServers": {
    "agentdock": {
      "url": "https://agentdock.example.com/mcp"
    }
  }
}
```

Return to **Tools & MCP**, find AgentDock, select **Connect**, and complete OAuth in the browser.

For a Bearer Token:

```json
{
  "mcpServers": {
    "agentdock": {
      "url": "https://agentdock.example.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}
```

## VS Code

Create or edit `.vscode/mcp.json` in the workspace:

```json
{
  "servers": {
    "agentdock": {
      "type": "http",
      "url": "https://agentdock.example.com/mcp"
    }
  }
}
```

You may also open the command palette:

```text
Ctrl+Shift+P / Cmd+Shift+P
```

Run **Add Server**, choose **HTTP (HTTP or Server-Sent Events)**, enter the AgentDock MCP URL and server ID, and choose a workspace or global configuration. Complete OAuth in the browser after saving.

For a Bearer Token:

```json
{
  "servers": {
    "agentdock": {
      "type": "http",
      "url": "https://agentdock.example.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}
```

## Codex

### Codex App

1. Open Codex and go to **Settings > Plugins > MCP**.
2. Select **Add server**.
3. Enter `AgentDock` as the name.
4. Choose **Streamable HTTP** as the transport.
5. Enter this MCP Server URL:

   ```text
   https://agentdock.example.com/mcp
   ```

6. Save, select **Authenticate**, and complete OAuth in the browser.

### Command line

```bash
codex mcp add agentdock --url https://agentdock.example.com/mcp
```

Follow the terminal prompt to complete OAuth login and authorization.

## TRAE

1. Open TRAE settings.
2. Select **MCP**.
3. Select **Add > Add manually**.
4. Add this configuration:

```json
{
  "mcpServers": {
    "agentdock": {
      "url": "https://agentdock.example.com/mcp"
    }
  }
}
```

After saving, find AgentDock in the installed MCP servers, select **Authenticate**, and complete OAuth in the browser.

For a Bearer Token:

```json
{
  "mcpServers": {
    "agentdock": {
      "url": "https://agentdock.example.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}
```

## WorkBuddy

1. Open WorkBuddy and select **Skills** on the left.
2. Select **MCP Servers** on the right.
3. Select **Configure MCP**.
4. Add this configuration:

```json
{
  "mcpServers": {
    "agentdock": {
      "type": "http",
      "url": "https://agentdock.example.com/mcp",
      "disabled": false
    }
  }
}
```

After saving, return to the MCP list, find AgentDock, select **Connect**, and complete OAuth in the browser.

For a Bearer Token:

```json
{
  "mcpServers": {
    "agentdock": {
      "type": "http",
      "url": "https://agentdock.example.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      },
      "disabled": false
    }
  }
}
```

## Verify the connection

Do not stop after the client reports “connected.” Complete a real read-only call, for example:

```text
Call AgentDock's agentdock_context and tell me the AgentDock version, operating system, path model, and available Skill and dynamic MCP capability indexes.
```

If the OAuth page does not open, verify:

```bash
curl -fsS https://agentdock.example.com/.well-known/oauth-authorization-server
curl -fsS https://agentdock.example.com/.well-known/oauth-protected-resource/mcp
```

A `302` from the authorization page usually means AgentDock is redirecting to the client as expected. If the browser does not continue, confirm that the reverse proxy preserves the `Location` header and that the browser or network policy does not block the callback URL.

See [Configuration](../reference/configuration.md#oauth-configuration) for complete authentication settings and [Manual Linux deployment](../getting-started/vps.md) for public deployment.
