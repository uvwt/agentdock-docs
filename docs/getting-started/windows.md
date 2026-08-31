# Windows installation

Install AgentDock using the official Windows graphical installer.

AgentDock supports Windows 11 x64 and ARM64.

## 1. Download installer

Open [AgentDock Latest Release](https://github.com/uvwt/agentdock/releases/latest) and download the package for your architecture:

- Most Intel or AMD PCs: `AgentDockSetup-amd64.exe`
- Windows ARM PCs: `AgentDockSetup-arm64.exe`

If unsure, choose `amd64`.

The installer already bundles AgentDock Core, the control panel, core Skills, and Cloudflare components. Installation and upgrades do not download these components separately from GitHub.

## 2. Run installer

Double-click the installer and follow the on-screen instructions.

If a UAC prompt appears, confirm the filename and publisher information before continuing.

## 3. Choose startup options

The installer offers these startup options:

- Launch AgentDock and tray icon on Windows login
- Run AgentDock Core with Administrator privileges

Administrator enhancement mode applies only to AgentDock Core; the control panel and tray icon always run as the current user. If current account cannot elevate, uncheck Administrator enhancement mode to run in standard user mode.

## 4. Choose connection option

### Local only

Select when the MCP client runs on the same computer. No domain or Cloudflare account required.

### Temporary public address

Select when connecting from ChatGPT, a phone, or another remote device without a custom domain. AgentDock generates a `trycloudflare.com` address automatically.

Temporary addresses may change when Windows or the tunnel restarts. When changed, copy the new address from the control panel and update your client.

### Fixed Cloudflare domain

For a permanent address, first complete the [fixed domain setup guide](../guides/fixed-domain.md). Then select **Fixed domain** and enter the HTTPS public origin and Tunnel Token from that setup. Do not append `/mcp` to the public origin.

After installation, you can switch between Local only, Temporary address, and Fixed domain in the **Public Access** section of the control panel without rerunning the installer.

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

Use the local MCP URL when the client is on the same computer; use the public MCP URL for ChatGPT or other remote clients. Select **Streamable HTTP** as the transport.

If you selected a temporary or fixed public address and want to connect web ChatGPT:

1. Copy the public MCP URL and OAuth password from the control panel.
2. In ChatGPT, open **Settings > Plugins**, and enable developer mode.
3. Create a plugin, enter the public MCP URL, and authorize with the OAuth password.

For full instructions, see [Connect ChatGPT to AgentDock](../guides/chatgpt.md). For other clients, see [Connect AgentDock from different clients](../guides/mcp-clients.md).

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

For PowerShell automation, pinned versions, WSL, and file locations, see [Advanced Windows configuration](../operations/windows.md). If startup fails, see [Troubleshooting](../operations/troubleshooting.md).
