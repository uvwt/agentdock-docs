# NexusDock REST API

NexusDock Cloud exposes a developer REST API for scripts, backend services, CI/CD jobs, and third-party automation that need to inspect devices, discover capabilities, or execute remote tools outside an MCP client.

:::tip[Interactive API reference]
The live interactive documentation is the source of truth for endpoints, parameters, request bodies, and response schemas:

**[Open NexusDock REST API documentation →](https://mcp.nexusdock.co/docs/api)**
:::

## Overview

When you connect an AI chat or coding client (such as ChatGPT, Claude, or Cursor), use the Streamable HTTP MCP endpoint (`https://mcp.nexusdock.co/mcp`). When you integrate from code, webhooks, or automated pipelines, use the NexusDock Cloud REST API to:

- list paired devices and inspect online status and capabilities;
- discover available tools and schemas on target devices;
- trigger remote tool executions and inspect results programmatically.

This documentation hub intentionally does not duplicate full OpenAPI endpoint schemas so that the live API reference remains accurate and up to date.

## Authentication

NexusDock Cloud REST API requests are authenticated over HTTPS using scoped tokens:

- **OAuth Device Flow:** Recommended for interactive CLIs, local utilities, and third-party integrations so users approve access in the browser without pasting account passwords.
- **Bearer Token:** Pass an issued token in the HTTP `Authorization` header:

```text
Authorization: Bearer <your-access-token>
```

:::warning[Protect API tokens]
Never commit Bearer Tokens to version control or paste them into logs, screenshots, issues, or Recall memory. Revoke or rotate compromised tokens immediately in NexusDock Cloud.
:::

## Machine-readable documentation

For SDK generation, automated verification, and AI coding assistants integrating with NexusDock Cloud, use the official machine-readable entry points:

| Resource | URL |
| --- | --- |
| Interactive REST API reference | [https://mcp.nexusdock.co/docs/api](https://mcp.nexusdock.co/docs/api) |
| OpenAPI specification (JSON) | [https://mcp.nexusdock.co/docs/openapi.json](https://mcp.nexusdock.co/docs/openapi.json) |
| Integrations guide (Markdown) | [https://mcp.nexusdock.co/docs/integrations.md](https://mcp.nexusdock.co/docs/integrations.md) |
| Official REST integration Skill | [`nexusdock-rest`](https://github.com/uvwt/agentdock-skills/tree/main/skills/nexusdock-rest) |

## Related documentation

- [What is NexusDock?](../concepts/nexusdock.md)
- [Connect from different clients](../guides/mcp-clients.md)
- [Built-in tools](./tools.md)
- [Configuration reference](./configuration.md)
