# Use Skills

A Skill teaches an agent how to handle a kind of task. It can describe the steps to follow, required tools or accounts, and actions that need confirmation.

## Official core Skills

AgentDock installers and Docker images include four core Skills:

- `agentdock-user-guide` — helps with AgentDock setup and day-to-day use.
- `skill-authoring` — helps create and review Skills.
- `skill-installation` — helps review and install Skills safely.
- `plugin-import` — helps bring remote Plugins from Git, GitHub, or other catalogs into AgentDock for review and installation.

Skills that need extra accounts, system permissions, or third-party software are installed separately when needed.

## How to use a Skill

Usually you only need to describe the goal:

```text
Check my current Codex allowance.
Use the desktop Skill to operate this macOS app.
Review and install this Skill: https://example.com/example-skill
```

AgentDock finds relevant Skills and lets the agent read the instructions only when they are needed. A project can also provide its own Skills under `.agents/skills/`; those project-specific instructions stay separate from globally installed Skills even when the names match.

## Install or update a Skill

Ask the agent to review an unfamiliar Skill before installing it:

```text
Review this Skill's source, files, portability, and permission requirements. Install it only if the review is clean.
```

A Skill installed through AgentDock can come from a local directory, a local ZIP file, or an HTTPS package URL. Installing reviewed new content with the same name replaces the current copy. Reinstalling identical content does nothing.

Normal AgentDock upgrades migrate older Skill layouts automatically. You do not need to move Skill directories by hand.

## Accounts, API keys, and private data

When an installed Skill needs a credential, ask the agent to save it in that Skill's isolated environment instead of putting it in the Skill package or a repository. For example:

```text
Set EXAMPLE_API_KEY for example-skill without echoing the value in the reply.
```

AgentDock can also give an installed Skill its own private data directory when the Skill needs to keep state. Normal updates and removal keep that data by default; an explicit purge removes it.

Skill packages must not contain tokens, cookies, browser sessions, `.env` files, caches, or device-private data.

## Skill, Plugin, or MCP?

| Use | When it fits |
| --- | --- |
| **Skill** | You want to teach the agent a reusable way to perform a task. |
| **Plugin** | You want to install a package that can include one or more Skills and MCP connections. |
| **Dynamic MCP** | You want AgentDock to connect directly to one external or local MCP service. |

See [Use Plugins](./plugins.md) and [Connect external MCP services](./dynamic-mcp.md) for the other two options.

## Safety

- Review third-party Skills before installation.
- Confirm sensitive actions such as sending, deleting, uploading, paying, or granting access.
- A Skill cannot exceed the permissions of the AgentDock process, container mounts, or operating-system user.
- Keep secrets out of Skill packages, public logs, and repositories.

To see what is available, ask the agent which Skills it can use and where each one comes from. Creating and maintaining Skills is covered in the [Contributor guide](../contributing/development.md#skill-development).
