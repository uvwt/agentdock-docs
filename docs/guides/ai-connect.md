# Let your AI connect NexusDock

Copy the message below into the AI assistant you already use. If it can manage native MCP connections, it can follow this guide, open OAuth authorization, and verify the tools for you.

:::info[Written for AI assistants]
If you are configuring NexusDock yourself, use [Connect from different clients](./mcp-clients.md) instead. This page contains instructions intended for an AI assistant to read and execute on your behalf.
:::

## Copy this message to your AI

You may need to approve a sign-in or authorization yourself. The assistant should handle every other step it actually has permission to perform.

```text
Read https://docs.nexusdock.co/docs/guides/ai-connect and follow the official guide to connect NexusDock for me. Complete everything you can automatically, and only ask me when my confirmation is required.
```

## Instructions for AI assistants

Follow these instructions only when the user explicitly asks you to connect NexusDock. Use your client's native MCP integration and authorized configuration tools, not an imitation of MCP.

### 1. Install the NexusDock Skill first (if supported)

Before configuring MCP, check whether this AI client supports native Skills and lets you install one. Read the official [`SKILL.md`](https://www.nexusdock.co/skills/nexusdock/SKILL.md), review its contents, install it into this AI client with any required approval, and verify the Skill appears in its Skill list. Do not install it on a remote AgentDock device as a substitute. If this client cannot install Skills, skip this optional step and continue to MCP setup.

### 2. Check MCP support and how it must be configured

First determine whether the AI client itself supports registering a remote Streamable HTTP MCP server.

- If the client supports MCP but you cannot change its MCP or connector settings from this conversation, do not report the client as unsupported.
- Identify the current client, look up its latest native MCP or connector setup flow from reliable current documentation or the client's own settings UI, and guide the user through it step by step: where to open settings, what connection type to choose, where to enter the NexusDock endpoint, and when OAuth approval is required.
- Do not invent stale menu names or unsupported steps.
- After the user completes configuration, continue by verifying that the NexusDock tools are actually registered.
- Only report MCP as unsupported when the client itself truly lacks the capability. Never substitute scripts, proxies, shell commands, or one-off HTTP requests.

### 3. Register the official MCP endpoint

Add NexusDock as a remote MCP connection using the official endpoint in the client's native MCP or connector settings:

```text
https://mcp.nexusdock.co/mcp
```

Do not register an unrelated local bridge or a custom script as a substitute.

### 4. Use OAuth and let the user approve access

Choose the client's OAuth authorization flow. Open the official sign-in and consent screen as supported by the client; only the user should enter credentials or approve access. Do not request access tokens, passwords, or verification codes in the chat, or silently fall back to a manual token.

### 5. Verify tool registration and a real read-only call

Check that NexusDock tools appear in the AI client's native tool list. Where permitted, call `agentdock_context` through that registered MCP connection to confirm access. A successful HTTP response or a scripted call alone is not proof of native integration.

## Official NexusDock Skill

The Skill helps compatible AI assistants recognize requests to list online devices, use your real computer, or operate another device, and then select the right NexusDock MCP tools. It does not provide device permissions on its own.

- [View Skill source (`SKILL.md`)](https://www.nexusdock.co/skills/nexusdock/SKILL.md)
- [Download Skill ZIP](https://www.nexusdock.co/skills/nexusdock.zip)

Installing the Skill is optional and depends on each client's support. MCP connection and OAuth must still be configured separately. A Skill cannot automatically run in every AI product just because it is published online.

## If your AI cannot complete setup

Some clients support MCP even though the assistant inside them cannot edit connection settings. That is a configuration-permission limitation, not an MCP compatibility failure. In this case, the assistant should identify the current client, find its latest native MCP setup instructions, and guide the user through the exact steps interactively. Once the user finishes, the assistant should resume and verify the registered NexusDock tools.

If the client itself truly does not support remote MCP, say so clearly instead of fabricating a workaround.

- [Manual client setup](./mcp-clients.md)
- [Connect with ChatGPT](./chatgpt.md)
- [Connection troubleshooting](../operations/troubleshooting.md)
