# Linux installation

AgentDock provides precompiled binaries for Linux x64 and ARM64.

The default flow below allows local access only, suitable for initial setup and server deployments.

## 1. Install

Run in terminal:

```bash
curl -fsSL https://github.com/uvwt/agentdock/releases/latest/download/install.sh \
  -o /tmp/install-agentdock.sh
sudo env AGENTDOCK_NONINTERACTIVE=true sh /tmp/install-agentdock.sh
```

The installer automatically detects systemd or OpenRC, creates a low-privilege runtime user, generates a Bearer Token, starts the service, and verifies health.

## 2. Verify service

systemd:

```bash
sudo systemctl status agentdock --no-pager
curl -fsS http://127.0.0.1:8765/healthz
```

OpenRC:

```sh
sudo rc-service agentdock status
curl -fsS http://127.0.0.1:8765/healthz
```

A healthy response contains `"ok": true`.

## 3. View Bearer Token

```bash
sudo awk -F= '/^AGENTDOCK_AUTH_TOKEN=/{print $2}' \
  /etc/agentdock/agentdock.env
```

Save the token in your password manager. Do not include it in Git, screenshots, or public chats.

## 4. Connect MCP client

When the client is on the same Linux machine, enter:

```text
Transport    Streamable HTTP
URL          http://127.0.0.1:8765/mcp
Headers      Authorization: Bearer <your token>
```

When AgentDock runs on a remote server, establish an SSH tunnel from your computer:

```bash
ssh -L 8765:127.0.0.1:8765 <username>@<server-address>
```

Keep the SSH session open, then connect your local client to `http://127.0.0.1:8765/mcp`.

:::tip
**Setup complete:** once the service is running, health checks pass, and the MCP URL and token are added to your client.
:::

## Optional: Create public address

The default installation allows local access only. When connecting from ChatGPT, mobile devices, or other remote clients, rerun interactive installation:

```bash
sudo sh /tmp/install-agentdock.sh
```

The installer asks if you have a Cloudflare-managed domain:

- No domain: automatically creates a temporary `trycloudflare.com` address for quick testing.
- Have a domain: complete the [fixed domain setup guide](../guides/fixed-domain.md), then enter the resulting HTTPS public origin and Tunnel Token when the installer asks.

After installation, the terminal displays the public MCP URL and connection credentials. Temporary addresses may change after service restarts; rerun the installer and update the client when that happens. Existing Bearer Token and OAuth credentials will be preserved.

Public access requires authentication. For detailed parameters and log locations, see [Advanced Linux configuration](../operations/linux.md#cloudflare-tunnel).

## Update

Download and run Step 1 again. Tasks, Skills, configuration, and working directories are preserved.

## Next steps

- For browser automation: install Chrome, Chromium, or Microsoft Edge on the host and enable browser tools; set `AGENTDOCK_BROWSER_EXECUTABLE_PATH` if not detected automatically. Docker browser images are needed only when you want Chromium contained in Docker. See [Browser automation](../guides/browser-control.md).
- For Alpine, custom directories/ports, manual service management, and uninstallation: see [Advanced Linux configuration](../operations/linux.md).
- For manual systemd, reverse proxy, and OAuth maintenance: see [Manual Linux deployment](./vps.md).
- If startup fails: see [Troubleshooting](../operations/troubleshooting.md).
- For public access: read the [Security model](../operations/security.md) first.
