# 工具参考

AgentDock 通过 MCP 向 AI 客户端提供工具。具体连接能看到哪些工具取决于已经启用的能力，以客户端实际返回的 `tools/list` 为准。

## 上下文、文件与命令

| 工具 | 用途 |
| --- | --- |
| `agentdock_context` | 读取当前 AgentDock 运行和能力上下文 |
| `workspace_context` | 读取工作区规则和本地 Skill 索引 |
| `read_file` | 读取文本文件 |
| `list_dir` | 列出或查找文件与目录 |
| `search_text` | 在文件中搜索文本或正则表达式 |
| `file_edit` | 添加、替换、修改、移动或删除文本文件 |
| `exec_command` | 执行命令 |
| `session_observe` | 查看长时间运行的命令会话 |
| `session_act` | 向命令会话输入内容或终止会话 |

## Skill、Plugin 与外部 MCP

| 工具 | 用途 | 主要 action |
| --- | --- | --- |
| `skill_manage` | 管理已安装 Skill 和环境配置 | `install`、`remove`、`env_set`、`env_unset`、`env_list` |
| `plugin_manage` | 检查和管理 Plugin | `inspect`、`validate`、`install`、`update`、`enable`、`disable`、`remove` |
| `mcp_manage` | 管理外部 MCP 连接 | `list`、`inspect`、`add`、`enable`、`disable`、`refresh`、`authorize`、`auth_clear`、`remove`、环境配置 |
| `mcp_tool_search` | 查找外部 MCP 提供的工具 | 搜索 |
| `mcp_tool_inspect` | 查看一个外部工具的 Schema | 检查 |
| `mcp_tool_call` | 调用已经检查过的外部 MCP 工具 | 调用 |

使用方式见 [使用 Skill](../concepts/skills.md)、[使用 Plugin](../concepts/plugins.md) 和 [使用外部MCP](../concepts/dynamic-mcp.md)。

## 任务、Workflow 与记忆

| 工具 | 可用条件 | 用途 |
| --- | --- | --- |
| `task_create` | 始终可用 | 创建可恢复任务（开启聊天卡片时挂载实时任务卡片） |
| `task_manage` | 始终可用 | 列出、查看、推进 checkpoint、阻塞、恢复、终审和完成任务 |
| `workflow_template_manage` | 已配对 NexusDock | 查找和管理可复用 Workflow |
| `recall_search` | 已配对 NexusDock | 搜索 Recall 记忆 |
| `recall_read` | 已配对 NexusDock | 读取 Recall 内容 |
| `recall_write` | 已配对 NexusDock | 创建或更新 Recall 内容 |
| `recall_maintain` | 已配对 NexusDock | 检查和维护 Recall 内容与索引 |

使用方式见 [任务与进度](../concepts/tasks.md)、[Recall 记忆](../concepts/recalldock.md) 和 [Workflow 工作流](../concepts/workflow.md)。

## Coding Agent

启用 Coding Agent 后会提供：

| 工具 | 用途 |
| --- | --- |
| `acp_session` | 查看、创建、列出、打开、更新、关闭和删除 Coding Agent 会话 |
| `acp_prompt` | 发起 prompt、读取事件和取消运行 |
| `acp_interaction` | 查看并处理等待确认的权限交互 |

配置多个 Coding Agent Profile 时，这些工具支持可选 `profile_id` 参数；省略时使用默认 Profile。

使用方式见 [使用本地 Coding Agent](../guides/coding-agents.md)。

## 浏览器、图片与文件分享

启用浏览器能力后会提供浏览器工具。

| 工具 | 用途 |
| --- | --- |
| `browser_session` | 启动和关闭浏览器会话 |
| `browser_act` | 打开页面、点击、输入、滚动和等待 |
| `browser_snapshot` | 读取页面状态和截图 |
| `view_image` | 从文件、已发布文件或 URL 加载图片 |
| `file_publish` | 发布文件或目录；有可访问地址时生成临时分享链接 |

浏览器使用见 [使用浏览器](../guides/browser-control.md)，启用方式见 [配置参考](./configuration.md)。

## NexusDock 多设备兼容工具

通过 NexusDock 统一 `/mcp` 入口接入时，设备工具会接收来自 `agentdock_context` 的 `node_id` 参数。如果客户端缓存的工具目录落后于节点当前真实 Schema，NexusDock 还提供两个兼容入口：

| 工具 | 用途 |
| --- | --- |
| `node_tool_search` | 查询节点当前实时工具目录与完整 Schema |
| `node_tool_call` | 按实时 Schema 调用指定节点工具 |

客户端目录已包含目标工具时应优先直接调用一级工具。详见 [什么是 NexusDock](../concepts/nexusdock.md)。
