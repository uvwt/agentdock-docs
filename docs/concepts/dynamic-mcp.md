# Use external MCP services

Dynamic MCP lets AgentDock use tools from other MCP services without restarting AgentDock. Use it when you need capabilities that are provided by another service or a local MCP program.

## Simplest usage

Tell the agent what you want to connect:

```text
Connect this MCP service: https://mcp.example.com/mcp
Use example as its name and verify that its tools are available.
```

AgentDock registers the connection, checks what authentication is required, and can verify it with a read-only tool call.

## HTTP MCP

Use HTTP when the service already provides a network address such as:

```text
https://mcp.example.com/mcp
```

### Browser sign-in with OAuth

If the remote MCP service requires OAuth, ask the agent to authorize it. AgentDock starts the authorization flow and returns a sign-in link for you to open in the browser. After you finish signing in, the MCP connection can refresh and use the authorized service.

You do not need to copy OAuth codes or access tokens into chat. You can also clear an existing authorization when you want to sign in again or disconnect the account.

### API key authentication

If the service gives you an API token or key instead of browser sign-in, store it in that MCP connection's isolated environment. AgentDock keeps the secret out of the connection record and does not show it back in configuration listings.

## Local MCP programs

AgentDock can also start command-line MCP services installed on the same machine. Provide the executable, any startup arguments, and the environment variables it needs.

A local MCP program runs with the operating-system permissions of AgentDock, so review unfamiliar software before using it.

## Credentials

Do not put tokens, cookies, passwords, or OAuth codes in chat history, a README, or MCP registry data.

- For OAuth, use AgentDock's authorization flow.
- For token-based authentication, use the MCP connection's isolated environment.
- Configuration listings show secret names and status, not secret values.

## Verify the connection

You can ask the agent:

```text
List the tools from the example MCP service, inspect one read-only tool, and make one call without side effects.
```

If verification fails, check whether the connection is enabled, the URL or command is correct, authentication is complete, and the upstream service is reachable.

## Manage existing MCP services

You can ask AgentDock to inspect, enable, disable, refresh, re-authorize, or remove a connection, and to manage its isolated environment when needed.

See [Tools](../reference/tools.md) for the complete operations and parameters.
