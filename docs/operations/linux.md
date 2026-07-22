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

## Interactive installation

Without `AGENTDOCK_NONINTERACTIVE`, the installer asks for each setting:

```bash
curl -fsSL https://github.com/uvwt/agentdock/releases/latest/download/install-linux.sh \
  -o /tmp/install-agentdock.sh
bash /tmp/install-agentdock.sh
```

Keep the `binary` mode for a normal deployment. `source` and `auto` are only for development or troubleshooting when prebuilt artifacts are unavailable.

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
