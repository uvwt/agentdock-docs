---
sidebar_position: 1
slug: /intro
---

# AgentDock

AgentDock lets MCP-compatible AI clients read files, run commands, operate Git, use browser automation, and connect external services on your computers and servers.

Access is limited by the operating-system user, Docker mounts, and the capabilities you enable.

## First use

Choose the installation guide for your current environment:

| Current environment | Recommended guide |
| --- | --- |
| macOS | [macOS installation](./getting-started/macos.md) |
| Windows 11 | [Windows installation](./getting-started/windows.md) |
| Linux server or desktop | [Linux installation](./getting-started/linux.md) |
| Docker already installed | [Docker installation](./getting-started/docker.md) |

After installation, add the MCP URL and token shown in the guide to your client using **Streamable HTTP**.

## What can it do?

Describe the goal directly, for example:

- “Find out why this project fails to start, fix it, and verify the result.”
- “Read this repository, change the code, and commit it.”
- “Open a website, complete a lookup, and save the result as a file.”
- “Install and use a Skill or connect an external MCP service.”
- “Use the browser, desktop automation, or a coding tool such as Codex, Claude, or Grok.”
- “Break this long task into steps and keep its progress updated.”

The agent selects the appropriate tools based on your request.

If you want web ChatGPT to operate your computer, follow [Connect ChatGPT to AgentDock](./guides/chatgpt.md) after installing with a public address.

## Where data is stored

A native installation uses these defaults:

```text
~/.agentdock   AgentDock state, tasks, Skills, and configuration
~/AgentDock    Default working directory
```

Docker stores both categories in Docker volumes by default. Removing the program or container does not necessarily remove its data; confirm what must be preserved before cleanup.

## Common entry points

- [Connect AgentDock from different clients](./guides/mcp-clients.md)
- [Connect ChatGPT to AgentDock](./guides/chatgpt.md)
- [Use Skills](./concepts/skills.md)
- [Tasks and progress](./concepts/tasks.md)
- [Browser automation](./guides/browser-control.md)
- [Use a local Coding Agent](./guides/coding-agents.md)
- [Connect external MCP servers](./concepts/dynamic-mcp.md)
- [Use NexusDock for multiple AgentDock devices](./concepts/nexusdock.md)
- [Complete configuration reference](./reference/configuration.md)
- [Troubleshooting](./operations/troubleshooting.md)
