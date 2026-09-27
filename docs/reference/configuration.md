# Configuration reference

Desktop users should normally change settings in the AgentDock app. This page is mainly for headless Linux, Docker, automation, and advanced configuration.

## Configuration surfaces

| Environment | Recommended place |
| --- | --- |
| macOS / Windows | AgentDock app and Advanced Settings |
| Linux service | Protected service environment file |
| Docker | Compose `.env`, `environment`, or secrets |
| Foreground process | Environment variables and supported CLI flags |

CLI flags override the matching environment variables they expose.

Default paths are:

```text
~/.agentdock  AgentDock state
~/AgentDock   Default working directory
```

## Core runtime

| Setting | Environment variable | CLI flag | Default |
| --- | --- | --- | --- |
| Listen address | `AGENTDOCK_HOST` | `--host` | `127.0.0.1` |
| Port | `AGENTDOCK_PORT` | `--port` | `8765` |
| Log level | `AGENTDOCK_LOG_LEVEL` | `--log-level` | `info` |
| Chat cards | `AGENTDOCK_MCP_APPS_MODE` | `--mcp-apps-mode` | `full` |
| stdio transport | `AGENTDOCK_STDIO` | `--stdio` | `false` |
| State directory | `AGENTDOCK_HOME` | — | `~/.agentdock` |
| Working directory | `AGENTDOCK_DEFAULT_DIR` | — | `~/AgentDock` |
| Trusted proxy CIDRs | `AGENTDOCK_TRUSTED_PROXY_CIDRS` | — | empty |

Chat-card mode accepts `full`, `compact`, or `off`.

## Authentication

Bearer Token:

```text
AGENTDOCK_AUTH_TOKEN=<random-secret>
```

OAuth settings:

| Variable | Purpose |
| --- | --- |
| `AGENTDOCK_OAUTH_ENABLED` | Enable OAuth |
| `AGENTDOCK_SERVER_URL` | Public HTTPS origin, without `/mcp` |
| `AGENTDOCK_OAUTH_PASSWORD` | Password used on the authorization page |
| `AGENTDOCK_OAUTH_TOKEN_SECRET` | Signing secret for OAuth state and tokens |
| `AGENTDOCK_OAUTH_ACCESS_TOKEN_TTL` | Optional access-token lifetime |

A non-loopback listener must use Bearer Token or OAuth. Public access should use HTTPS; see [Public access](../operations/public-access.md).

## Browser

| Variable | CLI flag | Purpose |
| --- | --- | --- |
| `AGENTDOCK_BROWSER_ENABLED` | `--browser-enabled` | Enable browser tools |
| `AGENTDOCK_BROWSER_EXECUTABLE_PATH` | `--browser-executable-path` | Use a specific Chrome, Chromium, or Edge executable |
| `AGENTDOCK_BROWSER_CDP_URL` | `--browser-cdp-url` | Connect to a configured CDP endpoint |
| `AGENTDOCK_BROWSER_REUSE_EXISTING_CDP` | `--browser-reuse-existing-cdp` | Prefer a reusable local CDP browser |

See [Use the browser](../guides/browser-control.md) for normal setup and usage.

## Coding Agents

| Variable | Purpose |
| --- | --- |
| `AGENTDOCK_ACP_ENABLED` | Enable Coding Agent tools |
| `AGENTDOCK_ACP_PROFILES_JSON` | Configure available Coding Agent profiles |
| `AGENTDOCK_ACP_DEFAULT_PROFILE` | Choose the default profile |
| `AGENTDOCK_ACP_MAX_CONCURRENT_PROMPTS` | Limit concurrent prompts |
| `AGENTDOCK_ACP_INTERACTION_TIMEOUT_MS` | Set the interaction timeout |

Desktop users should configure Coding Agents in the AgentDock UI. Headless deployments can use these variables. See [Use local Coding Agents](../guides/coding-agents.md).

## Other settings

NexusDock pairing is stored as a paired device identity rather than a normal runtime environment variable. See [Connect AgentDock](../operations/nexusdock-connect.md).

Managed Skill and dynamic MCP credentials are configured through their own environment-management interfaces instead of global AgentDock variables.

Project rules use `AGENTS.md`; they are not runtime environment settings.
