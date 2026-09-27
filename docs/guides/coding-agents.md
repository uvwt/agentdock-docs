# Use local Coding Agents

AgentDock can hand coding work from ChatGPT or another MCP client to a local Coding Agent running on the same computer as your project. This can be Codex, Claude, Grok Build, or a custom coding tool.

This feature is optional and disabled by default. Enable it only when you want AgentDock to use a local coding tool for repository work.

## What you can use

AgentDock includes ready-to-configure options for:

- **Codex**
- **Claude**
- **Grok Build**
- **Custom coding tools**

Choose one enabled tool as the default. You can also add multiple custom tools and ask for a different one when a task needs it.

Before enabling a coding tool, install it on the same computer and sign in to its provider if required. AgentDock starts the local integration, but it does not manage the provider account or copy provider credentials into AgentDock settings.

## Installation preparation

- **Codex:** install and sign in to Codex. AgentDock also needs `codex-acp`.
- **Claude:** install and sign in to Claude Code. AgentDock also needs `claude-agent-acp`.
- **Grok Build:** install and sign in to Grok. No extra connection component is required.
- **Custom coding tool:** prepare the executable path and any startup arguments it needs.

The Codex and Claude connection components are installed with npm, so Node.js and npm must be available:

```bash
npm install -g @agentclientprotocol/codex-acp
npm install -g @agentclientprotocol/claude-agent-acp
```

If your system-wide npm directory is not writable, use a user-owned npm prefix instead of running npm with `sudo`.

## macOS and Windows

1. Complete the preparation above for the coding tool you want to use.
2. On macOS, open **Advanced Settings**. On Windows, open the AgentDock control panel.
3. Enable **Coding Agent (ACP)**.
4. Enable Codex, Claude, or Grok Build, or add a custom coding tool.
5. Choose the default coding tool.
6. Save the settings and let AgentDock restart.
7. Reconnect your MCP client or start a new conversation.

You normally do not need to configure internal IDs or ACP tool parameters when using the desktop application.

## Ask for coding work directly

Describe the outcome you want, for example:

```text
Use the local Coding Agent on this computer to inspect the repository, fix the failing tests, and verify the change.
```

If several coding tools are enabled, you can name the one you want in the request, for example:

```text
Use Claude for this repository task and verify the change when finished.
```

AgentDock handles the local session and tool communication in the background. Permission requests still require an explicit allowed choice before work continues.

## Project access

A local Coding Agent can work only in directories that the operating-system user running AgentDock can access.

AgentDock does not add a separate operating-system sandbox around the coding tool. If it should only access selected projects, use operating-system accounts, file permissions, container mounts, or other host controls to enforce that boundary.

## Check that it works

After saving the settings, reconnect the client and start with a harmless task such as:

```text
Use the local Coding Agent to inspect this repository and summarize its structure. Do not modify files.
```

If that succeeds, AgentDock can start the selected coding tool and return its result through the current conversation.

## Troubleshooting

If the Coding Agent does not start:

- Confirm the coding tool is installed and signed in on the same computer and under the same operating-system user that runs AgentDock.
- If that tool requires an ACP connection component, confirm it is installed and available to AgentDock.
- Confirm **Coding Agent (ACP)** is enabled and an enabled tool is selected as the default.
- Save the settings, let AgentDock restart, then reconnect the MCP client or start a new conversation.
- For a custom coding tool, verify its configured executable path and startup arguments.

## Advanced and headless configuration

Headless deployments, custom adapter commands, profile IDs, environment variables, and the low-level ACP session tools are advanced configuration details. See [Configuration](../reference/configuration.md) for host setup and [Tools](../reference/tools.md) for the tool contract.
