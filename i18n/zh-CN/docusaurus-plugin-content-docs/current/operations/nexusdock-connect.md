# 连接 AgentDock

NexusDock 启动后，在这里完成 AgentDock 设备配对和 MCP 客户端连接。

## 配对 AgentDock 设备

登录 Web 控制台，打开 **设置 → 系统与节点**，点击 **配对设备**。

NexusDock 会生成一次性配对码，并给出命令行示例：

```bash
agentdock nexus pair --endpoint https://nexus.example.com --code pair_xxx
```

如果使用 Windows 或 macOS 桌面版 AgentDock，可以直接在图形界面的 NexusDock 配对区域填写 **NexusDock 地址** 和 **一次性配对码**，然后点击 **配对并重启**，无需手动执行上面的命令。

Linux、服务器或其他命令行环境可以使用上面的命令完成配对。配对后 AgentDock 会连接 NexusDock，因此设备本身不需要开放公网入站端口。

配对不会改变节点原有的本地 MCP 地址或认证方式，每台 AgentDock 仍然可以独立使用。

## 连接 MCP 客户端

NexusDock 提供统一的 MCP 地址：

```text
https://your-nexus-domain/mcp
```

支持 OAuth 的客户端可以直接连接，并在浏览器中完成授权。

如果客户端需要固定 Token，打开 **设置 → MCP 接入**，使用页面中的 MCP Access Token。

两种凭据用途不同：

| 凭据 | 用途 |
| --- | --- |
| 管理员账号 / 密码 | 登录 Web 控制台 |
| MCP Access Token | 不使用 OAuth 时连接 `/mcp` |

不同客户端的具体接入方式见 [在不同客户端中连接](../guides/mcp-clients.md)。
