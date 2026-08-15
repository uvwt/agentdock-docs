# Install AgentDock on macOS

The graphical macOS app is recommended for regular users. You do not need Terminal, Go, Git, or the source code.

The same package supports both Apple Silicon and Intel Macs.

## Before you begin

- Use macOS 13 or later.
- Download AgentDock only from the official [GitHub Releases page](https://github.com/uvwt/agentdock/releases/latest).
- A fixed public address requires a Cloudflare-managed domain and its Tunnel Token. Without those, start with a temporary public address.
- Install Google Chrome, Chromium, or Microsoft Edge before enabling browser automation.

## 1. Download and install the app

1. Open the [latest AgentDock release](https://github.com/uvwt/agentdock/releases/latest).
2. Download `AgentDock-macos-universal.dmg`.
3. Double-click the DMG.
4. Drag `AgentDock.app` to **Applications**.
5. Eject the disk image after copying finishes.

Apple Silicon and Intel Macs use the same DMG. You do not need to identify the processor or download a ZIP package.

## 2. Open it for the first time

The current version is not notarized by Apple, so the first launch needs one manual confirmation:

1. Open **Applications** in Finder.
2. Right-click `AgentDock.app` and choose **Open**.
3. Click **Open** again in the confirmation dialog.

Do not disable Gatekeeper or change system-wide security settings. After the first successful launch, you can open AgentDock normally.

AgentDock appears in the menu bar. Click its icon and choose **Install AgentDock** or **Open AgentDock** to show the main window.

## 3. Choose a connection option

### Only this Mac

Choose **Only this Mac** when the MCP client runs on the same Mac. This mode does not require a domain or Cloudflare account.

### Temporary public address

Choose **Temporary address** when ChatGPT, a phone, or another remote device needs to connect and you do not have a domain ready. AgentDock creates a public HTTPS address automatically.

The address may change after the Mac or Tunnel restarts. When it changes, copy the new address from the control panel and replace the old address in the client.

### Fixed domain

Choose **Fixed domain** for a stable, long-term address and enter:

- The HTTPS public origin, for example `https://mini.example.com`
- The matching Cloudflare Tunnel Token

Enter only the origin. Do not add `/mcp`.

Click **Install and Start** and keep the window open until the status reports that AgentDock is running normally.

## 4. Connect an MCP client

After installation, the main window shows:

- Service status and version
- Local MCP URL
- Public MCP URL, when public access is enabled
- Bearer Token
- OAuth sign-in password, when public access is enabled

Credentials are masked by default. Select **Show** only when needed. Long URLs and credentials can be copied with the **Copy** buttons.

A client on the same Mac uses the local MCP URL. ChatGPT or another remote client uses the public MCP URL. Choose **Streamable HTTP** as the transport.

Do not include the Bearer Token or OAuth password in screenshots, issues, or public conversations.

## 5. Daily use

Use the AgentDock menu bar icon to:

- Check service status and version
- Open the control panel
- Start, stop, or restart the service
- Check for updates
- Open log and configuration folders

The control panel can also test public access, change connection mode, and regenerate a temporary address. While regeneration is in progress, the previous address is hidden until the new one is ready.

Quitting the menu bar app does not stop the AgentDock service. The menu bar app and core service have separate login-startup settings.

## Optional: enable browser tools

1. Install Google Chrome, Chromium, or Microsoft Edge if none is installed yet.
2. Open **Advanced Settings**.
3. Enable **Browser tools**.
4. Confirm that AgentDock detects a supported browser.
5. Select **Apply and Restart**.

AgentDock uses separate browser sessions and profiles for automation instead of taking over your everyday browser profile.

See [Browser automation](../guides/browser-control.md) for login profiles and safety boundaries.

## Optional: start after login

Advanced Settings provides two independent switches:

- Start the AgentDock service after login
- Show AgentDock in the menu bar after login

Most users should leave both enabled. You can hide the menu bar app while keeping the core service available in the background.

## Update or repair

Use **Check for Updates** in the main window. Current releases update the AgentDock core, macOS app, and official core Skills as one coordinated update, then restore the managed service and reopen the app when required.

Configuration, Skills, tasks, and the working directory are preserved. If you are upgrading from an older release that predates the integrated desktop updater, install the latest DMG once and continue using in-app updates afterward.

## Common problems

### macOS says the developer cannot be verified

Right-click AgentDock in Applications and choose **Open**. Do not double-click it for the first launch.

### The service shows an error

Select **Restart**, then open the log folder. The latest error is usually in `agentdock.err.log`.

### The temporary public address changed

Copy the new public MCP URL from the control panel, replace the old URL in the client, and authorize OAuth again when prompted. Existing Bearer and OAuth credentials remain unchanged.

### Browser tools do not start

Confirm that Google Chrome, Chromium, or Microsoft Edge is installed, then disable and enable browser tools again.

For pinned versions, custom installation directories, manual service commands, and removal, see [Advanced macOS configuration](../operations/macos.md). For screen, keyboard, and mouse control, continue with [macOS desktop automation](../guides/desktop-automation.md).
