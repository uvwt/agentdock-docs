# Linux installation

AgentDock provides prebuilt releases for Linux x64 and ARM64. A regular installation does not require Go, Git, or the source repository.

## 1. Install

Run this in a terminal:

```bash
curl -fsSL https://github.com/uvwt/agentdock/releases/latest/download/install.sh \
  -o /tmp/install-agentdock.sh
sudo env AGENTDOCK_NONINTERACTIVE=true sh /tmp/install-agentdock.sh
```

The installer uses safe defaults, selects systemd or OpenRC, creates a low-privilege service user, generates a connection token, and completes a health check.

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

A healthy response contains `ok: true`.

## 3. Read the connection token

```bash
sudo awk -F= '/^AGENTDOCK_AUTH_TOKEN=/{print $2}' \
  /etc/agentdock/agentdock.env
```

Save the output in a password manager. Do not paste it into chat history or commit it to Git.

## 4. Connect an MCP client

When the client runs on the same Linux machine, use:

```text
Transport      Streamable HTTP
URL            http://127.0.0.1:8765/mcp
Request header Authorization: Bearer <your token>
```

When AgentDock runs on a remote server, create an SSH tunnel from your own computer:

```bash
ssh -L 8765:127.0.0.1:8765 <username>@<server-address>
```

Keep the SSH session open and let the local client connect to the same `http://127.0.0.1:8765/mcp` URL.

:::tip
**Installation is complete** when the service is running, the health check succeeds, and the client has the MCP URL and token.
:::

## Optional: publish with Cloudflare Tunnel

The non-interactive command above keeps public access disabled. To configure public access, rerun the same installer interactively:

```bash
sudo sh /tmp/install-agentdock.sh
```

The installer asks one product-level question: **Do you have a domain already managed by Cloudflare?**

- Choose **yes** for a fixed hostname. Enter the HTTPS public origin and paste the Tunnel Token at the hidden prompt.
- Choose **no** for a temporary `trycloudflare.com` URL that works immediately but may change after `cloudflared` restarts.

Both paths automatically generate or reuse a Bearer Token and AgentDock OAuth credentials. The completion panel shows the public URL, MCP URL, Bearer Token, and OAuth login password. The OAuth signing secret and Cloudflare Tunnel Token remain only in protected configuration files.

When a temporary URL changes, rerun the same installer. It writes the new URL back to AgentDock and restarts the service while preserving the existing Bearer Token, OAuth password, and signing secret. Replace the MCP URL in the client and authorize OAuth again. See [Advanced Linux configuration](../operations/linux.md#cloudflare-tunnel) for service names, automation variables, and secret storage.

## Update

Download and run step 1 again. Tasks, Skills, configuration, and the working directory are preserved.

## Continue when needed

- For Alpine, interactive installation, custom directories, ports, or service managers, see [Advanced Linux configuration](../operations/linux.md).
- For browser automation, the current build-free option is the Docker browser image. See [Browser automation](../guides/browser-control.md).
- To maintain systemd, the reverse proxy, and OAuth entirely yourself, see [Manual Linux deployment](./vps.md).
- If startup fails, see [Troubleshooting](../operations/troubleshooting.md).
- Before public access, read the [Security model](../operations/security.md).
