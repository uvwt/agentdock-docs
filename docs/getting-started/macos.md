# macOS installation

AgentDock provides prebuilt releases for Apple Silicon and Intel Macs. A regular installation does not require Go, Git, or the source repository.

Use the native installation for local files and for macOS desktop automation that needs Screen Recording and Accessibility permissions.

## 1. Install AgentDock

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/install-macos.sh \
  -o /tmp/install-agentdock-macos.sh
zsh /tmp/install-agentdock-macos.sh
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

Install the background service and let the installer configure public access:

```bash
zsh /tmp/install-agentdock-macos.sh --register-service
```

The installer asks only whether a Cloudflare-managed domain is available:

- Choose **yes** for a fixed hostname. Enter the HTTPS public origin and paste the Tunnel Token at the hidden prompt.
- Choose **no** for a temporary `trycloudflare.com` URL. It is ready immediately, but may change after `cloudflared` restarts.

AgentDock remains bound to `127.0.0.1`, while `cloudflared` runs as a separate user LaunchAgent. Both fixed and temporary paths automatically enable Bearer Token and OAuth authentication. The completion panel shows the public URL, MCP URL, Bearer Token, and OAuth login password. The OAuth signing secret and Tunnel Token are stored privately and are not displayed.

When a temporary URL changes, rerun the same command. The installer refreshes the URL while preserving all authentication credentials. Update the MCP URL in the client and authorize OAuth again.

Automation may still use `--tunnel quick`, `--tunnel named`, or `--tunnel none` as advanced overrides. See [Advanced macOS configuration](../operations/macos.md#manage-cloudflare-tunnel) for managed files, status, and logs.

## Update

Download and run the latest installer again. Tasks, Skills, configuration, and the working directory are preserved, and the previous binary is backed up first.

## Continue when needed

- For a fixed version, custom installation directory, or background service, see [Advanced macOS configuration](../operations/macos.md).
- For screen, keyboard, and mouse automation, see [macOS desktop automation](../guides/desktop-automation.md).
- For browser automation, the current build-free option is the Docker browser image. See [Browser automation](../guides/browser-control.md).
- If startup fails, see [Troubleshooting](../operations/troubleshooting.md).
