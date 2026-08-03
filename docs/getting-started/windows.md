# Windows installation

The signed offline installer is the recommended option for regular users. You do not need PowerShell, WSL, Go, or the source code.

AgentDock supports Windows 11 x64 and ARM64.

## 1. Download the installer

Open the [latest AgentDock release](https://github.com/uvwt/agentdock/releases/latest) and download the package for your computer:

- Most Intel or AMD PCs: `AgentDockSetup-amd64.exe`
- Windows on ARM: `AgentDockSetup-arm64.exe`

Choose `amd64` unless you know that your PC runs Windows on ARM.

The installer already contains the AgentDock core, control panel, core Skills, and Cloudflare component. Installation and upgrades do not download those components from GitHub.

## 2. Run it normally

Double-click the installer. Do not choose **Run as administrator**.

Setup requests UAC only when it is needed, such as enabling administrator-enhanced mode. Before approving a UAC prompt, confirm the file name and publisher information.

## 3. Choose startup options

The default options are suitable for most users:

- Start AgentDock and the tray after signing in to Windows
- Run the AgentDock core with administrator privileges

Administrator-enhanced mode applies only to the AgentDock core. The control panel and tray continue to run as the signed-in user. If the current account cannot elevate, clear that option and use standard-user mode.

## 4. Choose a connection option

### Local access only

Use this when the MCP client runs on the same PC. It is the simplest and safest first setup and needs no domain or Cloudflare account.

### Temporary public address

Use this for ChatGPT, a phone, or another remote device when you do not have a domain ready. AgentDock creates a `trycloudflare.com` address automatically.

The address may change after Windows or the Tunnel restarts. When it changes, read the new address from the control panel and replace the old address in your client.

### Your own Cloudflare domain

Use this for a stable, long-term address. Enter:

- The HTTPS public origin, for example `https://mini.example.com`
- The matching Cloudflare Tunnel Token

Enter only the origin. Do not add `/mcp`.

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

Do not include the Bearer Token or OAuth password in screenshots, issues, or public conversations.

## Daily use

Use the control panel to check status and version, start or stop the service, test public access, change connection mode, regenerate a temporary URL, and adjust port, logging, and startup settings.

Use the tray menu for quick status checks, service restart, temporary public URL regeneration, and log access.

## Update or repair

To update the complete Windows application, download and run the latest Setup again. It detects the existing installation and preserves tasks, Skills, configuration, connection settings, and the working directory by default.

The **Update** button in the control panel updates the AgentDock core. A newer control panel and installer are delivered through the latest Setup.

## Uninstall

Remove AgentDock from **Settings > Apps > Installed apps**, or use **Uninstall AgentDock** in the Start menu. The uninstaller asks whether to remove tasks, Skills, configuration, and the default working directory as well.

For PowerShell automation, pinned versions, WSL, and file locations, see [Advanced Windows configuration](../operations/windows.md). For startup failures, see [Troubleshooting](../operations/troubleshooting.md).
