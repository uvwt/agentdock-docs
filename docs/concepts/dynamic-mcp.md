# Connect external MCP servers

Dynamic MCP lets AgentDock connect to other MCP servers without restarting or rebuilding. Examples include design platforms, task systems, search services, and local analysis tools.

Regular users only need the service URL or launch command and any credentials required by that service. The agent handles registration, inspection, and verification.

## Simplest usage

Tell the agent what to connect:

```text
Connect this MCP server: https://mcp.example.com/mcp
Use example as its name, store the authentication token in its isolated environment, and verify that its tools can be listed.
```

The agent will usually:

1. Confirm the source and transport.
2. Register the MCP server.
3. Save the token in that MCP server's isolated environment.
4. Refresh the connection.
5. Find one tool and complete a read-only verification call.

## Two transport options

### HTTP MCP

Use HTTP for services that already expose a network endpoint:

```text
https://mcp.example.com/mcp
```

Authentication data is mapped from an isolated environment variable to an HTTP header. Registry data stores only the variable name, never the actual token.

### Local stdio MCP

Use stdio for command-line MCP servers installed on the same machine. You need to provide:

- The absolute path to the executable.
- Launch arguments.
- An optional working directory.
- Any required environment variables.

A local MCP server inherits the operating-system permissions of the AgentDock process, so review its source before installation.

## Credential storage

Do not place tokens, cookies, passwords, or OAuth codes directly in chat history, a README, or MCP registry data.

Ask the agent to store secrets with `mcp_manage env_set`. `env_list` shows only variable names and whether they are configured; it never returns the actual values.

Refresh the MCP connection after updating credentials.

## Verify the connection

You can ask the agent:

```text
List the tools provided by the example MCP server, inspect the parameters of one read-only tool, and complete one call without side effects.
```

If verification fails, check whether the server is enabled, whether the URL or command is correct, whether all required variables are configured, and whether the upstream service is reachable.

## Manage existing MCP servers

Common operations include:

- View and inspect configuration.
- Enable, disable, or refresh a connection.
- Update or remove isolated environment variables.
- Remove a server that is no longer used.

See [Tools](../reference/tools.md#dynamic-mcp) for exact actions and parameters.
