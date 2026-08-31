# Use Skills

A Skill is a set of instructions for the agent explaining when to use it, what steps to follow, what dependencies are required, and which operations require user confirmation.


## Official core Skills

AgentDock native installers and Docker images automatically install and activate these official core Skills:

- `skill-authoring`
- `skill-installation`
- `skill-vetter-runtime`

They use the same version selection and rollback mechanism as other installed Skills.

`desktop` and Skills requiring accounts, system permissions, or third-party configuration are not installed automatically.

## How to use Skills

Tell the agent your goal directly, for example:

```text
Check current Codex allowance.
Use the desktop Skill to operate this macOS app.
Install and use this Skill: https://example.com/example-skill.zip
```

The agent typically:

1. Checks whether a matching Skill is already installed.
2. Reads the Skill instructions and safety boundaries.
3. Checks required commands, accounts, or environment variables.
4. Uses actual tools to perform the task.
5. Confirms and verifies operations with side effects.

## Installing a Skill

Confirm the source is trustworthy before installing. Ask the agent to vet the package before installing and activating:

```text
Please vet this Skill's source, files, and permission requirements, and install it once confirmed safe.
```

Remote sources must point to a ZIP archive; local sources can be a Skill directory or ZIP file. A Skill can have multiple installed versions, but only one is active at any time. When installing a new version, you can leave it inactive. Use `skill_package activate` to switch active versions, or rollback to a previous version if switching fails. Skill packages must not contain tokens, cookies, browser sessions, or personal environment files.

## Configure accounts or API keys

When a Skill requires credentials, ask the agent to store them in that Skill's isolated environment, for example:

```text
Set EXAMPLE_API_KEY for example-skill without echoing the actual value in the reply.
```

Isolated environments are injected only when running that Skill; they are not written into the Skill package or the permanent system environment.

## Usage precautions

- Confirm before deleting, sending, uploading, paying, or authorizing.
- Skill instructions cannot exceed the permissions of the running user, Docker volumes, or the OS.
- Third-party Skills may call external services; verify source and capabilities before installation.
- On failure, check missing dependencies or configuration first; do not paste secrets into public logs.

## Viewing installed Skills

Ask directly:

```text
What Skills are installed? What does each do?
```

The agent checks installed Skill names and descriptions, then reads full documentation as needed.

Creating and maintaining Skills is a developer workflow; see [Developer Guide](../contributing/development.md#skill-development).
