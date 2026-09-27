# Contributor guide

This page is the development entry point for AgentDock, NexusDock, and related repositories.

## Main repositories

- [`uvwt/agentdock`](https://github.com/uvwt/agentdock): AgentDock Core, desktop apps, tools, and built-in capabilities.
- [`uvwt/nexusdock`](https://github.com/uvwt/nexusdock): multi-device console, unified MCP, Recall, and Workflow.
- [`uvwt/agentdock-protocol`](https://github.com/uvwt/agentdock-protocol): shared protocol between AgentDock and NexusDock.
- [`uvwt/agentdock-docs`](https://github.com/uvwt/agentdock-docs): public documentation.

## Local checks

### AgentDock

```bash
make check
```

For desktop apps, installers, browser behavior, or platform-specific changes, also run the relevant tests and validate on a real environment.

### NexusDock

For first-time development:

```bash
make web-deps
make build
```

For normal checks:

```bash
make check
```

For full validation:

```bash
make ci
```

### Documentation

```bash
pnpm install --frozen-lockfile
pnpm check
```

After changing navigation or layout, also inspect desktop and mobile pages in a real browser.

## Development notes

- Inspect the existing structure, interfaces, error handling, and tests before changing behavior.
- When user-visible behavior changes, update the tests and public documentation together.
- When shared AgentDock/NexusDock interfaces change, check `agentdock-protocol` and both implementations.
- Do not place real tokens, private endpoints, personal paths, or other sensitive information in examples, tests, logs, or docs.
- Validate platform, installation, networking, and UI changes in the relevant real environment.

## Skill development

Skills should remain portable and must not depend on maintainer-specific paths, credentials, or private state. Minimal structure:

```text
example-skill/
└── SKILL.md
```

Add scripts, references, and tests only when needed. Runtime installation uses `skill_manage`; see [Use Skills](../concepts/skills.md) for the user workflow.
