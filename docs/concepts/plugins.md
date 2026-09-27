# Use Plugins

A Plugin packages related AgentDock extensions so they can be reviewed and managed together. A Plugin can include Skills, MCP server configurations, or both. Those components still use AgentDock's existing Skill and dynamic MCP systems; a Plugin does not create a separate execution layer.

Here, **Plugin** means an AgentDock extension package. It is different from the plugin, connector, or MCP entry that an AI client such as ChatGPT uses to connect to AgentDock.

## When to use a Plugin

Use a Plugin when several related extensions should be installed and updated together. If you only need task instructions, use a [Skill](./skills.md). If you only need one MCP connection, use [Dynamic MCP](./dynamic-mcp.md).

AgentDock understands its portable Plugin format and supported OpenAI and Claude Plugin packages. Remote sources such as Git or GitHub are fetched through the bundled `plugin-import` Skill before AgentDock reviews the local package.

## Install a Plugin

Describe the goal and ask for a review first:

```text
Review and install this Plugin. Show me which Skills and MCP connections it adds before installing it.
```

AgentDock validates the package before installation. Installation or update is tied to the exact reviewed content, so changing the package requires another review.

Installed Plugins can be inspected, updated, enabled, disabled, or removed. Disabling a Plugin keeps it installed but stops its packaged components from being active. Removal can keep the Plugin data and MCP credentials, or explicitly purge them.

## Safety

- Review unfamiliar Plugins before installing or updating them.
- Do not put tokens, cookies, passwords, or other secrets inside a Plugin package.
- A packaged MCP server has the same trust considerations as a directly configured MCP server.
- A Plugin cannot exceed the operating-system permissions, container mounts, or other boundaries that apply to AgentDock.

For complete management operations and parameters, see [Tools](../reference/tools.md).
