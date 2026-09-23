# 使用 Skill

Skill 是一份给 Agent 阅读的文档型工作方法，用来说明什么时候使用某项能力、要遵循哪些步骤、需要哪些依赖，以及哪些操作需要确认。

## 官方核心 Skill

AgentDock 原生安装包和 Docker 镜像会随运行时提供这些核心 Skill：

- `agentdock-user-guide`
- `skill-authoring`
- `skill-installation`

它们和其他 AgentDock managed Skill 使用相同模型：每个名称只保留一份当前内容。AgentDock 不维护可供选择的 Skill 历史版本，也没有 active-version 指针。

需要额外账号、系统权限或第三方软件的 Skill 在实际需要时再单独安装。

## 使用 Skill

直接告诉 Agent 你的目标，例如：

```text
Check current Codex allowance.
Use the desktop Skill to operate this macOS app.
Install and use this Skill: https://example.com/example-skill.zip
```

Agent 通常会：

1. 用 `agentdock_context` 或 `workspace_context` 发现相关 Skill 候选及其来源。
2. 选择一个精确候选，再用 `read_file` 读取宿主返回的 `file`。
3. 检查需要的命令、账号、环境变量和安全边界。
4. 使用真实工具执行任务；需要绑定 Skill 的命令会把该候选返回的 `skill_ref` 交给 `exec_command`。
5. 对有副作用的操作进行确认并验证结果。

不要根据裸 Skill 名称自行拼接 `skill_ref`。宿主签发的引用用于区分同名的 managed、shared 和 workspace 候选。

## 工作区 Skill

项目可以在 `<workspace>/.agents/skills/<skill-name>/SKILL.md` 提供本地 Skill。`workspace_context` 会索引它们，并返回 `name`、`description`、`source_type`、`source_id`、`skill_ref`、`file` 等来源信息；不会把 Skill 正文直接注入上下文。

即使名称相同，workspace Skill、AgentDock managed Skill 和 `~/.agents/skills` 下的 shared Skill 仍是不同候选。处理当前项目时通常会优先考虑 workspace 候选，但 Agent 必须使用实际选中候选自己的 `file` 和 `skill_ref`，而不是依靠全局名称优先级静默切换来源。

## 安装或更新 managed Skill

安装前先确认来源可信。可以让 Agent 先做审查：

```text
Please review this Skill's source, files, portability, and permission requirements, then install it if the review is clean.
```

`skill_manage install` 支持本地 Skill 目录、本地 ZIP 包或 HTTPS 软件包地址，也可以提供可选的源文件 SHA-256 做完整性校验。

managed Skill 每个名称只有一份当前内容。同名但内容不同的包在校验后会原子替换当前内容；重复安装完全相同的内容是 no-op，并返回相同的 `content_digest`。AgentDock 不提供 Skill 的 `activate`、`rollback` 或版本选择 action。需要恢复到已知内容时，应重新审查并安装目标来源快照。

从使用历史 Skill 布局的旧版 AgentDock 升级时，受支持的安装器和更新器会自动迁移 managed Skill 当前内容与 Skill 持久数据。外层安装/更新事务真正提交前，旧布局会继续保留，因此用户不需要手工移动 Skill 目录，也不需要执行迁移命令。

Skill 包不能包含 Token、Cookie、浏览器登录态、`.env`、缓存或设备私有数据。

## 配置账号或 API Key

managed Skill 需要凭据时，让 Agent 保存到该 Skill 的独立环境，例如：

```text
Set EXAMPLE_API_KEY for example-skill without echoing the actual value in the reply.
```

`skill_manage env_list` 只返回变量名和配置状态，不回显秘密值。只有通过该 managed 候选自己的 `skill_ref` 运行命令时才会注入独立环境；它不会写进 Skill 包，也不会永久污染系统环境。

## Skill 持久数据

managed Skill 命令需要可变的持久状态时，AgentDock 会创建私有数据目录，并通过保留环境变量 `SKILL_DATA_DIR` 提供给该进程。

Skill 应把 `SKILL_DATA_DIR` 视为可选的 AgentDock 适配，而不是跨宿主的必需前提。shared 和 workspace 候选不会继承 managed Skill 的环境或数据目录。普通 managed Skill 更新以及 `skill_manage remove` 会保留独立环境和持久数据；执行带 `purge=true` 的 `skill_manage remove` 才会一并清理这些保留资源。

使用受支持的 AgentDock 安装器或内置更新器进行正常升级时，旧 managed Skill 布局会自动迁移，不需要用户手工搬目录。

## 使用时要注意

- 删除、发送、上传、支付或授权前应确认目标和副作用。
- Skill 说明不能突破 AgentDock 进程、容器 volume 或操作系统的权限边界。
- 第三方 Skill 可能调用外部服务，安装前应检查来源和能力范围。
- 不要把秘密粘贴到公开日志，也不要随 Skill 打包。
- `content_digest` 表示内容身份和审计证据，不是产品版本号。

## 查看已安装 Skill

可以直接询问：

```text
What Skills are available here, and where does each candidate come from?
```

Agent 可以用 `agentdock_context` 查看 managed/shared 候选，用 `workspace_context` 查看当前项目候选，只在真正需要时读取完整 Skill 文档。

创建和维护 Skill 属于开发者工作，见 [开发者指南](../contributing/development.md#skill-开发)。
