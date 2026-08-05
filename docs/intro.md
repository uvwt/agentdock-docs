---
sidebar_position: 1
slug: /intro
---

# AgentDock

AgentDock lets MCP-compatible AI clients read files, run commands, operate Git, enable browser automation, and connect external services on your computers and servers.

It does not decide the permission boundary for you. What AgentDock can access depends on the operating-system user that runs it, the directories mounted into Docker, and the capabilities you enable.

## First use

Open [Install AgentDock](./getting-started/install.md) and choose the native installer for your current system. Choose Docker when it is already part of your environment or when you need runtime isolation.

| Current environment | Recommended guide |
| --- | --- |
| macOS | [macOS installation](./getting-started/macos.md) |
| Windows 11 | [Windows installation](./getting-started/windows.md) |
| Linux server or desktop | [Linux installation](./getting-started/linux.md) |
| Docker already installed | [Docker installation](./getting-started/docker.md) |

After installation, add the MCP URL and token shown in the guide to your client. You do not need to understand the complete configuration, systemd, WSL, container volumes, or reverse proxies before your first connection.

## What can it do?

After connecting, describe a goal directly, for example:

- “Find out why this project fails to start, fix it, and verify the result.”
- “Read this repository, change the code, and commit it.”
- “Open a website, complete a lookup, and save the result as a file.”
- “Install and use a Skill.”
- “Connect an external MCP service.”
- “Use the browser, desktop automation, or a coding tool such as Codex, Claude, or Grok.”
- “Break this long task into steps and keep its progress updated.”

The agent selects file, command, Git, browser, Skill, or external MCP tools based on the task. Regular users rarely need to call individual tools manually.

If you mainly want web ChatGPT to operate your Windows PC, follow [Connect ChatGPT to AgentDock](./guides/chatgpt.md) after installing with a public address.

## Where data is stored

A native installation uses these defaults:

```text
~/.agentdock   AgentDock state, tasks, Skills, and configuration
~/AgentDock    Default working directory
```

Docker stores both categories in Docker volumes by default. Removing the program or container does not necessarily remove its data; confirm what must be preserved before running cleanup commands.

## Common entry points

- [Connect AgentDock from different clients](./guides/mcp-clients.md)
- [Connect ChatGPT to AgentDock](./guides/chatgpt.md)
- [Use Skills](./concepts/skills.md)
- [Tasks and progress](./concepts/tasks.md)
- [Browser automation](./guides/browser-control.md)
- [Connect external MCP servers](./concepts/dynamic-mcp.md)
- [Complete configuration reference](./reference/configuration.md)
- [Troubleshooting](./operations/troubleshooting.md)

Open “Advanced operations” only when you need reverse-proxy changes, system services, container mounts, or the complete environment-variable reference.
