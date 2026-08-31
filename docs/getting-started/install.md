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

The Windows and macOS installers offer three connection options:

| Option | Best for | What you need |
| --- | --- | --- |
| Local only | The MCP client and AgentDock run on the same computer | Nothing else |
| Temporary public address | ChatGPT, a phone, or another remote device; no domain is ready | Internet access |
| Fixed domain | A stable address for long-term use | A Cloudflare-managed domain and Tunnel Token |

Choose an option based on where your MCP client runs, whether public access is needed, and whether you already have a fixed domain. You can switch modes later in the control panel.

:::warning
Public access must use a Bearer Token or OAuth. Do not include connection credentials in screenshots, issues, or public conversations.
:::

## After installation

Get these values from the control panel or terminal:

```text
MCP URL
Bearer Token or OAuth sign-in details
```

Add them to the MCP, Tools, or Connectors settings in your client and choose **Streamable HTTP**.

- Client and AgentDock on the same device: use the local MCP URL.
- Client on another device or in the cloud: use the public MCP URL.
- Temporary public URL changed: replace the old URL in the client and authorize OAuth again when prompted.

:::tip
For your first use, complete only the numbered steps on the page for your operating system. Custom ports, pinned versions, automation flags, and manual service management can wait until later.
:::

If you installed with a public address so web ChatGPT can operate your computer, continue with [Connect ChatGPT to AgentDock](../guides/chatgpt.md).
