# Advanced macOS configuration

Regular users only need the [macOS installation](../getting-started/macos.md) for their first setup. This page covers fixed versions, custom installation directories, background operation, and desktop permissions.

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
zsh /tmp/install-agentdock-macos.sh --version vX.Y.Z
```

## Change the installation directory

```bash
zsh /tmp/install-agentdock-macos.sh --install-dir "$HOME/bin"
```

After changing the directory, add it to `PATH` or always use the full binary path.

## Run in the background

For long-running background operation, use a LaunchAgent for the current logged-in user. When the Desktop Skill is involved, AgentDock must run in the logged-in user session and cannot use a system-level LaunchDaemon.

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
