# Workflow

Workflow is NexusDock's shared library for reusable procedures. If something happens repeatedly and usually follows a similar set of steps, it can be saved as a Workflow. Everyday life, learning, content creation, work, and technical tasks can all use it.

## What it does

A Workflow saves a reusable process so similar tasks do not need to be planned from scratch every time.

For example, you can keep workflows for:

- preparing for a trip;
- weekly study review or organizing notes;
- organizing photos, downloads, or personal files;
- writing, filming, or publishing content;
- recurring checks and routine work tasks;
- releasing software, deploying a service, or troubleshooting a recurring issue.

Workflow templates are shared through NexusDock, so paired AgentDock devices can use the same procedures.

## How to use it

You can ask directly:

```text
Use my usual trip-preparation workflow to check what is still missing.
Use the weekly review workflow to organize what I should study today.
Save this photo-organizing process as a reusable workflow.
Use the existing release workflow for this version.
```

A Workflow is a reusable process, not an automatic script. AgentDock can adjust the steps to the current task and environment before carrying them out.

## Matching

Basic Workflow matching works without an AI or Embedding provider. If Embedding is configured in **Settings → AI & Vectors**, NexusDock can also use semantic matching to find relevant workflows.

Current task progress is separate from Workflow templates. See [Tasks and progress](./tasks.md) for execution progress, and [Recall memory](./recalldock.md) for long-term knowledge.
