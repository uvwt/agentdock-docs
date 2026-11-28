---
sidebar_position: 1
slug: /intro
---

# NexusDock & AgentDock

NexusDock and AgentDock connect MCP-compatible AI clients—such as ChatGPT, Claude, Cursor, and VS Code—to your real computers and servers so they can work with files, run commands, use Git and browsers, share long-term memory, and reuse workflows.

- **AgentDock** runs on each computer or server you want AI to operate and performs the allowed work within your OS user permissions, Docker mounts, and enabled capabilities.
- **NexusDock** (`https://mcp.nexusdock.co` or self-hosted) brings one or more AgentDock devices into a single control center with one Remote MCP endpoint, shared Recall memory, and reusable Workflows—without exposing each machine directly to the internet.

Neither NexusDock nor AgentDock is a chat app or AI model. Your connected AI client decides what to do; AgentDock executes allowed actions on the target device.

## First use

Start with one device, connect your AI, and get work done:

1. Choose the installation guide for your current environment:

| Current environment | Recommended guide |
| --- | --- |
| macOS | [macOS installation](./getting-started/macos.md) |
| Windows 11 | [Windows installation](./getting-started/windows.md) |
| Linux server or desktop | [Linux installation](./getting-started/linux.md) |
| Docker already installed | [Docker installation](./getting-started/docker.md) |

2. Pair the device with [NexusDock](./concepts/nexusdock.md) (`https://mcp.nexusdock.co` or self-hosted) for remote and multi-device access, or connect directly over local/public **Streamable HTTP** MCP.
3. Connect your AI client manually with [Connect from different clients](./guides/mcp-clients.md), or hand setup to your assistant with [Let your AI connect NexusDock](./guides/ai-connect.md).

## What can it do?

Describe the goal directly, for example:

- “Find out why this project fails to start, fix it, and verify the result.”
- “Read this repository, change the code, and commit it.”
- “Open a website, complete a lookup, and save the result as a file.”
- “Install and use a Skill, review a Plugin, or connect an external MCP service.”
- “Use the browser, desktop automation, or a coding tool such as Codex, Claude, or Grok.”
- “Break this long task into steps and keep its progress updated.”

The agent selects the appropriate tools based on your request.

If you want web ChatGPT to operate your computer, pair with [NexusDock](./concepts/nexusdock.md) (recommended) or enable self-hosted public access, then follow [Connect with ChatGPT](./guides/chatgpt.md).

## Where data is stored

A native installation uses these defaults:

```text
~/.agentdock   AgentDock state, tasks, Skills, and configuration
~/AgentDock    Default working directory
```

Docker stores both categories in Docker volumes by default. Removing the program or container does not necessarily remove its data; confirm what must be preserved before cleanup.

## Common entry points

- [Let your AI connect NexusDock](./guides/ai-connect.md)
- [Connect from different clients](./guides/mcp-clients.md)
- [Connect with ChatGPT](./guides/chatgpt.md)
- [Everyday use with NexusDock](./guides/using-nexusdock.md)
- [Use Skills](./concepts/skills.md)
- [Use Plugins](./concepts/plugins.md)
- [Tasks and progress](./concepts/tasks.md)
- [Browser automation](./guides/browser-control.md)
- [Use a local Coding Agent](./guides/coding-agents.md)
- [Connect external MCP servers](./concepts/dynamic-mcp.md)
- [Use NexusDock for multiple AgentDock devices](./concepts/nexusdock.md)
- [NexusDock REST API](./reference/api.md)
- [Complete configuration reference](./reference/configuration.md)
- [Troubleshooting](./operations/troubleshooting.md)
