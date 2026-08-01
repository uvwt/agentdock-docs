# Advanced Docker configuration

Regular users only need the [Docker installation](../getting-started/docker.md) for their first setup. This page covers custom ports, other images, host-directory mounts, upgrades, and old-data migration.

## Image variants

AgentDock publishes three image variants for `linux/amd64` and `linux/arm64`:

| Tag | Use case |
| --- | --- |
| `latest` / `vX.Y.Z` | Default runtime image with common tools such as Node.js, Python, Git, and pnpm |
| `dev-latest` / `dev-vX.Y.Z` | Adds Go, C, C++, and the `pkg-config` build toolchain |
| `browser-latest` / `browser-vX.Y.Z` | Adds Chromium and the browser runner |

The default Compose file uses the production runtime image. When you need to compile Go or native extensions inside the container, add this to `.env`:

```dotenv
AGENTDOCK_IMAGE=ghcr.io/uvwt/agentdock:dev-vX.Y.Z
```

Then recreate the container:

```bash
docker compose up -d --force-recreate
```

The `dev` and `browser` images serve different purposes. The browser image does not include the Go compiler by default.

## Enable browser automation

Download the browser Compose file that matches the current release.

macOS / Linux:

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/docker-compose.browser.yml \
  -o docker-compose.browser.yml
```

Windows PowerShell:

```powershell
Invoke-WebRequest `
  https://github.com/uvwt/agentdock/releases/latest/download/docker-compose.browser.yml `
  -OutFile docker-compose.browser.yml
```

Start the browser image:

```bash
docker compose -f docker-compose.yml -f docker-compose.browser.yml up -d
```

This image enables the `browser_*` tools and increases browser shared memory to 1 GB. Browser profiles, screenshots, and session state remain in the AgentDock data volume.

Use a dedicated `profile_id` for browser sessions. Do not mount the complete profile directory from your daily browser.

## Cloudflare Tunnel

Download the Release overlay next to `docker-compose.yml`:

```bash
curl -fL \
  https://github.com/uvwt/agentdock/releases/latest/download/docker-compose.cloudflare-tunnel.yml \
  -o docker-compose.cloudflare-tunnel.yml
curl -fL \
  https://github.com/uvwt/agentdock/releases/latest/download/docker-compose.cloudflare-tunnel.env.example \
  -o docker-compose.cloudflare-tunnel.env.example
```

### Quick Tunnel

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.cloudflare-tunnel.yml \
  --profile cloudflare-quick up -d

docker compose \
  -f docker-compose.yml \
  -f docker-compose.cloudflare-tunnel.yml \
  logs -f cloudflared-quick
```

The URL in the log is temporary and changes after restart. Append `/mcp` and keep the Bearer Token from `.env` when configuring the client.

### Named Tunnel

Create a Cloudflare Named Tunnel and Public Hostname. Add these values to the existing deployment `.env`; use `docker-compose.cloudflare-tunnel.env.example` as a reference without overwriting the current AgentDock token:

```dotenv
AGENTDOCK_SERVER_URL=https://agent.example.com
TUNNEL_TOKEN=replace-with-cloudflare-tunnel-token
```

Restrict `.env` to the current user and start the named profile:

```bash
chmod 600 .env
docker compose \
  -f docker-compose.yml \
  -f docker-compose.cloudflare-tunnel.yml \
  --profile cloudflare-named up -d
```

Set the Cloudflare Public Hostname service to `http://agentdock:8765`. Compose passes `TUNNEL_TOKEN` only to the `cloudflared-named` container; the AgentDock container receives `AGENTDOCK_SERVER_URL` and its own authentication token, but not the Tunnel Token. The token is provided through the container environment and does not appear in the `cloudflared` command arguments.

Use only one Tunnel profile at a time. To stop the deployment and remove the Tunnel container while preserving AgentDock data:

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.cloudflare-tunnel.yml \
  --profile cloudflare-quick \
  --profile cloudflare-named down
```

## Change the local port

The default MCP URL is `http://127.0.0.1:18766/mcp`. When that port conflicts, add this to `.env`:

```dotenv
AGENTDOCK_PUBLISH_PORT=18767
```

Then restart:

```bash
docker compose up -d --force-recreate
```

The new MCP URL becomes `http://127.0.0.1:18767/mcp`.

The default listener is bound only to the local loopback address. Do not change it directly to `0.0.0.0` for convenience. Read the [Security model](./security.md) before allowing LAN or public access.

## Where data is stored

The default Compose file uses two Docker named volumes:

```text
agentdock_home       -> /home/agentdock/.agentdock
agentdock_workspace  -> /home/agentdock/AgentDock
```

- `agentdock_home`: tasks, Skills, dynamic MCP, isolated environments, and runtime artifacts.
- `agentdock_workspace`: the default working directory for file, command, and Git tools.

Inspect the actual volume names:

```bash
docker compose config --volumes
```

`docker compose down` does not delete this data.

## Mount a host project directory

To let AgentDock work directly with a host project, replace the workspace volume with a bind mount:

```yaml
services:
  agentdock:
    volumes:
      - agentdock_home:/home/agentdock/.agentdock
      - ./AgentDock:/home/agentdock/AgentDock
```

On Linux, make sure container UID/GID `10001` can write to the directory:

```bash
mkdir -p AgentDock
sudo chown -R 10001:10001 AgentDock
```

Mount only the directories the task requires. AgentDock does not treat the working directory as a security sandbox; the container can access whatever you actually mount.

## Pin a version

The Compose file attached to a GitHub Release is already pinned to that release and does not silently switch to a newer `latest` image.

To download a specific version:

```bash
VERSION=vX.Y.Z
curl -fL "https://github.com/uvwt/agentdock/releases/download/$VERSION/docker-compose.yml" \
  -o docker-compose.yml
curl -fL "https://github.com/uvwt/agentdock/releases/download/$VERSION/docker-compose.browser.yml" \
  -o docker-compose.browser.yml
```

Windows users can replace `curl -fL ... -o ...` with `Invoke-WebRequest ... -OutFile ...`.

## Update AgentDock

For the standard image:

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/docker-compose.yml \
  -o docker-compose.yml
docker compose pull
docker compose up -d --force-recreate
```

For the browser image, download `docker-compose.browser.yml` again and continue passing both Compose files.

After the update, run:

```bash
docker compose ps
```

Confirm that the service returns to `healthy`.

## Migrate from v0.4.1 or earlier

Older Compose files bind-mounted `./AgentDockHome` and `./AgentDock` directly into the container. Do not delete those directories when they contain existing data.

You can continue using them, but update the container paths to the new locations:

```yaml
services:
  agentdock:
    volumes:
      - ./AgentDockHome:/home/agentdock/.agentdock
      - ./AgentDock:/home/agentdock/AgentDock
```

On Linux, update ownership as well:

```bash
sudo chown -R 10001:10001 AgentDockHome AgentDock
```

After confirming that the new container can see the original tasks, Skills, MCP configuration, and project files, decide whether to migrate to named volumes. Never let two running AgentDock instances use the same state directory simultaneously.

## View logs and stop the service

```bash
# Follow logs
docker compose logs -f

# Stop and remove containers while preserving data
docker compose down
```

For a browser deployment, continue passing both Compose files when running these commands.

## Delete all Docker data

Run this only after confirming that you no longer need the tasks, Skills, MCP configuration, or project files:

```bash
docker compose down -v
```

:::danger
**Irreversible:** `-v` deletes the named volumes created by Compose. Back up any data you need before running it.
:::
