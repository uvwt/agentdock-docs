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

### 断线后重读命令输出

当当前运行端的 `session_observe` Schema 包含 `action=read` 时，可以使用客户端
独立保存的字节偏移读取输出。旧版只提供 `list` 和 `status`，调用前先检查
`tools/list`。

通过 `exec_command` 的 `execution_mode=async` 启动命令，再读取返回的会话：

```json
{
  "action": "read",
  "session_id": "session-...",
  "stdout_offset": 0,
  "stderr_offset": 0,
  "max_output_bytes": 65536
}
```

收到一页后，把结果中的 `stdout_next_offset` 和 `stderr_next_offset` 作为下次
请求的偏移；响应丢失时重试原偏移。每条输出流分别受分页上限约束；`read` 要求
`max_output_bytes` 至少为 4，并保持 UTF-8 字符分页边界。命令退出后继续读取，
直到 `stdout_truncated` 和 `stderr_truncated` 都为 `false`。

`*_missed_bytes` 表示请求位置之前的输出已被淘汰，或偏移落在 UTF-8 字符中间而
跳过了部分字节。偏移按 JSON 编码前的原始进程输出字节计算。首次读取默认从零
开始，可能包含 `exec_command` 已返回的输出。

`read` 不推进旧的观察游标，也不删除已完成会话。每条输出流仍只保留最多 4 MiB；
已完成会话在一小时后或触及既有会话数量上限时可能被淘汰。会话只存在于内存，
AgentDock 重启后不保留。既有 `status` 和写入、停止等动作仍可能消费输出或删除
会话；需要支持重试时，应持续使用 `read` 观察。

## Skill、Plugin 与外部 MCP

| 工具 | 用途 | 主要 action |
| --- | --- | --- |
| `skill_manage` | 管理已安装 Skill 和环境配置 | `install`、`remove`、`env_set`、`env_unset`、`env_list` |
| `plugin_manage` | 检查和管理 Plugin | `inspect`、`validate`、`install`、`update`、`enable`、`disable`、`remove` |
| `mcp_manage` | 管理外部 MCP 连接 | `list`、`inspect`、`add`、`enable`、`disable`、`refresh`、`authorize`、`remove`、环境配置 |
| `mcp_tool_search` | 查找外部 MCP 提供的工具 | 搜索 |
| `mcp_tool_inspect` | 查看一个外部工具的 Schema | 检查 |
| `mcp_tool_call` | 调用已经检查过的外部 MCP 工具 | 调用 |

使用方式见 [使用 Skill](../concepts/skills.md)、[使用 Plugin](../concepts/plugins.md) 和 [使用外部MCP](../concepts/dynamic-mcp.md)。

## 任务、Workflow 与记忆

| 工具 | 可用条件 | 用途 |
| --- | --- | --- |
| `task_manage` | 始终可用 | 记录多步骤任务状态和进度 |
| `workflow_template_manage` | 已配对 NexusDock | 查找和管理可复用 Workflow |
| `recall_search` | 已配对 NexusDock | 搜索 Recall 记忆 |
| `recall_read` | 已配对 NexusDock | 读取 Recall 内容 |
| `recall_write` | 已配对 NexusDock | 创建或更新 Recall 内容 |
| `recall_maintain` | 已配对 NexusDock | 检查和维护 Recall 内容与索引 |
| `evolve` | 已配对 NexusDock | 管理可复用知识 |
| `private_note_manage` | 已配对 NexusDock | 访问私密笔记 |

使用方式见 [任务与进度](../concepts/tasks.md)、[Recall 记忆](../concepts/recalldock.md) 和 [Workflow 工作流](../concepts/workflow.md)。

## Coding Agent

启用 Coding Agent 后会提供：

| 工具 | 用途 |
| --- | --- |
| `acp_session` | 创建、打开、查看、更新和关闭 Coding Agent 会话 |
| `acp_prompt` | 发起 prompt、读取事件和取消运行 |
| `acp_interaction` | 查看并处理等待确认的权限交互 |

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
