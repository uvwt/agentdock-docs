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

Interactive installation does not expose the internal `none/quick/named` choices. It asks whether a Cloudflare-managed domain is available:

| User answer | Installer mode | Result |
| --- | --- | --- |
| Domain available | Fixed (`named`) | Stable HTTPS hostname for long-running clients and OAuth |
| No domain | Temporary (`quick`) | Generated `trycloudflare.com` URL for immediate testing |

A fixed installation asks for the HTTPS public origin and Cloudflare Tunnel Token. Create the Named Tunnel and Public Hostname first, then point its Service to the local URL shown by the installer, normally `http://127.0.0.1:8765`.

A temporary installation starts `cloudflared`, reads the generated URL from the service log, writes it to `AGENTDOCK_SERVER_URL`, enables OAuth, and restarts AgentDock. Both modes generate or reuse these credentials:

- `AGENTDOCK_AUTH_TOKEN`
- `AGENTDOCK_OAUTH_PASSWORD`
- `AGENTDOCK_OAUTH_TOKEN_SECRET`

The completion panel prints the public URL, MCP URL, Bearer Token, and OAuth login password. The OAuth signing secret is not printed. The Tunnel Token is written only to root-only `/etc/agentdock/cloudflared.env`; it is not written to `agentdock.env`, passed to AgentDock, or placed in the `cloudflared` command line.

If a temporary URL changes, rerun the same installer. Existing host, port, advanced settings, Bearer Token, OAuth password, signing secret, and NexusDock configuration are preserved. The new URL is written back automatically and AgentDock is restarted. The client must replace the old MCP URL and authorize OAuth again.

The default Tunnel service is `agentdock-cloudflared`:

```bash
# systemd
sudo systemctl status agentdock-cloudflared --no-pager
sudo journalctl -u agentdock-cloudflared -n 100 --no-pager

# OpenRC
sudo rc-service agentdock-cloudflared status
sudo tail -n 100 /var/log/agentdock-cloudflared.log \
  /var/log/agentdock-cloudflared.err
```

Non-interactive installation remains private unless the mode is explicitly supplied. For a temporary Tunnel:

```bash
sudo env \
  AGENTDOCK_NONINTERACTIVE=true \
  AGENTDOCK_TUNNEL_MODE=quick \
  bash /tmp/install-agentdock.sh
```

For fixed mode, set `AGENTDOCK_TUNNEL_MODE=named`, `AGENTDOCK_SERVER_URL`, and `AGENTDOCK_CLOUDFLARE_TUNNEL_TOKEN`. `AGENTDOCK_OAUTH_PASSWORD` and `AGENTDOCK_OAUTH_TOKEN_SECRET` are optional first-install overrides; otherwise the installer generates them. Inject secrets from a protected environment or secret manager.

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
