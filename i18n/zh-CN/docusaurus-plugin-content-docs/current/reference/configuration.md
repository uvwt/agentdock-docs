# 配置

AgentDock 当前不读取统一的 YAML、JSON 或 TOML 配置文件。运行配置通过环境变量提供，部分常用项还可以使用 CLI 参数覆盖。

:::tip
首次安装请使用对应平台的安装指南。本页集中说明端口、远程访问、认证、浏览器、NexusDock 和高级部署配置。
:::

## 常用配置

| 场景 | 需要处理的内容 |
| --- | --- |
| 本机前台运行 | 通常保持 `127.0.0.1` 和默认端口即可 |
| Docker | `.env` 中的 `AGENTDOCK_AUTH_TOKEN`，其余使用 Compose 默认值 |
| 浏览器自动化 | 启用浏览器工具，并准备 Chrome、Edge 或 browser 镜像 |
| NexusDock（Recall、Workflow、Evolution、私密笔记） | 配置服务地址和可选 Token |
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

需要修改目录时，可以把 `AGENTDOCK_HOME` 或 `AGENTDOCK_DEFAULT_DIR` 设置为绝对路径。需要更强的数据隔离时，仍应使用独立系统用户或明确的容器挂载。

## CLI 参数

| 参数 | 对应环境变量 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `--host` | `AGENTDOCK_HOST` | `127.0.0.1` | HTTP 监听地址 |
| `--port` | `AGENTDOCK_PORT` | `8765` | HTTP 监听端口，范围 `1`～`65535` |
| `--log-level` | `AGENTDOCK_LOG_LEVEL` | `info` | `debug`、`info`、`warn` 或 `error` |
| `--nexus-endpoint` | `AGENTDOCK_NEXUS_ENDPOINT` | 空 | NexusDock 服务根地址 |
| `--browser-enabled` | `AGENTDOCK_BROWSER_ENABLED` | `false` | 暴露浏览器自动化工具 |
| `--browser-executable-path` | `AGENTDOCK_BROWSER_EXECUTABLE_PATH` | 空 | 指定 Chrome、Chromium 或 Edge 可执行文件 |
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
| `AGENTDOCK_HOME` | `~/.agentdock` | AgentDock 内部状态目录；手工设置时必须解析为绝对目录 |
| `AGENTDOCK_DEFAULT_DIR` | `~/AgentDock` | 相对文件、命令和 Git 操作的默认工作目录；手工设置时必须解析为绝对目录 |
| `AGENTDOCK_HOST` | `127.0.0.1` | HTTP 监听地址；非回环地址必须启用 Bearer Token 或 OAuth |
| `AGENTDOCK_PORT` | `8765` | HTTP 监听端口 |
| `AGENTDOCK_LOG_LEVEL` | `info` | 日志级别 |
| `AGENTDOCK_STDIO` | `false` | 是否使用 stdio 模式 |
| `AGENTDOCK_BROWSER_ENABLED` | `false` | 是否暴露 `browser_*` 工具 |
| `AGENTDOCK_BROWSER_EXECUTABLE_PATH` | 空 | 可选的 Chrome、Chromium 或 Edge 可执行文件绝对路径 |
| `AGENTDOCK_NEXUS_ENDPOINT` | 空 | NexusDock 服务根地址；启用 Recall、Workflow、Evolution 和私密笔记能力 |
| `AGENTDOCK_NEXUS_TOKEN` | 空 | NexusDock Bearer Token |
| `AGENTDOCK_INSTRUCTIONS_FILE` | 空 | 可选 UTF-8 文本文件，在 MCP 初始化时作为 Server Instructions 下发给兼容客户端 |

布尔值统一使用 `true` 或 `false`，避免不同服务管理器产生解析差异。

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

可选的 `AGENTDOCK_OAUTH_ACCESS_TOKEN_TTL` 用于控制 Access Token 有效期，默认 `1h`；支持 `12h` 这类 Go duration、`90d` 这类整数天数以及 `never`。

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

## NexusDock Recall、Workflow、Evolution 与私密笔记

配置 NexusDock 后，AgentDock 会暴露 `recall_*`、`workflow_template_manage`、`evolve` 和 `private_note_manage`。Recall 与 Workflow 使用 NexusDock 共享服务，Evolution 生命周期策略由 AgentDock 负责，私密笔记使用 NexusDock Private Notes：

```bash
AGENTDOCK_NEXUS_ENDPOINT=https://nexus.example.com
AGENTDOCK_NEXUS_TOKEN=<nexus-token>
```

`AGENTDOCK_NEXUS_ENDPOINT` 使用 NexusDock 服务根地址，不要附加具体 API 路径。未配置时：

- 本地 `task_manage` 仍可管理普通可恢复任务。
- `evolve`、`recall_*`、`workflow_template_manage` 和 `private_note_manage` 不会出现在 `tools/list`。

多设备路由、fleet 上下文和节点 Artifact 下载见 [NexusDock](../concepts/nexusdock.md)。

## Coding Agent（ACP）

ACP 默认关闭。macOS 和 Windows 用户通常直接在 AgentDock 高级设置中启用即可，完整流程见 [使用本地 Coding Agent](../guides/coding-agents.md)。

无图形界面的部署可以使用这些宿主机配置：

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `AGENTDOCK_ACP_ENABLED` | `false` | 是否暴露内置 ACP 工具 |
| `AGENTDOCK_ACP_AGENT` | `claude` | 当前 Coding Agent 的简短配置名称 |
| `AGENTDOCK_ACP_COMMAND` | 空 | 启用 ACP 时必填的 Adapter 可执行文件绝对路径 |
| `AGENTDOCK_ACP_ARGS_JSON` | 空 | 可选的 Adapter 参数 JSON 字符串数组 |
| `AGENTDOCK_ACP_ENV_FROM_ENV_JSON` | 空 | 可选 JSON 对象，把子进程变量名映射到已有宿主机变量名 |
| `AGENTDOCK_ACP_MAX_CONCURRENT_PROMPTS` | `2` | 同时运行的 Prompt 上限，范围 `1` 到 `8` |
| `AGENTDOCK_ACP_INTERACTION_TIMEOUT_MS` | `300000` | 权限交互超时毫秒数，范围 `1000` 到 `3600000` |

环境变量映射示例：

```bash
AGENTDOCK_ACP_ENV_FROM_ENV_JSON='{"OPENAI_API_KEY":"OPENAI_API_KEY"}'
```

映射只保存变量名；AgentDock 启动时再把宿主机中的当前值传给子进程。凭据应保存在宿主机环境中，不要直接写进 `AGENTDOCK_ACP_ARGS_JSON`。

AgentDock 不再维护 ACP 项目根目录白名单。会话可以使用运行用户有权限访问的任意宿主机目录；需要更严格边界时，应使用操作系统权限或容器挂载限制 Coding Agent。

## 静态 MCP Server Instructions

需要在 MCP 初始化时给兼容客户端下发一段简短、静态的说明时，可以设置 `AGENTDOCK_INSTRUCTIONS_FILE`：

```bash
AGENTDOCK_INSTRUCTIONS_FILE=/absolute/path/to/agentdock-instructions.md
```

文件必须是非空的普通 UTF-8 文件，大小不超过 64 KiB，并且路径必须是绝对路径。AgentDock 启动时读取文件，并通过 MCP Server `instructions` 字段返回内容。

它用于给客户端提供静态启动说明，不是动态 Recall 记忆，也不替代 `agentdock_context`。客户端最终是否把 MCP Server Instructions 放进自己的提示词或界面，由客户端自身决定。

## 浏览器工具

浏览器自动化默认关闭，可以这样启用：

```bash
AGENTDOCK_BROWSER_ENABLED=true
```

或：

```bash
agentdock --browser-enabled
```

AgentDock 支持 Chrome、Chromium 和 Microsoft Edge。自动检测不适用时，可以显式配置浏览器可执行文件路径。

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `AGENTDOCK_BROWSER_ENABLED` | `false` | 暴露 `browser_session`、`browser_act` 和 `browser_snapshot` |
| `AGENTDOCK_BROWSER_EXECUTABLE_PATH` | 空 | 自动检测不合适时，可指定浏览器可执行文件绝对路径 |

macOS 和 Windows 图形应用会在启用前检测已经安装的受支持浏览器。Docker browser 镜像直接包含 Chromium，并自动配置可执行文件路径。使用方式见 [浏览器自动化](../guides/browser-control.md)。

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

调用 `agentdock_context` 可以查看当前连接的运行环境和能力启动上下文。直连 AgentDock 时会包含：

- AgentDock 版本、操作系统和架构。
- AgentDock Home、默认目录、当前默认工作目录和路径模型。
- 已安装 Skill 摘要和已启用的动态 MCP Server。
- 配置后可见的 ACP 状态，以及 Nexus 提供的 Workflow / Recall 索引。

`agentdock_context` 不会重复内置 MCP 工具清单，也不会报告当前使用的认证方式。当前连接实际暴露哪些工具，以 MCP 客户端的 `tools/list` 为准；认证配置请从部署环境或桌面控制面板检查。

`agentdock_context` 和 `tools/list` 都不会返回认证 Token、OAuth 密码、签名密钥或 NexusDock Token。

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
