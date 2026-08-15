# Linux installation

AgentDock provides prebuilt Linux x64 and ARM64 releases. A regular installation does not require Go, Git, or the source repository.

The default flow below accepts only local connections. It is suitable for a first installation and for most server deployments.

## 1. Install

Run:

```bash
curl -fsSL https://github.com/uvwt/agentdock/releases/latest/download/install.sh \
  -o /tmp/install-agentdock.sh
sudo env AGENTDOCK_NONINTERACTIVE=true sh /tmp/install-agentdock.sh
```

The installer selects systemd or OpenRC, creates a low-privilege service user, generates a Bearer Token, starts the service, and completes a health check.

## 2. Verify the service

For systemd:

```bash
sudo systemctl status agentdock --no-pager
curl -fsS http://127.0.0.1:8765/healthz
```

For OpenRC:

```sh
sudo rc-service agentdock status
curl -fsS http://127.0.0.1:8765/healthz
```

A healthy response contains `"ok": true`.

## 3. Read the Bearer Token

```bash
sudo awk -F= '/^AGENTDOCK_AUTH_TOKEN=/{print $2}' \
  /etc/agentdock/agentdock.env
```

Save the token in a password manager. Do not commit it to Git or include it in screenshots or public conversations.

## 4. Connect an MCP client

When the client runs on the same Linux machine, use:

```text
Transport      Streamable HTTP
URL            http://127.0.0.1:8765/mcp
Request header Authorization: Bearer <your token>
```

When AgentDock runs on a remote server, create an SSH tunnel from your computer:

```bash
ssh -L 8765:127.0.0.1:8765 <username>@<server-address>
```

Keep the SSH session open and let the local client connect to `http://127.0.0.1:8765/mcp`.

:::tip
Installation is complete when the service is running, the health check succeeds, and the client has the MCP URL and token.
:::

## Optional: create a public address

The default installation accepts only local connections. To connect from ChatGPT, a phone, or another device, run the installer interactively:

```bash
sudo sh /tmp/install-agentdock.sh
```

The installer asks whether you already have a Cloudflare-managed domain:

- No domain: create a temporary `trycloudflare.com` address for quick use.
- Domain available: enter the HTTPS public origin and Cloudflare Tunnel Token for a stable address.

The terminal shows the public MCP URL and connection credentials when installation finishes. A temporary address may change after the service restarts. Run the installer again and replace the old URL in the client. Existing Bearer and OAuth credentials are preserved.

Public access must keep authentication enabled. See [Advanced Linux configuration](../operations/linux.md#cloudflare-tunnel) for automation parameters and log locations.

## Update

Download and run step 1 again. Tasks, Skills, configuration, and the working directory are preserved.

For browser automation, install Chrome, Chromium, or Microsoft Edge on the host and enable browser tools. Set `AGENTDOCK_BROWSER_EXECUTABLE_PATH` if automatic discovery cannot find it. Use the Docker browser image only when you want Chromium bundled in the container. See [Browser automation](../guides/browser-control.md).

For Alpine, custom directories or ports, manual service management, and removal, see [Advanced Linux configuration](../operations/linux.md). To maintain systemd, the reverse proxy, and OAuth entirely yourself, see [Manual Linux deployment](./vps.md).
