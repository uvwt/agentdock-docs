# Connect ChatGPT to AgentDock

ChatGPT can drive AgentDock through a custom MCP plugin. After you connect, the web ChatGPT client can read files, run commands, use Skills, call external MCP servers, control the browser, and operate coding tools such as Codex, Claude, or Grok on the computer where AgentDock is running.

The fastest path for most people is the desktop installer: enable a public address, copy the MCP URL and OAuth password from the control panel, then create a plugin in ChatGPT. You do not need to create a Client ID or Client Secret manually.

AgentDock supports OAuth 2.0 Authorization Code, PKCE S256, dynamic client registration, and Refresh Tokens.

## Quick start on Windows

This path uses the graphical Windows installer. The macOS app follows the same idea: enable a public address, copy the public MCP URL and OAuth password, then create the ChatGPT plugin.

### 1. Install AgentDock

1. Open the [latest AgentDock release](https://github.com/uvwt/agentdock/releases/latest).
2. Download the Windows installer for your PC:
   - Most Intel or AMD PCs: `AgentDockSetup-amd64.exe`
   - Windows on ARM: `AgentDockSetup-arm64.exe`
3. Run the installer and follow the on-screen steps.
4. When the installer asks for a connection option:
   - Choose **Temporary public address** for the first connection if you do not have a domain ready.
   - Prefer **Your own Cloudflare domain** for a stable long-term address.

![Installer connection options: temporary public address or fixed Cloudflare domain](/img/guides/chatgpt/01-install-connection-option.png)

Full installer details are in [Windows installation](../getting-started/windows.md). macOS users can follow [macOS installation](../getting-started/macos.md).

:::tip
A temporary `trycloudflare.com` address is enough for learning and first-time setup. The address may change after Windows or the tunnel restarts. When it changes, copy the new public URL from the control panel and update the ChatGPT plugin.
:::

### 2. Copy the public URL and OAuth password

Open the AgentDock control panel and wait until the status shows that AgentDock is running normally.

On the **Overview** page, copy:

- The **public MCP URL**, which ends with `/mcp`
- The **OAuth password**

![Control panel Overview with public MCP URL and OAuth password](/img/guides/chatgpt/02-copy-public-url-oauth.png)

Credentials are masked by default. Select **Show** only when you need to copy them. Do not put the password into screenshots, issues, or public chats.

:::warning
Do not enter a loopback URL such as `http://127.0.0.1:8765/mcp` in ChatGPT. ChatGPT cannot reach a local address on your computer.
:::

### 3. Create the plugin in ChatGPT

1. Open ChatGPT in the browser.
2. Go to **Settings > Plugins > Advanced settings** and enable **Developer mode**.

![ChatGPT Settings > Plugins with Developer mode enabled](/img/guides/chatgpt/03-chatgpt-developer-mode.png)

3. Return to the plugins page on the ChatGPT home screen and select **+** / **Create plugin**.

![ChatGPT plugins page with the add button highlighted](/img/guides/chatgpt/04-plugins-add-button.png)

4. Enter a name such as `AgentDock`.
5. Enter the public MCP URL you copied, for example:

   ```text
   https://your-public-host.example/mcp
   ```

![Create plugin dialog with name and public MCP URL filled in](/img/guides/chatgpt/05-fill-name-and-url.png)

6. Create the plugin and start the connection.
7. When the browser opens the AgentDock authorization page, enter the OAuth password and complete the connection.

![AgentDock authorization page for entering the OAuth password](/img/guides/chatgpt/06-create-enter-password.png)

8. Return to ChatGPT and confirm that the AgentDock plugin is available.

ChatGPT discovers AgentDock's OAuth metadata, registers a client, and finishes browser authorization automatically. You do not need to fill in a Client ID, Client Secret, authorization URL, or token URL.

### 4. Verify the connection

Start a new ChatGPT conversation and try:

```text
Use AgentDock to inspect the current device.
```

A read-only check is also enough:

```text
Call AgentDock's server_info and tell me the service version, operating system, and current authentication mode.
```

Do not treat the OAuth redirect alone as success. Confirm that ChatGPT can list AgentDock tools and complete a real tool call.

After the connection works, you can ask ChatGPT to install Skills, connect external MCP services, automate the browser, or drive local coding tools through AgentDock.

## Prerequisites for remote or manual deployments

If you deploy AgentDock yourself on a server, Docker host, or reverse proxy, confirm that:

- AgentDock is available at a public URL that ChatGPT can reach.
- The public endpoint uses a valid HTTPS certificate.
- The MCP URL ends with `/mcp`, for example `https://agentdock.example.com/mcp`.
- The reverse proxy forwards `/mcp`, `/register`, `/oauth/*`, and `/.well-known/*` without rewriting them incorrectly.

Desktop installers that enable a temporary or fixed public address already satisfy these requirements for first use.

## Manual OAuth configuration

Use this section when you run AgentDock outside the desktop installer, or when you need to set OAuth environment variables yourself.

Add these values to the AgentDock environment file, Docker Compose `environment`, or service environment:

```bash
AGENTDOCK_OAUTH_ENABLED=true
AGENTDOCK_SERVER_URL=https://agentdock.example.com
AGENTDOCK_OAUTH_PASSWORD=<password-used-for-connection-authorization>
AGENTDOCK_OAUTH_TOKEN_SECRET=<random-signing-key-at-least-32-bytes>
```

Generate random values with OpenSSL:

```bash
openssl rand -base64 24   # Suitable for the authorization password
openssl rand -hex 32      # Suitable for the token signing key
```

Requirements:

- `AGENTDOCK_SERVER_URL` contains only the origin, without `/mcp`, another path, query parameters, or a fragment.
- A public URL must use `https://`.
- `AGENTDOCK_OAUTH_PASSWORD` must contain at least 12 characters.
- `AGENTDOCK_OAUTH_TOKEN_SECRET` must contain at least 32 bytes and remain stable across restarts.

You may omit `AGENTDOCK_AUTH_TOKEN` when OAuth is the only authentication method. Both methods can also be enabled together for different MCP clients.

Restart AgentDock after changing the configuration. For systemd:

```bash
sudo systemctl restart agentdock
sudo systemctl status agentdock --no-pager
```

For Docker Compose:

```bash
docker compose up -d
```

## Verify the OAuth endpoints

First verify the health endpoint and OAuth metadata:

```bash
curl -fsS https://agentdock.example.com/healthz
curl -fsS https://agentdock.example.com/.well-known/oauth-authorization-server
curl -fsS https://agentdock.example.com/.well-known/oauth-protected-resource/mcp
```

The second request should return JSON containing these endpoints:

```text
authorization_endpoint  https://agentdock.example.com/oauth/authorize
token_endpoint          https://agentdock.example.com/oauth/token
registration_endpoint   https://agentdock.example.com/register
```

Do not open `/oauth/authorize` manually. It requires the client, callback URL, and PKCE parameters generated by ChatGPT, so a direct request normally returns a parameter error.

## Troubleshooting

### The authorization page does not open

Check, in order:

- The MCP URL ends exactly with `/mcp`.
- Public access is enabled and the public URL shown in the control panel is the one you entered in ChatGPT.
- `AGENTDOCK_OAUTH_ENABLED` is `true` for manual deployments.
- `AGENTDOCK_SERVER_URL` exactly matches the HTTPS origin used in the browser.
- `/.well-known/oauth-authorization-server` and `/.well-known/oauth-protected-resource/mcp` are reachable from the public internet.
- The reverse proxy allows `/register`, `/oauth/authorize`, and `/oauth/token`.

### The page keeps loading after authorization

A successful `POST /oauth/authorize` returns a `302` redirect to ChatGPT's callback. The `302` is expected. If the browser does not continue, inspect the reverse proxy, browser console, and the response `Location` header for rewriting or blocking.

### The password is rejected

Enter the OAuth password shown in the control panel, or `AGENTDOCK_OAUTH_PASSWORD` for a manual deployment. Do not enter the Bearer Token or `AGENTDOCK_OAUTH_TOKEN_SECRET`. Repeated failures trigger a short rate limit.

### Connection still fails after configuration changes

Restart AgentDock and verify the public endpoints again. Then remove the old plugin from ChatGPT and create it again so the client does not keep stale registration or authorization state.

If you use a temporary public address and it changed, update the MCP URL in the ChatGPT plugin before reconnecting.

## Security recommendations

- Prefer a fixed domain and a valid HTTPS certificate for long-term use.
- Keep the authorization password and token signing key in a permission-restricted environment file or secret manager.
- Never publish real passwords or signing keys in a README, Compose file, chat, or screenshot.
- Do not log Authorization headers, OAuth codes, or request bodies at the reverse proxy.
- AgentDock operates real resources with its process or container permissions. Grant only the directories and commands required for the task.

See [Configuration](../reference/configuration.md#oauth-configuration) for all environment variables and [Manual Linux deployment](../getting-started/vps.md) for a public deployment without the desktop installer.
