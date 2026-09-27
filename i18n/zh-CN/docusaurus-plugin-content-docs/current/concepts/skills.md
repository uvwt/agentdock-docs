# 使用 Skill

Skill 用来教 Agent 如何处理某一类任务，可以说明要遵循的步骤、需要的工具或账号，以及哪些操作必须先确认。

## 官方核心 Skill

AgentDock 安装包和 Docker 镜像内置四个核心 Skill：

- `agentdock-user-guide` — 帮助配置和日常使用 AgentDock。
- `skill-authoring` — 帮助创建和审查 Skill。
- `skill-installation` — 帮助安全审查和安装 Skill。
- `plugin-import` — 帮助把 Git、GitHub 或其他目录中的远程 Plugin 下载到本地，再交给 AgentDock 审查和安装。

需要额外账号、系统权限或第三方软件的 Skill，在实际需要时再单独安装。

## 使用 Skill

通常只需要直接描述目标：

```text
查看我当前的 Codex 用量。
使用桌面 Skill 操作这个 macOS 应用。
审查并安装这个 Skill：https://example.com/example-skill
```

AgentDock 会发现相关 Skill，只在真正需要时让 Agent 读取对应说明。项目也可以在 `.agents/skills/` 下提供自己的 Skill；即使名称相同，项目 Skill 和全局安装的 Skill 仍会作为不同来源处理。

## 安装或更新 Skill

安装陌生 Skill 前，可以先让 Agent 审查：

```text
检查这个 Skill 的来源、文件、可移植性和权限要求，审查没有问题后再安装。
```

由 AgentDock 安装的 Skill 支持本地目录、本地 ZIP 或 HTTPS 软件包地址。安装经过审查的新内容会替换同名 Skill 的当前内容；内容完全相同时不会重复安装。

正常升级 AgentDock 时，旧版 Skill 目录会自动迁移，不需要手工搬目录。

## 账号、API Key 与私有数据

已安装的 Skill 需要凭据时，让 Agent 保存到该 Skill 的独立环境，不要写进 Skill 包或代码仓库。例如：

```text
为 example-skill 配置 EXAMPLE_API_KEY，回复中不要回显真实值。
```

Skill 需要保存可变状态时，AgentDock 还可以为它提供独立的私有数据目录。普通更新和删除默认保留这些数据；只有明确执行 purge 才会一并清理。

Skill 包不能包含 Token、Cookie、浏览器登录态、`.env`、缓存或设备私有数据。

## Skill、Plugin 还是 MCP？

| 方式 | 适合场景 |
| --- | --- |
| **Skill** | 想教 Agent 一套可复用的任务处理方法。 |
| **Plugin** | 想一次安装一个可以包含多个 Skill 和 MCP 连接的扩展包。 |
| **动态 MCP** | 想让 AgentDock 直接连接一个外部或本地 MCP 服务。 |

另外两种方式见 [使用 Plugin](./plugins.md) 和 [连接外部 MCP](./dynamic-mcp.md)。

## 安全注意事项

- 第三方 Skill 安装前先审查来源和内容。
- 发送、删除、上传、支付、授权等敏感操作应先确认。
- Skill 不能突破 AgentDock 进程、容器挂载或操作系统用户本身的权限。
- 不要把秘密放进 Skill 包、公开日志或代码仓库。

想查看当前可用 Skill，可以直接询问 Agent 有哪些 Skill、分别来自哪里。创建和维护 Skill 见 [开发者指南](../contributing/development.md#skill-开发)。
