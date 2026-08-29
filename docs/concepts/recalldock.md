# NexusDock Recall

NexusDock Recall is an optional long-term knowledge service for AgentDock. It stores stable project documentation, experience, decisions, and question records so future tasks can recover reliable context.

Without NexusDock, files, commands, command-line Git, Skills, dynamic MCP, and local tasks continue to work normally. Recall, workflow templates, knowledge evolution, and private-note tools are unavailable. For the multi-device control-plane and unified MCP behavior, see [NexusDock](./nexusdock.md).

## When to use it

Good candidates include:

- Long-lived project structure and operating instructions.
- Verified deployment or troubleshooting experience.
- Decisions and preferences that should carry across conversations.
- Open questions and learning records that still need resolution.

Do not store:

- Tokens, passwords, cookies, private keys, or browser login state.
- One-off logs or temporary execution state.
- Unverified speculation.
- Live progress for the current task.

## Connect NexusDock

You need a reachable NexusDock URL and, optionally, a token. Ask the agent to configure it:

```text
Connect AgentDock to NexusDock Recall at https://nexus.example.com, and store the token in a secure environment variable.
```

See [Configuration](../reference/configuration.md) for the exact environment variables.

## How to use it

You can say:

```text
Before starting, look for existing deployment records for this project.
Update the long-term project documentation with the conclusions verified in this task, but do not store temporary logs.
Search for previous OAuth troubleshooting experience.
```

`agentdock_context` already carries a compact Recall index for startup context, so the model does not need a separate bootstrap call. When that index gives the exact path, it can read the entry directly. Otherwise `recall_search` searches Markdown and cards, using lexical retrieval by default and adding semantic retrieval transparently when NexusDock embeddings are available.

The agent searches existing content before deciding whether to read, update, or create an entry, which helps avoid duplicates and conflicts.

## Content types

- **Markdown:** stable project documentation, runbooks, learning records, and structured long-term facts.
- **Card:** one atomic, reusable experience, preference, or decision.

Private Notes are a separate store rather than a Recall content type.

## Private Notes and Recall

Private Notes use a separate NexusDock Private Notes store and are not part of Recall search:

- Recall stores reusable project knowledge and must not contain tokens, passwords, cookies, or private keys.
- Private Notes store sensitive information only when the user explicitly asks, with age-encrypted backups.
- Private-note search returns safe metadata only; reading the body requires an explicit action.
- `recall_*` cannot read, modify, or list private notes. Use `private_note_manage` instead.

## Task progress and Recall

NexusDock Recall stores long-term knowledge. The task system stores current execution progress. Connecting NexusDock does not automatically make a task resumable on another device.
