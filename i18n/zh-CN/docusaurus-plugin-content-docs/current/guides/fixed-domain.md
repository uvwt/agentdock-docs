# 配置固定域名

如果希望 AgentDock 在电脑或 Tunnel 重启后仍保持同一个公网 MCP 地址，可以使用固定域名。AgentDock 通过 Cloudflare Named Tunnel 提供固定公网入口，不需要在路由器开放端口，也不需要自己维护公网 HTTPS 反向代理。

典型连接方式如下：

```text
MCP 客户端 → https://agent.example.com/mcp → Cloudflare Tunnel → AgentDock
```

## 开始前准备

先准备好以下内容：

- AgentDock 已经安装完成，并且本机访问正常。
- 域名已经接入 Cloudflare。
- 可以登录 [Cloudflare Zero Trust 控制台](https://one.dash.cloudflare.com/)。
- 准备一个单独的子域名，例如 `agent.example.com`。

如果之前没有使用过 Cloudflare Tunnel，可以先查看 [Cloudflare Tunnel 官方文档](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/)。

## 1. 选择域名

建议使用单独的子域名，不要直接占用根域名。例如：

```text
agent.example.com
```

后续在 Cloudflare 创建 Public Hostname，以及在 AgentDock 中填写公网地址时，都使用这个域名。

## 2. 创建 Cloudflare Tunnel

打开 [Cloudflare Zero Trust 控制台](https://one.dash.cloudflare.com/)，创建一个 Cloudflare Tunnel，并选择 Cloudflared 作为 Connector。

Cloudflare 会显示一条包含 Tunnel Token 的 Connector 命令。AgentDock 需要的是其中的 **Tunnel Token 本身**，不是整条命令。这个 Token 需要妥善保管，不要公开。

如果已经有一个准备给 AgentDock 使用的 Named Tunnel，也可以直接复用，不必重复创建。

## 3. 添加 Public Hostname

在这个 Tunnel 中添加一个 Public Hostname：

```text
Hostname     agent.example.com
Service      HTTP
```

Service URL 根据 AgentDock 的安装方式填写：

| 安装方式 | Cloudflare Service URL |
| --- | --- |
| macOS、Windows 或原生 Linux | `http://127.0.0.1:8765` |
| Docker Compose | `http://agentdock:8765` |

Path 保持为空。这里不要填写 `/mcp`：Cloudflare 应该转发整个 AgentDock 服务，`/mcp` 只在最后给 MCP 客户端使用时追加。

Docker 用户也可以直接查看 [Docker Named Tunnel 配置](../operations/docker.md#named-tunnel)。

## 4. 配置 AgentDock

AgentDock 里的公网地址只填写 HTTPS Origin：

```text
https://agent.example.com
```

不要追加 `/mcp`，也不要填写端口、查询参数或其他路径。

### macOS 应用

打开 AgentDock，在 **公网访问** 中选择 **固定域名**，然后填写：

```text
公网地址       https://agent.example.com
Tunnel Token   <Cloudflare 提供的 Tunnel Token>
```

应用更改即可。AgentDock 会继续保持本机服务不直接暴露到公网，并通过 Named Tunnel 提供固定入口。

如果还没有安装后台服务，可以先查看 [macOS 安装](../getting-started/macos.md)。

### Linux 或 Windows 安装器

重新运行 AgentDock 安装器，并选择“已有接入 Cloudflare 的域名”。按照提示填写同一个 HTTPS 公网地址和 Tunnel Token。

具体命令可以查看 [Linux 安装](../getting-started/linux.md) 或 [Windows 安装](../getting-started/windows.md)。

### Docker Compose

先完成 Public Hostname 配置，再在 Docker 部署中填写固定公网地址和 Tunnel Token，并启动 Named Tunnel profile。

具体 Compose 配置和值请查看 [Docker Named Tunnel 配置](../operations/docker.md#named-tunnel)。

## 5. 验证固定域名

先访问公网健康检查地址：

```text
https://agent.example.com/healthz
```

AgentDock 正常时会返回成功响应，其中包含 `ok: true`。

然后在 MCP 客户端中填写：

```text
Transport      Streamable HTTP
URL            https://agent.example.com/mcp
Authentication Bearer Token or OAuth shown by AgentDock
```

Tunnel Token **不是** MCP 登录凭据。它只用于 Cloudflare 与 AgentDock 所在设备建立 Tunnel。MCP 客户端仍然使用 AgentDock 显示的 Bearer Token 或 OAuth 凭据。

## 地址对照

这三个地址用途不同：

| 位置 | 示例 | 用途 |
| --- | --- | --- |
| Cloudflare Service URL | `http://127.0.0.1:8765` | 原生安装时 Cloudflare 转发到的本机地址 |
| AgentDock 公网地址 | `https://agent.example.com` | AgentDock 与 OAuth 使用的固定 HTTPS Origin |
| MCP 客户端地址 | `https://agent.example.com/mcp` | 填入 ChatGPT 或其他 MCP 客户端的地址 |

Docker 部署只有第一项不同，需要使用 `http://agentdock:8765`。

## 常见问题

### 域名打不开

先确认 Cloudflare 中的 Tunnel 已连接，并且 Public Hostname 指向了正确的 Service URL。原生安装通常是 `http://127.0.0.1:8765`，Docker Compose 使用 `http://agentdock:8765`。

### Cloudflare 返回 502

说明 Tunnel 本身可以访问，但 Cloudflare 无法连接 AgentDock。确认 AgentDock 本机服务正在运行，并检查 Service URL 是否和安装方式一致。

### AgentDock 提示公网地址无效

这里只填写 HTTPS Origin，例如 `https://agent.example.com`。不要填写 `https://agent.example.com/mcp`。

### MCP 客户端要求认证

这是公网访问的正常行为。使用 AgentDock 显示的 Bearer Token 或 OAuth 凭据，不要把 Cloudflare Tunnel Token 填到 MCP 客户端中。

## 安全提醒

Tunnel Token、Bearer Token 和 OAuth 凭据都应当作为秘密信息保存，不要放进截图、Issue、聊天记录或 Git 仓库。

固定域名不会替代 AgentDock 自身认证。公网访问仍应保持 Bearer Token 或 OAuth 开启；准备把入口提供给其他人使用前，建议阅读 [安全模型](../operations/security.md)。
