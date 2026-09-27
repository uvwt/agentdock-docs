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
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/install.sh \
  -o /tmp/agentdock-install.sh
sh /tmp/agentdock-install.sh --register-service
```

Useful options include `--version vX.Y.Z` and `AGENTDOCK_INSTALL_DIR=<path>`. The default CLI path is `~/.local/bin/agentdock`.

Default user data:

```text
~/.agentdock  AgentDock state
~/AgentDock   Default working directory
```

For screen, keyboard, or mouse automation, grant the app that actually runs AgentDock the required permissions under **System Settings → Privacy & Security**.

### Verify desktop automation readiness

The [Desktop Skill](https://github.com/uvwt/agentdock-skills/tree/main/skills/desktop)
provides `skill_action=status` or `skill_action=observe` with `action=preflight`.
Run the installed Skill through AgentDock's `exec_command` path using the exact
Skill reference returned by `agentdock_context`. Checks from a separate SSH or
terminal process do not prove the AgentDock process has permission.

When the installed Skill returns `readiness`, it reports `screen_capture`,
`apple_events`, and `accessibility` separately as `passed`, `failed`, or
`not_checked`. Screen capture must produce a PNG header with nonzero
dimensions. Accessibility checks read actual window properties from the
frontmost application. Listing System Events processes alone cannot establish
AX access. Temporary preflight captures are removed and window names are not
returned.

All three checks run by default. Skipping one with `check_screenshot=false`,
`check_applescript=false`, or `check_accessibility=false` leaves it unverified
and makes overall `ok` false. These checks read state without injecting input;
a pass does not guarantee every target application or input action succeeds.
If an older Skill omits `readiness` or `accessibility_ok`, update it or treat
Accessibility as unverified.

If Apple Events passes but real AX reading fails, verify Accessibility
permission for the current AgentDock process and an active graphical session.
After an update, permission switches may refer to an older code identity.
Reauthorize the current process and repeat the real check. A System Events
restart can interrupt other automation and requires user confirmation.
Preflight does not reset TCC, change permissions, or restart system processes.

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
  https://github.com/uvwt/agentdock/releases/latest/download/install.ps1 `
  -OutFile $script
powershell -ExecutionPolicy Bypass -File $script -RegisterStartup
```

The default installation and runtime location is `%LOCALAPPDATA%\AgentDock`. Use the Control Panel for normal updates and settings changes.

When WSL is installed, file and command tools can target a Linux distribution with `runtime=wsl`. WSL file operations require `python3` in the selected distribution.

To uninstall, use **Settings → Apps → Installed apps** or **Uninstall AgentDock** from the Start menu. The uninstaller lets you choose whether preserved AgentDock data should also be removed.
