# Advanced Linux configuration

Regular users only need the [Linux installation](../getting-started/linux.md) for their first setup. This page covers interactive installation, custom directories and ports, service-manager selection, NexusDock configuration, and binary-only installation.

## Alpine and minimal systems

When Bash or curl is missing, run the bootstrap script first:

```sh
wget -O /tmp/install-agentdock-bootstrap.sh \
  https://github.com/uvwt/agentdock/releases/latest/download/install-linux-bootstrap.sh
sudo sh /tmp/install-agentdock-bootstrap.sh
```

The bootstrap script installs only the minimum dependencies and downloads the full installer. AgentDock itself still uses a prebuilt release.

`install-linux-bootstrap.sh` is only a dependency bootstrapper. Its default `AGENTDOCK_INSTALL_URL` points to the current Release asset `install-linux.sh`; after downloading it, the bootstrapper runs `exec bash /tmp/agentdock-install.sh "$@"`. All installation questions and Cloudflare Tunnel behavior therefore come from `install-linux.sh`, and arguments passed to the bootstrap script are forwarded unchanged.

## Interactive installation

Without `AGENTDOCK_NONINTERACTIVE`, the installer asks for each setting:

```bash
curl -fsSL https://github.com/uvwt/agentdock/releases/latest/download/install-linux.sh \
  -o /tmp/install-agentdock.sh
bash /tmp/install-agentdock.sh
```

Keep the `binary` mode for a normal deployment. `source` and `auto` are only for development or troubleshooting when prebuilt artifacts are unavailable.

## Cloudflare Tunnel

The full installer asks `Public access: none/quick/named`:

| Mode | Use case |
| --- | --- |
| `none` | Keep only the local listener and remove an installer-managed Tunnel service |
| `quick` | Create a temporary `trycloudflare.com` URL without a Cloudflare account or domain |
| `named` | Reuse a Cloudflare Named Tunnel Token and fixed HTTPS Public Hostname |

Quick Tunnel prints the current public MCP URL during installation. The URL changes after `cloudflared` restarts and must not be used for OAuth callbacks or long-running clients.

For Named Tunnel, create the Tunnel and Public Hostname in Cloudflare first. Use the HTTPS hostname as the public origin and point its Service to the local URL shown by the installer, normally `http://127.0.0.1:8765`. The token is written to root-only `/etc/agentdock/cloudflared.env`; it is not written to `agentdock.env`, passed to the AgentDock service, or placed in the `cloudflared` command line.

The default Tunnel service is `agentdock-cloudflared`. Inspect it with:

```bash
# systemd
sudo systemctl status agentdock-cloudflared --no-pager
sudo journalctl -u agentdock-cloudflared -n 100 --no-pager

# OpenRC
sudo rc-service agentdock-cloudflared status
sudo tail -n 100 /var/log/agentdock-cloudflared.log \
  /var/log/agentdock-cloudflared.err
```

For non-interactive Quick Tunnel installation:

```bash
sudo env \
  AGENTDOCK_NONINTERACTIVE=true \
  AGENTDOCK_TUNNEL_MODE=quick \
  bash /tmp/install-agentdock.sh
```

Named mode also accepts `AGENTDOCK_SERVER_URL` and `AGENTDOCK_CLOUDFLARE_TUNNEL_TOKEN`. Inject the token from a secret manager or protected environment; do not place it in a script, shell history, or Git repository.

## Default directories

```text
Installation directory  /opt/agentdock
Runtime data directory  /srv/agentdock
Environment file        /etc/agentdock/agentdock.env
Service user            agentdock
Listen address          127.0.0.1:8765
```

A typical systemd installation creates:

```text
/opt/agentdock/bin/agentdock
/srv/agentdock/.agentdock
/srv/agentdock/AgentDock
/etc/agentdock/agentdock.env
/etc/systemd/system/agentdock.service
```

OpenRC creates `/etc/init.d/agentdock` instead.

## Non-interactive configuration

Override defaults through environment variables in automated deployments:

```bash
sudo env \
  AGENTDOCK_NONINTERACTIVE=true \
  AGENTDOCK_RELEASE_VERSION=latest \
  AGENTDOCK_PORT=8765 \
  bash /tmp/install-agentdock.sh
```

Common variables:

| Variable | Purpose |
| --- | --- |
| `AGENTDOCK_RELEASE_VERSION` | `latest` or `vX.Y.Z` |
| `AGENTDOCK_SOURCE_DIR` | Binary installation root |
| `AGENTDOCK_DATA_DIR` | State and working-directory root |
| `AGENTDOCK_ENV_FILE` | Service environment file |
| `AGENTDOCK_SERVICE_NAME` | systemd or OpenRC service name |
| `AGENTDOCK_SERVICE_USER` | Low-privilege runtime user |
| `AGENTDOCK_SERVICE_MANAGER` | `auto`, `systemd`, `openrc`, or `none` |
| `AGENTDOCK_HOST` | Listen address |
| `AGENTDOCK_PORT` | Listen port |
| `AGENTDOCK_AUTH_TOKEN` | Custom Bearer Token |
| `AGENTDOCK_NEXUS_ENDPOINT` | NexusDock URL |
| `AGENTDOCK_NEXUS_TOKEN` | NexusDock token |
| `AGENTDOCK_TUNNEL_MODE` | `none`, `quick`, or `named` |
| `AGENTDOCK_SERVER_URL` | Fixed HTTPS origin for Named Tunnel and OAuth |
| `AGENTDOCK_CLOUDFLARE_TUNNEL_TOKEN` | Named Tunnel Token; stored only in `cloudflared.env` |
| `AGENTDOCK_CLOUDFLARED_INSTALL_PATH` | Custom `cloudflared` binary path |

Do not commit real tokens. When `AGENTDOCK_AUTH_TOKEN` is omitted, the installer generates one and writes it to a root-only environment file.

## Install only the binary

To avoid registering a system service:

```bash
sudo env \
  AGENTDOCK_NONINTERACTIVE=true \
  AGENTDOCK_SERVICE_MANAGER=none \
  bash /tmp/install-agentdock.sh
```

This mode does not start AgentDock automatically. Run `/opt/agentdock/bin/agentdock` manually.

## Change the port or token

Edit the environment file:

```bash
sudoedit /etc/agentdock/agentdock.env
```

Restart the service afterward:

```bash
sudo systemctl restart agentdock
sudo systemctl status agentdock --no-pager
```

For OpenRC:

```sh
sudo rc-service agentdock restart
sudo rc-service agentdock status
```

## View logs

For systemd:

```bash
sudo journalctl -u agentdock -n 100 --no-pager
sudo journalctl -u agentdock -f
```

For OpenRC:

```sh
sudo tail -n 100 /var/log/agentdock.log /var/log/agentdock.err
```

## Update

Rerun the installer to replace the binary. Runtime data and the environment file are preserved. To install a fixed version:

```bash
sudo env \
  AGENTDOCK_NONINTERACTIVE=true \
  AGENTDOCK_RELEASE_VERSION=vX.Y.Z \
  bash /tmp/install-agentdock.sh
```

To maintain systemd, the environment file, reverse proxy, and OAuth entirely yourself, see [Manual Linux deployment](../getting-started/vps.md).
