# 工具介绍

AgentDock 通过 MCP 向上层 Agent 暴露一组稳定的内置工具。工具负责执行真实动作，Skill 负责描述工作方法，动态 MCP 负责接入外部服务，这三者职责不同。

连接 MCP 客户端后，直接描述目标，Agent 会选择合适工具。本页用于了解能力范围、排查连接问题和集成开发。

## 常见能力

- 读取、搜索、修改和发布文件。
- 执行命令并持续观察长时间任务。
- 通过 `exec_command` 使用本机 Git CLI，或通过动态 MCP 接入 Git 服务。
- 安装和使用 Skill。
- 管理复杂任务的步骤与验证。
- 接入外部 MCP、浏览器和 NexusDock。

客户端实际能看到哪些工具取决于宿主机配置：

- 不依赖外部集成的基础工具始终可用。
- 当前 AgentDock 与 NexusDock 完成配对后，额外暴露 `evolve`、`workflow_template_manage`、`recall_*` 和 `private_note_manage`。
- 启用 `AGENTDOCK_BROWSER_ENABLED` 或 `--browser-enabled` 后，额外暴露 `browser_*` 工具。
- 启用 `AGENTDOCK_ACP_ENABLED` 后，额外暴露 `acp_session`、`acp_prompt` 和 `acp_interaction`。
- 动态 MCP 的上游工具不会直接混入 AgentDock 的 `tools/list`，而是通过固定的发现和调用入口访问。

当前连接真正暴露哪些工具，以 MCP 客户端拿到的 `tools/list` 为准。

## 系统与上下文

| 工具 | 用途 |
| --- | --- |
| `agentdock_context` | 返回本机运行事实、已安装 Skill、动态 MCP、可选 ACP、操作规则，以及可用时由 Nexus 提供的 Workflow / Recall 索引 |
| `workspace_context` | 按本次工作区选择返回生效的 `AGENTS.md` 链和 workspace-local Skill 索引 |

`agentdock_context` 是让模型快速决策的启动上下文，不是重复的工具清单。直连 AgentDock 时会包含版本、操作系统、架构、目录和路径模型等 runtime 字段；经 NexusDock 调用时则返回包含各节点信息和 Nexus 共享上下文的 fleet 结构。

操作具体项目、切换工作区或工作区规则可能变化时，使用 `workspace_context`。直连 AgentDock 时只需可选 `workdir`；经 NexusDock 调用时需要 `node_id`，并可再传 `workdir`。返回包含 `workdir`、`workspace_root`、`instructions`、`workspace_skills` 和 `warnings`：先读取固定的 `~/.agentdock/AGENTS.md`，再读取工作区 `AGENTS.md` 继承链，并索引 `<workspace>/.agents/skills/*/SKILL.md`，但不返回 Skill 正文。

需要 Skill 正文、动态 MCP Schema 或 Recall 正文时，再调用对应读取工具。

## 文件与文本

AgentDock 使用 Host 路径模型。相对路径默认从 `~/AgentDock` 解析，绝对路径按运行 AgentDock 的操作系统用户权限访问。

| 工具 | 用途 | 常用参数或 action |
| --- | --- | --- |
| `read_file` | 分段读取 UTF-8 文本，也支持宿主签发的 `skill://...` 资源 URI | `path`、`start_line`、`end_line` |
| `list_dir` | 通过一个受限的目录树 / glob 入口列目录或查找文件 | `path`、`max_depth`、`max_entries`、`patterns`、`exclude_patterns`、`entry_type` |
| `search_text` | 使用文本或正则搜索文件内容 | `query`、`regex`、`include_globs`、`context_lines` |
| `file_edit` | 统一执行文本文件修改 | `replace`、`patch`、`add`、`delete`、`move` |

`list_dir` 已取代旧的独立文件列表入口。glob 模式相对于 `path`：`*` 不跨目录层级，`**` 可以跨目录；只需要文件时使用 `entry_type=file`，大目录中应合理限制 `max_depth` / `max_entries`。

`file_edit` 支持 `dry_run` 和 diff 预览。涉及替换时可以使用 `expected_matches` 约束命中数量，避免内容漂移后误改其他位置。

Windows 版 AgentDock 的文件工具可以通过 `runtime=wsl` 使用 WSL 原生文件语义；这不是一组额外工具。

## 命令与会话

| 工具 | 用途 | 常用参数或 action |
| --- | --- | --- |
| `exec_command` | 执行有超时、输出上限和脱敏能力的命令 | `cmd`、`workdir`、`timeout_ms`、`tty`、`skill` |
| `session_observe` | 只读查看长时间命令会话 | `list`、`status` |
| `session_act` | 向会话写入输入或终止会话 | `write`、`kill`、`kill_all` |

`exec_command` 在命令未快速结束时返回 `session_id`，后续使用 `session_observe` 读取状态。需要交互输入时使用 `session_act action=write`。

通过宿主签发的 managed `skill_ref` 运行命令时，AgentDock 会把该精确 Skill 根目录设为默认工作目录，注入它的独立环境，并提供保留的 `SKILL_DATA_DIR` 作为私有持久数据目录。shared 和 workspace 候选不会继承 managed Skill 的环境或数据目录。

Windows 版 `exec_command` 可以显式选择 `runtime=windows` 或 `runtime=wsl`。

## Coding Agent（ACP）

只有宿主启用 ACP 时才会暴露这些工具。三组工具都接受可选 `profile_id`；省略时使用配置的默认 Profile。

| 工具 | 用途 | 主要 action |
| --- | --- | --- |
| `acp_session` | 管理 AgentDock session 与 Adapter 原生 session | `info`、`new`、`list`、`inspect`、`open`、`update`、`close`、`delete` |
| `acp_prompt` | 启动异步 Prompt Run、读取有序事件、请求取消 | `start`、`events`、`cancel` |
| `acp_interaction` | 处理待用户参与的权限交互 | `list`、`respond` |

`acp_session open` 会在内部协商 resume/load；Adapter 声明能力时，`new` 可以通过 `from_session_id` fork；`update` 负责 session mode 或配置项。认证可以通过 `info(auth_method_id=...)` 发起，也可以在其他 session action 中带上 Adapter 声明的认证方法。Prompt steering 属于能力驱动的内部流程，不再是单独公开 action。

`acp_prompt start` 会快速返回 `run_id`，进度通过 `events` 增量读取。permission 响应只能选择 Coding Agent 当前提供且本地策略允许的选项，或者取消待处理交互。

Profile、安装和项目访问边界见 [使用本地 Coding Agent](../guides/coding-agents.md)。

## 可恢复任务与 Workflow

| 工具 | 用途 | action |
| --- | --- | --- |
| `task_manage` | 持久化多步骤任务、进度、阻塞和最终验证证据 | `create`、`list`、`get`、`checkpoint`、`block`、`resume`、`final_review`、`complete` |
| `workflow_template_manage` | 管理和匹配可复用 Workflow 模板；仅当前 AgentDock 设备与 NexusDock 配对后可见 | `publish`、`retire`、`list`、`get`、`get_many`、`match`、`vector_index` |

`task_manage` 保存的是状态，不会替代命令、测试、部署或浏览器验证。普通任务可以完全在本机使用；Workflow 模板存放在 NexusDock Registry；当前 AgentDock 设备未与 NexusDock 配对时，`workflow_template_manage` 不会出现在工具列表中。

`publish` 接收完整模板，并在激活该版本前进行校验。多个模板同时适用时，`get_many` 返回模板正文，但不会自动拼接。模型需要删除无关步骤、合并重复项、确定顺序，再把组合后的 steps 和 completion conditions 传给 `task_manage create`。

## 知识 Evolution

当前 AgentDock 设备与 NexusDock 配对后会暴露 `evolve`，但 Evolution 生命周期属于 AgentDock。NexusDock 提供共享存储和访问路径，不负责决定知识何时得到支持、被反证、被替代或撤回。

| 工具 | 用途 | intent |
| --- | --- | --- |
| `evolve` | 提议有边界的可复用知识，并管理由 AgentDock 负责的验证生命周期 | `propose`、`bind`、`supersede`、`retract` |

`bind` 属于高级的执行前学习检查：模型必须在任务开始执行前声明后续 Task 成功或失败分别代表什么。Task 结果本身没有学习含义，而且 Evolution 不能阻塞普通 Task 完成。

## managed Skill 与独立环境

| 工具 | 用途 | action |
| --- | --- | --- |
| `skill_manage` | 安装或移除 managed Skill 当前内容，并管理它的独立环境 | `install`、`remove`、`env_set`、`env_unset`、`env_list` |

AgentDock 不提供独立的 Skill 版本、激活或回滚生命周期。每个 managed Skill 名称只有一份当前内容；重复安装相同内容会按 `content_digest` no-op，同名但经过审查的新内容会原子替换当前内容。

典型流程：

```text
agentdock_context / workspace_context
→ select one exact Skill candidate
→ read_file <the candidate's returned file>
→ execute through real tools using the same returned skill_ref when needed
```

不要根据裸名称自行构造 `skill_ref` 或 `skill://` URI。同名的 managed、shared、workspace 候选仍是不同来源。`skill_manage env_list` 只返回变量名和配置状态，不回显秘密值。普通 `remove` 会保留 managed Skill 的环境和持久数据；`purge=true` 才会一并删除这些保留资源。

用户流程见 [使用 Skill](../concepts/skills.md)。

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

经 NexusDock 调用节点时，NexusDock 可以把节点本地下载位置替换为自己的临时签名地址。文件通过已配对节点现有的出站连接按受限分块流式传输；下载期间源节点必须在线，而且 NexusDock 不会额外持久化一份 Artifact。详见 [NexusDock](../concepts/nexusdock.md#从节点下载文件)。

浏览器截图等图片型工具通常先返回轻量 Artifact 引用，再通过 `view_image` 加载，避免在普通工具结果中传递大段 Base64。

## NexusDock Recall

直连 AgentDock 时，只有当前设备已经与 NexusDock 配对，才会暴露这些工具：

| 工具 | 用途 | 常用参数或 action |
| --- | --- | --- |
| `recall_search` | 搜索 Markdown 和经验卡片；配置 Embedding 后会透明加入语义召回 | `query`、`kind=all|markdown|card`、`max_results` |
| `recall_read` | 按路径读取一个 Recall 条目 | `path`、`include_raw` |
| `recall_write` | 计划、创建、替换、追加、patch、更新事实、diff 或删除 Recall 内容 | `target=card|markdown`、`action`、`confirmed` |
| `recall_maintain` | 列表、lint，并查看或重建 Embedding 索引 | `list`、`lint`、`embedding_status`、`reindex`、`reindex_cards` |

紧凑的启动索引现在已经并入 `agentdock_context`，不再有独立的 Recall bootstrap 工具。索引已经给出目标路径时优先 `recall_read`；尚不知道相关条目时再使用 `recall_search`。

`recall_write` 要求明确选择内容类型：

- `card`：原子、可复用的经验、偏好和决策。
- `markdown`：稳定项目文档、Runbook、学习记录和结构化长期事实。

确认要求取决于 action 和目标位置。破坏性操作或受保护位置写入需要 `confirmed=true`；契约支持时，未确认编辑会返回预览。详细边界见 [NexusDock Recall](../concepts/recalldock.md)。

## 私密笔记

直连 AgentDock 时，只有当前设备已经与 NexusDock 配对，才会暴露 `private_note_manage`：

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
