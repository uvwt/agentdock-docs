# Docker

Use the [Docker installation guide](../getting-started/docker.md) for first-time setup. This page covers the settings most often changed after installation.

## Images

AgentDock publishes these Linux images for `amd64` and `arm64`:

| Image | Use |
| --- | --- |
| `latest` / `vX.Y.Z` | Normal runtime |
| `dev-latest` / `dev-vX.Y.Z` | Adds Go and native build tools |
| `browser-latest` / `browser-vX.Y.Z` | Adds Chromium for browser automation |

Choose another image through `.env`:

```dotenv
AGENTDOCK_IMAGE=ghcr.io/uvwt/agentdock:browser-latest
AGENTDOCK_BROWSER_ENABLED=true
```

See [Use the browser](../guides/browser-control.md) for browser behavior.

## Port and data

The default MCP URL is `http://127.0.0.1:8765/mcp`. To change the host port:

```dotenv
AGENTDOCK_PUBLISH_PORT=18767
```

The default Compose file keeps persistent data in two named volumes:

```text
agentdock_home       -> /home/agentdock/.agentdock
agentdock_workspace  -> /home/agentdock/AgentDock
```

`docker compose down` preserves these volumes.

## Mount a host project

Replace the workspace volume with a bind mount when AgentDock needs to work directly on host files:

```yaml
services:
  agentdock:
    volumes:
      - agentdock_home:/home/agentdock/.agentdock
      - ./AgentDock:/home/agentdock/AgentDock
```

On Linux, make sure container UID/GID `10001` can write to the mounted directory. Mount only the paths you want the container to access.

## Public access

Keep the normal service bound to the local host and use the supported Cloudflare Tunnel profile when remote access is required. See [Public access](./public-access.md) instead of duplicating Tunnel settings here.

## Update and logs

```bash
docker compose pull
docker compose up -d --force-recreate
docker compose ps
```

Follow logs with:

```bash
docker compose logs -f
```

Stop containers while preserving data:

```bash
docker compose down
```

Delete the named volumes only when you intentionally want to remove AgentDock state and workspace data:

```bash
docker compose down -v
```
