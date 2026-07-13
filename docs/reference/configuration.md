# 配置

AgentDock 当前不读取统一的 YAML、JSON 或 TOML 配置文件。运行配置通过环境变量提供，部分常用项还可以使用 CLI 参数覆盖。

推荐按部署方式管理配置：

- 本地前台运行：Shell 环境变量或 CLI 参数。
- Docker Compose：`environment` 或项目根目录的本地 `.env`。
- systemd：权限受限的 `EnvironmentFile`。
- Windows 登录自启动：安装脚本生成的当前用户配置和 DPAPI 保护数据。

不要把 Token、密码、Cookie、私钥或 OAuth Secret 提交到源码仓库。

## 配置优先级

AgentDock 启动时按以下顺序解析：

1. 内置默认值。
2. 环境变量。
3. CLI 参数。

CLI 只覆盖它明确提供的参数。认证秘密、OAuth 密码和 NexusDock Token 等配置只能通过环境变量提供。

AgentDock 的两个主要目录由运行它的操作系统用户决定：

```text
~/.agentdock   内部状态、Skill、任务、MCP 配置和 Artifact
~/AgentDock    文件、命令和 Git 工具的默认工作目录
```

当前 CLI 不提供修改这两个目录的公共参数。需要隔离数据时，应使用独立操作系统用户、容器 volume 或独立用户主目录。

## CLI 参数

| 参数 | 对应环境变量 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `--host` | `AGENTDOCK_HOST` | `127.0.0.1` | HTTP 监听地址 |
| `--port` | `AGENTDOCK_PORT` | `8765` | HTTP 监听端口，范围 `1`～`65535` |
| `--log-level` | `AGENTDOCK_LOG_LEVEL` | `info` | `debug`、`info`、`warn` 或 `error` |
| `--nexus-endpoint` | `AGENTDOCK_NEXUS_ENDPOINT` | 空 | NexusDock 服务根地址 |
| `--browser-enabled` | `AGENTDOCK_BROWSER_ENABLED` | `false` | 暴露浏览器自动化工具 |
| `--stdio` | `AGENTDOCK_STDIO` | `false` | 通过标准输入输出提供 JSON-RPC，不启动 HTTP 服务 |

示例：

```bash
agentdock \
  --host 127.0.0.1 \
  --port 8765 \
  --log-level info
```

## 基础运行配置

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `AGENTDOCK_HOST` | `127.0.0.1` | HTTP 监听地址。非回环地址必须启用 Bearer Token 或 OAuth |
| `AGENTDOCK_PORT` | `8765` | HTTP 监听端口 |
| `AGENTDOCK_LOG_LEVEL` | `info` | 日志级别 |
| `AGENTDOCK_STDIO` | `false` | 是否使用 stdio 模式 |
| `AGENTDOCK_BROWSER_ENABLED` | `false` | 是否暴露 `browser_*` 工具 |
| `AGENTDOCK_NEXUS_ENDPOINT` | 空 | NexusDock 服务根地址；配置后暴露 `recall_*` 工具并启用 Workflow 模板后端 |
| `AGENTDOCK_NEXUS_TOKEN` | 空 | NexusDock Bearer Token |

布尔值建议只使用 `true` 或 `false`，避免不同服务管理器对其他写法的处理差异。

## Bearer Token 认证

最简单的 HTTP 认证方式是设置：

```bash
export AGENTDOCK_AUTH_TOKEN="$(openssl rand -hex 32)"
```

客户端访问 `/mcp` 时发送：

```http
Authorization: Bearer <token>
```

只监听回环地址时允许不配置认证；一旦监听 `0.0.0.0`、局域网地址或公网地址，AgentDock 会拒绝在无认证状态下启动。

Docker Compose 示例：

```yaml
services:
  agentdock:
    environment:
      AGENTDOCK_AUTH_TOKEN: "${AGENTDOCK_AUTH_TOKEN:?set AGENTDOCK_AUTH_TOKEN}"
```

## OAuth 配置

OAuth 适合需要浏览器授权流程的 MCP 客户端。启用时必须同时配置以下变量：

| 环境变量 | 要求 | 说明 |
| --- | --- | --- |
| `AGENTDOCK_OAUTH_ENABLED` | `true` | 启用 OAuth |
| `AGENTDOCK_SERVER_URL` | 必填 | AgentDock 对客户端公开的 Origin，例如 `https://agentdock.example.com` |
| `AGENTDOCK_OAUTH_PASSWORD` | 至少 12 个字符 | 用户在授权页面输入的连接密码 |
| `AGENTDOCK_OAUTH_TOKEN_SECRET` | 至少 32 字节 | OAuth 状态和 Token 的签名密钥 |

示例：

```bash
AGENTDOCK_OAUTH_ENABLED=true
AGENTDOCK_SERVER_URL=https://agentdock.example.com
AGENTDOCK_OAUTH_PASSWORD=<long-login-password>
AGENTDOCK_OAUTH_TOKEN_SECRET=<random-secret-at-least-32-bytes>
```

`AGENTDOCK_SERVER_URL` 必须是没有路径、查询参数或 Fragment 的完整 Origin。非回环地址必须使用 HTTPS；仅 `localhost` 或回环 IP 可以使用 HTTP。

Bearer Token 和 OAuth 可以同时配置。只需要一种认证方式时，不要额外保留无用秘密。

## 可信反向代理

默认情况下，AgentDock 不信任客户端提供的 `X-Forwarded-For`。只有反向代理确实位于受控网段，并且会正确重写代理链时，才配置：

```bash
AGENTDOCK_TRUSTED_PROXY_CIDRS=127.0.0.0/8,::1/128
```

多个网段使用逗号分隔。不要把不受控制的公网网段加入该变量，否则认证限流和客户端地址判断可能被伪造。

## NexusDock Recall 与 Workflow

配置 NexusDock 后，AgentDock 会暴露 `recall_*` 工具，并让 `workflow_template_manage` 使用 NexusDock Workflow Registry：

```bash
AGENTDOCK_NEXUS_ENDPOINT=https://nexus.example.com
AGENTDOCK_NEXUS_TOKEN=<nexus-token>
```

`AGENTDOCK_NEXUS_ENDPOINT` 使用 NexusDock 服务根地址，不要附加具体 API 路径。未配置时：

- 本地 `task_manage` 仍可管理普通可恢复任务。
- `recall_*` 工具不会出现在 `tools/list`。
- Workflow 模板查询和变更不可用。

## 浏览器工具

浏览器自动化默认关闭。启用：

```bash
AGENTDOCK_BROWSER_ENABLED=true
```

或：

```bash
agentdock --browser-enabled
```

启用开关只负责暴露 `browser_session`、`browser_act` 和 `browser_snapshot`。运行环境还需要安装 browser runner 及其 Node.js、`playwright-core` 依赖；具体方式见 [浏览器自动化](../guides/browser-control.md)。

## Skill 与动态 MCP 的独立环境

Skill 和动态 MCP 的业务秘密不应长期放在 AgentDock 主进程环境中。优先使用各自的独立环境：

```json
{
  "action": "env_set",
  "skill": "example-skill",
  "key": "EXAMPLE_API_KEY",
  "value": "..."
}
```

```json
{
  "action": "env_set",
  "name": "example-mcp",
  "key": "SERVICE_TOKEN",
  "value": "..."
}
```

分别通过 `skill_package` 和 `mcp_manage` 调用。`env_list` 只返回变量名和是否已配置，不返回真实值。

## 私密笔记加密

`private_note_manage` 可以通过 age X25519 加密私密笔记。通常先让工具初始化本机身份和 Recipient：

```json
{
  "action": "maintain",
  "maintenance_action": "init-encryption"
}
```

需要使用外部 Recipient 时，可以配置：

| 环境变量 | 说明 |
| --- | --- |
| `AGENTDOCK_PRIVATE_NOTES_AGE_RECIPIENT` | 一个或多个 age X25519 Recipient，可使用换行、逗号或分号分隔 |
| `AGENTDOCK_PRIVATE_NOTES_AGE_RECIPIENTS_FILE` | 包含 Recipient 的文本文件路径 |

不要把 age Identity 私钥放进这两个变量或提交到仓库。

## 查看当前状态

调用 `server_info` 可以查看当前实例的公开运行状态，包括：

- AgentDock 版本、操作系统和架构。
- 默认目录和路径模型。
- 是否启用认证、浏览器和 NexusDock Recall。
- 当前实际暴露的工具列表。
- 可信代理网段和命令会话限制。

`server_info` 不返回认证 Token、OAuth 密码、签名密钥或 NexusDock Token。

## 启动前检查

配置错误会让 AgentDock 直接拒绝启动。常见检查包括：

- 端口是否位于 `1`～`65535`。
- 日志级别是否有效。
- 非回环监听是否已启用认证。
- OAuth 所需变量是否齐全、长度是否满足要求。
- 公网 `AGENTDOCK_SERVER_URL` 是否使用 HTTPS。
- `AGENTDOCK_TRUSTED_PROXY_CIDRS` 是否都是合法 CIDR。

部署完成后至少验证：

```bash
curl -fsS http://127.0.0.1:8765/healthz
```

再使用实际客户端完成一次 MCP `initialize` 和工具调用。安全边界与部署建议见 [安全模型](../operations/security.md)。
