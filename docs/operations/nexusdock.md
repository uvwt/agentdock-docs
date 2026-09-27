# Install and maintain

The simplest way to run NexusDock is Docker Compose.

## Before you start

Install Docker Engine and Docker Compose on the host.

## Create `compose.yaml`

Create a directory for NexusDock, then add this `compose.yaml`:

```yaml
services:
  nexusdock:
    image: agentdockio/nexusdock:latest
    restart: unless-stopped
    ports:
      - "127.0.0.1:18777:18777"
    volumes:
      - nexus-data:/var/lib/nexus
      - recall:/recall
volumes:
  nexus-data:
  recall:
```

The same image is also available as `ghcr.io/uvwt/nexusdock:latest`. Official images support `linux/amd64` and `linux/arm64`.

## Create the administrator and start

Run:

```bash
docker compose run --rm nexusdock admin init admin
docker compose up -d
```

Then open:

```text
http://127.0.0.1:18777
```

Sign in with the administrator account you just created.

## Remote access

For remote use, publish NexusDock through HTTPS. Direct HTTP is intended only for `localhost` / loopback access.

Keep the Docker port bound to `127.0.0.1` and place your HTTPS reverse proxy or tunnel in front of it. For more complex proxy setups and optional site settings, see the [NexusDock README](https://github.com/uvwt/nexusdock).

## AI and vector settings

Embedding and external model providers are optional. Device management, MCP routing, Recall file browsing, keyword search, and basic Workflow operations work without them.

Configure these features from **Settings → AI & Vectors** when you need semantic Recall or Workflow vector matching.

## Upgrade

Back up the persistent data first, then run:

```bash
docker compose pull
docker compose up -d
curl http://127.0.0.1:18777/health
```

Do not run two NexusDock instances that write to the same Nexus data store.

## Backup and recovery

The quick-start Compose file stores persistent data in two Docker volumes:

```text
nexus-data   NexusDock accounts, devices, settings, secrets, and Workflow data
recall       Recall content and private-note data
```

Back up both volumes before upgrades or migration. If you changed the deployment to use host directories instead, back up both mounted directories in full.

If you forget the administrator password, run:

```bash
docker compose run --rm nexusdock admin recover
```

For basic troubleshooting:

```bash
docker compose ps
docker compose logs --tail=200 nexusdock
curl http://127.0.0.1:18777/health
```

## Connect devices and clients

After installation, continue with [Connect AgentDock and clients](./nexusdock-connect.md).
