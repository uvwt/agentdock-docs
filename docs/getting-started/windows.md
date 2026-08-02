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

## Optional: create a public address

To let another computer, phone, or ChatGPT connect, run in PowerShell:

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -RegisterStartup
```

This command starts AgentDock automatically after the current user signs in and asks: **Do you already have a domain connected to Cloudflare?**

- Choose **no** to create a temporary `https://…trycloudflare.com` address automatically. No domain setup is required, so this is the easiest option for a first trial.
- Choose **yes** to enter a fixed HTTPS address and Cloudflare Tunnel Token for long-running use.

When installation finishes, PowerShell shows the public address, MCP URL, Bearer Token, and OAuth login password. Copy the MCP URL and the required authentication details into the client. Other sensitive keys are stored securely by the installer and are not displayed.

A temporary address may change after the computer or Tunnel restarts. Run the same command again and replace the MCP URL in the client. The existing Bearer Token and OAuth login details are preserved.

See [Advanced Windows configuration](../operations/windows.md#cloudflare-tunnel) for login startup, automation parameters, logs, and secret storage.

## Update

Download the latest installer and run it again. Tasks, Skills, configuration, and the working directory are preserved.

## Continue when needed

- For login startup, a fixed version, installer verification, WSL, or removal, see [Advanced Windows configuration](../operations/windows.md).
- For browser automation, the current build-free option is the Docker browser image. See [Browser automation](../guides/browser-control.md).
- If startup fails, see [Troubleshooting](../operations/troubleshooting.md).
- Before allowing LAN or public access, read the [Security model](../operations/security.md).
