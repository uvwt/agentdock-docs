# AgentDock Docs

English | [简体中文](./README.zh-CN.md)

Official public documentation for AgentDock, built with Docusaurus, TypeScript, and pnpm.

- Documentation: <https://uvwt.github.io/agentdock-docs/>
- Simplified Chinese documentation: <https://uvwt.github.io/agentdock-docs/zh-CN/>
- AgentDock source: <https://github.com/uvwt/agentdock>

This repository is the source of truth for installation, configuration, concepts, operations, and troubleshooting. The AgentDock source repository README keeps only the project overview and shortest onboarding path.

## Local development

```bash
pnpm install --frozen-lockfile
pnpm start
```

Start the Simplified Chinese locale with:

```bash
pnpm start -- --locale zh-CN
```

The local development server runs at:

```text
http://localhost:3000/agentdock-docs/
```

## Quality checks

```bash
pnpm check
```

This command runs the TypeScript check, locale-preference tests, verifies that English and Simplified Chinese documents have matching paths and structure, and builds both locales for production.

## Documentation layout

```text
docs/                                            # English source documents
├── getting-started/                             # Installation and first connection
├── concepts/                                    # Skills, tasks, dynamic MCP, and NexusDock Recall
├── guides/                                      # Browser and desktop automation
├── reference/                                   # Configuration and tool reference
├── operations/                                  # Advanced deployment, security, and troubleshooting
└── contributing/                                # Contributor guide

i18n/zh-CN/docusaurus-plugin-content-docs/current/  # Matching Simplified Chinese documents
```

Navigation order is maintained explicitly in `sidebars.ts`. Docusaurus locale resources under `i18n/zh-CN/` localize the home page, navbar, footer, sidebar, and theme text.

## Localization rules

- English and Simplified Chinese documents must have identical relative file paths.
- Corresponding pages must keep the same heading levels, section order, code-fence languages, commands, configuration fields, and link destinations.
- Translation may follow natural conventions in each language, but it must not add, remove, or change product behavior.
- Add, delete, or rename a page in both locales in the same change.
- On the first visit, browser languages select English or Simplified Chinese automatically. A manual locale-menu choice is stored in `localStorage` and takes priority afterward.
- Shared images stay under `static/img/`; do not duplicate language-neutral assets.

## Content rules

- Give users the shortest complete path first. Move internals, exhaustive parameters, and maintainer workflows into reference, operations, or contributor sections.
- Write for public users. Do not record personal device paths, private ports, private domains, or maintainer credentials.
- Keep migration history, retired API inventories, and temporary compatibility plans out of primary user documentation.
- Commands, flags, and environment variables must match the current source code.
- Validate code and documentation together whenever user-visible behavior changes.

## Search

Provide all of these variables at build time to enable Algolia DocSearch:

```bash
ALGOLIA_APP_ID=...
ALGOLIA_SEARCH_API_KEY=...
ALGOLIA_INDEX_NAME=...
pnpm build
```

The site still builds and deploys normally when search variables are absent.

## Deployment

`.github/workflows/docs.yml` checks pull requests and publishes GitHub Pages after `main` changes.

## License

MIT
