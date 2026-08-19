# 工具介绍

AgentDock 通过 MCP 向上层 Agent 暴露一组稳定的内置工具。工具负责执行真实动作，Skill 负责描述工作方法，动态 MCP 负责接入外部服务，这三者职责不同。

普通用户通常不需要逐个手动调用工具。连接 MCP 客户端后，直接描述目标，Agent 会选择合适工具。这个页面主要用于了解能力范围、排查连接问题或进行集成开发。

## 常见能力

- 读取、搜索、修改和发布文件。
- 执行命令并持续观察长时间任务。
- 检查、提交、拉取和推送 Git 仓库。
- 安装和使用 Skill。
- 管理复杂任务的步骤与验证。
- 接入外部 MCP、浏览器和 NexusDock Recall。

客户端实际能看到哪些工具取决于宿主机配置：

- 不依赖外部集成的基础工具始终可用。
- 配置 `AGENTDOCK_NEXUS_ENDPOINT` 后，额外暴露 `workflow_template_manage`、`recall_*` 和 `private_note_manage`。
- 启用 `AGENTDOCK_BROWSER_ENABLED` 或 `--browser-enabled` 后，额外暴露 `browser_*` 工具。
- 启用 `AGENTDOCK_ACP_ENABLED` 后，额外暴露 `acp_session`、`acp_prompt` 和 `acp_interaction`。
- 动态 MCP 的上游工具不会直接混入 AgentDock 的 `tools/list`，而是通过固定的发现和调用入口访问。

调用 `server_info` 可以查看当前实例真正暴露的工具清单。

## 系统与上下文

| 工具 | 用途 |
| --- | --- |
| `server_info` | 返回版本、操作系统、路径模型、认证状态、可选能力和当前工具列表，是部署与排障的首要入口 |
| `agentdock_context` | 返回轻量能力索引，包括内置工具、已安装 Skill、动态 MCP、Workflow 模板和高优先级上下文 |

`agentdock_context` 只返回适合模型快速判断的索引。未配置 NexusDock 时，它不会展示 Workflow 模板索引或相关规则。需要 Skill 正文、动态 MCP Schema 或 Recall 正文时，再调用对应读取工具。

## 文件与文本

AgentDock 使用 Host 路径模型。相对路径默认从 `~/AgentDock` 解析，绝对路径按运行 AgentDock 的操作系统用户权限访问。

| 工具 | 用途 | 常用参数或 action |
| --- | --- | --- |
| `read_file` | 分段读取 UTF-8 文本，也支持 `skill://<name>/<path>` | `path`、`start_line`、`end_line` |
| `list_dir` | 列出目录项，可限制递归深度和数量 | `recursive`、`max_depth`、`include_hidden` |
| `list_files` | 使用 glob 批量查找文件 | `patterns`、`glob`、`exclude_patterns` |
| `search_text` | 使用文本或正则搜索文件内容 | `query`、`regex`、`include_globs`、`context_lines` |
| `file_edit` | 统一执行文本文件修改 | `replace`、`patch`、`add`、`delete`、`move` |

`file_edit` 支持 `dry_run` 和 diff 预览。涉及替换时可以使用 `expected_matches` 约束命中数量，避免内容漂移后误改其他位置。

Windows 版 AgentDock 的文件工具可以通过 `runtime=wsl` 使用 WSL 原生文件语义；这不是一组额外工具。

## 命令与会话

| 工具 | 用途 | 常用参数或 action |
| --- | --- | --- |
| `exec_command` | 执行有超时、输出上限和脱敏能力的命令 | `cmd`、`workdir`、`timeout_ms`、`tty`、`skill` |
| `session_observe` | 只读查看长时间命令会话 | `list`、`status` |
| `session_act` | 向会话写入输入或终止会话 | `write`、`kill`、`kill_all` |

`exec_command` 在命令未快速结束时返回 `session_id`，后续使用 `session_observe` 读取状态。需要交互输入时使用 `session_act action=write`。

通过 `skill=<name>` 运行命令时，AgentDock 会把当前激活 Skill 根目录设为默认工作目录，并只向该子进程注入 Skill 独立环境。

Windows 版 `exec_command` 可以显式选择 `runtime=windows` 或 `runtime=wsl`。

## Coding Agent（ACP）

这些工具只有在宿主机启用 ACP 后才会暴露。普通用户通常只需要直接描述编码任务，由上游 Agent 管理 ACP 会话和进度读取。

| 工具 | 用途 | 主要动作 |
| --- | --- | --- |
| `acp_session` | 检查当前 Coding Agent，并创建、恢复、配置、查看或关闭持久会话 | `info`、`authenticate`、`new`、`load`、`resume`、`fork`、`set_mode`、`set_config`、`list`、`inspect`、`close`、`delete` |
| `acp_prompt` | 启动编码轮次，并读取进度、steering 或取消任务 | `start`、`events`、`steer`、`cancel` |
| `acp_interaction` | 处理 Coding Agent 发起的显式权限交互 | `list`、`inspect`、`respond`、`cancel` |

`acp_prompt start` 会很快返回 `run_id`，后续通过 `events` 读取进度，而不是让一次工具调用一直等待完整编码轮次。权限响应只能选择 Coding Agent 当前明确提供、且本地 AgentDock 策略允许的选项。

安装方式和项目访问边界见 [使用本地 Coding Agent](../guides/coding-agents.md)。

## 可恢复任务与 Workflow

| 工具 | 用途 | action |
| --- | --- | --- |
| `task_manage` | 持久化多步骤任务、进度、阻塞和最终验证证据 | `create`、`list`、`get`、`checkpoint`、`block`、`resume`、`final_review`、`complete` |
| `workflow_template_manage` | 管理和匹配可复用 Workflow 模板；仅配置 NexusDock 后可见 | `save`、`validate`、`publish`、`retire`、`list`、`get`、`get_many`、`match`、`vector_index` |

`task_manage` 保存的是状态，不会替代命令、测试、部署或浏览器验证。普通任务可以完全在本机使用；Workflow 模板存放在 NexusDock Registry，未配置 NexusDock 时 `workflow_template_manage` 不会出现在工具列表中。

多个模板同时适用时，`get_many` 返回模板正文，但不会自动拼接。模型需要删除无关步骤、合并重复项，再把组合结果传给 `task_manage create`。

## Skill 包与独立环境

| 工具 | 用途 | action |
| --- | --- | --- |
| `skill_package` | 校验、安装、激活和回滚 Skill，并管理每个 Skill 的独立环境 | `validate`、`install`、`activate`、`rollback`、`env_set`、`env_unset`、`env_list` |

Skill 是模型读取的文档型工作方法，不是隐藏执行器。常见调用顺序：

```text
agentdock_context
→ read_file skill://<name>/SKILL.md
→ 使用真实文件、命令、浏览器或 MCP 工具执行
```

`skill_package env_list` 不返回秘密值，只返回变量名和是否已配置。普通用户使用方式见 [使用 Skill](../concepts/skills.md)。

## 动态 MCP

动态 MCP 使用四个固定入口，避免上层客户端因远端工具频繁变化而缓存过期。

| 工具 | 用途 | 常用 action |
| --- | --- | --- |
| `mcp_manage` | 注册、启停、刷新、删除 MCP Server，并管理独立环境 | `list`、`inspect`、`add`、`enable`、`disable`、`refresh`、`remove`、`env_set`、`env_unset`、`env_list` |
| `mcp_tool_search` | 按 Server 和能力关键词搜索轻量工具摘要 | `server`、`query`、`limit` |
| `mcp_tool_inspect` | 读取一个上游工具的完整输入输出 Schema | `name=<server>:<tool>` |
| `mcp_tool_call` | 按检查过的 Schema 调用上游工具 | `name`、`arguments` |

推荐调用链：

```text
agentdock_context
→ mcp_tool_search
→ mcp_tool_inspect
→ mcp_tool_call
```

注册信息只保存环境变量名，不保存明文 Token。更完整的注册示例见 [动态 MCP](../concepts/dynamic-mcp.md)。

## 图片与 Artifact

| 工具 | 用途 |
| --- | --- |
| `view_image` | 从 AgentDock Artifact、Host 图片路径或 HTTP(S) URL 加载图片，并按模型限制自动缩放或转码 |
| `file_publish` | 把文件或目录发布为不可变 Artifact 快照；目录自动打包为 `tar.gz` |

`file_publish` 始终返回 `artifact_id`、哈希和大小。当前请求存在可访问服务地址时，还会返回有过期时间的签名 URL。

浏览器截图等图片型工具通常先返回轻量 Artifact 引用，再通过 `view_image` 加载，避免在普通工具结果中传递大段 Base64。

## NexusDock Recall

以下工具只在配置 `AGENTDOCK_NEXUS_ENDPOINT` 后暴露：

| 工具 | 用途 | 常用参数或 action |
| --- | --- | --- |
| `recall_bootstrap` | 在重要任务开始时加载紧凑的长期上下文和 Runbook 索引 | `max_bytes`、`include_body` |
| `recall_search` | 搜索 Markdown、经验卡片和笔记 | `query`、`kind`、`note_scope` |
| `recall_read` | 按路径读取一个 Recall 条目 | `path` |
| `recall_write` | 计划、创建、更新或删除 Recall 内容 | `target`、`action`、`confirmed` |
| `recall_maintain` | 检查同步、列表、lint、Embedding 和索引 | `sync_status`、`list`、`lint`、`embedding_status`、`reindex`、`reindex_cards` |

`recall_write` 要求明确选择内容类型：

- `card`：原子、可复用的经验和决策。
- `note`：问题讨论、学习记录和未定结论。
- `markdown`：稳定项目文档、Runbook 和结构化长期事实。

真实写入和删除需要 `confirmed=true`。详细边界见 [NexusDock Recall](../concepts/recalldock.md)。

## 私密笔记

`private_note_manage` 只在配置 `AGENTDOCK_NEXUS_ENDPOINT` 后暴露：

| 工具 | 用途 | action |
| --- | --- | --- |
| `private_note_manage` | 访问 NexusDock Private Notes 私密笔记库 | `search`、`read`、`write`、`delete`、`status`、`maintain` |

这个工具不是普通记忆入口。只有用户明确要求访问私密笔记，或内容明显包含敏感凭据和个人信息时才应使用。

- `search` 只返回标题、简介、标签、分类、路径和更新时间等元数据，不搜索正文。
- 只有显式 `read` 才返回明文。
- `write` 和 `delete` 必须使用 `confirmed=true`。
- Git 备份只保存 age 密文，明文与密钥必须保持 Git 忽略。

## 浏览器自动化

以下工具只在启用浏览器能力后暴露：

| 工具 | 用途 | action 或典型输入 |
| --- | --- | --- |
| `browser_session` | 创建、关闭和清理浏览器会话 | `start`、`close`、`cleanup_stale` |
| `browser_act` | 在指定页面中导航、点击、输入、滚动并等待页面条件 | `page_id`、`goto`、`click`、`fill`、`wait_for_url`、`wait_for_text`、`wait_for_response` |
| `browser_snapshot` | 获取指定页面及全部页面元数据、文本、截图和错误 | `session_id`、`page_id`、`full_page` |

`browser_session` 创建由 AgentDock 管理的 Chrome、Chromium 或 Edge 会话，支持无头模式、独立 `profile_id`、Cookie 和 localStorage 注入。会话返回 `page_id` 和 `pages`；网页打开新标签页后，可以把目标 `page_id` 传给 `browser_act` 或 `browser_snapshot`。它不会接管已经打开的个人浏览器。

AgentDock 默认不开放任意页面脚本执行动作。优先使用可观察的点击、输入、滚动和截图完成操作。详细说明见 [浏览器自动化](../guides/browser-control.md)。

## 返回状态（集成与调试）

:::info
以下状态语义从 AgentDock `v0.4.3` 开始生效。`v0.4.2` 及更早版本的正常工具结果仍可能包含通用 `ok`；集成方应升级后再依赖本节字段。
:::

AgentDock 把“工具调用是否成功”和“业务或命令结果是否成功”分开表达：

- MCP 协议层的 `isError` 表示工具调用错误。参数错误、权限不足、资源不存在、网络失败或内部异常会返回 `isError: true`。
- 正常返回的 `structuredContent` 不包含通用 `ok` 或 `tool_ok`，避免模型把“工具成功返回结果”误判成“命令或业务成功”。
- 命令完成后使用 `command_ok`、`exit_code` 和可选的 `command_error`。命令仍在运行时不会提前返回 `command_ok`。
- 浏览器操作使用 `browser_ok`、`browser_error`；其他工具使用 `valid`、`changed`、`configured`、`written`、`encrypted_backup_ok` 等领域字段。

命令退出失败仍然属于一次正常的工具返回，因为 AgentDock 需要保留 stdout、stderr 和退出码：

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

业务检查未通过也不等于工具调用错误。例如 Skill 校验可以正常返回 `valid: false` 和具体问题列表。调用方应先看 MCP `isError`，再按工具领域读取 `command_ok`、`valid`、`changed` 等字段。

HTTP 健康检查、Runtime API、WSL 子进程等内部或独立协议可能使用自己的状态字段，但这些字段不会作为 MCP 工具结果中的通用成功标记暴露。

## 工具选择原则

- 先用只读工具检查现状，再调用会产生副作用的工具。
- 修改前查看真实文件、仓库、服务或页面状态，修改后做真实验证。
- 简单读取不创建任务；多步骤开发、部署、迁移和排障使用 `task_manage`。
- Skill 用来指导流程，不替代真实工具。
- 动态 MCP 工具先搜索、再检查 Schema、最后调用。
- 不把 AgentDock 当成操作系统级沙箱。真实权限仍由运行用户、容器 volume、systemd、DACL 和网络策略决定。

配置启用方式见 [配置](./configuration.md)，安全边界见 [安全模型](../operations/security.md)。
