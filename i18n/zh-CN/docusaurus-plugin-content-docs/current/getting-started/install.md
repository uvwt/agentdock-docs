# 安装 AgentDock

按当前系统选择官方安装包。

| 你正在使用的环境 | 推荐方式 |
| --- | --- |
| Windows 11 | [Windows 图形安装](./windows.md) |
| macOS 13 或更高版本 | [macOS 图形安装](./macos.md) |
| Linux 服务器或桌面 | [Linux 自动安装](./linux.md) |
| 已经安装 Docker | [Docker 安装](./docker.md) |

在自己的 Windows 或 Mac 上使用时，优先选择图形安装。只有已经在使用 Docker，或确实需要容器隔离时，才建议选择 Docker。

## 安装时要做的选择

安装完成后，按你的使用场景选择 AI 客户端的连接方式：

| 连接方式 | 适合场景 | 需要准备 |
| --- | --- | --- |
| **NexusDock（推荐远程方式）** | ChatGPT、Claude、手机或多设备远程连接，无需折腾隧道或域名 | NexusDock Cloud（`https://mcp.nexusdock.co`）或自托管 NexusDock 一次性配对码 |
| 仅本机 | MCP 客户端和 AgentDock 在同一台电脑上 | 无 |
| 自建 Cloudflare Tunnel（可选） | 需要让单台 AgentDock 直接暴露公网 HTTPS 地址 | 在设置中按需安装可选 `cloudflared` 组件（支持临时地址或固定 Cloudflare 域名） |

桌面端首次安装只安装 AgentDock 本身并默认启用本机服务。远程连接（配对 NexusDock，或按需安装 `cloudflared` 组件启用直连公网地址）均在安装完成后的控制面板中配置。

:::warning
公网地址必须配合 Bearer Token 或 OAuth 使用。不要把连接凭据或配对码放进截图、Issue 或公开聊天。
:::

## 安装完成后

如果使用 **NexusDock**（远程客户端和网页版 ChatGPT 推荐），先登录 `https://mcp.nexusdock.co`（或你的自托管 NexusDock），在 **设备** 中创建 6 位一次性配对码（有效期 5 分钟），在 AgentDock 控制面板（或通过 `agentdock nexus pair`）填入完成配对，确认设备显示为 **在线** 后，再把客户端连接到 `https://mcp.nexusdock.co/mcp`（或你的自托管 NexusDock 地址）。详见 [连接 AgentDock](../operations/nexusdock-connect.md)。

如果直连本机或自建公网 MCP 地址，从控制面板或终端取得：

```text
MCP 地址
Bearer Token 或 OAuth 登录信息
```

把这些信息填入客户端的 MCP、Tools 或 Connectors 设置，并选择 **Streamable HTTP**。

- 客户端和 AgentDock 在同一台设备上：使用本地 MCP 地址。
- 客户端在其他设备或云端：推荐使用 NexusDock，或启用 Cloudflare Tunnel 后使用公网 MCP 地址。
- 临时公网地址变化后：在客户端中替换旧地址，并按提示重新授权 OAuth。

:::tip
第一次使用只需要完成对应系统页面中的编号步骤。自定义端口、自动化参数和手动服务管理都可以以后再看。
:::

设备上线后的下一步：

- [让 AI 帮你连接 NexusDock](../guides/ai-connect.md)（兼容 AI 助手推荐）
- [在不同客户端中连接](../guides/mcp-clients.md)
- [使用 ChatGPT 连接](../guides/chatgpt.md)
- [日常使用 NexusDock](../guides/using-nexusdock.md)
