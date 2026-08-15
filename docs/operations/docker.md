# Advanced Docker configuration

Regular users only need the [Docker installation](../getting-started/docker.md) for their first setup. This page covers custom ports, other images, host-directory mounts, upgrades, and old-data migration.

AgentDock uses a single `docker-compose.yml`. Optional capabilities (browser image, Cloudflare Tunnel) are enabled with environment variables and Compose profiles—no extra Compose overlay files.

## Image variants

AgentDock publishes three image variants for `linux/amd64` and `linux/arm64`:

| Tag | Use case |
| --- | --- |
| `latest` / `vX.Y.Z` | Default runtime image for normal use |
| `dev-latest` / `dev-vX.Y.Z` | Adds Go, C, C++, and the `pkg-config` build toolchain |
| `browser-latest` / `browser-vX.Y.Z` | Adds Chromium for browser automation |

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

Point Compose at the browser image and enable browser tools in `.env`:

```dotenv
AGENTDOCK_IMAGE=ghcr.io/uvwt/agentdock:browser-latest
AGENTDOCK_BROWSER_ENABLED=true
```

Then recreate:

```bash
docker compose up -d --force-recreate
```

The Compose file already sets `shm_size` to 1 GB for Chromium. Browser profiles, screenshots, and session state remain in the AgentDock data volume.

Use a dedicated `profile_id` for browser sessions. Do not mount the complete profile directory from your daily browser.

## Cloudflare Tunnel

Tunnel services live in the same `docker-compose.yml` and are activated with Compose profiles. Optional sample variables are listed in [`.env.example`](https://raw.githubusercontent.com/uvwt/agentdock/main/.env.example) on the repository.

### Quick Tunnel

```bash
docker compose --profile cloudflare-quick up -d
docker compose logs -f cloudflared-quick
```

The URL in the log is temporary and changes after restart. Append `/mcp` and keep the Bearer Token from `.env` when configuring the client.

### Named Tunnel

Create a Cloudflare Named Tunnel and Public Hostname. Add these values to the existing deployment `.env` without overwriting the current AgentDock token:

```dotenv
AGENTDOCK_SERVER_URL=https://agent.example.com
TUNNEL_TOKEN=replace-with-cloudflare-tunnel-token
```

Restrict `.env` to the current user and start the named profile:

```bash
chmod 600 .env
docker compose --profile cloudflare-named up -d
```

Set the Cloudflare Public Hostname service to `http://agentdock:8765`. Compose passes `TUNNEL_TOKEN` only to the `cloudflared-named` container; the AgentDock container receives `AGENTDOCK_SERVER_URL` and its own authentication token, but not the Tunnel Token. The token is provided through the container environment and does not appear in the `cloudflared` command arguments.

Use only one Tunnel profile at a time. To stop the deployment and remove the Tunnel container while preserving AgentDock data:

```bash
docker compose \
  --profile cloudflare-quick \
  --profile cloudflare-named \
  down
```

## Change the local port

The default MCP URL is `http://127.0.0.1:8765/mcp` (host and container both use port `8765`). When that host port conflicts, add this to `.env`:

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

Compose is maintained in the repository. The default image tag is `latest`. For a reproducible deploy, pin both the Compose revision (git tag) and the image tag.

To download Compose from a specific git tag:

```bash
VERSION=vX.Y.Z
curl -fL "https://raw.githubusercontent.com/uvwt/agentdock/$VERSION/docker-compose.yml" \
  -o docker-compose.yml
```

Windows users can replace `curl -fL ... -o ...` with `Invoke-WebRequest ... -OutFile ...`.

Pin the image in `.env` (runtime or browser):

```dotenv
AGENTDOCK_IMAGE=ghcr.io/uvwt/agentdock:vX.Y.Z
# or browser:
# AGENTDOCK_IMAGE=ghcr.io/uvwt/agentdock:browser-vX.Y.Z
# AGENTDOCK_BROWSER_ENABLED=true
```

## Update AgentDock

```bash
curl -fL https://raw.githubusercontent.com/uvwt/agentdock/main/docker-compose.yml \
  -o docker-compose.yml
docker compose pull
docker compose up -d --force-recreate
```

For browser deployments, keep `AGENTDOCK_IMAGE` and `AGENTDOCK_BROWSER_ENABLED` in `.env`. For Tunnel deployments, keep the same `--profile` on `pull` and `up`.

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

When a Tunnel profile is active, pass the same profile to these commands, for example:

```bash
docker compose --profile cloudflare-named logs -f
docker compose --profile cloudflare-named down
```

## Delete all Docker data

Run this only after confirming that you no longer need the tasks, Skills, MCP configuration, or project files:

```bash
docker compose down -v
```

:::danger
**Irreversible:** `-v` deletes the named volumes created by Compose. Back up any data you need before running it.
:::
