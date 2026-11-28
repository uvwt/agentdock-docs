# 连接 AgentDock

你可以将 AgentDock 设备配对到 **NexusDock Cloud**（`https://mcp.nexusdock.co`）或自托管 NexusDock 实例，然后通过统一的 MCP 地址接入 AI 客户端。

## 配对 AgentDock 设备

1. 登录 NexusDock Web 控制台：
   - **NexusDock Cloud**：打开 `https://mcp.nexusdock.co`，进入 **设备** 页面创建一次性配对码（6 位数字、5 分钟有效、单次使用）。
   - **自托管 NexusDock**：打开 **设置 → 系统与节点**，点击 **配对设备** 生成短期一次性配对码。
2. 在 AgentDock 设备上完成配对：

如果使用 Windows 或 macOS 桌面版 AgentDock，可以直接在图形界面的 NexusDock 配对区域填写 **NexusDock 地址**（如 `https://mcp.nexusdock.co` 或自托管地址）和 **一次性配对码**，完成配对并重启，无需手动执行命令。

Linux、服务器或其他命令行环境可执行控制台给出的配对命令：

```bash
sudo agentdock nexus pair --endpoint https://mcp.nexusdock.co --code <pairing-code>
```

自托管部署请把 `https://mcp.nexusdock.co` 替换为你自己的 NexusDock HTTPS 地址。在标准 Linux 服务安装中，执行 `sudo agentdock nexus pair` 会自动解析服务对应的 `AGENTDOCK_HOME`，并在保存设备身份后自动重启 systemd/OpenRC 服务（如需暂不重启可附加 `--no-restart`）。

配对后 AgentDock 会在本地保存 Device Token 并主动向外连接 NexusDock，因此设备本身不需要开放公网入站端口。你也可以在 NexusDock 控制台为每台设备填写可选的 **设备用途描述**，该描述会透出到 `agentdock_context`，方便 AI 识别应该操作哪台机器。

配对不会改变节点原有的本地 MCP 地址或认证方式，每台 AgentDock 仍然可以独立使用。

## 连接 MCP 客户端

NexusDock 提供统一的 MCP 地址：

```text
https://mcp.nexusdock.co/mcp
```

自托管部署请改用 `https://your-nexus-domain/mcp`。

支持 OAuth 的客户端可以直接连接并在浏览器中完成授权（NexusDock Cloud 也支持面向无头客户端的 OAuth Device Flow）。

如果客户端需要固定 Token，可在控制台的 **设置** 页面生成或复制 **MCP Access Token / PAT**。

两种凭据用途不同：

| 凭据 | 用途 |
| --- | --- |
| 控制台账号登录凭据 | 登录 NexusDock Web 控制台 |
| MCP Access Token / PAT | 在不使用交互式 OAuth 时接入 `/mcp` 或 REST API |

## 第三方 REST API 集成

如果需要在非 MCP 应用或脚本中查询 NexusDock Cloud 设备、浏览能力目录或发起远程工具执行，请直接使用在线 REST API 文档和官方 Skill：

- 在线 REST API 文档：[https://mcp.nexusdock.co/docs/api](https://mcp.nexusdock.co/docs/api)
- 官方 Skill：[`nexusdock-rest`](https://github.com/uvwt/agentdock-skills/tree/main/skills/nexusdock-rest)

不同客户端的具体接入方式见 [在不同客户端中连接](../guides/mcp-clients.md)。
