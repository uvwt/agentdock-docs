---
sidebar_position: 1
slug: /intro
---

# AgentDock

AgentDock 是本地与远程 Agent 的工具运行层。它把文件、命令、Git、Skill、动态 MCP、浏览器自动化和长期召回能力统一成清晰、可审计的工具边界，让 Agent 能够直接完成真实工作，而不是只给出操作建议。

## 核心能力

- **文件与命令**：读取、搜索、结构化修改文件，执行有边界的命令并管理长时间会话。
- **Git 与 GitHub**：检查仓库状态、提交改动、拉取和推送代码。
- **原生 Skill**：Skill 负责描述流程和约束，真实动作仍由文件、命令、浏览器或 MCP 工具完成。
- **动态 MCP**：按需注册和调用外部 MCP 服务，不把远端工具混入 AgentDock 内置工具列表。
- **可恢复任务**：把多步骤任务、完成条件、阶段进度和验证证据持久化。
- **RecallDock**：在不同会话和设备之间召回经过治理的长期知识。
- **自动化能力**：可选浏览器自动化；macOS 裸机环境还可以通过 Skill 驱动真实桌面操作。

## 从这里开始

| 目标 | 文档 |
| --- | --- |
| 在本机快速体验 | [Docker 部署](./getting-started/docker.md) |
| 在 Linux 服务器安装 | [Linux 问答式安装](./getting-started/linux.md) |
| 在 Windows 原生运行 | [Windows 原生安装](./getting-started/windows.md) |
| 理解 Skill 模型 | [Skill 设计与运行模型](./concepts/skills.md) |
| 理解任务恢复机制 | [可恢复任务](./concepts/tasks.md) |
| 开始参与开发 | [开发与质量门禁](./contributing/development.md) |

## 路径模型

AgentDock 使用单一 Host 路径模型：

- `~/.agentdock`：内部状态目录。
- `~/.agentdock/skill-store`：已安装 Skill。
- `~/AgentDock`：默认工作目录。

相对路径从 `~/AgentDock` 解析；绝对路径和 `~/path` 按运行 AgentDock 的操作系统用户真实解析。Docker 环境由 volume 控制可见范围，裸机环境由当前操作系统用户权限决定。

## 项目仓库

- [AgentDock](https://github.com/uvwt/agentdock)
- [AgentDock Docs](https://github.com/uvwt/agentdock-docs)
