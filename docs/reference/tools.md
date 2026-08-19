# Tools

AgentDock exposes a stable set of built-in tools to upstream agents over MCP. Tools perform real actions, Skills describe working methods, and dynamic MCP connects external services. These responsibilities are distinct.

Regular users usually do not need to call tools one by one. After connecting an MCP client, describe the goal and let the agent choose the appropriate tools. This page is mainly for understanding capability boundaries, troubleshooting connections, and integration development.

## Common capabilities

- Read, search, modify, and publish files.
- Run commands and continue observing long-running work.
- Inspect, commit, pull, and push Git repositories.
- Install and use Skills.
- Track steps and verification for complex tasks.
- Connect external MCP servers, browsers, and NexusDock Recall.

The tools actually visible to a client depend on the host configuration:

- Core tools that do not depend on external integrations are always available.
- Configuring `AGENTDOCK_NEXUS_ENDPOINT` adds `workflow_template_manage`, `recall_*`, and `private_note_manage`.
- Enabling `AGENTDOCK_BROWSER_ENABLED` or `--browser-enabled` adds `browser_*` tools.
- Enabling `AGENTDOCK_ACP_ENABLED` adds `acp_session`, `acp_prompt`, and `acp_interaction`.
- Upstream tools from dynamic MCP servers are not merged directly into AgentDock's `tools/list`; they are accessed through stable discovery and invocation entry points.

Call `server_info` to inspect the tools actually exposed by the current instance.

## System and context

| Tool | Purpose |
| --- | --- |
| `server_info` | Returns version, operating system, path model, authentication state, optional capabilities, and the current tool list; the primary entry point for deployment and troubleshooting |
| `agentdock_context` | Returns a lightweight capability index covering built-in tools, installed Skills, dynamic MCP, Workflow templates, and high-priority context |

`agentdock_context` returns only the index needed for quick model decisions. Without NexusDock, it does not include Workflow-template indexes or related rules. Read the corresponding resource when a Skill body, dynamic MCP schema, or full Recall entry is required.

## Files and text

AgentDock uses the Host path model. Relative paths resolve from `~/AgentDock`; absolute paths are accessed with the permissions of the operating-system user that runs AgentDock.

| Tool | Purpose | Common parameters or actions |
| --- | --- | --- |
| `read_file` | Reads UTF-8 text in slices and supports `skill://<name>/<path>` | `path`, `start_line`, `end_line` |
| `list_dir` | Lists directory entries with bounded recursion depth and count | `recursive`, `max_depth`, `include_hidden` |
| `list_files` | Finds files in bulk with glob patterns | `patterns`, `glob`, `exclude_patterns` |
| `search_text` | Searches file contents with text or regular expressions | `query`, `regex`, `include_globs`, `context_lines` |
| `file_edit` | Performs text-file changes through one entry point | `replace`, `patch`, `add`, `delete`, `move` |

`file_edit` supports `dry_run` and a diff preview. For replacements, use `expected_matches` to constrain the number of matches and prevent accidental edits after the source text changes.

On Windows, file tools can use native WSL file semantics through `runtime=wsl`; this is not a separate set of tools.

## Commands and sessions

| Tool | Purpose | Common parameters or actions |
| --- | --- | --- |
| `exec_command` | Runs a command with timeout, output limits, and redaction | `cmd`, `workdir`, `timeout_ms`, `tty`, `skill` |
| `session_observe` | Reads the state of a long-running command session | `list`, `status` |
| `session_act` | Writes input to or terminates a command session | `write`, `kill`, `kill_all` |

When a command does not exit quickly, `exec_command` returns a `session_id`. Use `session_observe` to read later state. Use `session_act action=write` when interactive input is required.

When a command runs with `skill=<name>`, AgentDock uses the active Skill root as the default working directory and injects that Skill's isolated environment only into the child process.

On Windows, `exec_command` can explicitly select `runtime=windows` or `runtime=wsl`.

## Coding Agents (ACP)

These tools are exposed only when ACP is enabled on the AgentDock host. Regular users normally describe the coding task directly; the upstream agent manages the ACP session and progress flow.

| Tool | Purpose | Main actions |
| --- | --- | --- |
| `acp_session` | Checks the configured Coding Agent and creates, resumes, configures, inspects, or closes persistent sessions | `info`, `authenticate`, `new`, `load`, `resume`, `fork`, `set_mode`, `set_config`, `list`, `inspect`, `close`, `delete` |
| `acp_prompt` | Starts a coding turn and reads progress, steering, or cancellation | `start`, `events`, `steer`, `cancel` |
| `acp_interaction` | Handles explicit permission interactions raised by the Coding Agent | `list`, `inspect`, `respond`, `cancel` |

A prompt `start` returns a `run_id` quickly; progress is read through `events` instead of keeping one tool call open for the entire coding turn. Permission responses can only select an option currently offered by the Coding Agent and allowed by local AgentDock policy.

See [Use local Coding Agents](../guides/coding-agents.md) for setup and project-access boundaries.

## Recoverable tasks and Workflows

| Tool | Purpose | Actions |
| --- | --- | --- |
| `task_manage` | Persists multi-step tasks, progress, blockers, and final verification evidence | `create`, `list`, `get`, `checkpoint`, `block`, `resume`, `final_review`, `complete` |
| `workflow_template_manage` | Manages and matches reusable Workflow templates; visible only when NexusDock is configured | `save`, `validate`, `publish`, `retire`, `list`, `get`, `get_many`, `match`, `vector_index` |

`task_manage` stores state; it does not replace commands, tests, deployment, or browser verification. Ordinary tasks work entirely locally. Workflow templates live in the NexusDock Registry, so `workflow_template_manage` is absent from the tool list when NexusDock is not configured.

When several templates apply, `get_many` returns their full bodies but does not combine them automatically. The model must remove irrelevant steps, merge duplicates, and pass the composed result to `task_manage create`.

## Skill packages and isolated environments

| Tool | Purpose | Actions |
| --- | --- | --- |
| `skill_package` | Validates, installs, activates, and rolls back Skills, and manages each Skill's isolated environment | `validate`, `install`, `activate`, `rollback`, `env_set`, `env_unset`, `env_list` |

A Skill is a document-based working method read by the model, not a hidden executor. A typical flow is:

```text
agentdock_context
→ read_file skill://<name>/SKILL.md
→ execute through real file, command, browser, or MCP tools
```

`skill_package env_list` returns variable names and configuration state, never secret values. See [Use Skills](../concepts/skills.md) for the regular-user workflow.

## Dynamic MCP

Dynamic MCP uses four stable entry points so that upstream clients do not cache stale tool lists when a remote service changes.

| Tool | Purpose | Common actions |
| --- | --- | --- |
| `mcp_manage` | Registers, enables, disables, refreshes, and removes MCP servers and manages isolated environments | `list`, `inspect`, `add`, `enable`, `disable`, `refresh`, `remove`, `env_set`, `env_unset`, `env_list` |
| `mcp_tool_search` | Searches lightweight tool summaries by server and capability keywords | `server`, `query`, `limit` |
| `mcp_tool_inspect` | Reads the complete input and output schema for one upstream tool | `name=<server>:<tool>` |
| `mcp_tool_call` | Calls an upstream tool using an inspected schema | `name`, `arguments` |

Recommended flow:

```text
agentdock_context
→ mcp_tool_search
→ mcp_tool_inspect
→ mcp_tool_call
```

Registry data stores environment-variable names, not plaintext tokens. See [Connect external MCP servers](../concepts/dynamic-mcp.md) for a complete registration example.

## Images and artifacts

| Tool | Purpose |
| --- | --- |
| `view_image` | Loads an image from an AgentDock artifact, Host path, or HTTP(S) URL and automatically resizes or converts it for model limits |
| `file_publish` | Publishes a file or directory as an immutable artifact snapshot; directories are packaged as `tar.gz` |

`file_publish` always returns an `artifact_id`, hash, and size. When the current request has a reachable service address, it also returns an expiring signed URL.

Image-producing tools such as browser screenshots usually return a lightweight artifact reference first. Load it through `view_image` instead of transferring large Base64 payloads in ordinary tool results.

## NexusDock Recall

These tools are exposed only when `AGENTDOCK_NEXUS_ENDPOINT` is configured:

| Tool | Purpose | Common parameters or actions |
| --- | --- | --- |
| `recall_bootstrap` | Loads compact long-term context and a Runbook index at the start of an important task | `max_bytes`, `include_body` |
| `recall_search` | Searches Markdown, experience cards, and notes | `query`, `kind`, `note_scope` |
| `recall_read` | Reads one Recall entry by path | `path` |
| `recall_write` | Plans, creates, updates, or deletes Recall content | `target`, `action`, `confirmed` |
| `recall_maintain` | Checks synchronization, lists content, lints, and manages embeddings and indexes | `sync_status`, `list`, `lint`, `embedding_status`, `reindex`, `reindex_cards` |

`recall_write` requires an explicit content type:

- `card`: atomic, reusable experience and decisions.
- `note`: question discussions, learning records, and unsettled conclusions.
- `markdown`: stable project documentation, Runbooks, and structured long-term facts.

Actual writes and deletions require `confirmed=true`. See [NexusDock Recall](../concepts/recalldock.md) for the boundaries.

## Private Notes

`private_note_manage` is exposed only when `AGENTDOCK_NEXUS_ENDPOINT` is configured:

| Tool | Purpose | Actions |
| --- | --- | --- |
| `private_note_manage` | Accesses the NexusDock Private Notes vault | `search`, `read`, `write`, `delete`, `status`, `maintain` |

This is not the ordinary memory entry point. Use it only when the user explicitly requests private-note access or when the content clearly contains sensitive credentials or personal information.

- `search` returns only metadata such as title, summary, tags, category, path, and update time; it does not search the body.
- Only an explicit `read` returns plaintext.
- `write` and `delete` require `confirmed=true`.
- Git backups contain only age ciphertext. Plaintext and keys must remain ignored by Git.

## Browser automation

These tools are exposed only when browser capabilities are enabled:

| Tool | Purpose | Actions or typical inputs |
| --- | --- | --- |
| `browser_session` | Creates, closes, and cleans up browser sessions | `start`, `close`, `cleanup_stale` |
| `browser_act` | Navigates, clicks, types, scrolls, and waits for page conditions in a selected page | `page_id`, `goto`, `click`, `fill`, `wait_for_url`, `wait_for_text`, `wait_for_response` |
| `browser_snapshot` | Captures selected-page and all-page metadata, text, screenshots, and errors | `session_id`, `page_id`, `full_page` |

`browser_session` creates an AgentDock-managed Chrome, Chromium, or Edge session. It supports headless mode, dedicated `profile_id` values, cookies, and localStorage injection. A session returns `page_id` and `pages`; when a site opens a new tab, pass the target `page_id` to `browser_act` or `browser_snapshot`. It does not take over an already-open personal browser.

AgentDock does not expose arbitrary page-script execution by default. Prefer observable clicks, typing, scrolling, and screenshots. See [Browser automation](../guides/browser-control.md) for details.

## Result state for integrations and debugging

:::info
The state semantics below apply starting with AgentDock `v0.4.3`. Normal tool results in `v0.4.2` and earlier may still contain a generic `ok`; integrations should upgrade before depending on these fields.
:::

AgentDock represents “whether the tool call succeeded” separately from “whether the command or domain result succeeded”:

- MCP protocol-level `isError` indicates a tool-call error. Invalid arguments, insufficient permissions, missing resources, network failures, or internal exceptions return `isError: true`.
- Successful `structuredContent` does not contain generic `ok` or `tool_ok`, preventing a model from confusing “the tool returned a result” with “the command or domain operation succeeded.”
- Completed commands use `command_ok`, `exit_code`, and optional `command_error`. A running command does not return `command_ok` early.
- Browser operations use `browser_ok` and `browser_error`; other tools use domain fields such as `valid`, `changed`, `configured`, `written`, and `encrypted_backup_ok`.

A failed command exit is still a normal tool result because AgentDock must preserve stdout, stderr, and the exit code:

```json
{
  "status": "exited",
  "command_ok": false,
  "exit_code": 1,
  "command_error": "exit status 1",
  "stdout": "",
  "stderr": "..."
}
```

A failed domain check is not necessarily a tool-call error. For example, Skill validation can return `valid: false` with a list of issues. Callers should inspect MCP `isError` first, then read `command_ok`, `valid`, `changed`, or the relevant domain field.

Internal or separate protocols such as HTTP health checks, the Runtime API, and WSL child processes may use their own state fields, but those fields are not exposed as generic success markers in MCP tool results.

## Tool selection principles

- Use read-only tools to inspect the current state before calling tools with side effects.
- Inspect real files, repositories, services, or pages before a change and verify the real result afterward.
- Do not create a task for a simple read. Use `task_manage` for multi-step development, deployment, migration, and troubleshooting.
- Skills guide the workflow; they do not replace real tools.
- Search a dynamic MCP tool, inspect its schema, and only then call it.
- Do not treat AgentDock as an operating-system sandbox. Real permissions still come from the runtime user, container volumes, systemd, DACLs, and network policy.

See [Configuration](./configuration.md) for enablement and the [Security model](../operations/security.md) for boundaries.
