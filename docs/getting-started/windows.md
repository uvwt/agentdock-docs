# Windows installation

Install AgentDock using the official Windows graphical installer.

AgentDock supports Windows 11 x64 and ARM64.

## 1. Download installer

Download the installer for your architecture:

- Most Intel or AMD PCs: [Download the x64 installer](https://download.nexusdock.co/latest/windows-x64)
- Windows ARM PCs: [Download the ARM64 installer](https://download.nexusdock.co/latest/windows-arm64)

If unsure, choose `amd64`.

The installer bundles AgentDock Core, the control panel, and official core Skills. `cloudflared` is now an optional managed component that is installed on demand from the Control Panel only if you enable self-hosted Cloudflare Tunnel public access.

## 2. Run installer

Double-click the installer and follow the on-screen instructions.

If a UAC prompt appears, confirm the filename and publisher information before continuing.

## 3. Choose startup options

The installer offers these startup options:

- Launch AgentDock and tray icon on Windows login
- Run AgentDock Core with Administrator privileges

Administrator enhancement mode applies only to AgentDock Core; the control panel and tray icon always run as the current user. If current account cannot elevate, uncheck Administrator enhancement mode to run in standard user mode.

## 4. Choose connection option

The interactive installer sets up AgentDock with local access by default—it does not ask you to configure Cloudflare Tunnels during installation. After opening the AgentDock Control Panel, choose your connection mode in **Connections**:

### NexusDock (recommended for remote access)

Enter your NexusDock address (for example `https://mcp.nexusdock.co` or your self-hosted NexusDock URL) and one-time pairing code, then pair. You do not need `cloudflared` or a custom domain. See [Connect AgentDock](../operations/nexusdock-connect.md).

### Local only

When the MCP client runs on the same computer, use the local MCP URL and Bearer Token directly. No domain or Cloudflare account is required.

### Self-hosted Cloudflare Tunnel (optional)

If you want direct public HTTPS access to this PC without NexusDock, install the optional `cloudflared` component in **Settings / Advanced connections**, then switch to **Temporary public address** or **Fixed domain** (see [Public access](../operations/public-access.md)). Do not append `/mcp` to the public origin.

## 5. Complete installation

"Add desktop shortcut" is checked by default. Click **Finish** to open the AgentDock Control Panel. You can also open it from the Start menu, desktop shortcut, or system tray.

Wait until the top-right displays "Healthy", and confirm the version, local MCP URL, and selected public address appear.

:::tip
When an existing installation is detected, the installer defaults to "Upgrade directly and keep all current settings". Keep this option for standard upgrades; choose "Modify settings" only when changing startup or connection modes.
:::

## 6. Connect MCP client

In the control panel **Overview** tab, check:

- Local MCP URL
- Public MCP URL (when public access is enabled)
- Bearer Token
- OAuth password (when public access is enabled)

Credentials are masked by default; click **Show** when needed.

Use the local MCP URL when the client is on the same computer; use the public MCP URL for clients on other devices or in the cloud. Select **Streamable HTTP** as the transport.

Connection menus and authentication options vary by client. OAuth-capable clients can authorize in the browser, while clients that support custom HTTP headers can also use a Bearer Token.

Connection guides for Claude Desktop, ChatGPT, Claude Code, Cursor, VS Code, Codex, TRAE, WorkBuddy, and other clients are available in [Connect from different clients](../guides/mcp-clients.md) and [Connect with ChatGPT](../guides/chatgpt.md).

Do not include Bearer Tokens or OAuth passwords in screenshots, issues, or public conversations.

## Daily usage

The control panel lets you check status and version, start or stop services, test public addresses, switch connection modes, regenerate temporary addresses, and adjust port, log, and startup settings.

The tray menu provides quick access to status, restarting services, regenerating temporary public addresses, and opening logs.

## Update or repair

Click **Update** in the control panel. Updates include AgentDock Core, Windows control panel/tray components, and official core Skills, restarting managed services when needed. Tasks, Skills, configuration, connection mode, and working directories are preserved.

If upgrading from an older version without the desktop updater, run the latest Setup once, then continue using in-app updates.

## Uninstallation

Uninstall AgentDock from Windows **Settings > Apps > Installed apps**, or use **Uninstall AgentDock** in the Start menu. The uninstaller asks whether to remove tasks, Skills, configuration, and default working directories.

For browser automation, install Chrome, Chromium, or Microsoft Edge first, then enable browser tools in the control panel. Docker browser images are needed only when you want Chromium contained in Docker. See [Browser automation](../guides/browser-control.md).

For PowerShell automation, WSL, and file locations, see [Desktop advanced settings](../operations/desktop.md). If startup fails, see [Troubleshooting](../operations/troubleshooting.md).
