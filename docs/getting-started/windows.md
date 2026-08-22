# Windows installation

Regular users can use the graphical Windows installer. You do not need PowerShell, WSL, Go, or the source code.

AgentDock supports Windows 11 x64 and ARM64.

## 1. Download the installer

Open the [latest AgentDock release](https://github.com/uvwt/agentdock/releases/latest) and download the package for your computer:

- Most Intel or AMD PCs: `AgentDockSetup-amd64.exe`
- Windows on ARM: `AgentDockSetup-arm64.exe`

Choose `amd64` unless you know that your PC runs Windows on ARM.

The installer already contains the AgentDock core, control panel, core Skills, and Cloudflare component. Installation and upgrades do not download those components from GitHub.

## 2. Run the installer

Double-click the installer and follow the on-screen instructions.

If a UAC prompt appears during installation, confirm the file name and publisher information before continuing.

## 3. Choose startup options

Setup provides these startup options:

- Start AgentDock and the tray after signing in to Windows
- Run the AgentDock core with administrator privileges

Administrator-enhanced mode applies only to the AgentDock core. The control panel and tray continue to run as the signed-in user. If the current account cannot elevate, clear that option and use standard-user mode.

## 4. Choose a connection option

### Local access only

Choose this when the MCP client runs on the same PC. This mode does not require a domain or Cloudflare account.

### Temporary public address

Use this for ChatGPT, a phone, or another remote device when you do not have a domain ready. AgentDock creates a `trycloudflare.com` address automatically.

The address may change after Windows or the Tunnel restarts. When it changes, read the new address from the control panel and replace the old address in your client.

### Your own Cloudflare domain

Use this for a stable, long-term address. Enter:

- The HTTPS public origin, for example `https://mini.example.com`
- The matching Cloudflare Tunnel Token

Enter only the origin. Do not add `/mcp`. For the full Cloudflare setup and address mapping, see [Configure a fixed domain](../guides/fixed-domain.md).

After installation, you can switch between local, temporary, and fixed-domain access directly from **Public access** in AgentDock Control Panel. Changing the public access mode does not require rerunning Setup.

## 5. Finish installation

**Create a desktop shortcut** is selected by default. Clicking **Finish** opens AgentDock Control Panel. You can also open it later from the Start menu, desktop shortcut, or system tray.

Wait until the top-right status says that AgentDock is running normally, then confirm that the version, local MCP URL, and selected public URL are visible.

:::tip
When an existing installation is detected, Setup defaults to upgrading while keeping all current settings. Keep that option for a normal upgrade. Choose the settings option only when you need to change startup or connection behavior.
:::

## 6. Connect an MCP client

The **Overview** page shows:

- Local MCP URL
- Public MCP URL, when public access is enabled
- Bearer Token
- OAuth password, when public access is enabled

Credentials are masked by default. Select **Show** only when needed. Values in the text fields can be copied with the standard Windows copy command.

A client on the same PC uses the local MCP URL. ChatGPT or another remote client uses the public MCP URL. Choose **Streamable HTTP** as the transport.

To connect web ChatGPT after choosing a temporary or fixed public address:

1. Copy the public MCP URL and OAuth password from the control panel.
2. In ChatGPT, enable developer mode under **Settings > Plugins**.
3. Create a plugin, paste the public MCP URL, and authorize with the OAuth password.

The full walkthrough is in [Connect ChatGPT to AgentDock](../guides/chatgpt.md). For other clients, see [Connect AgentDock from different clients](../guides/mcp-clients.md).

Do not include the Bearer Token or OAuth password in screenshots, issues, or public conversations.

## Daily use

Use the control panel to check status and version, start or stop the service, test public access, change connection mode, regenerate a temporary URL, and adjust port, logging, and startup settings.

Use the tray menu for quick status checks, service restart, temporary public URL regeneration, and log access.

## Update or repair

Use **Update** in the control panel. Current releases update the AgentDock core, Windows control-panel/tray components, and official core Skills together, then restart the managed service when needed. Tasks, Skills, configuration, connection settings, and the working directory are preserved.

If you are upgrading from an older release that predates the integrated desktop updater, run the latest Setup once and continue using in-app updates afterward.

## Uninstall

Remove AgentDock from **Settings > Apps > Installed apps**, or use **Uninstall AgentDock** in the Start menu. The uninstaller asks whether to remove tasks, Skills, configuration, and the default working directory as well.

For browser automation, install Chrome, Chromium, or Microsoft Edge and enable browser tools in the control panel. Use the Docker browser image only when you want Chromium bundled in a container. See [Browser automation](../guides/browser-control.md).

For PowerShell automation, pinned versions, WSL, and file locations, see [Advanced Windows configuration](../operations/windows.md). For startup failures, see [Troubleshooting](../operations/troubleshooting.md).
