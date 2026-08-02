# Advanced Windows configuration

Regular users only need the [Windows installation](../getting-started/windows.md) for their first setup. This page covers login startup, fixed versions, WSL, browser capabilities, and removal.

## Start after login

After downloading `$script` as described on the installation page, run:

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -RegisterStartup `
  -Port 8765
```

The installer generates a Bearer Token, protects it with the current user's DPAPI, and starts AgentDock immediately. A newly generated token is shown only once, so save it in a password manager.

Connection details:

```text
Transport      Streamable HTTP
URL            http://127.0.0.1:8765/mcp
Request header Authorization: Bearer <token shown by the installer>
```

This mode starts after the current user logs in. It is not a system service that runs before login.

## Cloudflare Tunnel

When `-RegisterStartup` is used for a new installation, the installer asks whether a Cloudflare-managed domain is available:

- Answer **yes** for a fixed Named Tunnel. Enter the HTTPS public origin and paste the Tunnel Token at the hidden prompt.
- Answer **no** for a temporary Quick Tunnel. The installer downloads `cloudflared.exe`, waits for the generated `trycloudflare.com` address, writes it back to AgentDock, and restarts AgentDock with OAuth enabled.

Later installer runs reuse the stored mode. Automation can bypass the question with `-TunnelMode quick`, `-TunnelMode named`, or `-TunnelMode none`. Named mode also accepts `-ServerUrl`; inject `AGENTDOCK_CLOUDFLARE_TUNNEL_TOKEN` from a protected environment rather than putting a real token in shell history.

AgentDock and `cloudflared` use separate current-user startup entries:

```text
HKCU\Software\Microsoft\Windows\CurrentVersion\Run\AgentDock
HKCU\Software\Microsoft\Windows\CurrentVersion\Run\AgentDockCloudflared
```

Sensitive values are stored separately under `%LOCALAPPDATA%\AgentDock` and protected with current-user DPAPI:

```text
auth-token.dpapi
oauth-password.dpapi
oauth-token-secret.dpapi
cloudflared-token.dpapi
```

The public origin and selected mode are non-secret text files. The Tunnel Token is decrypted only by the `cloudflared` launcher and is exported as `TUNNEL_TOKEN`; it is not placed in command arguments or passed to AgentDock.

A Quick Tunnel address changes whenever `cloudflared` restarts. Rerun the same installer command to obtain and write back the new address. The Bearer Token, OAuth password, and OAuth signing secret remain unchanged. Then update the client MCP URL and authorize OAuth again.

## Install a specific version

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -Version vX.Y.Z
```

Run the installer again to upgrade. Existing runtime data and startup configuration are preserved.

## Verify the installer script

To verify the installer script before execution:

```powershell
$base = 'https://github.com/uvwt/agentdock/releases/latest/download'
$script = Join-Path $env:TEMP 'install-agentdock.ps1'
$checksum = "$script.sha256"

Invoke-WebRequest "$base/install-windows.ps1" -OutFile $script
Invoke-WebRequest "$base/install-windows.ps1.sha256" -OutFile $checksum

$expected = ((Get-Content -LiteralPath $checksum -Raw) -split '\s+')[0].ToLowerInvariant()
$actual = (Get-FileHash -LiteralPath $script -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw 'AgentDock installer checksum mismatch.' }
```

The installer also verifies the AgentDock ZIP that it downloads.

## WSL runtime

When WSL is installed, command and file tools can select a Linux runtime explicitly:

```json
{
  "runtime": "wsl",
  "wsl_distribution": "Ubuntu"
}
```

You may omit `wsl_distribution` to use the system default distribution. WSL file tools require `python3` in the target distribution and use Linux absolute paths such as `/home/...` and `/mnt/d/...`.

WSL writes reject symbolic links, device files, and special directories such as `/proc`, `/sys`, `/dev`, and `/run`. Cross-filesystem moves and recursive directory deletion are not currently supported.

## Browser capabilities

The Windows release does not install the browser runner automatically. Native mode requires Node.js, the runner from the source repository, and `playwright-core`. Regular users should prefer the Docker browser image, which already includes all dependencies. See [Browser automation](../guides/browser-control.md).

## Commands and Skills

- `exec_command` prefers PowerShell 7, then falls back to Windows PowerShell or `cmd.exe`.
- `tty=true` uses ConPTY.
- Python, Node.js, and other platform dependencies declared by a Skill must be installed by the user.
- The macOS Desktop Skill does not support Windows.

## Remove AgentDock

Download and run the uninstaller:

```powershell
$uninstaller = Join-Path $env:TEMP 'uninstall-agentdock.ps1'
Invoke-WebRequest `
  https://github.com/uvwt/agentdock/releases/latest/download/uninstall-windows.ps1 `
  -OutFile $uninstaller
powershell -ExecutionPolicy Bypass -File $uninstaller
```

To also remove `%USERPROFILE%\.agentdock` and `%USERPROFILE%\AgentDock`:

```powershell
powershell -ExecutionPolicy Bypass `
  -File $uninstaller `
  -PurgeState
```

:::danger
`-PurgeState` deletes tasks, Skill configuration, runtime data, and the default working directory. Back up anything you need before running it.
:::
