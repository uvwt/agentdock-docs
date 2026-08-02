# Windows installation

AgentDock supports Windows 11 x64 and ARM64. It can work directly with Windows files, PowerShell, Git, and Skills. WSL is optional, and no source compilation is required.

## 1. Download and run the installer

Open PowerShell:

```powershell
$script = Join-Path $env:TEMP 'install-agentdock.ps1'
Invoke-WebRequest `
  https://github.com/uvwt/agentdock/releases/latest/download/install-windows.ps1 `
  -OutFile $script
powershell -ExecutionPolicy Bypass -File $script
```

The installer downloads and verifies the prebuilt release for the current architecture, installs it under the current user's profile, and adds the installation directory to the user `PATH`. Close and reopen PowerShell after installation before continuing.

## 2. Start AgentDock

```powershell
& "$env:LOCALAPPDATA\AgentDock\bin\agentdock.exe" `
  --host 127.0.0.1 `
  --port 8765
```

Keep this PowerShell window open. You do not need to register automatic startup for the first trial. A newly opened PowerShell window can usually use the `agentdock` command directly.

## 3. Verify startup

Open another PowerShell window:

```powershell
Invoke-RestMethod http://127.0.0.1:8765/healthz
```

A healthy response shows `ok` as `True`.

## 4. Connect an MCP client

For a client on the same computer, use:

```text
Transport      Streamable HTTP
URL            http://127.0.0.1:8765/mcp
Authentication Not required
```

:::tip
**Installation is complete** when the health check succeeds and the client connects.
:::

## Optional: publish with Cloudflare Tunnel

Use login startup mode so AgentDock and `cloudflared` can run together after the current user signs in:

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -RegisterStartup
```

The installer asks only whether you already have a domain connected to Cloudflare. With a domain, it requests the fixed HTTPS public origin and a Tunnel Token. Without a domain, it creates a temporary `trycloudflare.com` address automatically.

Both paths enable Bearer Token and OAuth. The completion output shows the public MCP URL, Bearer Token, and OAuth login password. OAuth and Tunnel secrets are protected with current-user DPAPI and are not placed in the `cloudflared` command line.

A temporary address changes after `cloudflared` restarts. Run the same installer command again to generate and write back the new address. Existing Bearer and OAuth credentials are preserved; replace the MCP URL in the client and complete OAuth again.

## Update

Download the latest installer and run it again. Tasks, Skills, configuration, and the working directory are preserved.

## Continue when needed

- For login startup, a fixed version, installer verification, WSL, or removal, see [Advanced Windows configuration](../operations/windows.md).
- For browser automation, the current build-free option is the Docker browser image. See [Browser automation](../guides/browser-control.md).
- If startup fails, see [Troubleshooting](../operations/troubleshooting.md).
- Before allowing LAN or public access, read the [Security model](../operations/security.md).
