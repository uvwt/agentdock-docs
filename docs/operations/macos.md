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

## Manage Cloudflare Tunnel

Running the installer with `--register-service` and no explicit Tunnel override asks one question: whether a Cloudflare-managed domain is available. A domain selects a fixed Named Tunnel; no domain selects a temporary Quick Tunnel. Advanced automation may still pass `--tunnel quick`, `--tunnel named`, or `--tunnel none` directly.

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
