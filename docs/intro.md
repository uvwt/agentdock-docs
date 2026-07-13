---
sidebar_position: 1
slug: /intro
---

# AgentDock

AgentDock 是本地与远程 Agent 的工具运行层。它把文件、命令、Git、Skill、动态 MCP、浏览器自动化、可恢复任务和长期知识召回组织成明确、可审计的工具边界，让 Agent 能直接完成真实工作。

## 核心能力

- **文件与命令**：读取、搜索、结构化修改文件，执行有边界的命令并管理长时间会话。
- **Git 与 GitHub**：检查仓库状态、提交改动、拉取和推送代码。
- **Skill**：用文档描述工作方法和约束，真实动作仍由文件、命令、浏览器或 MCP 工具完成。
- **动态 MCP**：按需注册和调用外部 MCP 服务，不把远端工具混入 AgentDock 内置工具列表。
- **可恢复任务**：持久化多步骤任务、完成条件、阶段进度和验证证据。
- **NexusDock Recall**：可选接入长期 Markdown、经验卡片和笔记召回。
- **自动化能力**：可选浏览器自动化；macOS 登录会话中还可以通过 Skill 驱动桌面操作。

## 选择安装方式

| 场景 | 推荐入口 |
| --- | --- |
| 本机快速体验 | [Docker 部署](./getting-started/docker.md) |
| Linux 长期运行 | [Linux 自动安装](./getting-started/linux.md) |
| 手动配置 systemd 与反代 | [Linux 手动 systemd 部署](./getting-started/vps.md) |
| Windows 原生运行 | [Windows 原生安装](./getting-started/windows.md) |
| macOS 原生运行 | [macOS 安装](./getting-started/macos.md) |

## 路径模型

AgentDock 使用当前运行用户的 Host 路径：

- `~/.agentdock`：任务、Skill、动态 MCP、环境配置和运行产物等内部状态。
- `~/AgentDock`：文件、命令和 Git 工具的默认工作目录。

相对路径从 `~/AgentDock` 解析；绝对路径按运行 AgentDock 的操作系统用户真实解析。Docker 环境由 volume 控制可见范围，裸机环境由操作系统用户权限决定。

## 下一步

- [查看完整配置](./reference/configuration.md)
- [浏览内置工具](./reference/tools.md)
- [理解 Skill](./concepts/skills.md)
- [理解可恢复任务](./concepts/tasks.md)
- [接入动态 MCP](./concepts/dynamic-mcp.md)
- [配置 NexusDock Recall](./concepts/recalldock.md)
- [安全部署](./operations/security.md)

## 项目仓库

- [AgentDock 源码](https://github.com/uvwt/agentdock)
- [AgentDock 文档源码](https://github.com/uvwt/agentdock-docs)
