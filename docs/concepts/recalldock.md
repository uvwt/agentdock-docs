# Recall memory

NexusDock Recall is an optional long-term memory service for AgentDock. It keeps information, preferences, experience, and knowledge that are worth reusing later, so future tasks can continue with useful context.

Without NexusDock, file, command, command-line Git, Skill, dynamic MCP, and local task tools remain fully available; Recall, workflow template, knowledge evolution, and private note tools are unavailable. See [NexusDock](./nexusdock.md) for multi-device management and the unified MCP endpoint.

## When to use it

Store:

- Personal preferences, recurring habits, and long-term goals.
- Learning notes, reading takeaways, and knowledge you want to build over time.
- Information you may reuse for travel, shopping, hobbies, or everyday decisions.
- Background, decisions, and experience from work or personal projects.
- Verified development, deployment, or troubleshooting lessons.

Do not store:

- Tokens, passwords, cookies, private keys, or browser sessions.
- One-off logs and temporary execution state.
- Unverified guesses.
- Real-time task progress.

## Setup

Pair the AgentDock device with NexusDock first. In NexusDock, open **Settings → System & Nodes**, create a one-time pairing code, then run the generated `agentdock nexus pair ...` command on the AgentDock device and restart AgentDock.

Recall does not need a separate AgentDock-side URL or token after pairing. See [Connect AgentDock](../operations/nexusdock-connect.md) for the full setup.

## How to use it

Speak directly:

```text
Remember that I prefer places to stay with convenient public transit when I travel.
Save the key points from this study session so I can continue reviewing them later.
Find the camera-buying criteria I summarized before.
Save the long-term conclusion we just confirmed for this project.
```

AgentDock can use existing Recall content to carry useful context into later tasks. With Embeddings configured, semantic search can also find related information even when it is phrased differently.

## Content types

- **Markdown:** long-term notes, learning records, project documentation, and structured knowledge.
- **Card:** one atomic, reusable experience, preference, fact, or decision.

Private Notes are a separate store rather than a Recall content type.

## Private Notes and Recall

Private Notes use a separate NexusDock Private Notes store and are not part of Recall search:

- Recall stores reusable project knowledge and must not contain tokens, passwords, cookies, or private keys.
- Private Notes store sensitive information only when you explicitly ask, with age-encrypted backups.
- Private-note search returns safe metadata only; reading the body requires an explicit action.
- `recall_*` cannot read, modify, or list private notes. Use `private_note_manage` instead.

## Task progress and Recall

NexusDock Recall stores long-term knowledge. The task system stores current execution progress. Connecting NexusDock does not automatically make a task resumable on another device.
