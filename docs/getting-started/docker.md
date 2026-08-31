# Docker installation

Run AgentDock in an isolated container using the official prebuilt image.

Docker cannot control the macOS desktop; use the native [macOS installation](./macos.md) when desktop automation is needed.

## 1. Verify Docker

```bash
docker --version
docker compose version
```

Make sure both commands display version numbers before continuing.

## 2. Download Compose configuration

Choose the command block for your operating system.

### macOS / Linux

```bash
mkdir -p agentdock && cd agentdock
curl -fL https://raw.githubusercontent.com/uvwt/agentdock/main/docker-compose.yml \
  -o docker-compose.yml
printf 'AGENTDOCK_AUTH_TOKEN=%s\n' "$(openssl rand -hex 32)" > .env
```

### Windows PowerShell

```powershell
New-Item -ItemType Directory -Force agentdock | Out-Null
Set-Location agentdock
Invoke-WebRequest `
  https://raw.githubusercontent.com/uvwt/agentdock/main/docker-compose.yml `
  -OutFile docker-compose.yml
$token = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
"AGENTDOCK_AUTH_TOKEN=$token" | Set-Content -Encoding ascii .env
```

The connection token is stored in `.env`. Do not commit it to Git or share it publicly.

For optional settings such as browser images, tunnels, or custom ports, see [`.env.example`](https://raw.githubusercontent.com/uvwt/agentdock/main/.env.example) in the repository.

## 3. Start and verify

```bash
docker compose up -d
docker compose ps
```

The first start downloads the image. Wait until the status is `healthy`; if it is still `starting`, run `docker compose ps` again after a few seconds.

## 4. Connect MCP client

In your client's MCP, Tools, or Connectors settings, create a connection:

```text
Transport    Streamable HTTP
URL          http://127.0.0.1:8765/mcp
Headers      Authorization: Bearer <your token>
```

The token is the value of `AGENTDOCK_AUTH_TOKEN=` in `.env`.

To view the token:

```bash
# macOS / Linux
cat .env
```

```powershell
# Windows PowerShell
Get-Content .env
```

:::tip
**Setup complete:** once `docker compose ps` shows `healthy` and the MCP URL and token are added to your client, AgentDock is ready to use.
:::

## Optional: Create temporary public address

When you need remote devices or ChatGPT to connect temporarily, start the Quick Tunnel profile from the same Compose file:

```bash
docker compose --profile cloudflare-quick up -d
```

View the generated address:

```bash
docker compose logs -f cloudflared-quick
```

Look for `https://...trycloudflare.com` in the logs. Append `/mcp` to the address in your client and use the Bearer Token from `.env` for authentication.

This temporary URL may change when the container or tunnel restarts. It is suitable for testing, not OAuth or long-term use. For a fixed domain, see [Advanced Docker configuration](../operations/docker.md#cloudflare-tunnel).

## Update

Download the latest `docker-compose.yml` from `main`, then run:

```bash
docker compose pull
docker compose up -d --force-recreate
```

When using Cloudflare Tunnel, include the same profile for `pull`, `up`, `logs`, and `down`:

```bash
docker compose --profile cloudflare-quick pull
docker compose --profile cloudflare-quick up -d --force-recreate
```

## Next steps

- For browser images, dev tools images, port changes, mounting projects, or data migration: see [Advanced Docker configuration](../operations/docker.md).
- If startup fails: see [Troubleshooting](../operations/troubleshooting.md).
- For LAN or public access: read the [Security model](../operations/security.md) first.
