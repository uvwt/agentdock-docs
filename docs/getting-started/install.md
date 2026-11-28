# Install AgentDock

Choose your platform to install AgentDock from official packages.

| Your environment | Recommended option |
| --- | --- |
| Windows 11 | [Graphical Windows installation](./windows.md) |
| macOS 13 or later | [Graphical macOS installation](./macos.md) |
| Linux server or desktop | [Automated Linux installation](./linux.md) |
| Docker already installed | [Docker installation](./docker.md) |

For your own Windows PC or Mac, prefer the graphical installer. Choose Docker when it is already part of your environment or when you need container isolation.

## Connection options

After installation, choose how your AI clients connect:

| Option | Best for | What you need |
| --- | --- | --- |
| **NexusDock** (recommended for remote access) | ChatGPT, Claude, phones, or multi-device access without setting up tunnels or domains | A NexusDock Cloud (`https://mcp.nexusdock.co`) or self-hosted NexusDock pairing code |
| Local only | The MCP client and AgentDock run on the same computer | Nothing else |
| Self-hosted Cloudflare Tunnel (optional) | Direct public HTTPS access to a single AgentDock device | Install the optional `cloudflared` component in Settings (temporary address or fixed Cloudflare domain) |

First-time desktop installation only installs AgentDock itself and starts local access. Remote connections—either pairing with NexusDock or installing the optional `cloudflared` component for direct public access—are configured in the control panel afterwards.

:::warning
Public access must use a Bearer Token or OAuth. Do not include connection credentials or pairing codes in screenshots, issues, or public conversations.
:::

## After installation

For **NexusDock** (recommended for remote clients such as web ChatGPT), sign in to `https://mcp.nexusdock.co` (or your self-hosted NexusDock), create a 6-digit single-use pairing code (valid for 5 minutes) under **Devices**, enter it in the AgentDock control panel (or via `agentdock nexus pair`), and confirm the device shows **Online**. Then connect your client to `https://mcp.nexusdock.co/mcp` (or your self-hosted NexusDock URL). See [Connect AgentDock](../operations/nexusdock-connect.md).

For direct local or self-hosted public MCP connections, get these values from the control panel or terminal:

```text
MCP URL
Bearer Token or OAuth sign-in details
```

Add them to the MCP, Tools, or Connectors settings in your client and choose **Streamable HTTP**.

- Client and AgentDock on the same device: use the local MCP URL.
- Client on another device or in the cloud: use NexusDock, or use the direct public MCP URL if you enabled Cloudflare Tunnel.
- Temporary public URL changed: replace the old URL in the client and authorize OAuth again when prompted.

:::tip
For your first use, complete only the numbered steps on the page for your operating system. Custom ports, automation flags, and manual service management can wait until later.
:::

Next steps after your device is online:

- [Let your AI connect NexusDock](../guides/ai-connect.md) (recommended for compatible AI assistants)
- [Connect from different clients](../guides/mcp-clients.md)
- [Connect with ChatGPT](../guides/chatgpt.md)
- [Everyday use with NexusDock](../guides/using-nexusdock.md)
