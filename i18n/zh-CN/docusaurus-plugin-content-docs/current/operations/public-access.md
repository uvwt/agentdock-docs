# 公网访问

AgentDock 保持本机使用最安全。只有远程 MCP 客户端需要连接时才开启公网访问。

| 模式 | 适合场景 | 地址 |
| --- | --- | --- |
| 仅本机 | 同一设备上的客户端 | `http://127.0.0.1:8765/mcp` |
| 临时公网地址 | 测试 | 自动生成的 `trycloudflare.com` 地址 |
| 固定域名 | 长期远程使用和 OAuth | 自己的 HTTPS 域名 |

## 临时公网地址

macOS 和 Windows 客户端可以直接在 **公网访问** 中启用临时地址。Linux 安装器可以选择临时 Tunnel。Docker 可以启动 Quick Tunnel profile：

```bash
docker compose --profile cloudflare-quick up -d
docker compose logs -f cloudflared-quick
```

临时地址在 Tunnel 重启后可能变化，变化后需要更新 MCP 客户端里的地址。

## 固定域名

固定域名使用 Cloudflare Named Tunnel。需要先准备：

- 一个由 Cloudflare 管理的域名；
- 本机已经可以正常使用 AgentDock；
- 可以进入 Cloudflare Zero Trust 控制台。

### 1. 创建 Tunnel

创建 Cloudflare Tunnel，并选择 **Cloudflared** 连接器。保存生成的 Tunnel Token，不要公开。

添加一个公网主机名，例如 `agent.example.com`，Service URL 填写：

| 安装方式 | Cloudflare Service URL |
| --- | --- |
| macOS、Windows、原生 Linux | `http://127.0.0.1:8765` |
| Docker Compose | `http://agentdock:8765` |

Cloudflare 的 Path 留空。`/mcp` 由 MCP 客户端添加，不写进 Tunnel 路由。

### 2. 配置 AgentDock

AgentDock 中填写的公网地址只使用 HTTPS Origin：

```text
https://agent.example.com
```

不要追加 `/mcp`。

macOS 或 Windows 打开 **公网访问 → 固定域名**，填写 HTTPS 公网地址和 Tunnel Token。

Linux 可以重新运行安装器，选择已有 Cloudflare 域名的选项。

Docker 在 `.env` 中加入：

```dotenv
AGENTDOCK_SERVER_URL=https://agent.example.com
TUNNEL_TOKEN=<cloudflare-tunnel-token>
```

然后启动 Named Tunnel profile：

```bash
docker compose --profile cloudflare-named up -d
```

## 验证

先检查公网健康地址：

```text
https://agent.example.com/healthz
```

然后在 MCP 客户端中使用：

```text
https://agent.example.com/mcp
```

MCP 认证继续使用 AgentDock 的 Bearer Token 或 OAuth。Cloudflare Tunnel Token 只用于 Tunnel，不能拿来登录 MCP。

连接失败见 [故障排查](./troubleshooting.md)，认证设置见 [配置参考](../reference/configuration.md)。
