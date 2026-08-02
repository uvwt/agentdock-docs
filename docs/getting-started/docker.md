# Docker installation

Use this option when Docker is already installed or when you want AgentDock isolated from the host operating system. You do not need the source code or a local `docker build`.

Do not use Docker when you need to control the macOS desktop. Use the [macOS installation](./macos.md) instead.

## 1. Verify Docker

```bash
docker --version
docker compose version
```

Continue only after both commands print a version.

## 2. Download the startup configuration

Choose the command set for your current system.

### macOS / Linux

```bash
mkdir -p agentdock && cd agentdock
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/docker-compose.yml \
  -o docker-compose.yml
printf 'AGENTDOCK_AUTH_TOKEN=%s\n' "$(openssl rand -hex 32)" > .env
```

### Windows PowerShell

```powershell
New-Item -ItemType Directory -Force agentdock | Out-Null
Set-Location agentdock
Invoke-WebRequest `
  https://github.com/uvwt/agentdock/releases/latest/download/docker-compose.yml `
  -OutFile docker-compose.yml
$token = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
"AGENTDOCK_AUTH_TOKEN=$token" | Set-Content -Encoding ascii .env
```

The `.env` file contains the connection token. Do not commit it to Git or share it with other people.

## 3. Start and inspect the service

```bash
docker compose up -d
docker compose ps
```

The first startup downloads the image. Wait until the service becomes `healthy`. If it still shows `starting`, run `docker compose ps` again after several seconds.

## 4. Connect an MCP client

Create a connection in your client's MCP, Tools, or Connectors settings:

```text
Transport     Streamable HTTP
URL           http://127.0.0.1:18766/mcp
Request header Authorization: Bearer <your token>
```

The token is the value after `AGENTDOCK_AUTH_TOKEN=` in `.env`.

Read the token:

```bash
# macOS / Linux
cat .env
```

```powershell
# Windows PowerShell
Get-Content .env
```

:::tip
**Installation is complete** when `docker compose ps` shows `healthy` and the client has the MCP URL and token.
:::

## Optional: create a temporary public address

To let another computer or phone connect temporarily, download the public-access configuration and start it:

```bash
curl -fL \
  https://github.com/uvwt/agentdock/releases/latest/download/docker-compose.cloudflare-tunnel.yml \
  -o docker-compose.cloudflare-tunnel.yml

docker compose \
  -f docker-compose.yml \
  -f docker-compose.cloudflare-tunnel.yml \
  --profile cloudflare-quick up -d
```

Read the generated address:

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.cloudflare-tunnel.yml \
  logs -f cloudflared-quick
```

The logs show an `https://…trycloudflare.com` address. Append `/mcp` and continue using the Bearer Token from `.env`.

The temporary address may change after the container or Tunnel restarts. It is suitable for testing, but not for OAuth or long-running use. See [Advanced Docker configuration](../operations/docker.md#cloudflare-tunnel) for a fixed domain.

## Update

Download the latest `docker-compose.yml` again, then run:

```bash
docker compose pull
docker compose up -d --force-recreate
```

When using Cloudflare Tunnel, download `docker-compose.cloudflare-tunnel.yml` again and continue passing both Compose files and the selected profile to `pull`, `up`, `logs`, and `down`.

## Continue when needed

- For the browser image, development image, custom ports, project mounts, or old-data migration, see [Advanced Docker configuration](../operations/docker.md).
- If startup fails, see [Troubleshooting](../operations/troubleshooting.md).
- Before allowing LAN or public access, read the [Security model](../operations/security.md).
