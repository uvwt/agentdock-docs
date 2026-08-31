# Advanced macOS configuration

Standard installations should use the [macOS graphical application](../getting-started/macos.md). This page covers command-line installation, specific versions, custom directories, file management, service administration, and uninstallation.

## Graphical app settings

The main window provides status, connection URLs, credentials, start, stop, restart, core updates, and log access. **Advanced Settings** manages ports, log levels, NexusDock integration, browser tools, and independent launch-at-login toggles.

When using the graphical app, avoid editing `agentdock.env` or LaunchAgents manually. The application validates inputs, writes configurations atomically with private permissions, restarts services, and performs health checks.

## Command-line installation

For automation or custom directories, use the command-line installer:

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/install.sh \
  -o /tmp/agentdock-install.sh
sh /tmp/agentdock-install.sh --register-service
```

## Adding AgentDock to PATH

The installer places the binary in `~/.local/bin` by default. To run `agentdock` directly:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

Then run:

```bash
agentdock
```

## Installing a specific version

```bash
sh /tmp/agentdock-install.sh --register-service --version vX.Y.Z
```

## Changing installation directory

```bash
sh /tmp/agentdock-install.sh --register-service --install-dir "$HOME/bin"
```

Ensure the custom directory is added to PATH or use absolute paths.

## Background service

The graphical app installs a LaunchAgent for the current user. In Advanced Settings, "Start AgentDock service at login" manages the core service, while "Show AgentDock menu bar at login" manages the menu bar application.

For manual configuration, use a LaunchAgent under the current login user. For desktop automation (Desktop Skill), AgentDock must run in the login user session, not as a system-wide LaunchDaemon.

Recommended defaults:

```text
Binary path    $HOME/.local/bin/agentdock
Working dir    $HOME/AgentDock
State dir      $HOME/.agentdock
Listen addr    127.0.0.1:8765
```

After modifying the LaunchAgent, reload with `launchctl` and run a health check:

```bash
curl -fsS http://127.0.0.1:8765/healthz
```

## Managing Cloudflare Tunnel

In the graphical app, switch between Local only, Temporary public, and Fixed domain. Fixed domain reuses the existing Tunnel Token.

When using `--register-service` without explicitly setting a tunnel type, the command-line installer asks if you have a Cloudflare-managed domain. Under the hood, having a domain maps to a Named Tunnel, while having none maps to a temporary Quick Tunnel. Scripts can pass `--tunnel quick`, `--tunnel named`, or `--tunnel none`.

Both public modes automatically create or reuse Bearer Tokens, OAuth passwords, and OAuth signing keys. Temporary setups start AgentDock with Bearer authentication first, write the generated trycloudflare.com address to `AGENTDOCK_SERVER_URL`, enable OAuth, and restart AgentDock. The completion dialog shows the public address, MCP URL, Bearer Token, and OAuth password; signing keys remain private.

The installer registers AgentDock and `cloudflared` as two separate user-level LaunchAgents. Management files:

```text
~/Library/Application Support/AgentDock/agentdock.env
~/Library/Application Support/AgentDock/cloudflared.env
~/Library/Application Support/AgentDock/start-cloudflared.sh
~/Library/LaunchAgents/com.uvwt.agentdock.cloudflared.plist
~/Library/Logs/AgentDock/cloudflared.out.log
~/Library/Logs/AgentDock/cloudflared.err.log
```

`agentdock.env` and `cloudflared.env` have `0600` permissions.

View service status and logs:

```bash
launchctl print "gui/$(id -u)/com.uvwt.agentdock.cloudflared"
tail -f "$HOME/Library/Logs/AgentDock/cloudflared.err.log"
```

If the temporary URL changes, rerun the installation command. The installer preserves Bearer Tokens, OAuth passwords, and signing keys, updates the URL, and restarts AgentDock. Update the MCP URL in your client and re-authorize OAuth.

## Browser automation

When enabling browser tools, the macOS graphical app checks that Google Chrome, Chromium, or Microsoft Edge is installed. Install and update browsers normally.

## Directories and permissions

```text
~/.agentdock  AgentDock internal state
~/AgentDock   Default working directory
```

Processes access files according to the macOS user's permissions. Do not grant unnecessary directory permissions.

## Desktop Skill permissions

Before using screen, keyboard, and mouse automation, grant permissions in **System Settings > Privacy & Security** to the terminal or application hosting AgentDock:

- Accessibility
- Screen & System Audio Recording

Grant permissions only to the application actually running AgentDock. macOS may require re-authorization when updating terminal or application paths.

For full instructions, see [macOS desktop automation](../guides/desktop-automation.md).

## Updates and backups

Rerun the install script to upgrade. Old binaries are backed up to:

```text
~/.agentdock/backups/bin
```

Runtime data and default working directories are preserved.

## Uninstalling AgentDock

Before removing the application, disable "Show AgentDock menu bar at login" in Advanced Settings, apply changes, and quit AgentDock.

Download and run the official uninstallation script:

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/uninstall-macos.sh \
  -o /tmp/uninstall-agentdock.sh
zsh /tmp/uninstall-agentdock.sh
```

The default command removes background services, support files, and logs, while preserving binaries, `~/.agentdock`, and `~/AgentDock`.

Use `--remove-binary` to remove the installed binary. Use `--purge-data` only when explicitly intending to remove binaries, all AgentDock state, browser profiles, and default working directories.

Finally, move `AgentDock.app` in Applications to the Trash.
