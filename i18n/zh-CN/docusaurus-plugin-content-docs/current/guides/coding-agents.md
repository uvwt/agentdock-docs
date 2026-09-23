# 使用本地 Coding Agent

AgentDock 可以通过 ACP（Agent Client Protocol）把 MCP 客户端连接到本地 Coding Agent，让 ChatGPT 或其他 MCP 客户端把编码任务交给项目所在电脑上的 Codex、Claude、Grok Build 或自定义 ACP Adapter。

ACP 是可选能力，默认关闭。

## 支持的 Profile

macOS 和 Windows 应用提供内置 Profile，也支持自定义 Adapter：

| Profile 类型 | AgentDock 使用的本地 Adapter |
| --- | --- |
| Codex | `codex-acp` 或 `@agentclientprotocol/codex-acp` 包 |
| Claude | `claude-agent-acp` 或 `@agentclientprotocol/claude-agent-acp` 包 |
| Grok Build | `grok agent stdio` |
| Custom | Adapter 的绝对可执行路径和可选参数 |

内置 Profile ID 固定为 `codex`、`claude`、`grok`，因此每个内置类型只有一个 Profile；Custom 可以用不同 ID 创建多个 Profile。已启用的 Profile 中会选一个默认项，也可以在调用时用 `profile_id` 明确选择其他 Profile。

启用 Adapter 前，先安装并登录准备使用的 Provider。AgentDock 负责启动 Adapter，不管理 Provider 账号，也不会把 Provider 凭据复制进自己的配置。

## macOS 和 Windows

1. 在运行 AgentDock 的同一台电脑上安装目标 Coding Agent，以及它需要的 ACP Adapter。
2. macOS 打开“高级设置”，Windows 打开 AgentDock 控制面板。
3. 启用 **Coding Agent (ACP)**。
4. 新增或启用内置 Profile，或者为 Custom Profile 配置 Adapter 命令和参数。
5. 从已启用 Profile 中选择一个默认项。
6. 确认 AgentDock 能检测到 Adapter，保存设置，并让 AgentDock 重启 Core。

重新连接 MCP 客户端后，`agentdock_context` 会返回 `default_profile` 和已启用的 `profiles`。当前连接的 `tools/list` 应包含 `acp_session`、`acp_prompt`、`acp_interaction`。

## 可以直接提出什么任务

直接描述目标即可，例如：

```text
Use the local Coding Agent on this computer to inspect the repository, fix the failing tests, and verify the change.
```

AgentDock 对外只暴露精简的管理语义，不把 ACP 协议每个底层方法都映射成 action：

- `acp_session`：`info`、`new`、`list`、`inspect`、`open`、`update`、`close`、`delete`。
- `acp_prompt`：`start`、`events`、`cancel`。
- `acp_interaction`：`list`、`respond`。

`open` 会在内部处理 resume/load 协商；Adapter 支持时，`new` 可以通过 `from_session_id` 从另一个 managed session fork；`update` 负责修改 Adapter 声明的 session mode 或配置项。支持 steering 时由 Prompt 流程在内部处理，不提供单独的公开 steering action。

长 Prompt 会异步启动并返回 Run ID，上游 Agent 持续读取有序事件，直到 Run 收敛。权限请求仍保持显式，只能选择 Adapter 当前提供且 AgentDock 本地策略允许的选项。

## 项目目录

Coding Agent session 可以使用 AgentDock 操作系统用户有权限访问的目录。AgentDock 不额外维护项目目录白名单。

这不是操作系统沙箱。需要把 Coding Agent 限制在特定项目时，应通过操作系统账号、文件权限、容器挂载或其他宿主机边界实现。

## 无界面或服务部署

没有桌面 UI 时，在 Core 启动环境中配置一个或多个 ACP Profile。例如 Codex Profile：

```bash
AGENTDOCK_ACP_ENABLED=true
AGENTDOCK_ACP_PROFILES_JSON='[{"id":"codex","kind":"codex","command":"/absolute/path/to/codex-acp","enabled":true}]'
AGENTDOCK_ACP_DEFAULT_PROFILE=codex
```

自定义 Adapter 使用 `kind=custom`、唯一 `id`、绝对路径 `command`，并按需配置 `args` 和 `env_from_env`。秘密值保留在宿主环境中；`env_from_env` 只映射变量名，不把秘密写进 Adapter 参数。

`AGENTDOCK_ACP_AGENT`、`AGENTDOCK_ACP_COMMAND`、`AGENTDOCK_ACP_ARGS_JSON`、`AGENTDOCK_ACP_ENV_FROM_ENV_JSON` 只用于旧单 Profile 配置的升级兼容。新配置应使用 `AGENTDOCK_ACP_PROFILES_JSON` 和 `AGENTDOCK_ACP_DEFAULT_PROFILE`。

## 验证连接

完整验证不能只看“配置已保存”：

1. Adapter 命令真实存在，并且 AgentDock 运行用户可以执行。
2. 配置变更后 AgentDock Core 健康。
3. `agentdock_context` 显示预期的默认 Profile 和已启用 Profile。
4. MCP 连接暴露 `acp_session`、`acp_prompt`、`acp_interaction`。
5. `acp_session info` 能启动选中的 Adapter，并返回实际能力或认证方式。

使用非默认 Profile 时，其 session、prompt 和 interaction 后续调用要持续传同一个 `profile_id`。

## 故障排查

如果 Coding Agent 无法启用或启动：

- 分开确认 Provider CLI 和 ACP Adapter；找到 `codex` 不代表已经有 `codex-acp`，找到 `claude` 也不代表已经有 `claude-agent-acp`。
- 在真正运行 AgentDock 的同一操作系统用户和服务环境中验证 Adapter，不要只在另一个交互 Shell 中测试。
- 无界面部署要确认每个已启用 Profile 都有绝对可执行 `command`，并确认 `env_from_env` 引用的宿主变量真实存在。
- 用 `agentdock_context` 确认目标 Profile 已启用，再用 `acp_session info` 直接测试 Adapter。
- 如果客户端缓存了旧工具 Schema，启用 ACP 后刷新 AgentDock 连接并新建会话。

公开工具契约见 [工具参考](../reference/tools.md#coding-agentacp)，宿主配置见 [配置参考](../reference/configuration.md#coding-agentacp)。
