# Deploy NexusDock

NexusDock is a separate self-hosted service from AgentDock. Deploy it when you want a shared web console, Recall and Workflow data, or one MCP endpoint for multiple AgentDock nodes.

For product boundaries and day-to-day use, read [NexusDock](../concepts/nexusdock.md). This page covers a small production-oriented Docker deployment.

## Before you start

You need:

- Docker Engine and Docker Compose.
- A host that can keep `nexus-data` and `recall` persistent.
- An HTTPS origin such as `https://nexus.example.com` for remote use.

Official images are published for `linux/amd64` and `linux/arm64` to both Docker Hub and GHCR. The examples below pin NexusDock `0.2.0` instead of following `latest` implicitly.

## Create the deployment

Create the persistent directories:

```bash
mkdir -p nexusdock/nexus-data nexusdock/recall
cd nexusdock
```

On Linux bind-mount deployments, let the image user own them:

```bash
sudo chown -R 10001:10001 nexus-data recall
```

Generate a random token for programmatic `/v1` API access:

```bash
openssl rand -hex 32
```

Create `.env`:

```dotenv
NEXUS_AUTH_TOKEN=<random-token>
NEXUS_PUBLIC_URL=https://nexus.example.com
NEXUS_AUTH_ALLOW_INSECURE_HTTP=false
NEXUS_TRUSTED_PROXIES=127.0.0.1,::1
```

`NEXUS_PUBLIC_URL` must be an HTTPS origin without a path, query, or fragment. For a temporary loopback-only HTTP test, leave `NEXUS_PUBLIC_URL` empty and set `NEXUS_AUTH_ALLOW_INSECURE_HTTP=true`; do not keep that setting for remote access.

Create `compose.yaml`:

```yaml
services:
  nexusdock:
    image: agentdockio/nexusdock:0.2.0
    container_name: nexusdock
    restart: unless-stopped
    read_only: true
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    ports:
      - "127.0.0.1:18777:18777"
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=64m,uid=10001,gid=10001,mode=0700
    volumes:
      - ./nexus-data:/var/lib/nexus
      - ./recall:/recall
    environment:
      NEXUS_AUTH_TOKEN: ${NEXUS_AUTH_TOKEN}
      NEXUS_REQUIRE_AUTH: "true"
      NEXUS_AUTH_ALLOW_INSECURE_HTTP: ${NEXUS_AUTH_ALLOW_INSECURE_HTTP:-false}
      NEXUS_PUBLIC_URL: ${NEXUS_PUBLIC_URL:-}
      NEXUS_DATA_DIR: /var/lib/nexus
      RECALL_REPO_DIR: /recall
      NEXUS_TRUSTED_PROXIES: ${NEXUS_TRUSTED_PROXIES:-127.0.0.1,::1}
```

GHCR is equivalent:

```yaml
image: ghcr.io/uvwt/nexusdock:0.2.0
```

## Initialize the administrator

Before the first login, create the administrator account:

```bash
docker compose run --rm nexusdock admin init owner
```

The command asks for the password interactively and stores its credential record in NexusDock's persistent database. Do not put the administrator password in `.env`.

Start NexusDock and check health:

```bash
docker compose up -d
curl http://127.0.0.1:18777/health
```

Then open the configured HTTPS address, or `http://127.0.0.1:18777` for a loopback-only test.

## Put remote access behind HTTPS

Keep the container port bound to `127.0.0.1` when possible and publish NexusDock through your HTTPS reverse proxy or tunnel. Set `NEXUS_PUBLIC_URL` to the exact external origin.

Only add proxies you actually operate to `NEXUS_TRUSTED_PROXIES`. NexusDock uses trusted forwarded headers for security-sensitive request metadata, so a broad trust list weakens that boundary.

A correct public URL is especially important when clients need the NexusDock OAuth flow or temporary signed downloads for artifacts published by AgentDock nodes. Node files remain on the source AgentDock device; the source node must stay online while NexusDock proxies a download.

## Pair AgentDock nodes

After signing in, open **Settings → System & Nodes** and choose **Pair device**. NexusDock generates an expiring one-time command such as:

```bash
agentdock nexus pair --endpoint https://nexus.example.com --code pair_xxx
```

Run it on the target device and restart AgentDock. The node then opens an outbound WebSocket connection to NexusDock, so the node itself does not need a public inbound port.

See [NexusDock](../concepts/nexusdock.md) for node selection, Runtime pages, Recall, Workflow, and fleet routing.

## Connect MCP clients

The unified MCP endpoint is:

```text
https://nexus.example.com/mcp
```

OAuth-capable clients can authorize in the browser. For clients that require a fixed Bearer token, open **Settings → MCP Access** and use the dedicated MCP Access Token shown there.

Do not mix these credentials:

| Credential | Purpose |
| --- | --- |
| Administrator username/password | Web console login |
| `NEXUS_AUTH_TOKEN` | Programmatic `/v1` management API |
| MCP Access Token | `/mcp` only |

For client-specific setup, see [Connect MCP clients](../guides/mcp-clients.md).

## Configure AI and vector search

Embeddings are optional. Recall files, keyword search, local version history, and ordinary Workflow browsing work without them.

After deployment, prefer **Settings → AI & Vector** to configure Stage 3 and the shared embedding service. The page can test both connections and rebuild the Recall and Workflow vector indexes without requiring a service restart.

## Upgrade

Back up the persistent data first. Then change the image tag in `compose.yaml` to the target version and run:

```bash
docker compose pull
docker compose up -d
curl http://127.0.0.1:18777/health
```

Use a fixed version for production. Available releases are listed on the [NexusDock releases page](https://github.com/uvwt/nexusdock/releases).

Do not run two NexusDock instances that write the same `nexus-data` directory.

## Back up and recover

Back up both persistent directories:

```text
nexus-data/   accounts, paired devices, settings, database, and NexusDock secrets
recall/       Recall content and its local Git history
```

If the administrator password is lost, reset it on the deployment host:

```bash
docker compose run --rm nexusdock admin recover owner
```

For troubleshooting, start with:

```bash
docker compose ps
docker compose logs --tail=200 nexusdock
curl http://127.0.0.1:18777/health
```
