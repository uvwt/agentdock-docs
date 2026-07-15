# 配置

AgentDock 当前不读取统一的 YAML、JSON 或 TOML 配置文件。运行配置通过环境变量提供，部分常用项还可以使用 CLI 参数覆盖。

:::tip
**大多数用户不需要从本页开始。** 按 Docker、Linux、Windows 或 macOS 安装指南启动后，只需使用指南给出的 MCP 地址和 Token。遇到端口冲突、远程访问、浏览器、NexusDock 或高级部署需求时，再查对应配置。
:::

## 普通用户通常只需要这些配置

| 场景 | 需要处理的内容 |
| --- | --- |
| 本机前台运行 | 通常保持 `127.0.0.1` 和默认端口即可 |
| Docker | `.env` 中的 `AGENTDOCK_AUTH_TOKEN`，其余使用 Compose 默认值 |
| 浏览器自动化 | 启用浏览器工具，并准备 Chrome、Edge 或 browser 镜像 |
| NexusDock（Recall、Workflow、私密笔记） | 配置服务地址和可选 Token |
| 局域网或公网访问 | 认证、HTTPS 和反向代理，不能只修改监听地址 |

推荐按部署方式管理配置：

- 本地前台运行：Shell 环境变量或 CLI 参数。
- Docker Compose：`environment` 或项目根目录的本地 `.env`。
- systemd：权限受限的 `EnvironmentFile`。
- Windows 登录自启动：安装脚本生成的当前用户配置和 DPAPI 保护数据。

不要把 Token、密码、Cookie、私钥或 OAuth Secret 提交到源码仓库。

## 配置方式与优先级

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
| `AGENTDOCK_BROWSER_RUNNER_DIR` | `~/.agentdock/browser-runner` | browser runner 目录；Docker browser 镜像自动指向镜像内只读目录 |
| `AGENTDOCK_NEXUS_ENDPOINT` | 空 | NexusDock 服务根地址；配置后暴露 Recall、Workflow 和私密笔记能力 |
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

OAuth 适合 ChatGPT 等需要浏览器授权流程的远程 MCP 客户端。AgentDock 支持 Authorization Code、PKCE S256、动态客户端注册和 Refresh Token；兼容客户端可以通过服务端元数据自动完成注册，不需要管理员预先创建 Client ID 或 Client Secret。

启用时必须同时配置以下变量：

| 环境变量 | 要求 | 说明 |
| --- | --- | --- |
| `AGENTDOCK_OAUTH_ENABLED` | `true` | 启用 OAuth |
| `AGENTDOCK_SERVER_URL` | 必填 | AgentDock 对客户端公开的 Origin，例如 `https://agentdock.example.com` |
| `AGENTDOCK_OAUTH_PASSWORD` | 至少 12 个字符 | 用户在授权页面输入的连接密码 |
| `AGENTDOCK_OAUTH_TOKEN_SECRET` | 至少 32 字节 | OAuth 状态和 Token 的签名密钥；应稳定保存，不要在每次重启时重新生成 |

示例：

```bash
AGENTDOCK_OAUTH_ENABLED=true
AGENTDOCK_SERVER_URL=https://agentdock.example.com
AGENTDOCK_OAUTH_PASSWORD=<long-login-password>
AGENTDOCK_OAUTH_TOKEN_SECRET=<random-secret-at-least-32-bytes>
```

可使用 OpenSSL 生成随机值：

```bash
openssl rand -base64 24
openssl rand -hex 32
```

`AGENTDOCK_SERVER_URL` 必须是没有路径、查询参数或 Fragment 的完整 Origin。非回环地址必须使用 HTTPS；仅 `localhost` 或回环 IP 可以使用 HTTP。客户端实际填写的 MCP 地址则需要附加 `/mcp`，例如 `https://agentdock.example.com/mcp`。

启用后会公开以下 OAuth 入口：

| 路径 | 用途 |
| --- | --- |
| `/.well-known/oauth-authorization-server` | OAuth Authorization Server 元数据 |
| `/.well-known/oauth-protected-resource/mcp` | MCP Protected Resource 元数据 |
| `/register` | 动态客户端注册 |
| `/oauth/authorize` | 浏览器授权页 |
| `/oauth/token` | Authorization Code 和 Refresh Token 兑换 |

Bearer Token 和 OAuth 可以同时配置。只需要一种认证方式时，不要额外保留无用秘密。面向 ChatGPT 的完整连接流程见 [使用 ChatGPT 连接 AgentDock](../guides/chatgpt.md)。

## 可信反向代理

默认情况下，AgentDock 不信任客户端提供的 `X-Forwarded-For`。只有反向代理确实位于受控网段，并且会正确重写代理链时，才配置：

```bash
AGENTDOCK_TRUSTED_PROXY_CIDRS=127.0.0.0/8,::1/128
```

多个网段使用逗号分隔。不要把不受控制的公网网段加入该变量，否则认证限流和客户端地址判断可能被伪造。

## NexusDock Recall、Workflow 与私密笔记

配置 NexusDock 后，AgentDock 会暴露 `recall_*`、`workflow_template_manage` 和 `private_note_manage`。Recall 与 Workflow 使用 NexusDock Registry，私密笔记使用 NexusDock Private Notes：

```bash
AGENTDOCK_NEXUS_ENDPOINT=https://nexus.example.com
AGENTDOCK_NEXUS_TOKEN=<nexus-token>
```

`AGENTDOCK_NEXUS_ENDPOINT` 使用 NexusDock 服务根地址，不要附加具体 API 路径。未配置时：

- 本地 `task_manage` 仍可管理普通可恢复任务。
- `recall_*`、`workflow_template_manage` 和 `private_note_manage` 不会出现在 `tools/list`。

## 浏览器工具

浏览器自动化默认关闭。启用：

```bash
AGENTDOCK_BROWSER_ENABLED=true
```

或：

```bash
agentdock --browser-enabled
```

启用开关只负责暴露 `browser_session`、`browser_act` 和 `browser_snapshot`。运行环境还需要 browser runner 及其 Node.js、`playwright-core` 依赖。

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `AGENTDOCK_BROWSER_RUNNER_DIR` | `~/.agentdock/browser-runner` | 包含 `browser-runner.js` 和 Node 依赖的目录 |
| `AGENTDOCK_BROWSER_EXECUTABLE_PATH` | 空 | runner 使用的 Chromium 可执行文件；Docker browser 镜像自动设置为 `/usr/bin/chromium` |

Docker browser 镜像会自动配置 runner 和 Chromium。macOS、Windows、Linux 原生 Release 当前不会安装 runner；启用前需要单独准备 Node.js、runner 和 `playwright-core`。具体选择见 [浏览器自动化](../guides/browser-control.md)。

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

## 私密笔记

从 `v0.4.4` 开始，`private_note_manage` 通过 NexusDock Private Notes 接口工作，不再读取 AgentDock 本机的私密笔记目录或 `AGENTDOCK_PRIVATE_NOTES_*` 环境变量。需要先配置 `AGENTDOCK_NEXUS_ENDPOINT` 和可选 Token。

NexusDock 负责明文存储边界、age X25519 密文备份和 Git 忽略规则。可以通过维护动作初始化或检查加密：

```json
{
  "action": "maintain",
  "maintenance_action": "init-encryption"
}
```

搜索只匹配标题、简介、标签、分类和路径等安全元数据，不搜索或返回正文。只有显式 `read` 才返回明文；`write` 和 `delete` 都需要 `confirmed=true`。

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
