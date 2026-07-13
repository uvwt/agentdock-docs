# NexusDock Recall

NexusDock Recall 是可选的长期知识存储，用于保存稳定项目文档、经验卡片和问题笔记，并提供搜索、读取、写入、Git 同步和向量召回能力。

AgentDock 本身不要求 NexusDock；未配置时，文件、命令、Git、Skill、动态 MCP 和本地任务仍可正常使用。

## 配置

在 AgentDock 进程环境中设置：

```text
AGENTDOCK_NEXUS_ENDPOINT=https://nexus.example.com
AGENTDOCK_NEXUS_TOKEN=<secret>
```

端口和部署拓扑由 NexusDock 实例决定，AgentDock 不依赖固定本机端口。

## 工具

```text
recall_bootstrap  加载高优先级上下文和索引
recall_search     搜索 Markdown、经验卡片或笔记
recall_read       按路径读取单个条目
recall_write      创建、修改或删除长期内容
recall_maintain   查看同步与索引状态并执行维护
```

重要任务通常先使用 `recall_bootstrap` 获取紧凑上下文；需要具体正文时再搜索和读取，避免一次加载大量无关内容。

## 内容类型

- **Markdown**：稳定项目文档、Runbook、总览和结构化长期事实。
- **Card**：单一、可复用的经验、偏好、决策或踩坑记录。
- **Note**：问题讨论、学习记录、尚未完全收敛的结论。

选择内容类型时优先考虑未来如何检索和维护，不要把一次性日志或执行状态当成长久知识。

## 安全写入

- 不保存 Token、密码、Cookie、Session、私钥或 OAuth Code。
- 不保存临时日志、一次性状态和未经验证的猜测。
- 写入前先搜索已有内容，优先更新权威条目，避免重复和冲突。
- 删除和覆盖操作应先预览，并明确确认。
- 设备私有环境文件、浏览器登录态和执行中任务不跨设备同步。

## 与可恢复任务的区别

NexusDock Recall 保存长期可复用知识；`task_manage` 保存当前 AgentDock 实例上的执行进度。任务状态不应写入 Recall，也不会因为配置了 NexusDock 就自动跨设备接续。
