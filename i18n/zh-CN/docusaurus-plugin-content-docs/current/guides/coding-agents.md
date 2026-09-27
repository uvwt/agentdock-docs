# 使用本地 Coding Agent

AgentDock 可以把 ChatGPT 或其他 MCP 客户端里的编码任务交给项目所在电脑上的本地 Coding Agent。它可以是 Codex、Claude、Grok Build，也可以是自定义编码工具。

这项功能默认关闭。只有需要让 AgentDock 调用本机编码工具处理仓库任务时再启用即可。

## 可以使用哪些编码工具

AgentDock 已提供以下选项：

- **Codex**
- **Claude**
- **Grok Build**
- **自定义编码工具**

启用后选择一个作为默认编码工具即可。你也可以添加多个自定义工具，并在某次任务中直接说明希望使用哪一个。

启用前，先在运行 AgentDock 的同一台电脑上安装并登录准备使用的编码工具。AgentDock 负责启动本地连接，但不会替你管理这些服务的账号，也不会把账号凭据复制到 AgentDock 配置中。

## 安装前准备

- **Codex**：安装并登录 Codex，同时还需要 `codex-acp`。
- **Claude**：安装并登录 Claude Code，同时还需要 `claude-agent-acp`。
- **Grok Build**：安装并登录 Grok，不需要额外的连接组件。
- **自定义编码工具**：准备好可执行程序路径和需要的启动参数。

Codex 和 Claude 的连接组件通过 npm 安装，因此电脑上还需要 Node.js 和 npm：

```bash
npm install -g @agentclientprotocol/codex-acp
npm install -g @agentclientprotocol/claude-agent-acp
```

如果系统级 npm 目录不可写，优先使用当前用户自己的 npm 安装目录，不要为了全局安装直接使用 `sudo npm`。

## macOS 和 Windows

1. 按上面的说明准备好要使用的编码工具。
2. macOS 打开“高级设置”，Windows 打开 AgentDock 控制面板。
3. 启用 **Coding Agent (ACP)**。
4. 启用 Codex、Claude 或 Grok Build，或者添加一个自定义编码工具。
5. 选择默认编码工具。
6. 保存设置，让 AgentDock 完成重启。
7. 重新连接 MCP 客户端，或者新建一个对话。

使用图形应用时，通常不需要手工填写内部 ID，也不需要理解 ACP 的工具参数。

## 直接提出编码任务

直接描述目标即可，例如：

```text
使用这台电脑上的本地 Coding Agent 检查这个仓库，修复失败的测试，并在修改后完成验证。
```

如果启用了多个编码工具，也可以在任务里直接点名，例如：

```text
这个仓库任务用 Claude 处理，完成后验证修改结果。
```

AgentDock 会在后台处理本地会话和工具通信。遇到权限请求时，仍然需要从允许的选项中明确确认后才能继续。

## 可以访问哪些项目

本地 Coding Agent 只能访问运行 AgentDock 的系统用户本来就有权限访问的目录。

AgentDock 不会额外给编码工具增加一层操作系统沙箱。如果只希望它访问指定项目，应通过系统账号、文件权限、容器挂载等方式限制访问范围。

## 确认是否可用

保存设置后重新连接客户端，可以先做一个不会修改文件的测试：

```text
使用本地 Coding Agent 查看这个仓库的结构并做一个简要说明，不要修改文件。
```

如果这个任务能够正常完成，就说明 AgentDock 已经可以启动所选编码工具并把结果返回到当前对话。

## 常见问题

如果 Coding Agent 无法启动：

- 确认编码工具已经安装并登录，而且与 AgentDock 运行在同一台电脑、同一个系统用户环境中。
- 如果该工具需要 ACP 连接组件，确认它已经安装并能被 AgentDock 找到。
- 确认 **Coding Agent (ACP)** 已启用，并且已经选择一个启用的默认编码工具。
- 保存设置并让 AgentDock 重启，然后重新连接 MCP 客户端或新建对话。
- 使用自定义编码工具时，检查配置的可执行文件路径和启动参数是否正确。

## 高级与无界面配置

无界面部署、自定义连接命令、内部 ID、环境变量以及 ACP 底层会话工具都属于高级配置。需要这些内容时，查看 [配置参考](../reference/configuration.md) 和 [工具参考](../reference/tools.md)。
