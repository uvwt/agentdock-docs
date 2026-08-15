# 使用本地 Coding Agent

AgentDock 可以通过 ACP（Agent Client Protocol）把 MCP 客户端连接到本机 Coding Agent。这样 ChatGPT 或其他 MCP 客户端就可以把编码任务交给真正位于项目电脑上的 Codex、Claude 或 Grok Build 执行。

这是一项可选能力，默认关闭。

## 支持的预设

macOS 和 Windows 图形应用目前提供这些预设：

| 预设 | AgentDock 会查找的本地 Adapter |
| --- | --- |
| Codex | `codex-acp` 或 `@agentclientprotocol/codex-acp` 包 |
| Claude | `claude-agent-acp` 或 `@agentclientprotocol/claude-agent-acp` 包 |
| Grok Build | 使用 ACP/stdio 模式的 `grok` |

启用前，请先在同一台电脑上安装并登录你要使用的 Coding Agent。AgentDock 不负责提供或管理对应服务商账号。

## macOS 和 Windows

1. 在运行 AgentDock 的电脑上安装目标 Coding Agent 或 ACP Adapter。
2. 打开 AgentDock“高级设置”或 Windows 控制面板。
3. 勾选“启用 Coding Agent”。
4. 选择 **Codex**、**Claude** 或 **Grok Build**。
5. 确认界面显示已经检测到对应 Adapter。
6. 应用设置并重启 AgentDock 服务。

重新连接 MCP 客户端后，可以通过 `agentdock_context` 或 `server_info` 确认 ACP 已启用。

## 直接描述编码任务

普通用户不需要手工操作 ACP 工具，直接描述结果即可，例如：

```text
使用这台电脑上的本地 Coding Agent 检查仓库，修复失败测试，并验证修改结果。
```

对于耗时较长的编码任务，AgentDock 会异步启动 Coding Agent，并让上游 Agent 持续读取进度事件。Coding Agent 发起的权限请求仍然需要明确选择；一次性的权限选择不会被自动变成永久授权。

## 项目目录

Coding Agent 会话可以使用 AgentDock 运行用户本身有权限访问的任意目录。AgentDock 不再维护额外的项目目录白名单。

这并不等于操作系统沙箱。如果某个 Coding Agent 只能访问指定项目，应通过独立系统用户、文件权限、容器挂载等宿主机边界限制访问范围。

## 无图形界面的服务部署

没有桌面界面时，可以通过宿主机配置启用 ACP。最少需要提供 Adapter 的绝对可执行文件路径：

```bash
AGENTDOCK_ACP_ENABLED=true
AGENTDOCK_ACP_AGENT=codex
AGENTDOCK_ACP_COMMAND=/absolute/path/to/codex-acp
```

可选参数和环境变量映射见 [配置参考](../reference/configuration.md)。凭据应保存在宿主机环境变量中，不要直接塞进命令参数。

## 常见问题

如果 Coding Agent 无法启用或启动：

- 确认所选 Adapter 已安装，并且 AgentDock 的运行用户可以直接执行它。
- macOS 或 Windows 上重新打开高级设置，检查 Adapter 检测提示。
- 无图形界面的部署要确认 `AGENTDOCK_ACP_COMMAND` 是绝对可执行文件路径。
- 使用 `AGENTDOCK_ACP_ENV_FROM_ENV_JSON` 时，确认映射引用的宿主机环境变量确实存在。
- 用 `server_info` 确认 ACP 已启用，再让 MCP 客户端新建会话重试。

用户可见的 ACP 工具边界见 [工具介绍](../reference/tools.md)。
