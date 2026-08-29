# Use Skills

A Skill is a set of instructions for an agent. It explains when to use a workflow, which steps and dependencies it requires, and which operations need careful confirmation.

A Skill is not a standalone plugin process. File changes, commands, browser actions, and external requests still run through real AgentDock tools.

## Official bundled Skills

Native AgentDock installers and Docker images automatically install and activate these official core Skills:

- `skill-authoring`
- `skill-installation`
- `skill-vetter-runtime`

They use the same Skill Store, version selection, and rollback mechanism as user-installed Skills. AgentDock records release-managed Skills in `bundled-skills.json`, and `agentdock_context` exposes their `bundled` status in the installed Skill index.

`desktop` and Skills that require accounts, operating-system permissions, or third-party service configuration are not installed automatically.

## How regular users work with Skills

Describe the goal directly, for example:

```text
Check my current Codex quota.
Use the desktop Skill to operate this macOS application.
Install and use this Skill: https://example.com/example-skill.zip
```

The agent will usually:

1. Check whether a matching Skill is already installed.
2. Read its instructions and safety boundaries.
3. Check required commands, accounts, and environment variables.
4. Execute the task through real tools.
5. Confirm and verify operations with side effects.

Regular users do not need to open Skill installation directories or construct version paths manually.

## Install a Skill

Confirm that the source is trustworthy before installation. Ask the agent to validate the package first, then install and activate it:

```text
Review this Skill's source, files, and permission requirements. Install it only after the review passes.
```

A remote source must point to a ZIP archive. A local source may be a Skill directory or ZIP file. Multiple versions of a Skill can remain installed, but only one version is active at a time. A new version can be installed without activating it; use `skill_package activate` to switch to an installed version. If activation fails, roll back to the most recent version that still exists. Skill packages must not include tokens, cookies, browser login state, or personal environment files.

## Configure an account or API key

When a Skill needs credentials, ask the agent to store them in that Skill's isolated environment:

```text
Configure EXAMPLE_API_KEY for example-skill, but do not reveal the value in the response.
```

The isolated environment is injected only while that Skill runs. It is not written into the Skill package and does not permanently modify the system environment.

## Safety considerations

- Deleting, sending, uploading, paying, and authorizing still require explicit confirmation.
- Skill instructions cannot bypass the runtime user, Docker volume, or operating-system permissions.
- A third-party Skill may call an external service; inspect its source and capability scope before installation.
- When a Skill fails, first inspect missing dependencies or configuration. Do not paste secrets into public logs.

## List installed Skills

Ask:

```text
Which Skills are currently installed, and what does each one do?
```

The agent first reads the installed Skill names and summaries, then opens the relevant instructions when needed.

Creating or maintaining a Skill is contributor work. See [Contributor guide](../contributing/development.md#skill-development).
