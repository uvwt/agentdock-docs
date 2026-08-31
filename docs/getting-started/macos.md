# Install AgentDock on macOS

Install and manage AgentDock using the official macOS graphical application.

A single universal installer supports both Apple Silicon and Intel Macs.

## Prerequisites

- macOS 13 or later.
- Download AgentDock only from the official [GitHub Releases page](https://github.com/uvwt/agentdock/releases/latest).
- A fixed public address requires a Cloudflare-managed domain and Tunnel Token. If you do not have these yet, choose a temporary public address.
- For browser automation, install Google Chrome, Chromium, or Microsoft Edge first.

## 1. Download and install

1. Open [AgentDock Latest Release](https://github.com/uvwt/agentdock/releases/latest).
2. Download `AgentDock-macos-universal.dmg`.
3. Double-click the DMG.
4. Drag `AgentDock.app` to **Applications**.
5. Eject the disk image once copied.

Apple Silicon and Intel Macs use the same DMG.

## 2. First launch

The current release is not yet notarized by Apple, requiring a one-time manual confirmation on first launch:

1. Open **Applications** in Finder.
2. Right-click `AgentDock.app` and select **Open**.
3. Click **Open** again in the confirmation prompt.

Do not disable Gatekeeper or alter global system security settings. After opening successfully once, you can launch normally.

AgentDock runs in the menu bar. Click the menu bar icon and choose **Install AgentDock** or **Open AgentDock** to open the main window.

## 3. Choose connection option

### Local only

Select when the MCP client runs on the same Mac. No domain or Cloudflare account required.

### Temporary public address

Select when connecting from ChatGPT, a phone, or another remote device without a custom domain. AgentDock generates an HTTPS public address automatically.

This address may change when the Mac or tunnel restarts. When changed, copy the new address from the control panel and update your client.

### Fixed domain

For a permanent address, first complete the [fixed domain setup guide](../guides/fixed-domain.md). Then select **Fixed domain** and enter the HTTPS public origin and Tunnel Token from that setup. Do not append `/mcp` to the public origin.

Click **Install and Start**, keeping the window open until the status shows "Healthy". You can switch connection modes later directly from the control panel without rerunning the installer.

## 4. Connect MCP client

After setup, the main window displays:

- Service status and version
- Local MCP URL
- Public MCP URL (when public access is enabled)
- Bearer Token
- OAuth password (when public access is enabled)

Credentials are masked by default; click **Show** when needed. Use the **Copy** button for URLs and credentials.

Use the local MCP URL when the client is on the same Mac; use the public MCP URL for ChatGPT or other remote clients. Select **Streamable HTTP** as the transport.

Do not include Bearer Tokens or OAuth passwords in screenshots, issues, or public conversations.

## 5. Daily usage

Click the AgentDock menu bar icon to:

- View status and version
- Open the control panel
- Start, stop, or restart the service
- Check for updates
- Open log and configuration directories

The control panel lets you test public URLs, switch connection modes, and regenerate temporary addresses.

Quitting the menu bar application does not stop the AgentDock background service. The menu bar application and core service have independent launch-at-login settings.

## Optional: Enable browser tools

1. Install Google Chrome, Chromium, or Microsoft Edge if not already installed.
2. Open **Advanced Settings**.
3. Check **Enable browser tools**.
4. Verify that AgentDock detects a supported browser.
5. Click **Apply and Restart**.

AgentDock uses isolated sessions and profiles for browser automation, never taking over your primary browser profile.

For sessions and security boundaries, see [Browser automation](../guides/browser-control.md).

## Optional: Launch at login

Advanced Settings provides two independent toggles:

- Start AgentDock service at login
- Show AgentDock menu bar at login

Both are recommended to stay enabled. You can disable the menu bar while keeping the core service running in the background.

## Update or repair

Click **Check for Updates** in the main window. Updates include AgentDock Core, macOS graphical app, and official core Skills as a complete package, automatically restarting services when needed.

Existing configuration, Skills, tasks, and working directories are preserved. If upgrading from an older version without the desktop updater, install the latest DMG over the existing app once.

## Frequently asked questions

### macOS says developer cannot be verified

Right-click AgentDock in Applications and choose **Open**. Do not double-click on first launch.

### Service status error

Click **Restart**, then check the log directory. Recent errors appear in `agentdock.err.log`.

### Temporary public address changed

Copy the new public MCP URL from the control panel and update your client; re-authorize OAuth when prompted. Existing Bearer Token and OAuth password remain unchanged.

### Browser tools cannot start

Verify that Google Chrome, Chromium, or Microsoft Edge is installed, then disable and re-enable browser tools.

For custom versions, directories, manual commands, and uninstallation, see [Advanced macOS configuration](../operations/macos.md). For screen, keyboard, and mouse control, see [macOS desktop automation](../guides/desktop-automation.md).
