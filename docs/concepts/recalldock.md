# NexusDock Recall

NexusDock Recall is an optional long-term knowledge service for AgentDock. It stores stable project notes, experience, decisions, and problem logs so later tasks can find reliable context.

Without NexusDock, file, command, command-line Git, Skill, dynamic MCP, and local task tools remain fully available; Recall, workflow template, knowledge evolution, and private note tools are unavailable. See [NexusDock](./nexusdock.md) for the multi-device control plane and unified MCP gateway.

## When to use it

Store:

- Long-lived project structure and runtime steps.
- Verified deployment or troubleshooting notes.
- Decisions and preferences meant to be reused across sessions.
- Open questions and learning notes.

Do not store:

- Tokens, passwords, cookies, private keys, or browser sessions.
- One-off logs and temporary execution state.
- Unverified guesses.
- Real-time task progress.

## Setup

You need an accessible NexusDock URL and an optional token. Ask your agent:

```text
Connect AgentDock to NexusDock Recall at https://nexus.example.com using a secure environment variable for the token.
```

For exact environment variables, see [Configuration reference](../reference/configuration.md).

## How to use it

Speak directly:

```text
Check existing deployment notes for this project before starting.
Update verified conclusions to long-term project docs; do not record temporary logs.
Search earlier troubleshooting notes about OAuth.
```

`agentdock_context` already includes a compact Recall startup index, so models do not need a separate bootstrap call. Read directly when the index already provides the exact path; otherwise use `recall_search` to search Markdown and Cards. When NexusDock has embeddings configured, it adds semantic recall behind the same search tool transparently.

The agent searches existing content first, then decides whether to read, update, or create, avoiding duplicates and conflicts.

## Content types

- **Markdown:** stable project documentation, runbooks, learning records, and structured long-term facts.
- **Card:** one atomic, reusable experience, preference, or decision.

Private Notes are a separate store rather than a Recall content type.

## Private Notes and Recall

Private Notes use a separate NexusDock Private Notes store and are not part of Recall search:

- Recall stores reusable project knowledge and must not contain tokens, passwords, cookies, or private keys.
- Private Notes store sensitive information only when you explicitly ask, with age-encrypted backups.
- Private-note search returns safe metadata only; reading the body requires an explicit action.
- `recall_*` cannot read, modify, or list private notes. Use `private_note_manage` instead.

## Task progress and Recall

NexusDock Recall stores long-term knowledge. The task system stores current execution progress. Connecting NexusDock does not automatically make a task resumable on another device.
