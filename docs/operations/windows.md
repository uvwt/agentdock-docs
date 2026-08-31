# Advanced Windows configuration

Standard installations should use the [Windows graphical installer](../getting-started/windows.md). This page covers PowerShell automation, pinned versions, WSL, browser setup, and manual uninstallation.

## Modifying an existing installation

Rerun the latest Setup installer. When an existing installation is detected:

- Standard upgrade or repair: choose "Upgrade directly and keep all current settings".
- Change startup, admin rights, or connection options: choose "Modify startup and connection settings".

Most daily settings can also be modified in **Public Access** and **Advanced Settings** within the Control Panel without reinstalling.

## PowerShell automated installation

PowerShell scripts are available for automation and headless environments:

```powershell
$script = Join-Path $env:TEMP 'install-agentdock.ps1'
Invoke-WebRequest `
  https://github.com/uvwt/agentdock/releases/latest/download/install.ps1 `
  -OutFile $script

powershell -ExecutionPolicy Bypass `
  -File $script `
  -RegisterStartup `
  -Port 8765
```

The default installation directory is `%LOCALAPPDATA%\AgentDock`. `-RegisterStartup` starts AgentDock upon current user login; it is not a pre-login system service.

Local connection details:

```text
Transport    Streamable HTTP
URL          http://127.0.0.1:8765/mcp
Headers      Authorization: Bearer <Bearer Token>
```

## Cloudflare Tunnel automation

Skip interactive prompts using these parameters:

```text
-TunnelMode none     Local only
-TunnelMode quick    Temporary public address
-TunnelMode named    Fixed Cloudflare domain
```

Fixed domains also require `-ServerUrl` and a Tunnel Token. Do not put real tokens directly into shell history; use protected environment variables or `-TunnelTokenFile`.

Example:

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -RegisterStartup `
  -TunnelMode named `
  -ServerUrl 'https://mini.example.com' `
  -TunnelTokenFile 'C:\secure\cloudflare-token.txt'
```

Temporary public addresses may change when the tunnel restarts. You can regenerate addresses from the control panel or tray icon. Bearer Tokens and OAuth credentials are preserved, but clients need the updated MCP URL and re-authorized OAuth.

## Installing a specific version

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -Version vX.Y.Z `
  -RegisterStartup
```

Use **Update** in the AgentDock Control Panel for standard upgrades. Rerun Setup or install scripts only when restoring an older version or pinning a specific release. Tasks, Skills, configuration, and working directories are preserved.

## Installer checksum verification

```powershell
$base = 'https://github.com/uvwt/agentdock/releases/latest/download'
$script = Join-Path $env:TEMP 'install-agentdock.ps1'
$checksum = "$script.sha256"

Invoke-WebRequest "$base/install.ps1" -OutFile $script
Invoke-WebRequest "$base/install.ps1.sha256" -OutFile $checksum

$expected = ((Get-Content -LiteralPath $checksum -Raw) -split '\s+')[0].ToLowerInvariant()
$actual = (Get-FileHash -LiteralPath $script -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw 'AgentDock installer checksum mismatch.' }
```

The installer also validates the downloaded AgentDock release archive.

## WSL runtime

When WSL is installed, file and command tools can target the Linux runtime:

```json
{
  "runtime": "wsl",
  "wsl_distribution": "Ubuntu"
}
```

`wsl_distribution` can be omitted to use the system default distribution. WSL file tools require `python3` in the target distribution, using absolute Linux paths like `/home/...` or `/mnt/d/...`.

## Browser capabilities

Install Google Chrome, Chromium, or Microsoft Edge first, then enable browser tools in the AgentDock Control Panel. The Windows application automatically detects supported browsers. For usage details, see [Browser automation](../guides/browser-control.md).

## Files and credential locations

Default runtime directory:

```text
%LOCALAPPDATA%\AgentDock
```

Bearer Tokens, OAuth passwords, OAuth signing keys, and Tunnel Tokens are encrypted using current-user credentials (DPAPI). Do not copy or expose these files.

## Uninstallation

Uninstall from Windows **Settings > Apps > Installed apps**, or use **Uninstall AgentDock** in the Start menu.

For automated uninstallation, run the release script:

```powershell
$uninstaller = Join-Path $env:TEMP 'uninstall-windows.ps1'
Invoke-WebRequest `
  https://github.com/uvwt/agentdock/releases/latest/download/uninstall-windows.ps1 `
  -OutFile $uninstaller
powershell -ExecutionPolicy Bypass -File $uninstaller
```

To also remove tasks, Skills, configuration, and default working directory:

```powershell
powershell -ExecutionPolicy Bypass `
  -File $uninstaller `
  -PurgeState
```

:::danger
`-PurgeState` deletes user data and default working directories. Back up required files before running.
:::
