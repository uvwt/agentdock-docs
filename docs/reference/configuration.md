# Configuration

AgentDock Core does not read a single YAML, JSON, or TOML configuration file. Runtime settings come from environment variables, with a small set of common options also available as command-line flags. Desktop installers and control panels manage those settings for you where applicable.

:::tip
For a first installation, use the platform guide. This page is a reference for runtime behavior, headless deployments, and advanced configuration.
:::

## Choose the right configuration surface

| Scenario | Recommended configuration surface |
| --- | --- |
| macOS or Windows desktop app | AgentDock control panel / Advanced Settings |
| Direct foreground process | Environment variables and supported CLI flags |
| Docker or Compose | Container `environment`, `env_file`, or secret injection |
| Linux service | Protected service environment file |
| NexusDock | Pair the device with `agentdock nexus pair`; do not configure legacy Nexus credentials in the Core environment |

Do not commit tokens, passwords, cookies, private keys, OAuth secrets, or device identities to source control.

## Precedence and directories

For ordinary Core runtime settings, AgentDock resolves values in this order:

1. Built-in defaults.
2. Environment variables.
3. Supported CLI flags.

CLI flags override only the settings they expose. Authentication secrets and ACP profile JSON, for example, remain environment-driven in headless deployments.

The two primary directories are based on the operating-system user that runs AgentDock:

```text
~/.agentdock   Internal state, managed Skills, tasks, MCP configuration, browser data, and artifacts
~/AgentDock    Default working directory for relative file and command operations
```

Set `AGENTDOCK_HOME` or `AGENTDOCK_DEFAULT_DIR` to an absolute path when a different location is required. For stronger isolation, use operating-system accounts, permissions, or container mounts rather than treating an AgentDock path setting as a sandbox.

## CLI flags

The current server entry point exposes these service flags:

| Flag | Environment variable | Default | Purpose |
| --- | --- | --- | --- |
| `--host` | `AGENTDOCK_HOST` | `127.0.0.1` | HTTP bind address |
| `--port` | `AGENTDOCK_PORT` | `8765` | HTTP port, `1` to `65535` |
| `--log-level` | `AGENTDOCK_LOG_LEVEL` | `info` | `debug`, `info`, `warn`, or `error` |
| `--mcp-apps-enabled` | `AGENTDOCK_MCP_APPS_ENABLED` | `true` | Expose optional MCP Apps UI resources and metadata |
| `--browser-enabled` | `AGENTDOCK_BROWSER_ENABLED` | `false` | Expose browser automation tools |
| `--browser-executable-path` | `AGENTDOCK_BROWSER_EXECUTABLE_PATH` | empty | Absolute Chrome, Chromium, or Edge executable path |
| `--browser-cdp-url` | `AGENTDOCK_BROWSER_CDP_URL` | empty | Existing Chromium CDP endpoint configured by the user |
| `--browser-reuse-existing-cdp` | `AGENTDOCK_BROWSER_REUSE_EXISTING_CDP` | `false` | Reuse one uniquely discovered local CDP browser |
| `--stdio` | `AGENTDOCK_STDIO` | `false` | Serve JSON-RPC over stdio instead of HTTP |

Example:

```bash
agentdock \
  --host 127.0.0.1 \
  --port 8765 \
  --log-level info
```

NexusDock is intentionally not a server flag. Pairing establishes a device identity that AgentDock loads separately from normal runtime settings.

## Core runtime variables

| Environment variable | Default | Purpose |
| --- | --- | --- |
| `AGENTDOCK_HOME` | `~/.agentdock` | Private AgentDock state root; an explicit value must resolve to an absolute directory |
| `AGENTDOCK_DEFAULT_DIR` | `~/AgentDock` | Default working directory; an explicit value must resolve to an absolute directory |
| `AGENTDOCK_HOST` | `127.0.0.1` | HTTP bind address; a non-loopback listener requires Bearer Token or OAuth authentication |
| `AGENTDOCK_PORT` | `8765` | HTTP port |
| `AGENTDOCK_LOG_LEVEL` | `info` | Logging level |
| `AGENTDOCK_STDIO` | `false` | Use stdio transport instead of the HTTP server |
| `AGENTDOCK_MCP_APPS_ENABLED` | `true` | Expose optional MCP Apps UI resources and metadata |
| `AGENTDOCK_COMMAND_ENV_FROM_ENV_JSON` | empty | Explicit map of child-process variable names to host variable names for `exec_command` |
| `AGENTDOCK_TRUSTED_PROXY_CIDRS` | empty | Comma-separated trusted reverse-proxy CIDRs |

Boolean values should be written as `true` or `false`.

`AGENTDOCK_COMMAND_ENV_FROM_ENV_JSON` is allowlist-style mapping, not wholesale environment inheritance. For example:

```bash
AGENTDOCK_COMMAND_ENV_FROM_ENV_JSON='{"HTTP_PROXY":"HTTP_PROXY","HTTPS_PROXY":"HTTPS_PROXY"}'
```

The reserved Skill runtime key `SKILL_DATA_DIR` cannot be supplied through this mapping or request-level command environment values.

## Bearer Token authentication

The simplest HTTP authentication method is:

```bash
export AGENTDOCK_AUTH_TOKEN="$(openssl rand -hex 32)"
```

Clients calling `/mcp` send:

```http
Authorization: Bearer <token>
```

A loopback-only HTTP listener may run without authentication. A non-loopback listener without Bearer Token or OAuth is rejected at startup.

## OAuth configuration

OAuth is useful for remote clients that support browser authorization. Enable it with:

| Environment variable | Requirement | Purpose |
| --- | --- | --- |
| `AGENTDOCK_OAUTH_ENABLED` | `true` | Enable OAuth |
| `AGENTDOCK_SERVER_URL` | required | Public AgentDock origin, such as `https://agentdock.example.com` |
| `AGENTDOCK_OAUTH_PASSWORD` | at least 12 characters | Password entered on the authorization page |
| `AGENTDOCK_OAUTH_TOKEN_SECRET` | at least 32 bytes | Stable signing secret for OAuth state and tokens |
| `AGENTDOCK_OAUTH_ACCESS_TOKEN_TTL` | optional, default `1h` | Access-token lifetime; accepts Go durations, integer days such as `90d`, or `never` |

Example:

```bash
AGENTDOCK_OAUTH_ENABLED=true
AGENTDOCK_SERVER_URL=https://agentdock.example.com
AGENTDOCK_OAUTH_PASSWORD=<long-login-password>
AGENTDOCK_OAUTH_TOKEN_SECRET=<random-secret-at-least-32-bytes>
```

`AGENTDOCK_SERVER_URL` is an origin, not the MCP path. Public non-loopback origins must use HTTPS. The client MCP URL appends `/mcp`, for example `https://agentdock.example.com/mcp`.

Bearer Token and OAuth can coexist. Do not retain an unused secret simply because an older deployment had one.

## Trusted reverse proxies

AgentDock does not trust arbitrary `X-Forwarded-For` values. Configure proxy CIDRs only when the proxy is controlled and rewrites the forwarding chain correctly:

```bash
AGENTDOCK_TRUSTED_PROXY_CIDRS=127.0.0.0/8,::1/128
```

Do not trust broad public networks. Client-address handling participates in authentication and rate-limiting decisions.

## Pair NexusDock

Current AgentDock uses a paired device identity for NexusDock. Legacy `AGENTDOCK_NEXUS_ENDPOINT` and `AGENTDOCK_NEXUS_TOKEN` values are not a supported Core configuration source; the server clears them before startup and loads Nexus identity only from a successful pairing.

Generate a one-time pairing code in **NexusDock → Settings → System & Nodes**, then run the command shown by the console on the AgentDock device. The generic form is:

```bash
agentdock nexus pair \
  --endpoint https://nexus.example.com \
  --code <pairing-code> \
  --name <optional-device-name>
```

Check the saved pairing state with:

```bash
agentdock nexus status
```

Restart AgentDock after pairing. Once the identity is loaded, the direct AgentDock connection can expose Nexus-backed Recall, Workflow, Evolution, and Private Notes capabilities, while the device also maintains an outbound Nexus bridge connection.

For multi-device routing and the fleet MCP endpoint, see [NexusDock](../concepts/nexusdock.md).

## Coding Agents (ACP)

ACP is disabled by default. macOS and Windows users should normally configure it in the AgentDock UI. Headless deployments use profile-based configuration:

| Environment variable | Default | Purpose |
| --- | --- | --- |
| `AGENTDOCK_ACP_ENABLED` | `false` | Enable ACP tools |
| `AGENTDOCK_ACP_PROFILES_JSON` | empty | JSON array of ACP profiles |
| `AGENTDOCK_ACP_DEFAULT_PROFILE` | first enabled profile | Profile used when a tool call omits `profile_id` |
| `AGENTDOCK_ACP_MAX_CONCURRENT_PROMPTS` | `2` | Concurrent prompt limit, `1` to `8` |
| `AGENTDOCK_ACP_INTERACTION_TIMEOUT_MS` | `300000` | Interaction timeout in milliseconds, `1000` to `3600000` |

A profile contains `id`, `kind`, `command`, optional `args`, optional `env_from_env`, and `enabled`. Built-in kinds `codex`, `claude`, and `grok` use matching fixed IDs; custom profiles can use other unique IDs.

Example:

```bash
AGENTDOCK_ACP_ENABLED=true
AGENTDOCK_ACP_PROFILES_JSON='[{"id":"codex","kind":"codex","command":"/absolute/path/to/codex-acp","enabled":true}]'
AGENTDOCK_ACP_DEFAULT_PROFILE=codex
```

`env_from_env` maps variable names and does not store their values. Keep provider credentials in the host environment or the provider's own login store.

The older `AGENTDOCK_ACP_AGENT`, `AGENTDOCK_ACP_COMMAND`, `AGENTDOCK_ACP_ARGS_JSON`, and `AGENTDOCK_ACP_ENV_FROM_ENV_JSON` variables are read only as a legacy single-profile compatibility path when no profile JSON is present. New configurations should use profiles.

See [Use local Coding Agents](../guides/coding-agents.md) for adapter discovery and verification.

## Workspace rules

Project rules are not configured through environment variables. The fixed global rule file is `~/.agentdock/AGENTS.md`; project rules use `<workspace>/AGENTS.md` and may be inherited through subdirectories.

Call `workspace_context` before project operations, after switching workspaces, or when rules may have changed. Its optional `workdir` selects the context for that request only. It also indexes `<workspace>/.agents/skills/*/SKILL.md` and returns exact Skill provenance and references without injecting Skill bodies.

## Browser tools

Browser automation is disabled by default:

| Environment variable | Default | Purpose |
| --- | --- | --- |
| `AGENTDOCK_BROWSER_ENABLED` | `false` | Expose browser tools |
| `AGENTDOCK_BROWSER_EXECUTABLE_PATH` | empty | Absolute browser executable when auto-detection is not appropriate |
| `AGENTDOCK_BROWSER_CDP_URL` | empty | User-configured existing Chromium CDP endpoint |
| `AGENTDOCK_BROWSER_REUSE_EXISTING_CDP` | `false` | Discover and reuse a unique local CDP browser |

AgentDock supports Chrome, Chromium, and Microsoft Edge. Without CDP reuse, it launches and owns an isolated browser process. With an external CDP browser, AgentDock attaches to that browser and creates a dedicated target; closing the AgentDock session does not terminate the external browser.

A per-call `browser_session` `cdp_url` is restricted to loopback endpoints. Named or remote CDP endpoints must be configured by the user through AgentDock settings. Persistent `profile_id`, cookie injection, and localStorage injection are not combined with an external CDP browser.

See [Browser automation](../guides/browser-control.md) for usage and safety boundaries.

## Managed Skill and dynamic MCP environments

Managed Skills and dynamic MCP servers keep their business credentials outside the package definition. Use `skill_manage` and `mcp_manage` environment actions rather than putting secrets in a Skill package, MCP registry entry, or permanent global environment.

`env_list` actions report variable names and configuration state, not plaintext values. Managed Skills also receive the reserved `SKILL_DATA_DIR` only when commands run with the exact managed `skill_ref`; shared and workspace Skills do not inherit it.

## Private Notes

`private_note_manage` is available when the current AgentDock is paired with NexusDock. It uses the NexusDock Private Notes service and is not configured through a local private-notes directory.

Search returns safe metadata; only an explicit `read` returns plaintext. Writes and deletes require confirmation according to the tool contract. Keep private-note encryption material and NexusDock administrator credentials separate from AgentDock device configuration.

## Check the current runtime

Call `agentdock_context` to inspect the runtime and capability bootstrap for the current connection. A direct AgentDock response includes runtime version, operating system, architecture, paths, Skill provenance, dynamic MCP summaries, and optional ACP/Nexus-backed indexes.

Use the MCP client's `tools/list` as the source of truth for tools exposed by that connection. Neither `agentdock_context` nor `tools/list` returns authentication tokens, OAuth passwords, signing keys, provider secrets, or NexusDock device tokens.

## Startup validation

AgentDock refuses invalid configurations. Common checks include:

- Port is between `1` and `65535`.
- Log level is valid.
- Non-loopback HTTP listening has authentication.
- OAuth variables are complete and satisfy minimum lengths.
- A public `AGENTDOCK_SERVER_URL` uses HTTPS.
- Trusted proxy entries are valid CIDRs.
- Enabled ACP profiles have valid unique IDs and executable absolute commands.
- Browser executable and CDP URL settings are structurally valid.

After deployment, verify at least:

```bash
curl -fsS http://127.0.0.1:8765/healthz
```

Then complete an MCP `initialize` and one real tool call from the actual client. See the [Security model](../operations/security.md) for deployment boundaries.
