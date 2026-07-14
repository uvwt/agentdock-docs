# NexusDock Recall

NexusDock Recall 是 AgentDock 的可选长期知识服务。它用于保存稳定项目说明、经验、决策和问题记录，让后续任务能够找到可靠上下文。

没有 NexusDock 时，文件、命令、Git、Skill、动态 MCP 和本地任务仍可正常使用；Recall、Workflow 模板和私密笔记工具不可用。

## 什么时候适合使用

适合保存：

- 长期有效的项目结构和运行方式。
- 已验证的部署或排障经验。
- 需要跨会话复用的决策和偏好。
- 仍待解决的问题与学习记录。

不适合保存：

- Token、密码、Cookie、私钥或浏览器登录态。
- 一次性日志和临时执行状态。
- 未验证的猜测。
- 当前任务的实时进度。

## 接入

需要一个可访问的 NexusDock 地址和可选 Token。可以让 Agent 配置：

```text
为 AgentDock 接入 NexusDock Recall，地址是 https://nexus.example.com，Token 使用安全环境变量保存。
```

精确环境变量见 [配置参考](../reference/configuration.md#nexusdock-recallworkflow-与私密笔记)。

## 如何使用

可以直接说：

```text
开始前先查一下这个项目已有的部署记录。
把这次确认过的结论更新到项目长期文档，不要记录临时日志。
搜索以前关于 OAuth 的排障经验。
```

Agent 会先搜索已有内容，再决定读取、更新或创建，避免产生重复和冲突。

## 内容类型

- **Markdown**：稳定项目文档、Runbook 和结构化长期事实。
- **Card**：单一、可复用的经验、偏好或决策。
- **Note**：问题讨论、学习记录和尚未收敛的结论。

## 私密笔记与 Recall 的区别

私密笔记使用独立的 NexusDock Private Notes 存储，不属于 Recall 搜索范围：

- Recall 保存可复用的项目知识，不应包含 Token、密码、Cookie 或私钥。
- Private Notes 用于用户明确要求保存的敏感信息，并维护 age 加密备份。
- 私密笔记搜索只返回安全元数据；正文必须显式读取。
- `recall_*` 不能读取、修改或列出私密笔记，必须使用 `private_note_manage`。

## 与任务进度的区别

NexusDock Recall 保存长期知识；任务系统保存当前执行进度。任务状态不会因为接入 NexusDock 就自动跨设备继续。
