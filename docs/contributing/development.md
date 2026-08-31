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

Changes involving concurrency, platform differences, installers, Docker, or browsers also require the relevant focused tests and real-environment verification.

## Documentation checks

Run this in the `agentdock-docs` repository:

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` runs the TypeScript check, verifies English and Simplified Chinese structure, builds both Docusaurus locales for production, and checks internal links. After changing navigation, layout, or wide tables, inspect desktop and mobile pages in a real browser.

## Change principles

- Inspect the existing directory structure, interfaces, error handling, and test style first.
- Keep the primary flow readable; do not create abstraction only for formal layering.
- Update tests when changing tool descriptions, schemas, paths, authentication, commands, browsers, or desktop capabilities.
- When changing an installer, verify help text, defaults, generated files, and representative installation paths.
- Do not publish real tokens, private endpoints, personal directories, or maintainer credentials.
- Keep migration history, temporary compatibility behavior, and maintainer-machine deployment details out of user documentation.

## Tool result conventions

Use MCP protocol-level `isError` for tool-call errors. Successful tool results do not use ambiguous generic fields such as `ok` or `tool_ok`:

- Commands use `command_ok`, `exit_code`, and `command_error`.
- Browser operations use `browser_ok` and `browser_error`.
- Other tools use explicit domain fields such as `valid`, `changed`, and `configured`.

When adding or changing an output schema, verify that `structuredContent` does not leak generic state fields from internal HTTP, WSL child-process, or runner protocols.

## Skill development

First-party Skills use a “portable core plus optional AgentDock integration” model. The minimum layout is:

```text
example-skill/
└── SKILL.md
```

Add `references/`, `scripts/`, entry points, and tests only when needed. Requirements:

- Use relative paths inside the package.
- Scripts read only from the current process environment.
- Do not hard-code user-specific absolute paths, installed versions, or private AgentDock state files.
- Do not package environment files, caches, login state, or device-private data.
- Increment the semantic version after changing instructions, references, or scripts.
- Use `skill-authoring` to review content and portability, then use `skill_package validate` to validate package structure.

See [Use Skills](../concepts/skills.md) for usage details.

## Commits and releases

- `main` is the stable branch.
- Commit messages use `type(scope): 中文说明`.
- Before committing, confirm the working tree contains only changes for the current task.
- Check GitHub Actions after pushing.
- Visit the deployed page after documentation is published.
- Follow the current source-repository maintenance rules for releases, signing, production deployment, and maintainer-machine operations; do not duplicate those procedures in user documentation.
