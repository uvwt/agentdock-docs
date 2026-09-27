# Linux and servers

For a normal Linux installation, start with [Install on Linux](../getting-started/linux.md). This page covers server-oriented settings and service management.

## Install

The public installer detects the architecture and can register systemd or OpenRC automatically:

```bash
curl -fsSL https://github.com/uvwt/agentdock/releases/latest/download/install.sh \
  -o /tmp/install-agentdock.sh
sudo sh /tmp/install-agentdock.sh
```

On Alpine or another minimal system, install Bash, CA certificates, and curl or wget first.

Default system installation:

```text
Binary           /opt/agentdock/bin/agentdock
Runtime data     /srv/agentdock
Environment      /etc/agentdock/agentdock.env
Service user     agentdock
Listen address   127.0.0.1:8765
```

## Service and logs

For systemd:

```bash
sudo systemctl status agentdock --no-pager
sudo systemctl restart agentdock
sudo journalctl -u agentdock -f
```

For OpenRC:

```sh
sudo rc-service agentdock status
sudo rc-service agentdock restart
```

If you manage the service yourself, keep AgentDock bound to loopback and run it under a dedicated low-privilege account. Put environment values in a protected service environment file rather than in the unit command line.

## Public servers

For remote use, keep AgentDock on `127.0.0.1` and provide HTTPS through a trusted reverse proxy or Cloudflare Tunnel. Do not expose plaintext `/mcp` directly to the Internet.

See [Public access](./public-access.md) for temporary and fixed Cloudflare addresses, and [Configuration](../reference/configuration.md) for authentication settings.

## NexusDock

Pair NexusDock after AgentDock is installed. On the default service account:

```bash
sudo -u agentdock -H /opt/agentdock/bin/agentdock nexus pair \
  --endpoint https://nexus.example.com \
  --code <pairing-code>
sudo systemctl restart agentdock
```

See [Connect AgentDock](./nexusdock-connect.md) for the complete pairing flow.

## Update

For a standard installation:

```bash
sudo /opt/agentdock/bin/agentdock update --check
sudo /opt/agentdock/bin/agentdock update
```

The runtime data and service environment remain separate from the binary. Use [Troubleshooting](./troubleshooting.md) if the service does not return to a healthy state after an update.
