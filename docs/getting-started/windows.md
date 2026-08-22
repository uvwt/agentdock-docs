# Windows installation

AgentDock supports Windows 11 x64 and ARM64. It can work directly with Windows files, PowerShell, Git, and Skills. WSL is optional, and no source compilation is required.

## 1. Download and run the installer

Open PowerShell:

```powershell
$script = Join-Path $env:TEMP 'install-agentdock.ps1'
Invoke-WebRequest `
  https://github.com/uvwt/agentdock/releases/latest/download/install.ps1 `
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

After installation, open the AgentDock control panel and select **Public access**. You can switch between **Local only**, **Temporary address**, and **Fixed domain** directly from this page; changing the public access mode does not require rerunning the installer.

For a fixed domain, select **Fixed domain**, enter the HTTPS public address and Cloudflare Tunnel Token, then click **Apply access mode**. Use **Test current public address** on the same page to verify the endpoint. If you have not created the Tunnel yet, follow [Configure a fixed domain](../guides/fixed-domain.md).

For a temporary address, select **Temporary address** and apply the mode. If the address later changes, use **Regenerate temporary address** in the control panel; existing Bearer and OAuth credentials are preserved.

Both public modes enable AgentDock authentication. The control panel shows the public MCP address and the credentials needed by your MCP client. Keep the Cloudflare Tunnel Token private; it is not an MCP login credential.

## Update

Download the latest installer and run it again. Tasks, Skills, configuration, and the working directory are preserved.

## Continue when needed

- For login startup, a fixed version, installer verification, WSL, or removal, see [Advanced Windows configuration](../operations/windows.md).
- For browser automation, the current build-free option is the Docker browser image. See [Browser automation](../guides/browser-control.md).
- If startup fails, see [Troubleshooting](../operations/troubleshooting.md).
- Before allowing LAN or public access, read the [Security model](../operations/security.md).
