# Tasks and progress

For development, deployment, migration, or complex troubleshooting, AgentDock can persist the goal, steps, completion conditions, and verification evidence as a recoverable task.

After an interrupted conversation, the next session can see what was completed, where work stopped, and what still needs verification.

## When a task is created

A task is appropriate when:

- Completion requires multiple steps.
- Code, configuration, or production systems will change.
- Work must wait for a build, deployment, or external device.
- Tests and real verification evidence are required before completion.

A simple query, one file read, or one explicit command usually does not need a task.

## What a task contains

A task normally records:

- **Goal:** the final outcome.
- **Steps:** stages such as inspection, modification, testing, and release.
- **Completion conditions:** objective criteria for real completion.
- **Current progress:** pending, in progress, or completed.
- **Verification evidence:** tests, service state, page checks, or actual output.

A step moves forward only after the underlying work is complete. A tool returning a result does not complete the step automatically.

## Blocking and resuming

A task is marked blocked only when work truly cannot continue, such as when a target computer is offline, required permissions are missing, or an external service remains unavailable.

An ordinary test failure is not a blocker; the agent should continue troubleshooting. After the blocker is resolved, say:

```text
The device is available again. Continue the previous task.
```

## How completion is determined

Before completing a task, the agent should verify:

1. Every step is actually complete.
2. Each completion condition has verifiable evidence.
3. No remaining risk or temporary workaround is left unexplained.
4. The modified service, page, or program works in the real environment.

“Code changed” and “command finished” do not mean the task is complete.

## Workflow templates

Common development, deployment, and operations processes can be saved as templates. The agent matches templates first, then removes, combines, or adjusts steps for the current task.

A template is workflow guidance. It does not execute commands automatically and does not replace inspection of the current environment.

## Data scope

Task state belongs to the current AgentDock instance and is not synchronized across devices automatically. Long-term conclusions should be moved into project documentation or NexusDock Recall rather than left only in old task records.

See [Tools](../reference/tools.md#recoverable-tasks-and-workflows) for exact actions and fields.
