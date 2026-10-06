# Desktop advanced settings

For normal installation, use the [macOS](../getting-started/macos.md) or [Windows](../getting-started/windows.md) guide. This page only covers settings and maintenance that are useful after installation.

## Common settings

The desktop apps already manage most configuration for you. Use **Public Access** and **Advanced Settings** to change:

- local port and log level;
- temporary or fixed public access;
- NexusDock pairing;
- browser connection mode;
- local Coding Agent profiles;
- chat-card display mode;
- launch-at-login behavior.

Use the app's update and log actions instead of editing service files by hand. For public addresses, see [Public access](./public-access.md). For browser setup, see [Use the browser](../guides/browser-control.md).

## macOS

For automation or a command-line installation:

```bash
curl -fL https://download.nexusdock.co/latest/install.sh \
  -o /tmp/agentdock-install.sh
sh /tmp/agentdock-install.sh --register-service
```

Useful options include `AGENTDOCK_INSTALL_DIR=<path>`. The default CLI path is `~/.local/bin/agentdock`.

Default user data:

```text
~/.agentdock  AgentDock state
~/AgentDock   Default working directory
```

For screen, keyboard, or mouse automation, grant the app that actually runs AgentDock the required permissions under **System Settings → Privacy & Security**.

The graphical app can update AgentDock directly. Command-line installations can use:

```bash
agentdock update --check
agentdock update
```

To uninstall while preserving user data:

```bash
sh /tmp/agentdock-install.sh --uninstall
```

Use `--purge-data` only when you intentionally want to remove preserved AgentDock state and the default working directory too.

## Windows

For automated or headless installation, use the release PowerShell installer:

```powershell
$script = Join-Path $env:TEMP 'install-agentdock.ps1'
Invoke-WebRequest `
  https://download.nexusdock.co/latest/install.ps1 `
  -OutFile $script
powershell -ExecutionPolicy Bypass -File $script -RegisterStartup
```

The default installation and runtime location is `%LOCALAPPDATA%\AgentDock`. Use the Control Panel for normal updates and settings changes.

When WSL is installed, file and command tools can target a Linux distribution with `runtime=wsl`. WSL file operations require `python3` in the selected distribution.

To uninstall, use **Settings → Apps → Installed apps** or **Uninstall AgentDock** from the Start menu. The uninstaller lets you choose whether preserved AgentDock data should also be removed.
