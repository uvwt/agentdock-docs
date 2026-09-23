# Contributor guide

This page is for contributors modifying AgentDock source code, public documentation, or first-party Skills.

Code and public documentation are maintained in separate repositories:

- [`uvwt/agentdock`](https://github.com/uvwt/agentdock)
- [`uvwt/agentdock-docs`](https://github.com/uvwt/agentdock-docs)

Update the matching documentation whenever user-visible behavior changes.

## Source checks

Run this in the AgentDock repository:

```bash
make check
```

It runs formatting, tests, vet, and builds. During local development, package-level tests may run first, but the complete check is still required before submission.

Changes involving concurrency, platform differences, installers, Docker, browsers, ACP, or desktop lifecycle also require relevant focused tests and real-environment verification.

## Documentation checks

Run this in the `agentdock-docs` repository:

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` runs TypeScript checks, locale tests, English/Simplified Chinese structural consistency checks, production builds for both locales, and the default production build. After changing navigation, layout, or wide tables, inspect desktop and mobile pages in a real browser.

## Public-contract discipline

Public documentation describes behavior that an ordinary user or third-party integrator can reproduce. It is not a maintainer notebook.

- Use current `main` source, public release assets, tool schemas, and supported UI/CLI entry points as the source of truth.
- Derive tool names and actions from the actual MCP contracts. Use the client's `tools/list` for availability rather than documenting internal helper functions as public tools.
- Derive runtime configuration from the current Core configuration parser and public server flags. Installer-only transaction variables, test switches, signing variables, and maintainer deployment overrides are not user configuration.
- Use generic placeholders such as `example.com`, `<token>`, and `<workspace>`. Never publish a maintainer username, device name, private hostname, local project path, personal proxy, private endpoint, or real credential.
- Document supported defaults and user-controlled overrides, not the topology of a maintainer machine. Platform examples should work for a normal installation of that platform.
- Keep compatibility code and migration behavior out of the primary path. Mention a legacy input only when current users may still encounter it, and label the current replacement clearly.
- Keep English and Simplified Chinese pages semantically synchronized in the same change.

When a source comment or historical document conflicts with executable behavior, verify the actual contract and tests before updating user documentation. Do not preserve stale wording merely for consistency with an older release.

## Change principles

- Inspect the existing directory structure, interfaces, error handling, and test style first.
- Keep the primary flow readable; do not create abstraction only for formal layering.
- Update tests when changing tool descriptions, schemas, paths, authentication, commands, browsers, ACP, or desktop capabilities.
- When changing an installer, verify help text, defaults, generated files, supported release assets, upgrades, uninstall behavior, and representative installation paths.
- Preserve user data unless the public action explicitly requests destructive cleanup; document purge behavior separately from ordinary update/remove behavior.
- Do not expose real tokens, private endpoints, personal directories, or maintainer credentials in tests, examples, screenshots, logs, or docs.

## Tool result conventions

Use MCP protocol-level `isError` for tool-call errors. Successful tool results do not use ambiguous generic fields such as `ok` or `tool_ok`:

- Commands use `command_ok`, `exit_code`, and `command_error`.
- Browser operations use `browser_ok` and `browser_error`.
- Other tools use explicit domain fields such as `changed`, `configured`, `written`, or similarly scoped results.

When adding or changing an output schema, verify that `structuredContent` does not leak generic state fields from internal HTTP, WSL child-process, installer, or runner protocols.

## Skill development

First-party Skills use a portable document core with optional AgentDock integration. The minimum layout is:

```text
example-skill/
└── SKILL.md
```

Add `references/`, `scripts/`, entry points, and tests only when needed. Requirements:

- `SKILL.md` has a valid `name`, a useful `description`, and non-empty instructions.
- Use relative paths inside the package; do not depend on a maintainer checkout path or private AgentDock state path.
- Scripts read configuration from the current process environment and keep mutable state outside the package.
- Do not package `.env` files, tokens, caches, login state, databases, downloaded results, symlinks, or device-private data.
- `metadata.version`, if present, is author metadata only. AgentDock does not use a Skill version field for install selection, activation, or rollback.
- Treat `content_digest` as current-content identity. Reinstalling identical managed content is a no-op; changed content replaces the current managed tree transactionally.
- If persistent mutable data is required, portable code should treat `SKILL_DATA_DIR` as an optional AgentDock adapter. Do not hard-code `~/.agentdock/data/...`.
- Use `skill-authoring` to review structure, portability, and safety. Runtime installation uses `skill_manage`; there is no `skill_package validate` compatibility action to document.
- When executing Skill-bound commands in integrations, use the exact host-issued `skill_ref` from discovery rather than reconstructing one from a bare name.

See [Use Skills](../concepts/skills.md) for the user workflow.

## Cross-repository changes

A user-visible change may require more than one repository:

- Tool behavior, installers, Core configuration, and bundled Skills: update `uvwt/agentdock` and matching docs.
- Shared AgentDock/NexusDock interfaces: update `uvwt/agentdock-protocol` first when the protocol contract changes, then update both implementations and docs.
- NexusDock-only deployment or fleet UI behavior: update `uvwt/nexusdock` and the relevant public documentation.
- Community or independently distributed Skills: update the Skill source/catalog rather than copying maintainer-specific installation state into AgentDock docs.

Keep each repository change independently reviewable and link related PRs when a public contract spans repositories.

## Commits and releases

- `main` is the stable branch.
- Commit messages use the repository's current convention; AgentDock commonly uses `type(scope): 中文说明`.
- Before committing, confirm the working tree contains only changes for the current task.
- Run the full repository checks before submission and check GitHub Actions after pushing.
- Visit the deployed documentation after publication when the change affects navigation, rendering, downloads, or copyable commands.
- Release signing, production deployment, and maintainer-machine operations belong in maintainer runbooks or automation, not ordinary user pages.
