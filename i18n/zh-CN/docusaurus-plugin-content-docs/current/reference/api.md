# NexusDock REST API

NexusDock Cloud 提供面向开发者的 REST API，方便脚本、后端服务、CI/CD 流水线和第三方自动化程序在 MCP 客户端之外查询设备、发现能力并触发远程工具执行。

:::tip[交互式接口文档]
所有接口路径、参数、请求体与响应 Schema 均以在线交互式文档为准：

**[打开 NexusDock REST API 交互式文档 →](https://mcp.nexusdock.co/docs/api)**
:::

## 概览

连接 ChatGPT、Claude、Cursor 等 AI 客户端时，请使用 Streamable HTTP MCP 入口（`https://mcp.nexusdock.co/mcp`）。当你需要通过代码、Webhook 或自动化任务集成设备能力时，可使用 NexusDock Cloud REST API 完成：

- 查询已配对设备列表、在线状态与能力信息；
- 获取目标设备上可用的工具目录与参数定义；
- 以编程方式触发远程工具执行并获取返回结果。

本文档中心不重复手抄完整 OpenAPI 定义，以确保在线接口文档始终作为唯一事实来源。

## 认证方式

NexusDock Cloud REST API 全部通过 HTTPS 访问，并使用受限作用域的令牌认证：

- **OAuth Device Flow**：推荐用于交互式 CLI、本地工具和第三方集成，用户在浏览器中完成登录授权，无需粘贴账号密码。
- **Bearer Token**：在 HTTP 请求头 `Authorization` 中携带令牌：

```text
Authorization: Bearer <your-access-token>
```

:::warning[妥善保管 API 令牌]
不要将 Bearer Token 提交到代码仓库，也不要贴进日志、截图、Issue 或 Recall 记忆中。如怀疑令牌泄露，请立即在 NexusDock Cloud 中撤销或轮换。
:::

## 机器可读文档入口

如需生成 SDK、编写自动化校验，或让 AI 编程助手快速对接 NexusDock Cloud，可直接读取以下官方入口：

| 资源 | 地址 |
| --- | --- |
| 交互式 REST API 文档 | [https://mcp.nexusdock.co/docs/api](https://mcp.nexusdock.co/docs/api) |
| OpenAPI 规范（JSON） | [https://mcp.nexusdock.co/docs/openapi.json](https://mcp.nexusdock.co/docs/openapi.json) |
| 开发者集成文档（Markdown） | [https://mcp.nexusdock.co/docs/integrations.md](https://mcp.nexusdock.co/docs/integrations.md) |
| 官方 REST 集成 Skill | [`nexusdock-rest`](https://github.com/uvwt/agentdock-skills/tree/main/skills/nexusdock-rest) |

## 相关文档

- [NexusDock 是什么](../concepts/nexusdock.md)
- [在不同客户端中连接](../guides/mcp-clients.md)
- [内置工具目录](./tools.md)
- [完整配置参考](./configuration.md)
