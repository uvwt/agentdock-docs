# Troubleshooting

## Start with these three checks

1. Confirm that the AgentDock process or container is still running.
2. Open `/healthz` on the port shown in the installation guide.
3. Check that the client MCP URL ends with `/mcp` and that its token matches the current instance.

If the connection still fails, record this information before continuing:

- Installation method and operating system.
- AgentDock version.
- Client name and MCP URL, with the token hidden.
- The specific service-log error.
- The last change made before the problem appeared.

Do not provide only a screenshot that says “not working,” and do not publish environment files or complete request headers.

## The service runs, but the client cannot see tools

First confirm the actual process and health state:

```bash
curl -fsS http://127.0.0.1:8765/healthz
```

Then check:

1. The client MCP URL points to `/mcp`.
2. Bearer Token or OAuth configuration matches the server.
3. The client is not caching an old connection; reconnect or create a new session.
4. The running binary is the version you just installed or updated.

A successful `/healthz` request proves only that the process is alive. It does not replace a real MCP initialization and tool call.

## 401 Unauthorized

- Confirm whether the service configures `AGENTDOCK_AUTH_TOKEN`.
- Confirm that the client sends `Authorization: Bearer <token>`.
- Check that the reverse proxy preserves the Authorization header.
- Do not paste the token into public logs or Issues.

## Docker still runs an old image

Download the latest Compose file from `main`, then pull and recreate the container:

```bash
curl -fL https://raw.githubusercontent.com/uvwt/agentdock/main/docker-compose.yml \
  -o docker-compose.yml
docker compose pull
docker compose up -d --force-recreate
```

For a browser deployment, keep `AGENTDOCK_IMAGE` and `AGENTDOCK_BROWSER_ENABLED` in `.env`, then inspect `docker compose ps`, `docker compose images`, and the container logs to confirm that the image tag, digest, and health state are correct.

## A dynamic MCP server cannot be called

Check, in order:

1. The server is enabled in `mcp_manage list`.
2. Required variables are configured in `mcp_manage env_list`.
3. You ran `refresh` after updating the environment.
4. The HTTP URL, stdio command, working directory, and upstream service are reachable.
5. `mcp_tool_search` can list tools, then `mcp_tool_inspect` can inspect the parameters.

Do not echo complete tokens, cookies, or headers in error messages.

## A browser session fails to start

- On macOS, prefer system `browser=chrome`.
- On Windows, choose Chrome or Edge.
- Confirm that the browser runner and `playwright-core` are installed.
- With Docker, use the browser image via `AGENTDOCK_IMAGE` and set `AGENTDOCK_BROWSER_ENABLED=true`.
- In CDP mode, confirm that the debugging port listens only on a loopback address and that the browser was started in debugging mode.

## Desktop actions have no effect

- Confirm that AgentDock runs in the current macOS login session.
- Check Screen Recording and Accessibility permissions.
- Read the active `desktop` Skill instructions again.
- Observe the application state or capture a screenshot both before and after the action; do not rely only on a successful command result.
- Coordinates may become invalid when the window moves, scaling changes, or multiple displays are used. Prefer Accessibility elements.

## Git push fails

```bash
git remote -v
git status --short --branch
git config --show-origin --get credential.helper
```

Confirm the remote URL, current branch, credentials, and repository permissions. Do not place an access token in the remote URL, README, or terminal screenshot.

## A Linux service fails to start

```bash
sudo systemctl status agentdock --no-pager
sudo journalctl -u agentdock -n 100 --no-pager
```

Common causes include incorrect environment-file permissions, an invalid binary path, a port conflict, a runtime user that cannot access the working directory, or a non-loopback listener without authentication.
