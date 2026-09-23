# 开发者指南

本页面面向准备修改 AgentDock 源码、公开文档或第一方 Skill 的贡献者。

代码和公开文档分别维护：

- [`uvwt/agentdock`](https://github.com/uvwt/agentdock)
- [`uvwt/agentdock-docs`](https://github.com/uvwt/agentdock-docs)

修改用户可见行为时，应同步更新对应文档。

## 源码检查

在 AgentDock 仓库运行：

```bash
make check
```

该命令执行格式化、测试、vet 和构建。局部开发可以先运行包级测试，提交前仍应执行完整检查。

涉及并发、平台差异、安装器、Docker、浏览器、ACP 或桌面生命周期时，还要运行对应专项测试和真实环境验证。

## 文档检查

在 `agentdock-docs` 仓库运行：

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` 会运行 TypeScript 检查、locale 测试、中英文结构一致性检查、两个 locale 的生产构建以及默认生产构建。修改导航、布局或宽表格后，还应使用真实浏览器检查桌面和移动端页面。

## 公开契约原则

公开文档描述普通用户或第三方集成可以复现的行为，不是维护者个人笔记。

- 以当前 `main` 源码、公开 Release 资产、工具 Schema 和受支持的 UI/CLI 入口作为事实源。
- 工具名称和 action 从真实 MCP 契约推导；能力是否存在以客户端的 `tools/list` 为准，不要把内部 helper 写成公开工具。
- 运行配置从当前 Core 配置解析器和公开服务参数推导。安装器事务变量、测试开关、签名变量和维护者部署覆盖项不是用户配置。
- 示例使用 `example.com`、`<token>`、`<workspace>` 等通用占位符。禁止写入维护者用户名、设备名、私有主机名、本地项目路径、个人代理、私有端点或真实凭据。
- 文档描述受支持默认值和用户可控覆盖方式，不复制维护者机器拓扑。平台示例应能在普通该平台安装中复现。
- 主流程不保留兼容代码和迁移历史。只有当前用户仍可能遇到旧入口时才说明，并明确指出新的推荐方式。
- 同一次改动保持英文和简体中文语义同步。

如果源码注释或历史文档与可执行行为冲突，应先核对真实契约和测试，再更新用户文档；不要为了和旧版本措辞一致而继续保留过期说明。

## 改动原则

- 先检查现有目录、接口、错误处理和测试方式。
- 保持主流程可读，不为了形式化分层制造抽象。
- 修改工具描述、Schema、路径、认证、命令、浏览器、ACP 或桌面能力时同步更新测试。
- 修改安装器时验证帮助文本、默认值、生成文件、公开 Release 资产、升级、卸载和代表性安装路径。
- 除非公开 action 明确要求破坏性清理，否则应保留用户数据；普通更新/移除和 purge 行为要分开描述。
- 测试、示例、截图、日志和文档都不得暴露真实 Token、私有端点、个人目录或维护者凭据。

## 工具结果约定

MCP 协议层错误使用 `isError`。正常工具结果不使用含义模糊的通用 `ok` 或 `tool_ok`：

- 命令使用 `command_ok`、`exit_code` 和 `command_error`。
- 浏览器使用 `browser_ok` 和 `browser_error`。
- 其他工具使用 `changed`、`configured`、`written` 等明确的领域字段。

新增或修改输出 Schema 时，要验证 `structuredContent` 不会泄漏内部 HTTP、WSL 子进程、安装器或 Runner 协议中的通用状态字段。

## Skill 开发

第一方 Skill 使用“可移植文档核心 + 可选 AgentDock 适配”模型。最小结构：

```text
example-skill/
└── SKILL.md
```

按需增加 `references/`、`scripts/`、入口脚本和测试。要求：

- `SKILL.md` 必须有合法 `name`、有意义的 `description` 和非空说明正文。
- 包内使用相对路径；不要依赖维护者 checkout 路径或 AgentDock 私有状态路径。
- 脚本从当前进程环境读取配置，并把可变状态保存在包外。
- 不打包 `.env`、Token、缓存、登录态、数据库、下载结果、symlink 或设备私有数据。
- `metadata.version` 即使存在也只是作者元数据；AgentDock 不使用 Skill version 字段做安装选择、激活或回滚。
- 把 `content_digest` 视为当前内容身份。重复安装完全相同的 managed 内容是 no-op；内容变化时事务性替换当前 managed tree。
- 需要持久可变数据时，可移植代码应把 `SKILL_DATA_DIR` 视为可选 AgentDock 适配，不要硬编码 `~/.agentdock/data/...`。
- 使用 `skill-authoring` 检查结构、可移植性和安全性。运行时安装使用 `skill_manage`；不存在应该写入文档的 `skill_package validate` 兼容 action。
- 集成执行 Skill 绑定命令时，使用发现阶段由宿主签发的精确 `skill_ref`，不要根据裸名称自行构造。

用户流程见 [使用 Skill](../concepts/skills.md)。

## 跨仓库改动

一个用户可见改动可能涉及多个仓库：

- 工具行为、安装器、Core 配置和内置 Skill：修改 `uvwt/agentdock` 并同步对应文档。
- AgentDock/NexusDock 共享接口：协议契约变化时先更新 `uvwt/agentdock-protocol`，再同步两端实现和文档。
- 仅属于 NexusDock 的部署或 fleet UI 行为：修改 `uvwt/nexusdock` 和对应公开文档。
- 社区或独立发布的 Skill：更新 Skill 源仓库/目录，不要把维护者机器上的安装状态复制进 AgentDock 文档。

每个仓库的改动应能独立审查；公开契约跨仓库时，在 PR 中关联相关改动。

## 提交与发布

- `main` 是稳定分支。
- 提交信息遵循仓库当前约定；AgentDock 常用 `type(scope): 中文说明`。
- 提交前确认工作区只包含本次任务改动。
- 提交前运行完整仓库检查，推送后检查 GitHub Actions。
- 如果改动涉及导航、渲染、下载或可复制命令，发布后应实际访问部署页面验证。
- Release 签名、生产部署和维护者机器操作应进入维护者 Runbook 或自动化，不写进普通用户页面。
