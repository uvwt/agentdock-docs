---
sidebar_position: 1
slug: /intro
---

# AgentDock

AgentDock 把支持 MCP 的 AI 客户端连接到你的电脑和服务器，让它们可以操作文件、执行命令、使用 Git 和浏览器，并连接其他服务。

AgentDock 本身不是聊天应用，也不负责模型推理。连接的 AI 客户端决定要做什么，AgentDock 在运行它的设备上执行被允许的操作。可访问范围由系统用户权限、Docker 挂载目录和你启用的功能决定。

## 第一次使用

按当前环境选择安装方式：

| 当前环境 | 推荐入口 |
| --- | --- |
| macOS | [macOS 安装](./getting-started/macos.md) |
| Windows 11 | [Windows 安装](./getting-started/windows.md) |
| Linux 服务器或桌面 | [Linux 安装](./getting-started/linux.md) |
| 已经安装 Docker | [Docker 安装](./getting-started/docker.md) |

安装完成后，把页面给出的 MCP 地址和 Token 填入客户端，传输方式选择 **Streamable HTTP**。

## 可以让它做什么

直接向 Agent 提出任务，例如：

- “检查这个项目为什么启动失败，并修好后验证。”
- “读取这份仓库，修改代码并提交。”
- “打开网页完成查询，并把结果整理成文件。”
- “安装并使用一个 Skill、审查并安装一个 Plugin，或接入一个外部 MCP 服务。”
- “控制浏览器、桌面自动化，或调用 Codex、Claude、Grok 等编码工具。”
- “把长任务拆成步骤，并持续更新进度。”

Agent 会根据任务选择合适的工具。

如果主要想用网页版 ChatGPT 操控自己的电脑，安装时开启公网地址后，按 [使用 ChatGPT 连接](./guides/chatgpt.md) 继续即可。

## 数据保存在哪里

裸机安装默认使用：

```text
~/.agentdock   AgentDock 状态、任务、Skill 和配置
~/AgentDock    默认工作目录
```

Docker 默认把这两类数据保存在 Docker volume。删除程序或容器不一定会删除数据；清理前先确认需要保留的内容。

## 常用入口

- [在不同客户端中连接](./guides/mcp-clients.md)
- [使用 ChatGPT 连接](./guides/chatgpt.md)
- [使用 Skill](./concepts/skills.md)
- [使用 Plugin](./concepts/plugins.md)
- [任务与进度](./concepts/tasks.md)
- [浏览器自动化](./guides/browser-control.md)
- [使用本地 Coding Agent](./guides/coding-agents.md)
- [连接外部 MCP](./concepts/dynamic-mcp.md)
- [使用 NexusDock 管理多台 AgentDock](./concepts/nexusdock.md)
- [完整配置参考](./reference/configuration.md)
- [故障排查](./operations/troubleshooting.md)
