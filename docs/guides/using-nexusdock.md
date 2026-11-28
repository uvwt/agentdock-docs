# Everyday use with NexusDock

You can treat NexusDock as one AI workspace. It keeps track of the devices AI can reach, useful context worth remembering, and routines you want to reuse—without asking you to manage the infrastructure behind them.

## Your devices

Devices are the real computers and servers that AgentDock connects to your NexusDock account. AI can only operate a device while that device is online and enabled.

### Rename devices

Give devices names that make sense to you, such as `Work Mac`, `Home PC`, or `Production Server`. You can also add short device purpose descriptions in NexusDock so connected AI clients can pick the right machine automatically when you have several devices online.

### Enable only what you want

A connected device can be disabled from NexusDock without deleting it. Disabled devices are not available to AI until you enable them again.

To pair additional computers or servers with your account, see [Connect AgentDock](../operations/nexusdock-connect.md).

## Long-term memory

NexusDock Recall gives AI a place to keep useful context across conversations. Good examples include personal preferences, stable project facts, recurring decisions, and verified runbooks.

You normally do not need to create memory documents by hand. A connected AI can write or update Recall when it is appropriate, and you can review or organize the resulting documents in NexusDock at any time.

:::warning[Memory is not a password vault]
Do not store passwords, access tokens, cookies, private keys, or pairing codes in Recall.
:::

For content types, search behavior, and best practices, see [Recall memory](../concepts/recalldock.md).

## Reusable workflows

A Workflow saves a proven way to do a recurring task. Instead of explaining the same process every time, AI can reuse the steps and checks that already worked across your paired devices.

### Good workflow candidates

Deployments, recurring reports, maintenance checks, repeatable research, and other tasks with a stable sequence are good candidates.

### Keep one-off work flexible

A task that changes every time does not need a saved workflow. Ask AI normally and let it plan the work for the current situation.

For matching modes and examples, see [Workflow](../concepts/workflow.md).

## A simple daily pattern

1. **Ask in plain language:** Tell ChatGPT, Claude, Cursor, or another connected AI what you want done.
2. **Let AI choose the right device:** If several devices are available, mention the device when it matters. Otherwise, the AI can inspect available NexusDock devices with `agentdock_context` before acting.
3. **Save what is worth reusing:** Useful stable context can become Recall memory, and a proven repeated process can become a Workflow.

## Related guides

- [What is NexusDock?](../concepts/nexusdock.md)
- [Recall memory](../concepts/recalldock.md)
- [Workflow](../concepts/workflow.md)
- [Connect from different clients](./mcp-clients.md)
- [Troubleshooting](../operations/troubleshooting.md)
