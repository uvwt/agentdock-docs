---
sidebar_position: 1
slug: /intro
---

# NexusDock 与 AgentDock

NexusDock 与 AgentDock 把支持 MCP 的 AI 客户端（如 ChatGPT、Claude、Cursor、VS Code）连接到你的真实电脑和服务器，让它们可以操作文件、执行命令、使用 Git 和浏览器、共享长期记忆并复用工作流。

- **AgentDock** 运行在每台需要 AI 协助的电脑或服务器上，在操作系统用户权限、Docker 挂载目录和你启用的能力边界内执行实际工作。
- **NexusDock**（`https://mcp.nexusdock.co` 或开源自托管版）把一台或多台 AgentDock 设备汇聚到统一控制中心，提供单一远程 MCP 入口、共享 Recall 记忆和可复用 Workflow 工作流，无需把每台设备直接暴露到公网。

NexusDock 和 AgentDock 本身都不是聊天应用，也不负责模型推理。连接的 AI 客户端决定要做什么，AgentDock 在目标设备上执行被允许的操作。

## 第一次使用

先连接一台设备，再接入你的 AI 客户端：

1. 按当前环境选择安装方式：

| 当前环境 | 推荐入口 |
| --- | --- |
| macOS | [macOS 安装](./getting-started/macos.md) |
| Windows 11 | [Windows 安装](./getting-started/windows.md) |
| Linux 服务器或桌面 | [Linux 安装](./getting-started/linux.md) |
| 已经安装 Docker | [Docker 安装](./getting-started/docker.md) |

2. 将设备配对到 [NexusDock](./concepts/nexusdock.md)（`https://mcp.nexusdock.co` 或自托管实例）即可获得远程和多设备能力，也可以直接通过本机或自建公网 **Streamable HTTP** MCP 连接。
3. 参考 [在不同客户端中连接](./guides/mcp-clients.md) 手动配置客户端，或使用 [让 AI 帮你连接 NexusDock](./guides/ai-connect.md) 让 AI 助手自动完成接入。

## 可以让它做什么

直接向 Agent 提出任务，例如：

- “检查这个项目为什么启动失败，并修好后验证。”
- “读取这份仓库，修改代码并提交。”
- “打开网页完成查询，并把结果整理成文件。”
- “安装并使用一个 Skill、审查并安装一个 Plugin，或接入一个外部 MCP 服务。”
- “控制浏览器、桌面自动化，或调用 Codex、Claude、Grok 等编码工具。”
- “把长任务拆成步骤，并持续更新进度。”

Agent 会根据任务选择合适的工具。

如果主要想用网页版 ChatGPT 操控自己的电脑，推荐先配对 [NexusDock](./concepts/nexusdock.md)（或启用自建公网地址），再按 [使用 ChatGPT 连接](./guides/chatgpt.md) 继续即可。

## 数据保存在哪里

裸机安装默认使用：

```text
~/.agentdock   AgentDock 状态、任务、Skill 和配置
~/AgentDock    默认工作目录
```

Docker 默认把这两类数据保存在 Docker volume。删除程序或容器不一定会删除数据；清理前先确认需要保留的内容。

## 常用入口

- [让 AI 帮你连接 NexusDock](./guides/ai-connect.md)
- [在不同客户端中连接](./guides/mcp-clients.md)
- [使用 ChatGPT 连接](./guides/chatgpt.md)
- [日常使用 NexusDock](./guides/using-nexusdock.md)
- [使用 Skill](./concepts/skills.md)
- [使用 Plugin](./concepts/plugins.md)
- [任务与进度](./concepts/tasks.md)
- [浏览器自动化](./guides/browser-control.md)
- [使用本地 Coding Agent](./guides/coding-agents.md)
- [连接外部 MCP](./concepts/dynamic-mcp.md)
- [使用 NexusDock 管理多台 AgentDock](./concepts/nexusdock.md)
- [NexusDock REST API](./reference/api.md)
- [完整配置参考](./reference/configuration.md)
- [故障排查](./operations/troubleshooting.md)
