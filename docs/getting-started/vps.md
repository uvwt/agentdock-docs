# Manual Linux systemd deployment

This page is for operators who want to maintain the service user, release binary, environment file, systemd unit, and HTTPS reverse proxy themselves. Regular users should start with the [Linux installation](./linux.md).

Manual deployment still uses a prebuilt release. You do not need Go or a source build on the server.

## Recommended topology

```text
MCP client -> HTTPS reverse proxy -> 127.0.0.1:8765 -> AgentDock
```

AgentDock listens only on a loopback address. Caddy, Nginx, or another reverse proxy provides TLS and the public endpoint.

## Create the service user and directories

```bash
sudo useradd --system --create-home --home-dir /srv/agentdock agentdock
sudo install -d -o agentdock -g agentdock /srv/agentdock/AgentDock
sudo install -d -m 0755 /opt/agentdock/bin
sudo install -d -m 0750 /etc/agentdock
```

## Download and install the release binary

```bash
case "$(uname -m)" in
  x86_64|amd64) ARCH=amd64 ;;
  aarch64|arm64) ARCH=arm64 ;;
  *) echo "unsupported architecture: $(uname -m)" >&2; exit 1 ;;
esac

ASSET="agentdock_linux_${ARCH}.tar.gz"
BASE_URL="https://github.com/uvwt/agentdock/releases/latest/download"
TMP_DIR="$(mktemp -d)"

curl -fL "$BASE_URL/$ASSET" -o "$TMP_DIR/$ASSET"
curl -fL "$BASE_URL/$ASSET.sha256" -o "$TMP_DIR/$ASSET.sha256"
(
  cd "$TMP_DIR"
  sha256sum -c "$ASSET.sha256"
  tar -xzf "$ASSET"
)

sudo install -m 0755 "$TMP_DIR/bin/agentdock" /opt/agentdock/bin/agentdock
rm -rf "$TMP_DIR"
```

In production, replace `BASE_URL` with a fixed release:

```bash
BASE_URL="https://github.com/uvwt/agentdock/releases/download/vX.Y.Z"
```

## Environment file

Create `/etc/agentdock/agentdock.env`:

```bash
AGENTDOCK_HOST=127.0.0.1
AGENTDOCK_PORT=8765
AGENTDOCK_LOG_LEVEL=info
AGENTDOCK_AUTH_TOKEN=<replace-with-a-random-secret>
```

Restrict its permissions:

```bash
sudo chown root:agentdock /etc/agentdock/agentdock.env
sudo chmod 0640 /etc/agentdock/agentdock.env
```

Add these variables when NexusDock Recall or workflow templates are required:

```bash
AGENTDOCK_NEXUS_ENDPOINT=https://nexus.example.com
AGENTDOCK_NEXUS_TOKEN=<replace-with-a-secret>
```

## systemd unit

Create `/etc/systemd/system/agentdock.service`:

```ini
[Unit]
Description=AgentDock MCP server
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=agentdock
Group=agentdock
WorkingDirectory=/srv/agentdock/AgentDock
EnvironmentFile=/etc/agentdock/agentdock.env
ExecStart=/opt/agentdock/bin/agentdock \
  --host ${AGENTDOCK_HOST} \
  --port ${AGENTDOCK_PORT} \
  --log-level ${AGENTDOCK_LOG_LEVEL}
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now agentdock
```

## HTTPS reverse proxy

Caddy example:

```caddyfile
agentdock.example.com {
  reverse_proxy 127.0.0.1:8765
}
```

Client URL:

```text
https://agentdock.example.com/mcp
```

Do not log the Authorization header at the proxy. Configure `AGENTDOCK_TRUSTED_PROXY_CIDRS` only when the proxy is on a trusted network and rewrites `X-Forwarded-For` correctly.

## OAuth (optional)

OAuth is recommended for MCP clients such as ChatGPT that use browser authorization. AgentDock supports dynamic client registration, Authorization Code, PKCE S256, and Refresh Tokens:

```bash
AGENTDOCK_OAUTH_ENABLED=true
AGENTDOCK_SERVER_URL=https://agentdock.example.com
AGENTDOCK_OAUTH_PASSWORD=<authorization-password-at-least-12-characters>
AGENTDOCK_OAUTH_TOKEN_SECRET=<random-signing-key-at-least-32-bytes>
```

A public `AGENTDOCK_SERVER_URL` must use HTTPS and contain only the origin, without `/mcp`. Keep the signing key stable instead of regenerating it on every restart. OAuth and Bearer Token authentication can be enabled separately or together according to client requirements. Do not commit the password or signing key.

After configuration and restart, verify:

```bash
curl -fsS https://agentdock.example.com/.well-known/oauth-authorization-server
curl -fsS https://agentdock.example.com/.well-known/oauth-protected-resource/mcp
```

The MCP URL entered in ChatGPT is `https://agentdock.example.com/mcp`. See [Connect ChatGPT to AgentDock](../guides/chatgpt.md) for the complete workflow.

## Update

Download and verify the target release again, replace `/opt/agentdock/bin/agentdock`, then restart:

```bash
sudo systemctl restart agentdock
sudo systemctl status agentdock --no-pager
```

Runtime data and the environment file live in separate directories and are not deleted when the binary is replaced.

## Verification

```bash
sudo systemctl status agentdock --no-pager
sudo journalctl -u agentdock -n 100 --no-pager
curl -fsS http://127.0.0.1:8765/healthz
```

Use the Bearer Token from the environment file when verifying MCP, and confirm that the public reverse proxy preserves the Authorization header. Source builds are for contributors only; see the [Contributor guide](../contributing/development.md).
