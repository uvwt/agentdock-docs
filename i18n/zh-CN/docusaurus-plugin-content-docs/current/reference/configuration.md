# 配置参考

macOS 和 Windows 用户通常直接在 AgentDock 客户端中修改设置。本页主要用于无界面 Linux、Docker、自动化和高级配置。

## 配置位置

| 环境 | 推荐配置位置 |
| --- | --- |
| macOS / Windows | AgentDock 客户端和高级设置 |
| Linux 服务 | 受保护的服务环境文件 |
| Docker | Compose `.env`、`environment` 或 secrets |
| 前台运行 | 环境变量和支持的 CLI 参数 |

CLI 参数会覆盖它对应的环境变量。

默认路径：

```text
~/.agentdock  AgentDock 状态
~/AgentDock   默认工作目录
```

## 核心运行配置

| 设置 | 环境变量 | CLI 参数 | 默认值 |
| --- | --- | --- | --- |
| 监听地址 | `AGENTDOCK_HOST` | `--host` | `127.0.0.1` |
| 端口 | `AGENTDOCK_PORT` | `--port` | `8765` |
| 日志级别 | `AGENTDOCK_LOG_LEVEL` | `--log-level` | `info` |
| 聊天卡片 | `AGENTDOCK_MCP_APPS_MODE` | `--mcp-apps-mode` | `full` |
| stdio 传输 | `AGENTDOCK_STDIO` | `--stdio` | `false` |
| 状态目录 | `AGENTDOCK_HOME` | — | `~/.agentdock` |
| 工作目录 | `AGENTDOCK_DEFAULT_DIR` | — | `~/AgentDock` |
| 命令环境变量映射 | `AGENTDOCK_COMMAND_ENV_FROM_ENV_JSON` | — | 空 |
| 可信代理 CIDR | `AGENTDOCK_TRUSTED_PROXY_CIDRS` | — | 空 |

聊天卡片支持 `full`、`compact`、`off`。`AGENTDOCK_COMMAND_ENV_FROM_ENV_JSON` 用于显式声明 `exec_command` 从宿主服务环境映射的变量名；AgentDock 不会自动继承交互式登录 Shell 的全部环境变量。

## 认证

Bearer Token：

```text
AGENTDOCK_AUTH_TOKEN=<random-secret>
```

OAuth：

| 变量 | 用途 |
| --- | --- |
| `AGENTDOCK_OAUTH_ENABLED` | 启用 OAuth |
| `AGENTDOCK_SERVER_URL` | 公网 HTTPS Origin，不带 `/mcp` |
| `AGENTDOCK_OAUTH_PASSWORD` | 授权页面使用的密码 |
| `AGENTDOCK_OAUTH_TOKEN_SECRET` | OAuth 状态和 Token 的签名密钥 |
| `AGENTDOCK_OAUTH_ACCESS_TOKEN_TTL` | 可选的 Access Token 有效期 |

监听非 loopback 地址时必须使用 Bearer Token 或 OAuth。公网访问应使用 HTTPS，见 [公网访问](../operations/public-access.md)。

## 浏览器

| 变量 | CLI 参数 | 用途 |
| --- | --- | --- |
| `AGENTDOCK_BROWSER_ENABLED` | `--browser-enabled` | 启用浏览器工具 |
| `AGENTDOCK_BROWSER_EXECUTABLE_PATH` | `--browser-executable-path` | 指定 Chrome、Chromium 或 Edge |
| `AGENTDOCK_BROWSER_CDP_URL` | `--browser-cdp-url` | 连接已配置的 CDP 地址 |
| `AGENTDOCK_BROWSER_REUSE_EXISTING_CDP` | `--browser-reuse-existing-cdp` | 优先复用本机可用的 CDP 浏览器 |

普通设置和使用方式见 [使用浏览器](../guides/browser-control.md)。

## Coding Agent

| 变量 | 用途 |
| --- | --- |
| `AGENTDOCK_ACP_ENABLED` | 启用 Coding Agent 工具 |
| `AGENTDOCK_ACP_PROFILES_JSON` | 配置可用的 Coding Agent profile |
| `AGENTDOCK_ACP_DEFAULT_PROFILE` | 指定默认 profile |
| `AGENTDOCK_ACP_MAX_CONCURRENT_PROMPTS` | 限制并发 prompt 数量 |
| `AGENTDOCK_ACP_INTERACTION_TIMEOUT_MS` | 设置交互超时 |

桌面端优先在 AgentDock 图形界面配置 Coding Agent；无界面部署可以使用这些变量。使用方式见 [使用本地 Coding Agent](../guides/coding-agents.md)。

## 其他设置

常见 CLI 子命令：

- `agentdock version [--json]`：查看版本信息。
- `agentdock update [--check]`：检查或安装更新。
- `agentdock service <status|start|stop|restart|autostart>`：管理后台服务。
- `agentdock tunnel <status|start|stop|restart|regenerate|configure|autostart>`：管理 Cloudflare Tunnel 状态。
- `agentdock component <status|install|update|uninstall> cloudflared`：管理可选的 `cloudflared` 组件。
- `agentdock nexus pair` / `agentdock nexus status`：执行 NexusDock 配对或查看配对状态。

标准安装下，`service`、`tunnel`、`component` 和 `nexus` 会自动解析平台默认运行目录；自定义目录或多实例部署可通过 `AGENTDOCK_RUNTIME_ROOT` 或 `--runtime-root <dir>` 指定。

NexusDock 配对保存为设备身份，不属于普通运行环境变量。见 [连接 AgentDock](../operations/nexusdock-connect.md)。

managed Skill 和动态 MCP 的凭据通过各自的环境配置入口管理，不写进 AgentDock 全局环境变量。

项目规则使用 `AGENTS.md`，也不属于运行环境配置。
