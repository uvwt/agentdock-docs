# Use Skills

A Skill is a document-based working method for an agent. It explains when to use a capability, what steps to follow, what dependencies are required, and which operations need confirmation.

## Official core Skills

AgentDock native installers and Docker images ship these core Skills with the runtime:

- `agentdock-user-guide`
- `skill-authoring`
- `skill-installation`

They are managed like other AgentDock-managed Skills: each name has one current content tree. AgentDock does not keep a selectable Skill-version history or an active-version pointer.

Skills that require extra accounts, system permissions, or third-party software are installed separately when needed.

## How to use Skills

Tell the agent your goal directly, for example:

```text
Check current Codex allowance.
Use the desktop Skill to operate this macOS app.
Install and use this Skill: https://example.com/example-skill.zip
```

The agent typically:

1. Uses `agentdock_context` or `workspace_context` to discover relevant Skill candidates and their source.
2. Selects one exact candidate and reads the `file` returned by the host with `read_file`.
3. Checks required commands, accounts, environment variables, and safety boundaries.
4. Uses real tools to perform the task; commands bound to a Skill use that candidate's returned `skill_ref` with `exec_command`.
5. Confirms and verifies operations with side effects.

Do not reconstruct a `skill_ref` from a bare Skill name. The host-issued reference keeps managed, shared, and workspace candidates with the same name distinct.

## Workspace-local Skills

A project can expose local Skills at `<workspace>/.agents/skills/<skill-name>/SKILL.md`. `workspace_context` indexes them and returns provenance such as `name`, `description`, `source_type`, `source_id`, `skill_ref`, and `file`; it does not inject the Skill body into context.

A workspace Skill, an AgentDock-managed Skill, and a shared Skill under `~/.agents/skills` remain separate candidates even when their names match. For project work, a workspace candidate is often the relevant choice, but the agent must use the selected candidate's own `file` and `skill_ref` instead of silently applying a global name-based priority.

## Installing or updating a managed Skill

Confirm the source is trustworthy before installing. Ask the agent to review the package first:

```text
Please review this Skill's source, files, portability, and permission requirements, then install it if the review is clean.
```

`skill_manage install` accepts a local Skill directory, a local ZIP archive, or an HTTPS package URL. An optional source SHA-256 can be supplied for integrity checking.

A managed Skill has one current content tree. Installing different content with the same Skill name atomically replaces that current content after validation; reinstalling identical content is a no-op and returns the same `content_digest`. AgentDock does not expose `activate`, `rollback`, or version-selection actions for Skills. To restore known content, review and reinstall the desired source snapshot.

When upgrading from an older AgentDock release that used the historical Skill layout, supported installers and updaters migrate managed Skill content and persistent Skill data automatically. The old layout is kept intact until the outer install/update transaction commits, so users do not need to move Skill directories or run migration commands manually.

Skill packages must not contain tokens, cookies, browser sessions, `.env` files, caches, or device-private data.

## Configure accounts or API keys

When a managed Skill requires credentials, ask the agent to save them in that Skill's isolated environment, for example:

```text
Set EXAMPLE_API_KEY for example-skill without echoing the actual value in the reply.
```

`skill_manage env_list` reports variable names and configuration state without returning secret values. The isolated environment is injected only when a command runs with that managed candidate's `skill_ref`; it is not written into the Skill package or the permanent system environment.

## Persistent Skill data

When a managed Skill command needs mutable persistent state, AgentDock creates a private data directory and exposes it to that process as the reserved `SKILL_DATA_DIR` environment variable.

The Skill should treat `SKILL_DATA_DIR` as an optional AgentDock integration, not as a portable requirement. Shared and workspace candidates do not inherit a managed Skill's environment or data directory. Normal managed-Skill updates and `skill_manage remove` preserve isolated environment and persistent data; `skill_manage remove` with `purge=true` removes those preserved resources as well.

Supported AgentDock installers and self-updaters migrate older managed-Skill layouts automatically during a normal upgrade, so no manual directory migration is required.

## Usage precautions

- Confirm before deleting, sending, uploading, paying, or authorizing.
- Skill instructions cannot exceed the permissions of the AgentDock process, container volumes, or the operating system.
- Third-party Skills may call external services; verify source and capabilities before installation.
- Do not paste secrets into public logs or package them with the Skill.
- Treat `content_digest` as content identity and audit evidence, not as a product version number.

## Viewing installed Skills

Ask directly:

```text
What Skills are available here, and where does each candidate come from?
```

The agent can use `agentdock_context` for managed/shared candidates and `workspace_context` for the active project, then read full Skill documentation only when needed.

Creating and maintaining Skills is a developer workflow; see [Contributor guide](../contributing/development.md#skill-development).
