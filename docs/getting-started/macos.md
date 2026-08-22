# macOS installation

AgentDock provides prebuilt releases for Apple Silicon and Intel Macs. A regular installation does not require Go, Git, or the source repository.

Use the native installation for local files and for macOS desktop automation that needs Screen Recording and Accessibility permissions.

## 1. Install AgentDock

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/install.sh \
  -o /tmp/install-agentdock.sh
sh /tmp/install-agentdock.sh
```

The script detects the Mac architecture, verifies the download, and installs AgentDock at:

```text
~/.local/bin/agentdock
```

If the script reports that this directory is not in `PATH`, run:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zprofile
export PATH="$HOME/.local/bin:$PATH"
```

## 2. Start AgentDock

```bash
agentdock --host 127.0.0.1 --port 8765
```

Keep this terminal open. You do not need a background service for the first trial.

## 3. Verify startup

Open another terminal and run:

```bash
curl -fsS http://127.0.0.1:8765/healthz
```

A healthy response contains `ok: true`.

## 4. Connect an MCP client

For a client on the same Mac, use:

```text
Transport      Streamable HTTP
URL            http://127.0.0.1:8765/mcp
Authentication Not required
```

Authentication may be disabled while listening only on `127.0.0.1`. LAN or public access requires authentication and HTTPS.

:::tip
**Installation is complete** when the health check succeeds and the client connects. You can then use files, commands, Git, and Skills.
:::

## Optional: publish with Cloudflare Tunnel

Open the AgentDock control panel and use **Public access** to switch between **Local only**, **Temporary address**, and **Fixed domain**. Changing the public access mode does not require rerunning the installer.

For a fixed domain, select **Fixed domain**, enter the HTTPS public address and Cloudflare Tunnel Token, then click **Apply changes**. If you have not created the Tunnel yet, follow [Configure a fixed domain](../guides/fixed-domain.md).

For a temporary address, select **Temporary address** and apply the change. If you need a new temporary URL later, use **Regenerate temporary address** in the same control panel instead of reinstalling AgentDock.

Both public modes enable AgentDock authentication and show the public MCP address plus the credentials needed by the MCP client. Keep the Cloudflare Tunnel Token private; it is not an MCP login credential.

For service management, logs, and advanced overrides, see [Advanced macOS configuration](../operations/macos.md#manage-cloudflare-tunnel).

## Update

Download and run the latest installer again. Tasks, Skills, configuration, and the working directory are preserved, and the previous binary is backed up first.

## Continue when needed

- For a fixed version, custom installation directory, or background service, see [Advanced macOS configuration](../operations/macos.md).
- For screen, keyboard, and mouse automation, see [macOS desktop automation](../guides/desktop-automation.md).
- For browser automation, the current build-free option is the Docker browser image. See [Browser automation](../guides/browser-control.md).
- If startup fails, see [Troubleshooting](../operations/troubleshooting.md).
