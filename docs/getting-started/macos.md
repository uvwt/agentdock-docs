# Install AgentDock on macOS

The macOS app is the recommended installation method for regular users. You do not need Terminal, Go, Git, or the source code.

AgentDock supports both Apple Silicon and Intel Macs. The app runs in the menu bar and keeps the AgentDock service available in the background.

## Before you begin

- Use macOS 13 or later.
- Download AgentDock only from the official [GitHub Releases page](https://github.com/uvwt/agentdock/releases/latest).
- For browser automation, install Google Chrome or Chromium first. Safari is not used by the browser tools.
- A fixed public address requires a domain already connected to Cloudflare and a Cloudflare Tunnel Token. Without those, choose a temporary public address instead.

## 1. Download the app

1. Open the [latest AgentDock release](https://github.com/uvwt/agentdock/releases/latest).
2. Download `AgentDock-macos-universal.zip`.
3. Double-click the ZIP file to extract `AgentDock.app`.
4. Drag `AgentDock.app` into the **Applications** folder.

The same download works on Apple Silicon and Intel Macs.

:::note
If `AgentDock-macos-universal.zip` is not listed, that release predates the graphical app. Use the [command-line installation](../operations/macos.md#command-line-installation) or wait for the next release that includes the app.
:::

## 2. Open it for the first time

The current free build uses an ad-hoc signature and is not notarized by Apple. macOS therefore requires one manual confirmation on first launch:

1. Open **Applications** in Finder.
2. Right-click `AgentDock.app` and choose **Open**.
3. Click **Open** again in the confirmation dialog.

Do not disable Gatekeeper or change system-wide security settings. After the first successful launch, you can open AgentDock normally.

AgentDock appears in the menu bar. Click its icon and choose **Install AgentDock (`安装 AgentDock`)** or **Open AgentDock (`打开 AgentDock`)** to show the main window. The current app interface uses Chinese labels; this guide includes the matching label where needed.

## 3. Choose how you will connect

For a first installation, choose one of the three options in the window.

### Only this Mac

Choose **Only this Mac (`仅本机`)** when the MCP client runs on the same Mac.

This is the simplest and safest first setup. No domain or Cloudflare account is required.

### Temporary public address

Choose **Temporary address (`临时地址`)** when you need to connect from ChatGPT or another remote client but do not have a Cloudflare domain ready.

AgentDock creates a public HTTPS address automatically. The address may change after the tunnel or Mac restarts. When it changes, copy the new public MCP address from the AgentDock window and update the client.

### Fixed domain

Choose **Fixed domain (`固定域名`)** for a stable address that you plan to use long term.

Enter:

- The public HTTPS address, for example `https://mini.example.com`
- The Cloudflare Tunnel Token for that hostname

The public address must contain only the origin. Do not add `/mcp` because AgentDock adds it automatically.

If you do not already have both a Cloudflare-managed domain and a Tunnel Token, use **Temporary address** instead.

Click **Install and Start (`安装并启动`)**. Keep the window open until AgentDock reports that the service is running normally.

## 4. Copy the connection information

After installation, the main window shows:

- Service status and version
- Local MCP address
- Public MCP address, when public access is enabled
- Bearer Token
- OAuth login password, when public access is enabled

Use the **Copy** buttons instead of selecting long values manually. Credentials are hidden by default; use **Show** only when you need to inspect them.

For a client on the same Mac, use the local MCP address. For a remote client, use the public MCP address.

Do not send the Bearer Token or OAuth password in screenshots, issue reports, or public chat messages. Anyone who has a valid credential may be able to operate the AgentDock service.

See [Connect an MCP client](./install.md#after-installation) for the next step.

## 5. Use the control panel

Open AgentDock from the menu bar whenever you need to:

- Check whether the service is healthy
- Copy the local or public MCP address
- Copy the Bearer Token or OAuth password
- Start, stop, or restart the service
- Update the AgentDock core
- Open the log folder

Stopping the menu bar app does not automatically stop the AgentDock service. The two components have separate startup settings.

## Optional: enable browser tools

1. Open **Advanced Settings (`高级设置`)**.
2. Turn on **Enable browser tools (`启用浏览器工具`)**.
3. Wait for the automatic installation to finish.
4. Click **Apply and Restart (`应用并重启`)**.

On first enable, AgentDock installs and verifies the browser runner and a compatible Node.js runtime automatically. You do not need to install Node.js yourself. Disabling browser tools keeps the downloaded files, so enabling them again does not repeat the full installation.

Use a dedicated browser profile for automation. Do not give an agent access to your everyday browser profile unless the task truly requires it.

## Optional: choose what starts after login

Advanced Settings contains two independent switches:

- **Start AgentDock service after login** keeps MCP available in the background.
- **Show AgentDock in the menu bar after login** opens only the menu bar app.

For most users, leave both switches enabled. You may disable the menu bar switch while keeping the service running after login.

## Update AgentDock

Use **Check for Updates (`检查更新`)** in the main window to update the AgentDock core and official core Skills.

The menu bar application itself is replaced separately. When a newer macOS app is released, download the latest ZIP and replace the old `AgentDock.app` in Applications. Your configuration, Skills, tasks, and working directory are preserved.

## Common problems

### macOS says the developer cannot be verified

Right-click the app in Applications and choose **Open**. Do not double-click it for the first launch.

### The service shows an error

Click **Restart**, then open the log folder. The latest error is usually in `agentdock.err.log`.

### The temporary public address changed

Copy the new public MCP address from AgentDock, replace the old address in the client, and complete OAuth authorization again when prompted. Existing Bearer and OAuth credentials remain unchanged.

### Browser tools fail to start

Confirm that Google Chrome or Chromium is installed, then turn browser tools off and on again. The first installation also needs network access to download the managed runtime when no compatible Node.js is already available.

## Advanced and command-line installation

The graphical app is the normal installation path. Fixed versions, custom installation directories, managed files, manual service commands, and removal steps are documented in [Advanced macOS configuration](../operations/macos.md).

For screen, keyboard, and mouse control, continue with [macOS desktop automation](../guides/desktop-automation.md).
