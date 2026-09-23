# 配置

AgentDock Core 不读取统一的 YAML、JSON 或 TOML 配置文件。运行参数来自环境变量，少量常用项也可以通过命令行参数覆盖；使用桌面安装包和控制面板时，应优先让图形界面管理这些设置。

:::tip
首次安装请使用对应平台的安装指南。本页主要作为运行行为、无界面部署和高级配置的参考。
:::

## 选择正确的配置入口

| 场景 | 推荐配置入口 |
| --- | --- |
| macOS 或 Windows 桌面应用 | AgentDock 控制面板 / 高级设置 |
| 直接前台运行 | 环境变量和受支持的 CLI 参数 |
| Docker 或 Compose | 容器 `environment`、`env_file` 或 secret 注入 |
| Linux 服务 | 权限受限的服务环境文件 |
| NexusDock | 使用 `agentdock nexus pair` 配对设备；不要再把旧 Nexus 凭据写进 Core 环境 |

不要把 Token、密码、Cookie、私钥、OAuth Secret 或设备身份提交到源码仓库。

## 优先级与目录

普通 Core 运行配置按以下顺序解析：

1. 内置默认值。
2. 环境变量。
3. 受支持的 CLI 参数。

CLI 只覆盖它实际提供的项目。例如在无界面部署中，认证秘密和 ACP Profile JSON 仍通过环境提供。

两个主要目录由实际运行 AgentDock 的操作系统用户决定：

```text
~/.agentdock   Internal state, managed Skills, tasks, MCP configuration, browser data, and artifacts
~/AgentDock    Default working directory for relative file and command operations
```

需要更换位置时，将 `AGENTDOCK_HOME` 或 `AGENTDOCK_DEFAULT_DIR` 设为绝对路径。需要更强隔离时，应使用操作系统账号、权限或容器挂载，而不是把 AgentDock 路径配置当成沙箱。

## CLI 参数

当前服务入口提供这些参数：

| 参数 | 环境变量 | 默认值 | 用途 |
| --- | --- | --- | --- |
| `--host` | `AGENTDOCK_HOST` | `127.0.0.1` | HTTP 监听地址 |
| `--port` | `AGENTDOCK_PORT` | `8765` | HTTP 端口，范围 `1`～`65535` |
| `--log-level` | `AGENTDOCK_LOG_LEVEL` | `info` | `debug`、`info`、`warn` 或 `error` |
| `--mcp-apps-enabled` | `AGENTDOCK_MCP_APPS_ENABLED` | `true` | 是否暴露可选 MCP Apps UI 资源与元数据 |
| `--browser-enabled` | `AGENTDOCK_BROWSER_ENABLED` | `false` | 是否暴露浏览器自动化工具 |
| `--browser-executable-path` | `AGENTDOCK_BROWSER_EXECUTABLE_PATH` | 空 | Chrome、Chromium 或 Edge 可执行文件绝对路径 |
| `--browser-cdp-url` | `AGENTDOCK_BROWSER_CDP_URL` | 空 | 由用户配置的现有 Chromium CDP 地址 |
| `--browser-reuse-existing-cdp` | `AGENTDOCK_BROWSER_REUSE_EXISTING_CDP` | `false` | 自动复用唯一检测到的本地 CDP 浏览器 |
| `--stdio` | `AGENTDOCK_STDIO` | `false` | 使用 stdio 提供 JSON-RPC，不启动 HTTP 服务 |

示例：

```bash
agentdock \
  --host 127.0.0.1 \
  --port 8765 \
  --log-level info
```

NexusDock 不再属于服务参数。配对会建立独立设备身份，由 AgentDock 在普通运行配置之外加载。

## Core 运行环境变量

| 环境变量 | 默认值 | 用途 |
| --- | --- | --- |
| `AGENTDOCK_HOME` | `~/.agentdock` | AgentDock 私有状态根目录；显式设置时必须解析为绝对目录 |
| `AGENTDOCK_DEFAULT_DIR` | `~/AgentDock` | 默认工作目录；显式设置时必须解析为绝对目录 |
| `AGENTDOCK_HOST` | `127.0.0.1` | HTTP 监听地址；非回环监听必须有 Bearer Token 或 OAuth |
| `AGENTDOCK_PORT` | `8765` | HTTP 端口 |
| `AGENTDOCK_LOG_LEVEL` | `info` | 日志级别 |
| `AGENTDOCK_STDIO` | `false` | 使用 stdio 传输而不是 HTTP 服务 |
| `AGENTDOCK_MCP_APPS_ENABLED` | `true` | 是否暴露可选 MCP Apps UI 资源与元数据 |
| `AGENTDOCK_COMMAND_ENV_FROM_ENV_JSON` | 空 | 明确把哪些宿主变量映射给 `exec_command` 子进程 |
| `AGENTDOCK_TRUSTED_PROXY_CIDRS` | 空 | 逗号分隔的可信反向代理 CIDR |

布尔值建议统一写成 `true` 或 `false`。

`AGENTDOCK_COMMAND_ENV_FROM_ENV_JSON` 是显式允许列表，不会把整个宿主环境透传给子进程。例如：

```bash
AGENTDOCK_COMMAND_ENV_FROM_ENV_JSON='{"HTTP_PROXY":"HTTP_PROXY","HTTPS_PROXY":"HTTPS_PROXY"}'
```

Skill 运行时保留变量 `SKILL_DATA_DIR` 不能通过该映射或请求级命令环境覆盖。

## Bearer Token 认证

最简单的 HTTP 认证方式：

```bash
export AGENTDOCK_AUTH_TOKEN="$(openssl rand -hex 32)"
```

客户端调用 `/mcp` 时发送：

```http
Authorization: Bearer <token>
```

只监听回环地址时可以不启用认证；非回环 HTTP 监听如果既没有 Bearer Token 也没有 OAuth，AgentDock 会拒绝启动。

## OAuth 配置

OAuth 适合支持浏览器授权的远程客户端。启用时使用：

| 环境变量 | 要求 | 用途 |
| --- | --- | --- |
| `AGENTDOCK_OAUTH_ENABLED` | `true` | 启用 OAuth |
| `AGENTDOCK_SERVER_URL` | 必填 | AgentDock 公网 Origin，例如 `https://agentdock.example.com` |
| `AGENTDOCK_OAUTH_PASSWORD` | 至少 12 个字符 | 授权页面登录密码 |
| `AGENTDOCK_OAUTH_TOKEN_SECRET` | 至少 32 字节 | OAuth 状态和 Token 的稳定签名密钥 |
| `AGENTDOCK_OAUTH_ACCESS_TOKEN_TTL` | 可选，默认 `1h` | Access Token 有效期；支持 Go duration、`90d` 这类整数天数或 `never` |

示例：

```bash
AGENTDOCK_OAUTH_ENABLED=true
AGENTDOCK_SERVER_URL=https://agentdock.example.com
AGENTDOCK_OAUTH_PASSWORD=<long-login-password>
AGENTDOCK_OAUTH_TOKEN_SECRET=<random-secret-at-least-32-bytes>
```

`AGENTDOCK_SERVER_URL` 是 Origin，不包含 MCP 路径。非回环公网 Origin 必须使用 HTTPS；客户端 MCP 地址再附加 `/mcp`，例如 `https://agentdock.example.com/mcp`。

Bearer Token 和 OAuth 可以同时存在。不要因为旧部署曾经使用某个秘密，就长期保留已经不用的配置。

## 可信反向代理

AgentDock 默认不信任任意 `X-Forwarded-For`。只有代理由你控制并正确重写转发链时，才配置代理网段：

```bash
AGENTDOCK_TRUSTED_PROXY_CIDRS=127.0.0.0/8,::1/128
```

不要信任过宽的公网网段。客户端地址会参与认证与限流相关判断。

## 配对 NexusDock

当前 AgentDock 通过设备配对身份连接 NexusDock。旧 `AGENTDOCK_NEXUS_ENDPOINT` 和 `AGENTDOCK_NEXUS_TOKEN` 不再是受支持的 Core 配置来源；服务启动前会清理这两个旧环境变量，只从成功配对产生的身份加载 Nexus 信息。

先在 **NexusDock → 设置 → 系统与节点** 生成一次性配对码，再在目标 AgentDock 设备执行控制台生成的命令。通用形式：

```bash
agentdock nexus pair \
  --endpoint https://nexus.example.com \
  --code <pairing-code> \
  --name <optional-device-name>
```

查看已保存的配对状态：

```bash
agentdock nexus status
```

配对后重启 AgentDock。身份加载成功后，直连 AgentDock 可以暴露 Nexus 支持的 Recall、Workflow、Evolution 和私密笔记能力，同时设备也会建立到 Nexus 的出站 Bridge 连接。

多设备路由和 fleet MCP 入口见 [NexusDock](../concepts/nexusdock.md)。

## Coding Agent（ACP）

ACP 默认关闭。macOS 和 Windows 用户通常直接在 AgentDock UI 配置。无界面部署使用 Profile 模型：

| 环境变量 | 默认值 | 用途 |
| --- | --- | --- |
| `AGENTDOCK_ACP_ENABLED` | `false` | 启用 ACP 工具 |
| `AGENTDOCK_ACP_PROFILES_JSON` | 空 | ACP Profile JSON 数组 |
| `AGENTDOCK_ACP_DEFAULT_PROFILE` | 第一个启用的 Profile | 工具调用省略 `profile_id` 时使用的默认 Profile |
| `AGENTDOCK_ACP_MAX_CONCURRENT_PROMPTS` | `2` | Prompt 并发上限，范围 `1`～`8` |
| `AGENTDOCK_ACP_INTERACTION_TIMEOUT_MS` | `300000` | 交互超时毫秒数，范围 `1000`～`3600000` |

每个 Profile 包含 `id`、`kind`、`command`、可选 `args`、可选 `env_from_env` 和 `enabled`。内置类型 `codex`、`claude`、`grok` 使用同名固定 ID；custom 可以使用其他唯一 ID。

示例：

```bash
AGENTDOCK_ACP_ENABLED=true
AGENTDOCK_ACP_PROFILES_JSON='[{"id":"codex","kind":"codex","command":"/absolute/path/to/codex-acp","enabled":true}]'
AGENTDOCK_ACP_DEFAULT_PROFILE=codex
```

`env_from_env` 只映射变量名，不保存真实值。Provider 凭据应留在宿主环境或 Provider 自己的登录存储中。

旧 `AGENTDOCK_ACP_AGENT`、`AGENTDOCK_ACP_COMMAND`、`AGENTDOCK_ACP_ARGS_JSON`、`AGENTDOCK_ACP_ENV_FROM_ENV_JSON` 只在没有 Profile JSON 时作为旧单 Profile 配置的升级兼容入口。新配置统一使用 Profiles。

Adapter 发现与验证流程见 [使用本地 Coding Agent](../guides/coding-agents.md)。

## 工作区规则

项目规则不通过环境变量配置。固定全局规则文件是 `~/.agentdock/AGENTS.md`；项目规则使用 `<workspace>/AGENTS.md`，并可通过子目录继承。

操作项目、切换工作区或规则可能变化时调用 `workspace_context`。可选 `workdir` 只影响本次上下文选择。它还会索引 `<workspace>/.agents/skills/*/SKILL.md`，返回精确 Skill 来源和引用，但不直接注入 Skill 正文。

## 浏览器工具

浏览器自动化默认关闭：

| 环境变量 | 默认值 | 用途 |
| --- | --- | --- |
| `AGENTDOCK_BROWSER_ENABLED` | `false` | 暴露浏览器工具 |
| `AGENTDOCK_BROWSER_EXECUTABLE_PATH` | 空 | 自动检测不适用时指定浏览器可执行文件绝对路径 |
| `AGENTDOCK_BROWSER_CDP_URL` | 空 | 用户配置的现有 Chromium CDP 地址 |
| `AGENTDOCK_BROWSER_REUSE_EXISTING_CDP` | `false` | 发现并复用唯一的本地 CDP 浏览器 |

AgentDock 支持 Chrome、Chromium 和 Microsoft Edge。不使用 CDP 复用时，AgentDock 会启动并管理独立浏览器进程；附着外部 CDP 浏览器时，AgentDock 会在其中创建自己的独立 target，关闭 AgentDock session 不会终止外部浏览器。

单次 `browser_session` 调用传入的 `cdp_url` 仅允许回环地址。命名或远程 CDP 地址必须由用户在 AgentDock 设置中配置。外部 CDP 浏览器不能同时使用持久 `profile_id`、Cookie 注入或 localStorage 注入。

使用方式和安全边界见 [浏览器自动化](../guides/browser-control.md)。

## managed Skill 与动态 MCP 的独立环境

managed Skill 和动态 MCP Server 的业务凭据应与包定义分开。使用 `skill_manage` 和 `mcp_manage` 的环境 action，而不是把秘密放进 Skill 包、MCP Registry 条目或永久全局环境。

`env_list` 只返回变量名和配置状态，不返回明文。managed Skill 只有在命令使用精确 managed `skill_ref` 时才会收到保留的 `SKILL_DATA_DIR`；shared 和 workspace Skill 不会继承它。

## 私密笔记

当前 AgentDock 与 NexusDock 完成配对后才会提供 `private_note_manage`。它使用 NexusDock Private Notes 服务，不通过本地私密笔记目录进行配置。

搜索只返回安全元数据；只有显式 `read` 才返回明文。写入和删除按工具契约要求确认。私密笔记加密材料、NexusDock 管理员凭据与 AgentDock 设备配置应分别保护。

## 查看当前运行状态

调用 `agentdock_context` 可以查看当前连接的运行环境和能力启动上下文。直连 AgentDock 时会包含运行时版本、操作系统、架构、路径、Skill 来源、动态 MCP 摘要，以及可选的 ACP/Nexus 支持索引。

当前连接实际暴露哪些工具，以 MCP 客户端的 `tools/list` 为准。`agentdock_context` 和 `tools/list` 都不会返回认证 Token、OAuth 密码、签名密钥、Provider Secret 或 NexusDock Device Token。

## 启动前检查

配置无效时 AgentDock 会拒绝启动。常见检查包括：

- 端口位于 `1`～`65535`。
- 日志级别有效。
- 非回环 HTTP 监听已启用认证。
- OAuth 所需变量齐全并满足最小长度。
- 公网 `AGENTDOCK_SERVER_URL` 使用 HTTPS。
- 可信代理配置都是合法 CIDR。
- 已启用 ACP Profile 的 ID 唯一有效，并使用可执行的绝对命令路径。
- 浏览器可执行文件和 CDP URL 配置结构有效。

部署完成后至少验证：

```bash
curl -fsS http://127.0.0.1:8765/healthz
```

再使用实际客户端完成一次 MCP `initialize` 和真实工具调用。安全边界见 [安全模型](../operations/security.md)。
