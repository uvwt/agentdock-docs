# Security model

AgentDock is a tool runtime, not a complete operating-system sandbox. Security comes from the listen address and authentication, runtime-user permissions, Docker volumes, the systemd service user, network policy, and each tool's own input validation.

## Regular local use

When using AgentDock only on your own computer, follow these rules first:

- Keep the listen address at `127.0.0.1`.
- Do not run as an administrator or root.
- Mount or authorize only the directories required by the task.
- Use dedicated profiles for browser and desktop automation, and confirm send, delete, upload, and authorization actions.
- Do not commit `.env` files, tokens, cookies, screenshots, or private logs to a repository.

Continue to the authentication and reverse-proxy sections only when LAN or public access is required.

## Authentication

- When listening only on a loopback address, AgentDock may run without authentication in a trusted local environment.
- A non-loopback listener must configure `AGENTDOCK_AUTH_TOKEN` or enable OAuth.
- A public endpoint must use HTTPS; do not expose plaintext HTTP `/mcp` directly.
- `/healthz` only indicates that the process is alive. It does not prove that MCP authentication and tool calls work.
- Logs must not record Authorization headers, OAuth codes, tool-argument bodies, or secret values.

Bearer Token:

```text
AGENTDOCK_AUTH_TOKEN=<random-secret>
```

OAuth:

```text
AGENTDOCK_OAUTH_ENABLED=true
AGENTDOCK_SERVER_URL=https://agentdock.example.com
AGENTDOCK_OAUTH_PASSWORD=<login-password>
AGENTDOCK_OAUTH_TOKEN_SECRET=<random-signing-secret>
```

## File and command boundaries

Relative paths resolve from `~/AgentDock`, but the default working directory is not a strong security boundary:

- A native deployment is constrained by the current operating-system user's permissions.
- A Docker deployment is constrained by volumes and the container user.
- A systemd deployment should use a dedicated low-privilege user with access only to required project directories.
- Windows uses protected DACLs; the WSL runtime is constrained by the default Linux user in the selected distribution.

Do not run AgentDock as an administrator or root unless the task genuinely requires it and the environment is isolated.

## Skills and dynamic MCP

- Skill packages must not contain tokens, cookies, sessions, private keys, or device login state.
- Skill and MCP secrets should be stored through their respective isolated-environment management entry points.
- `env_list` is only for checking whether variables are configured and must not return secret values.
- An external MCP server is an independent trust boundary; review its source, transport, and tool capabilities before registration.

## Browser and desktop

- Use a dedicated browser profile instead of reusing the primary daily profile.
- Bind CDP debugging ports only to `127.0.0.1`.
- The macOS Desktop Skill runs in a high-privilege login session; grant only the required Screen Recording and Accessibility permissions.
- Upload, send, delete, and authorization actions require explicit confirmation and post-action verification.

## Reverse proxy

Set `AGENTDOCK_TRUSTED_PROXY_CIDRS` only when the reverse proxy is truly on a trusted network and rewrites `X-Forwarded-For`. Do not trust proxy headers supplied directly by public clients.

## Artifacts

Screenshots and published files may contain sensitive information. A signed URL expires, but anyone who obtains it can still access the content while it remains valid. Inspect files before publishing, and avoid exposing browser login state, desktop screenshots, environment files, and private logs.
