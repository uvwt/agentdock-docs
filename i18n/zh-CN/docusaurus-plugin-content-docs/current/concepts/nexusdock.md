# 是什么

NexusDock 是面向 AgentDock 设备的统一控制中心与远程连接枢纽，同时提供托管的 **NexusDock Cloud**（`https://mcp.nexusdock.co`）以及开源自托管版 **NexusDock**。

它可以把 Mac、Windows、Linux 主机和服务器上的 AgentDock 集中到一个 Web 控制台中，共享 Recall 记忆和 Workflow 工作流数据，并为 AI 客户端提供统一的 MCP 入口，无需把每台机器直接暴露到公网。

即使只有一台设备，使用 NexusDock Cloud 也是远程接入 AgentDock 最简单的方式，无需自己配置 Cloudflare Tunnel 或域名；如果只在本机连接本地客户端，也可以继续直接使用独立 AgentDock。

## 可以做什么

- 一个 MCP 连接多台 AgentDock；
- 集中管理已配对的 AgentDock 设备、在线状态以及可选的设备用途描述（会透出到 `agentdock_context`，帮助 AI 选择正确的目标设备）；
- 统一查看各节点本地的任务、Skill、Plugin 与动态 MCP 状态；
- 在多台设备之间共享 Recall 记忆和 Workflow 工作流数据；
- 只配置一次 AI 客户端，而不是分别连接每台 AgentDock；
- 当客户端缓存的工具 Schema 落后于节点实时工具时，通过 `node_tool_search` 和 `node_tool_call` 兼容调用。

实际的文件、命令、浏览器等操作仍由每台 AgentDock 执行。NexusDock 负责把这些设备集中起来，而不是替代 AgentDock。

## 云端与自托管

| 部署方式 | 入口与控制台 | 适用场景 |
| --- | --- | --- |
| **NexusDock Cloud** | `https://mcp.nexusdock.co` | 最快获得远程连接、云端托管 Recall/Workflow 以及第三方 REST API 集成 |
| **自托管 NexusDock** | 自有 HTTPS 域名（`uvwt/nexusdock`） | 在自有基础设施上运行控制中心、SQLite 状态与本地 Recall 文件 |

## 第三方 REST API（NexusDock Cloud）

如果你需要在 MCP 客户端之外通过脚本、后端服务或自动化流程调用设备能力，NexusDock Cloud 提供了第三方 REST API（设备目录、能力目录与远程工具执行）。本文档站不重复手抄 OpenAPI 细节，请直接以在线 API 文档和官方 Skill 为准：

- 在线 REST API 文档：[https://mcp.nexusdock.co/docs/api](https://mcp.nexusdock.co/docs/api)
- 官方 REST 集成 Skill：[`nexusdock-rest`](https://github.com/uvwt/agentdock-skills/tree/main/skills/nexusdock-rest)
- API 概览与机器可读入口：[NexusDock REST API](../reference/api.md)

## 下一步

- [日常使用 NexusDock](../guides/using-nexusdock.md)
- [连接 AgentDock](../operations/nexusdock-connect.md)
- [自托管安装与维护](../operations/nexusdock.md)
- [Recall 记忆](./recalldock.md)
- [Workflow 工作流](./workflow.md)
