# Use local Coding Agents

AgentDock can optionally connect an MCP client to local Coding Agents through ACP (Agent Client Protocol). This lets ChatGPT or another MCP client hand a coding task to Codex, Claude, Grok Build, or a custom ACP adapter on the computer where the project actually lives.

ACP is optional and disabled by default.

## Supported profiles

The macOS and Windows apps provide built-in profiles and also allow custom adapters:

| Profile kind | Local adapter AgentDock uses |
| --- | --- |
| Codex | `codex-acp` or the `@agentclientprotocol/codex-acp` package |
| Claude | `claude-agent-acp` or the `@agentclientprotocol/claude-agent-acp` package |
| Grok Build | `grok agent stdio` |
| Custom | An absolute adapter executable path plus optional arguments |

Built-in profile IDs are fixed as `codex`, `claude`, and `grok`, so each built-in kind has one profile. You can create multiple custom profiles with different IDs. One enabled profile is selected as the default; calls can choose another profile explicitly with `profile_id`.

Install and sign in to the provider you intend to use before enabling its adapter. AgentDock starts the adapter but does not manage provider accounts or copy provider credentials into its own configuration.

## macOS and Windows

1. Install the desired Coding Agent and any required ACP adapter on the same computer as AgentDock.
2. Open **Advanced Settings** on macOS or the AgentDock control panel on Windows.
3. Enable **Coding Agent (ACP)**.
4. Add or enable a built-in profile, or add a Custom profile with its adapter command and arguments.
5. Choose one enabled profile as the default.
6. Confirm AgentDock detects the adapter, save the settings, and let AgentDock restart Core.

After reconnecting the MCP client, `agentdock_context` reports `default_profile` and the enabled `profiles`. The current connection's `tools/list` should include `acp_session`, `acp_prompt`, and `acp_interaction`.

## What you can ask for

Describe the outcome directly, for example:

```text
Use the local Coding Agent on this computer to inspect the repository, fix the failing tests, and verify the change.
```

AgentDock exposes a small management surface instead of mirroring every ACP protocol method:

- `acp_session`: `info`, `new`, `list`, `inspect`, `open`, `update`, `close`, `delete`.
- `acp_prompt`: `start`, `events`, `cancel`.
- `acp_interaction`: `list`, `respond`.

`open` handles resume/load negotiation internally, `new` can fork from another managed session through `from_session_id` when the adapter supports it, and `update` changes advertised session modes or configuration options. Prompt steering is handled internally when supported; there is no separate public steering action.

A long prompt starts asynchronously and returns a Run ID. The upstream agent reads ordered events until the Run settles. Permission responses stay explicit and can only choose options offered by the adapter and allowed by AgentDock policy.

## Project directories

A Coding Agent session can use any directory that the AgentDock operating-system user can access. AgentDock does not maintain a separate project-directory whitelist.

This is not an operating-system sandbox. If a Coding Agent should access only selected projects, enforce that boundary with the operating-system account, file permissions, container mounts, or other host controls.

## Headless or service deployments

For deployments without the desktop UI, configure one or more ACP profiles in the Core startup environment. For example, a Codex profile can be configured as:

```bash
AGENTDOCK_ACP_ENABLED=true
AGENTDOCK_ACP_PROFILES_JSON='[{"id":"codex","kind":"codex","command":"/absolute/path/to/codex-acp","enabled":true}]'
AGENTDOCK_ACP_DEFAULT_PROFILE=codex
```

Custom adapters use `kind=custom`, a unique `id`, an absolute `command`, and optional `args` and `env_from_env`. Keep secret values in the host environment; `env_from_env` maps variable names and does not embed secret values in adapter arguments.

`AGENTDOCK_ACP_AGENT`, `AGENTDOCK_ACP_COMMAND`, `AGENTDOCK_ACP_ARGS_JSON`, and `AGENTDOCK_ACP_ENV_FROM_ENV_JSON` are legacy single-profile compatibility inputs. Current configurations should use `AGENTDOCK_ACP_PROFILES_JSON` and `AGENTDOCK_ACP_DEFAULT_PROFILE`.

## Verify the connection

A complete check covers more than whether settings were saved:

1. The adapter command exists and is executable by the user running AgentDock.
2. AgentDock Core is healthy after the configuration change.
3. `agentdock_context` shows the expected default and enabled profiles.
4. The MCP connection exposes `acp_session`, `acp_prompt`, and `acp_interaction`.
5. `acp_session info` can start the selected adapter and return its actual capabilities or authentication methods.

When using a non-default profile, keep passing the same `profile_id` for its session, prompt, and interaction calls.

## Troubleshooting

If a Coding Agent cannot be enabled or started:

- Verify the provider CLI and required ACP adapter separately; finding `codex` does not imply `codex-acp` exists, and finding `claude` does not imply `claude-agent-acp` exists.
- Verify the adapter under the same operating-system user and service environment that run AgentDock, not only in another interactive shell.
- For headless deployments, confirm every enabled profile has an absolute executable `command` and that any host variable referenced by `env_from_env` exists.
- Use `agentdock_context` to confirm the expected profile is enabled, then use `acp_session info` to test the adapter itself.
- If a client cached an older tool schema, refresh the AgentDock connection and start a new conversation after ACP is enabled.

See [Tools](../reference/tools.md#coding-agents-acp) for the public tool contract and [Configuration](../reference/configuration.md#coding-agents-acp) for host configuration.
