# Troubleshooting

## Start here

Check these first:

1. AgentDock or its container is still running.
2. `http://127.0.0.1:8765/healthz` responds locally.
3. The MCP client URL ends with `/mcp`.
4. The client uses the current Bearer Token or OAuth connection.
5. The running AgentDock version is the version you expect.

When reporting a problem, include the installation method, operating system, AgentDock version, client name, and the relevant error log. Hide tokens and private addresses.

## Client connects but cannot see tools

Reconnect or refresh the MCP client and start a new session to clear cached tool schemas. Confirm authentication, then verify one real MCP connection instead of relying only on `/healthz`. When connecting through NexusDock, if a node's live tool is missing from the cached catalog or returns `TOOL_CONTRACT_MISMATCH`, you can use `node_tool_search` and `node_tool_call` as a compatibility fallback.

## NexusDock pairing and remote access

- **Pairing code does not work:** Pairing codes are 6 digits, valid for 5 minutes, and single-use. If a code has expired or was already submitted, generate a new one in NexusDock and pair again.
- **Device never appears or shows offline:** Confirm AgentDock is running on the target computer, the computer is awake, and the NexusDock service address is `https://mcp.nexusdock.co/` (or your self-hosted NexusDock HTTPS origin). Refresh the **Devices** page after reconnecting.
- **OAuth authorization failed or cancelled:** Restart the connection from the AI client and confirm you are signed in to the intended NexusDock account. If the client was previously authorized, revoke it in NexusDock settings and connect again.
- **MCP access token stopped working:** Resetting the MCP access token immediately invalidates the old token. Update every client that used the old token with the new value (shown once).

If NexusDock displays a request ID alongside an error, include that request ID when asking for help—never share access tokens, OAuth credentials, cookies, pairing codes, device tokens, private keys, or sensitive Recall content.

## 401 Unauthorized

Check that the client sends the current Bearer Token or completes OAuth. If a reverse proxy is used, make sure it preserves the `Authorization` header.

## Public address does not work

For Cloudflare Tunnel:

- confirm the Tunnel is connected;
- native installs should normally forward to `http://127.0.0.1:8765`;
- Docker should forward to `http://agentdock:8765`;
- AgentDock's public address is the HTTPS origin without `/mcp`;
- the MCP client URL adds `/mcp`.

A Cloudflare `502` usually means the Tunnel is reachable but cannot reach AgentDock locally.

## Docker is still using an old image

```bash
docker compose pull
docker compose up -d --force-recreate
docker compose ps
```

Check `docker compose logs` if the new container does not become healthy.

## Dynamic MCP cannot connect

Check that the connection is enabled, required environment values are configured, and the upstream URL or local command is reachable. Refresh the MCP connection after changing its environment.

## Browser session cannot start

Confirm Chrome, Chromium, or Edge is installed. For Docker, use the browser image and enable browser tools. For native headless Linux, configure a browser executable path when automatic discovery cannot find one.

## macOS desktop actions do nothing

Confirm AgentDock is running in the current login session and that the hosting app has Screen Recording and Accessibility permissions. Recheck the screen after the action instead of relying only on command success.

## Linux service does not start

```bash
sudo systemctl status agentdock --no-pager
sudo journalctl -u agentdock -n 100 --no-pager
```

Common causes are a port conflict, invalid environment values, incorrect file permissions, or a service account that cannot access the working directory.
