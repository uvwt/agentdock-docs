# Advanced Windows configuration

Regular users only need the [graphical Windows installation](../getting-started/windows.md) for installation and upgrades. This page covers PowerShell automation, pinned versions, WSL, browser capabilities, and manual removal.

## Change an existing installation

Run the latest Setup again. When it detects AgentDock:

- Normal upgrade or repair: keep **Upgrade and keep all current settings**.
- Change startup, core privileges, or connection mode: choose the settings option.

The **Public access** and **Advanced settings** pages in the control panel can change most day-to-day settings without reinstalling.

## PowerShell installation

The PowerShell entry point is intended for automation and advanced users. Regular users can use the graphical Windows installer.

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

The default runtime directory is `%LOCALAPPDATA%\AgentDock`. `-RegisterStartup` starts AgentDock after the current user signs in; it is not a pre-login system service.

Typical local connection details:

```text
Transport      Streamable HTTP
URL            http://127.0.0.1:8765/mcp
Request header Authorization: Bearer <Bearer Token>
```

## Cloudflare Tunnel automation

Use these values to skip the interactive connection choice:

```text
-TunnelMode none     Local only
-TunnelMode quick    Temporary public address
-TunnelMode named    Fixed Cloudflare domain
```

Fixed-domain mode also needs `-ServerUrl` and a Tunnel Token. Do not place a real token directly in shell history. Prefer a protected environment variable or `-TunnelTokenFile`.

Example:

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -RegisterStartup `
  -TunnelMode named `
  -ServerUrl 'https://mini.example.com' `
  -TunnelTokenFile 'C:\secure\cloudflare-token.txt'
```

A temporary public address may change after the Tunnel restarts. Regenerate it from the control panel or tray. Bearer and OAuth credentials are preserved, but the client must use the new MCP URL and may need OAuth authorization again.

## Install a specific version

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -Version vX.Y.Z `
  -RegisterStartup
```

Run the script or a newer Setup again to upgrade. Tasks, Skills, configuration, and the working directory are preserved by default.

## Verify the installer script

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

The script also verifies the AgentDock release package it downloads.

## WSL runtime

When WSL is installed, command and file tools can select a Linux runtime explicitly:

```json
{
  "runtime": "wsl",
  "wsl_distribution": "Ubuntu"
}
```

You may omit `wsl_distribution` to use the default distribution. WSL file tools require `python3` in the selected distribution and use Linux absolute paths such as `/home/...` and `/mnt/d/...`.

## Browser capabilities

The Windows control panel can save Browser Runner, Node.js, and related paths. Native browser capabilities still require those runtime files to exist. To avoid preparing them manually, use the Docker browser image, which already includes its dependencies. See [Browser automation](../guides/browser-control.md).

## Files and credentials

Default runtime directory:

```text
%LOCALAPPDATA%\AgentDock
```

The Bearer Token, OAuth password, OAuth signing secret, and Tunnel Token are protected for the current Windows user. Do not copy or publish these files.

## Remove AgentDock

Regular users should remove AgentDock from **Settings > Apps > Installed apps** or use **Uninstall AgentDock** in the Start menu.

For automated removal, run the release script:

```powershell
$uninstaller = Join-Path $env:TEMP 'uninstall-agentdock.ps1'
Invoke-WebRequest `
  https://github.com/uvwt/agentdock/releases/latest/download/uninstall-windows.ps1 `
  -OutFile $uninstaller
powershell -ExecutionPolicy Bypass -File $uninstaller
```

To remove tasks, Skills, configuration, and the default working directory as well:

```powershell
powershell -ExecutionPolicy Bypass `
  -File $uninstaller `
  -PurgeState
```

:::danger
`-PurgeState` deletes user data and the default working directory. Back up anything you need before running it.
:::
