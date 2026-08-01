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

The same installer can keep AgentDock on `127.0.0.1` and manage `cloudflared` as a separate user LaunchAgent. Public access always keeps AgentDock authentication enabled.

For a temporary URL that does not require a Cloudflare account or domain:

```bash
zsh /tmp/install-agentdock-macos.sh --tunnel quick
```

The installer prints the generated `https://...trycloudflare.com/mcp` URL. It changes whenever `cloudflared` restarts, so Quick Tunnel is not suitable for OAuth callbacks or long-running deployments.

For a fixed hostname, create a Named Tunnel and Public Hostname in Cloudflare, then run:

```bash
zsh /tmp/install-agentdock-macos.sh \
  --tunnel named \
  --server-url https://agent.example.com
```

Paste the Tunnel Token at the hidden prompt. Configure the Cloudflare Public Hostname service as `http://127.0.0.1:8765`. The token is stored only in `~/Library/Application Support/AgentDock/cloudflared.env`, not in the AgentDock environment file or command line.

To remove a Tunnel managed by the installer:

```bash
zsh /tmp/install-agentdock-macos.sh --tunnel none
```

See [Advanced macOS configuration](../operations/macos.md#manage-cloudflare-tunnel) for service files, status, and logs.

## Update

Download and run the latest installer again. Tasks, Skills, configuration, and the working directory are preserved, and the previous binary is backed up first.

## Continue when needed

- For a fixed version, custom installation directory, or background service, see [Advanced macOS configuration](../operations/macos.md).
- For screen, keyboard, and mouse automation, see [macOS desktop automation](../guides/desktop-automation.md).
- For browser automation, the current build-free option is the Docker browser image. See [Browser automation](../guides/browser-control.md).
- If startup fails, see [Troubleshooting](../operations/troubleshooting.md).
