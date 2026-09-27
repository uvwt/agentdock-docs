# Tool reference

AgentDock exposes tools to connected AI clients over MCP. The tools visible on a specific connection depend on enabled capabilities; the client's `tools/list` is the source of truth.

## Context, files, and commands

| Tool | Purpose |
| --- | --- |
| `agentdock_context` | Read current AgentDock runtime and capability context |
| `workspace_context` | Read workspace rules and workspace-local Skill index |
| `read_file` | Read text files |
| `list_dir` | List or find files and directories |
| `search_text` | Search text or regular expressions in files |
| `file_edit` | Add, replace, patch, move, or delete text files |
| `exec_command` | Run commands |
| `session_observe` | Inspect long-running command sessions |
| `session_act` | Send input to or stop command sessions |

## Skills, Plugins, and external MCP

| Tool | Purpose | Main actions |
| --- | --- | --- |
| `skill_manage` | Manage installed Skills and their environment | `install`, `remove`, `env_set`, `env_unset`, `env_list` |
| `plugin_manage` | Review and manage Plugins | `inspect`, `validate`, `install`, `update`, `enable`, `disable`, `remove` |
| `mcp_manage` | Manage external MCP connections | `list`, `inspect`, `add`, `enable`, `disable`, `refresh`, `authorize`, `remove`, environment actions |
| `mcp_tool_search` | Find tools provided by an external MCP server | search |
| `mcp_tool_inspect` | Read one external tool's schema | inspect |
| `mcp_tool_call` | Call an inspected external MCP tool | call |

See [Use Skills](../concepts/skills.md), [Use Plugins](../concepts/plugins.md), and [Use external MCP services](../concepts/dynamic-mcp.md).

## Tasks, Workflow, and memory

| Tool | Availability | Purpose |
| --- | --- | --- |
| `task_manage` | Always | Track multi-step task state and progress |
| `workflow_template_manage` | NexusDock paired | Find and manage reusable Workflows |
| `recall_search` | NexusDock paired | Search Recall memory |
| `recall_read` | NexusDock paired | Read Recall content |
| `recall_write` | NexusDock paired | Create or update Recall content |
| `recall_maintain` | NexusDock paired | Inspect and maintain Recall indexes/content |
| `evolve` | NexusDock paired | Manage reusable learned knowledge |
| `private_note_manage` | NexusDock paired | Access Private Notes |

See [Tasks and progress](../concepts/tasks.md), [Recall memory](../concepts/recalldock.md), and [Workflow](../concepts/workflow.md).

## Coding Agents

These tools are available when Coding Agents are enabled:

| Tool | Purpose |
| --- | --- |
| `acp_session` | Create, open, inspect, update, and close Coding Agent sessions |
| `acp_prompt` | Start prompts, read events, and cancel runs |
| `acp_interaction` | Review and respond to pending permission interactions |

See [Use local Coding Agents](../guides/coding-agents.md).

## Browser, images, and file sharing

Browser tools are available when browser support is enabled.

| Tool | Purpose |
| --- | --- |
| `browser_session` | Start and close browser sessions |
| `browser_act` | Navigate, click, type, scroll, and wait on pages |
| `browser_snapshot` | Read page state and capture screenshots |
| `view_image` | Load an image from a file, published file, or URL |
| `file_publish` | Publish a file or directory; create a temporary shareable URL when a reachable address is available |

See [Use the browser](../guides/browser-control.md) and [Configuration reference](./configuration.md) for enablement.
