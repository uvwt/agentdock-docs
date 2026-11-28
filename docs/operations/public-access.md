# Public access

AgentDock is safest when it stays local. Enable public access only when a remote MCP client needs to reach it.

| Mode | Best for | Address |
| --- | --- | --- |
| Local only | Same-device clients | `http://127.0.0.1:8765/mcp` |
| Temporary public address | Testing | Generated `trycloudflare.com` address |
| Fixed domain | Long-term remote use and OAuth | Your own HTTPS hostname |

## Temporary public address

If you only need remote access from ChatGPT, Claude, or another device, pairing with **NexusDock** (`https://mcp.nexusdock.co` or self-hosted) is usually simpler and does not require `cloudflared`.

For direct self-hosted public access on macOS and Windows, install the optional `cloudflared` component first in **Settings / Advanced connections** (or run `agentdock component install cloudflared`), then enable **Temporary public address**. Linux installers can choose the temporary Tunnel option. Docker can start the Quick Tunnel profile:

```bash
docker compose --profile cloudflare-quick up -d
docker compose logs -f cloudflared-quick
```

A temporary URL may change after a Tunnel restart. Update the MCP client when it changes.

## Fixed domain

A fixed domain uses a Cloudflare Named Tunnel. You need:

- a domain managed by Cloudflare;
- AgentDock already working locally;
- access to the Cloudflare Zero Trust dashboard.

### 1. Create the Tunnel

Create a Cloudflare Tunnel and choose **Cloudflared** as the connector. Keep the generated Tunnel Token private.

Add a public hostname such as `agent.example.com` and point it to:

| Installation | Cloudflare Service URL |
| --- | --- |
| macOS, Windows, native Linux | `http://127.0.0.1:8765` |
| Docker Compose | `http://agentdock:8765` |

Leave the Cloudflare path empty. `/mcp` is added by the MCP client, not by the Tunnel route.

### 2. Configure AgentDock

The AgentDock public address is the HTTPS origin only:

```text
https://agent.example.com
```

Do not append `/mcp`.

On macOS or Windows, make sure the optional `cloudflared` component is installed, open **Settings / Advanced connections → Fixed domain**, then enter the HTTPS public address and Tunnel Token.

On Linux, rerun the installer and choose the existing Cloudflare-domain option.

For Docker, add:

```dotenv
AGENTDOCK_SERVER_URL=https://agent.example.com
TUNNEL_TOKEN=<cloudflare-tunnel-token>
```

Then start the Named Tunnel profile:

```bash
docker compose --profile cloudflare-named up -d
```

## Verify

Check the public health endpoint first:

```text
https://agent.example.com/healthz
```

Then configure the MCP client with:

```text
https://agent.example.com/mcp
```

Use the AgentDock Bearer Token or OAuth flow for MCP authentication. The Cloudflare Tunnel Token is only for the Tunnel and must never be used as the MCP credential.

For connection failures, see [Troubleshooting](./troubleshooting.md). For authentication settings, see [Configuration reference](../reference/configuration.md).
