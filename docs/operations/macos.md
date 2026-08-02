# Advanced macOS configuration

Regular users should install and manage AgentDock through the [macOS graphical app](../getting-started/macos.md). This page is for command-line installation, fixed versions, custom directories, managed files, service inspection, and removal.

## Use the graphical app first

The main window already provides status, connection addresses, credentials, start, stop, restart, core updates, and log access. **Advanced Settings** manages the port, log level, Nexus connection, browser tools, and two independent login-startup switches.

Do not edit `agentdock.env` or LaunchAgent files for settings that the app already exposes. The app validates changes, writes the configuration atomically with private permissions, restarts AgentDock, and restores the previous configuration when the new one does not pass its health check.

## Command-line installation

The command-line installer remains available for automation and custom layouts:

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/install.sh \
  -o /tmp/agentdock-install.sh
sh /tmp/agentdock-install.sh --register-service
```

## Add AgentDock to PATH

The installer places the binary in `~/.local/bin` by default. To run `agentdock` directly:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

Then run:

```bash
agentdock
```

## Install a specific version

```bash
sh /tmp/agentdock-install.sh --register-service --version vX.Y.Z
```

## Change the installation directory

```bash
sh /tmp/agentdock-install.sh --register-service --install-dir "$HOME/bin"
```

After changing the directory, add it to `PATH` or always use the full binary path.

## Run in the background

The graphical app installs a current-user LaunchAgent automatically. In **Advanced Settings**, **Start AgentDock service after login** controls the core service, while **Show AgentDock in the menu bar after login** controls only the menu bar app. Disabling one does not silently change the other.

For a manual setup, use a LaunchAgent for the current logged-in user. When the Desktop Skill is involved, AgentDock must run in the logged-in user session and cannot use a system-level LaunchDaemon.

Keep these values stable:

```text
Program path     $HOME/.local/bin/agentdock
Working directory $HOME/AgentDock
State directory   $HOME/.agentdock
Listen address    127.0.0.1:8765
```

Do not place tokens, OAuth secrets, or third-party credentials directly in a public startup configuration. Reload the LaunchAgent after modifying it, then run a health check:

```bash
curl -fsS http://127.0.0.1:8765/healthz
```

## Manage Cloudflare Tunnel

Regular users should switch between local-only, temporary public access, and a fixed domain in the graphical app. A fixed domain can reuse the existing Tunnel Token, so changing unrelated settings does not require pasting it again.

The command-line installer with `--register-service` and no explicit Tunnel override asks whether a Cloudflare-managed domain is available. Internally, a domain selects a Named Tunnel and no domain selects a temporary Quick Tunnel. Automation may pass `--tunnel quick`, `--tunnel named`, or `--tunnel none` directly.

For either public mode, the installer automatically creates or reuses a Bearer Token, OAuth login password, and OAuth signing secret. A temporary installation first starts AgentDock with Bearer authentication, obtains the generated `trycloudflare.com` URL, writes it to `AGENTDOCK_SERVER_URL`, enables OAuth, and restarts AgentDock. The completion panel displays the public URL, MCP URL, Bearer Token, and OAuth login password; the signing secret remains private.

The installer registers AgentDock and `cloudflared` as separate user LaunchAgents. Only `cloudflared` reads the Named Tunnel Token. Managed files:

```text
~/Library/Application Support/AgentDock/agentdock.env
~/Library/Application Support/AgentDock/cloudflared.env
~/Library/Application Support/AgentDock/start-cloudflared.sh
~/Library/LaunchAgents/com.uvwt.agentdock.cloudflared.plist
~/Library/Logs/AgentDock/cloudflared.out.log
~/Library/Logs/AgentDock/cloudflared.err.log
```

`agentdock.env` and `cloudflared.env` use mode `0600`. The AgentDock LaunchAgent does not load the Tunnel Token, and the token is not placed in `ProgramArguments`.

Inspect the service and logs:

```bash
launchctl print "gui/$(id -u)/com.uvwt.agentdock.cloudflared"
tail -f "$HOME/Library/Logs/AgentDock/cloudflared.err.log"
```

When a temporary URL changes, rerun the same installer command. It preserves the Bearer Token, OAuth password, and signing secret, writes the new URL, and restarts AgentDock. Update the MCP URL in the client and authorize OAuth again. A fixed installation reuses the existing public origin and Tunnel Token on later runs.

## Browser runtime managed by the app

When browser tools are enabled from Advanced Settings, the app installs the runner under:

```text
~/.agentdock/browser-runner
~/.agentdock/browser-runtime
```

It writes `AGENTDOCK_BROWSER_ENABLED`, `AGENTDOCK_BROWSER_RUNNER_DIR`, and `AGENTDOCK_BROWSER_NODE_PATH` to the private service configuration. Disabling browser tools does not remove these directories; this avoids downloading the runtime again on the next enable.

Do not move the managed Node.js executable or runner directory manually. Use the browser switch in the app to repair or reapply the configuration.

## Directories and permissions

```text
~/.agentdock  AgentDock internal state
~/AgentDock   Default working directory
```

A native process can access whatever the current macOS user can access. Do not grant the AgentDock runtime user unnecessary directory permissions.

## Desktop Skill permissions

Before using screen, keyboard, and mouse automation, open **System Settings > Privacy & Security** and grant these permissions to the terminal or application that actually hosts AgentDock:

- Accessibility
- Screen & System Audio Recording

Grant permissions only to the process that runs AgentDock. macOS may request authorization again after the host terminal, application path, or code signature changes.

See [macOS desktop automation](../guides/desktop-automation.md) for the complete procedure.

## Updates and backups

Rerun the installer to upgrade. Previous binaries are backed up under:

```text
~/.agentdock/backups/bin
```

Runtime data and the default working directory are not deleted.

## Remove AgentDock

Before removing the app, open Advanced Settings, disable **Show AgentDock in the menu bar after login**, apply the change, and quit AgentDock.

Download and run the official uninstaller:

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/uninstall-macos.sh \
  -o /tmp/uninstall-agentdock.sh
zsh /tmp/uninstall-agentdock.sh
```

The default command removes the background services, support files, and logs while preserving the binary, `~/.agentdock`, and `~/AgentDock`.

Use `--remove-binary` to remove the installed binaries too. Use `--purge-data` only when you intentionally want to delete the binary, all AgentDock state, installed browser support, and the default working directory.

Finally, move `AgentDock.app` from Applications to the Trash.
