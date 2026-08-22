# Configure a fixed domain

Use a fixed domain when you want AgentDock to keep the same public MCP address across restarts. AgentDock uses a Cloudflare Named Tunnel, so you do not need to expose a router port or maintain a public HTTPS reverse proxy yourself.

A typical setup looks like this:

```text
MCP client → https://agent.example.com/mcp → Cloudflare Tunnel → AgentDock
```

## Before you start

Prepare these items first:

- AgentDock is already installed and working locally.
- Your domain is managed by Cloudflare.
- You can sign in to the [Cloudflare Zero Trust dashboard](https://one.dash.cloudflare.com/).
- Choose a dedicated hostname such as `agent.example.com`.

If Cloudflare Tunnel is new to you, see the [Cloudflare Tunnel documentation](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/).

## 1. Choose a hostname

Use a dedicated subdomain instead of your root domain. For example:

```text
agent.example.com
```

You will use the same hostname when creating the Cloudflare public hostname and when configuring AgentDock.

## 2. Create a Cloudflare Tunnel

In the [Cloudflare Zero Trust dashboard](https://one.dash.cloudflare.com/), create a Cloudflare Tunnel and choose Cloudflared as the connector.

Cloudflare will show a connector command containing a Tunnel Token. AgentDock needs the **Tunnel Token itself**, not the complete command. Keep this token private.

If you already have a Named Tunnel that you want AgentDock to use, you can reuse it instead of creating another one.

## 3. Add the public hostname

Add a public hostname to the Tunnel:

```text
Hostname     agent.example.com
Service      HTTP
```

Set the Service URL according to how AgentDock is installed:

| Installation | Cloudflare Service URL |
| --- | --- |
| macOS, Windows, or native Linux | `http://127.0.0.1:8765` |
| Docker Compose | `http://agentdock:8765` |

Leave the Path empty. Do not add `/mcp` here: Cloudflare should forward the whole AgentDock service, while `/mcp` is only added by the MCP client later.

Docker users can also see [Docker Named Tunnel configuration](../operations/docker.md#named-tunnel).

## 4. Configure AgentDock

The public address you give AgentDock is the HTTPS origin only:

```text
https://agent.example.com
```

Do not add `/mcp`, a port, a query string, or another path.

### macOS app

Open AgentDock, go to **Public access**, and select **Fixed domain**. Enter:

```text
Public address   https://agent.example.com
Tunnel Token     <the Tunnel Token from Cloudflare>
```

Apply the change. AgentDock will keep the local service private and use the Named Tunnel for public access.

See [macOS installation](../getting-started/macos.md) if you have not installed the background service yet.

### Linux or Windows installer

Run the AgentDock installer again and choose the option that says you already have a domain managed by Cloudflare. Enter the same HTTPS public origin and Tunnel Token when prompted.

See [Linux installation](../getting-started/linux.md) or [Windows installation](../getting-started/windows.md) for the platform-specific command.

### Docker Compose

Create the public hostname first, then configure the fixed origin and Tunnel Token in the Docker deployment and start the Named Tunnel profile.

Follow [Docker Named Tunnel configuration](../operations/docker.md#named-tunnel) for the exact Compose values and command.

## 5. Verify the fixed domain

First open or request the public health endpoint:

```text
https://agent.example.com/healthz
```

A healthy AgentDock endpoint returns a successful response containing `ok: true`.

Then configure your MCP client with:

```text
Transport      Streamable HTTP
URL            https://agent.example.com/mcp
Authentication Bearer Token or OAuth shown by AgentDock
```

The Tunnel Token is **not** an MCP login credential. It is only used to connect Cloudflare to your AgentDock host. Keep using the AgentDock Bearer Token or OAuth credentials for the MCP client.

## Address reference

These three addresses have different purposes:

| Where | Example | What it means |
| --- | --- | --- |
| Cloudflare Service URL | `http://127.0.0.1:8765` | Where Cloudflare forwards traffic on a native installation |
| AgentDock public address | `https://agent.example.com` | Fixed HTTPS origin used by AgentDock and OAuth |
| MCP client URL | `https://agent.example.com/mcp` | Address entered in ChatGPT or another MCP client |

For Docker, only the first value changes to `http://agentdock:8765`.

## Common problems

### The domain does not open

Check that the Tunnel is connected in Cloudflare and that the public hostname points to the correct Service URL. A native installation normally uses `http://127.0.0.1:8765`; Docker Compose uses `http://agentdock:8765`.

### Cloudflare returns 502

The Tunnel is reachable, but it cannot reach AgentDock. Confirm that AgentDock is running locally and that the Service URL matches your installation method.

### AgentDock rejects the public address

Enter only the HTTPS origin, for example `https://agent.example.com`. Do not enter `https://agent.example.com/mcp`.

### The MCP client asks for authentication

That is expected for public access. Use the Bearer Token or OAuth credentials shown by AgentDock. Do not paste the Cloudflare Tunnel Token into the MCP client.

## Security notes

Treat the Tunnel Token, Bearer Token, and OAuth credentials as secrets. Do not put them in screenshots, issues, chat logs, or Git repositories.

A fixed domain does not replace AgentDock authentication. Keep Bearer Token or OAuth enabled for public access and review the [security model](../operations/security.md) before sharing the endpoint with other people.
