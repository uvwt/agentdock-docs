# Install AgentDock on macOS

Install and manage AgentDock using the official macOS graphical application.

A single universal installer supports both Apple Silicon and Intel Macs.

## Prerequisites

- macOS 13 or later.
- Download AgentDock only from the official [AgentDock download endpoint](https://download.nexusdock.co/latest/macos).
- For remote access, pairing with **NexusDock** (`https://mcp.nexusdock.co` or self-hosted) is recommended and requires no Cloudflare setup. If you prefer direct self-hosted public access via Cloudflare Tunnel, `cloudflared` can be installed on demand from Settings afterwards.
- For browser automation, install Google Chrome, Chromium, or Microsoft Edge first.

## 1. Download and install

1. Download the latest [AgentDock macOS installer](https://download.nexusdock.co/latest/macos).
2. Double-click `AgentDock-macos-universal.dmg`.
3. Drag `AgentDock.app` to **Applications**.
4. Eject the disk image once copied.

Apple Silicon and Intel Macs use the same DMG.

## 2. First launch

Open **Applications** in Finder and launch `AgentDock.app`.

AgentDock runs in the menu bar. Click the menu bar icon and choose **Install AgentDock** or **Open AgentDock** to open the main window.

If macOS blocks the first launch, see [macOS says developer cannot be verified](#macos-says-developer-cannot-be-verified) below.

## 3. Choose connection option

The initial setup configures the local AgentDock service and allows it to run in the background. Wait until the status shows "Healthy", then choose how to connect in the app:

### NexusDock (recommended for remote access)

Open the **Connections** section, enter your NexusDock address (for example `https://mcp.nexusdock.co` or your self-hosted NexusDock URL) and one-time pairing code, then pair. You do not need Cloudflare Tunnel or a custom domain. See [Connect AgentDock](../operations/nexusdock-connect.md).

### Local only

When the MCP client runs on the same Mac, use the local MCP URL and Bearer Token directly. No domain or Cloudflare account is required.

### Self-hosted public access (optional Cloudflare Tunnel)

If you want this Mac to expose its own public HTTPS MCP endpoint directly without NexusDock, install the optional `cloudflared` component inside **Settings / Advanced connections** first, then choose either a **Temporary public address** or a **Fixed domain** (see [Public access](../operations/public-access.md)). Do not append `/mcp` to the public origin.

## 4. Connect MCP client

After setup, the main window displays:

- Service status and version
- Local MCP URL
- Public MCP URL (when public access is enabled)
- Bearer Token
- OAuth password (when public access is enabled)

Credentials are masked by default; click **Show** when needed. Use the **Copy** button for URLs and credentials.

Use the local MCP URL when the client is on the same Mac; use the public MCP URL for clients on other devices or in the cloud. Select **Streamable HTTP** as the transport.

Connection menus and authentication options vary by client. OAuth-capable clients can authorize in the browser, while clients that support custom HTTP headers can also use a Bearer Token.

Connection guides for Claude Desktop, ChatGPT, Claude Code, Cursor, VS Code, Codex, TRAE, WorkBuddy, and other clients are available in [Connect from different clients](../guides/mcp-clients.md) and [Connect with ChatGPT](../guides/chatgpt.md).

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

AgentDock uses a separate browser session by default. For login state and security boundaries, see [Browser automation](../guides/browser-control.md).

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

For custom versions, directories, manual commands, and uninstallation, see [Desktop advanced settings](../operations/desktop.md).
