# Use local Coding Agents

AgentDock can optionally connect an MCP client to a local Coding Agent through ACP (Agent Client Protocol). This is useful when you want ChatGPT or another MCP client to hand a coding task to Codex, Claude, or Grok Build on the computer where the project actually lives.

This capability is optional and is disabled by default.

## Supported presets

The macOS and Windows apps currently provide these presets:

| Preset | Local adapter AgentDock looks for |
| --- | --- |
| Codex | `codex-acp` or the `@agentclientprotocol/codex-acp` package |
| Claude | `claude-agent-acp` or the `@agentclientprotocol/claude-agent-acp` package |
| Grok Build | `grok` with its ACP/stdio mode |

Install and sign in to the Coding Agent you intend to use before enabling it in AgentDock. AgentDock does not provide or manage the provider account itself.

## macOS and Windows

1. Install the desired Coding Agent or ACP adapter on the same computer as AgentDock.
2. Open AgentDock **Advanced Settings** / the Windows control panel.
3. Turn on **Coding Agent (`启用 Coding Agent`)**.
4. Choose **Codex**, **Claude**, or **Grok Build**.
5. Confirm that AgentDock reports the adapter as detected.
6. Apply the settings and restart the AgentDock service.

After reconnecting your MCP client, `agentdock_context` and `server_info` can show that ACP is enabled.

## What you can ask for

You do not need to operate ACP tools manually. Ask for the outcome, for example:

```text
Use the local Coding Agent on this computer to inspect the repository, fix the failing tests, and verify the change.
```

For a long coding turn, AgentDock starts the work asynchronously and lets the upstream agent continue reading progress events. Permission requests from the Coding Agent remain explicit; AgentDock does not turn a one-time permission choice into permanent authorization.

## Project directories

A Coding Agent session can use any directory that the AgentDock operating-system user can access. AgentDock does not maintain a separate project-directory whitelist.

This is not an operating-system sandbox. If a Coding Agent should only access selected projects, enforce that boundary with the operating-system account, file permissions, container mounts, or other host controls.

## Headless or service deployments

For deployments without the desktop UI, ACP is enabled with host configuration. At minimum, provide an absolute adapter executable path:

```bash
AGENTDOCK_ACP_ENABLED=true
AGENTDOCK_ACP_AGENT=codex
AGENTDOCK_ACP_COMMAND=/absolute/path/to/codex-acp
```

Optional arguments and environment mappings are documented in [Configuration](../reference/configuration.md#coding-agents-acp). Keep credentials in host environment variables rather than embedding secret values in arguments.

## Troubleshooting

If the Coding Agent cannot be enabled or started:

- Verify that the selected adapter is installed and can run under the same user account as AgentDock.
- On macOS or Windows, reopen Advanced Settings and check the adapter detection message.
- For headless deployments, confirm that `AGENTDOCK_ACP_COMMAND` is an absolute executable file path.
- Confirm that any host environment variable referenced by `AGENTDOCK_ACP_ENV_FROM_ENV_JSON` actually exists.
- Use `server_info` to confirm that ACP is enabled, then let the MCP client retry with a new session.

See [Tools](../reference/tools.md#coding-agents-acp) for the user-visible ACP tool boundaries.
