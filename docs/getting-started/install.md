# Install AgentDock

Choose the system you are currently using. Most users should prefer a native installation. Choose Docker when it is already part of your environment or when you want stronger runtime isolation.

| Current environment | Recommended option |
| --- | --- |
| macOS | [macOS installation](./macos.md) |
| Windows 11 | [Windows installation](./windows.md) |
| Linux server or desktop | [Linux installation](./linux.md) |
| Docker already installed | [Docker installation](./docker.md) |

All standard installation methods automatically install and activate AgentDock's official core Skills. Other user-installed Skills, existing versions, and isolated environments remain in the same Skill Store and are not erased when AgentDock is upgraded.

When upgrading for the first time from a release that did not yet contain the core Skill bundle, rerun the installer for your platform. After that one-time upgrade, future `agentdock update` runs update both the binary and the official core Skills.

You do not need to download source code, install Go, or build AgentDock yourself.

## After installation

Every installation page provides two pieces of information:

```text
MCP URL
Connection token (required only when authentication is enabled)
```

Add them to the MCP, Tools, or Connectors settings in your client. Choose **Streamable HTTP** as the transport.

:::tip
For your first use, complete only the numbered steps on the page for your operating system. You can return to the advanced links at the end later.
:::

## Choosing an option

- For your own Mac or Windows computer, use the native installer.
- For a long-running Linux server, use the Linux installer.
- For a quick isolated trial on a machine that already has Docker, use Docker.
- To use browser automation without preparing a runner manually, use Docker and then [enable the browser image](../operations/docker.md#enable-browser-automation).
- To control the macOS screen and accessibility APIs, you must use the native macOS installation; Docker cannot control the host desktop.
