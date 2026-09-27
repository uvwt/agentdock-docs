# Recall 记忆

NexusDock Recall 是 AgentDock 的可选长期记忆服务。它可以保存值得长期保留的信息、偏好、经验和知识，让以后处理类似事情时能够继续使用这些上下文。

没有 NexusDock 时，文件、命令、命令行 Git、Skill、动态 MCP 和本地任务仍可正常使用；Recall、Workflow 模板、知识 Evolution 和私密笔记工具不可用。多设备管理和统一 MCP 入口见 [NexusDock](./nexusdock.md)。

## 什么时候适合使用

适合保存：

- 个人偏好、常用习惯和长期目标。
- 学习笔记、阅读结论和持续积累的知识。
- 旅行、购物、兴趣爱好等以后还会参考的信息。
- 工作或个人项目中的背景、决策和经验。
- 已验证的开发、部署或排障经验。

不适合保存：

- Token、密码、Cookie、私钥或浏览器登录态。
- 一次性日志和临时执行状态。
- 未验证的猜测。
- 当前任务的实时进度。

## 接入

先把 AgentDock 设备与 NexusDock 配对。在 NexusDock 打开 **设置 → System & Nodes**，生成一次性配对码，然后在目标设备执行页面生成的 `agentdock nexus pair ...` 命令并重启 AgentDock。

完成配对后，Recall 不需要再给 AgentDock 单独配置 URL 或 Token。完整步骤见 [连接 AgentDock](../operations/nexusdock-connect.md)。

## 如何使用

可以直接说：

```text
记住我旅行时更喜欢住在公共交通方便的地方。
把这次学习整理出的重点保存下来，下次继续复习。
查一下我之前总结过的相机选购标准。
把这个项目刚确认的长期结论保存下来。
```

AgentDock 会利用已有 Recall 内容帮助后续任务继续使用这些信息。配置 Embedding 后，还可以通过语义搜索找到表达不同但含义相关的内容。

## 内容类型

- **Markdown**：长期资料、学习记录、项目文档和结构化知识。
- **Card**：单一、可复用的经验、偏好、事实或决策。

Private Notes 是独立存储，不是 Recall 的一种内容类型。

## 私密笔记与 Recall 的区别

私密笔记使用独立的 NexusDock Private Notes 存储，不属于 Recall 搜索范围：

- Recall 保存可复用的项目知识，不应包含 Token、密码、Cookie 或私钥。
- Private Notes 用于用户明确要求保存的敏感信息，并维护 age 加密备份。
- 私密笔记搜索只返回安全元数据；正文必须显式读取。
- `recall_*` 不能读取、修改或列出私密笔记，必须使用 `private_note_manage`。

## 与任务进度的区别

NexusDock Recall 保存长期知识；任务系统保存当前执行进度。任务状态不会因为接入 NexusDock 就自动跨设备继续。
