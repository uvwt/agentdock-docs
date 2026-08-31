# 开发者指南

本页面向准备修改 AgentDock 源码、文档或第一方 Skill 的贡献者。

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

涉及并发、平台差异、安装器、Docker 或浏览器时，还应运行对应专项测试和真实验证。

## 文档检查

在 `agentdock-docs` 仓库运行：

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` 会运行 TypeScript 检查、Docusaurus 生产构建和内部链接验证。修改导航、布局或长表格后，还要用真实浏览器检查桌面和移动端。

## 改动原则

- 先检查现有目录、接口、错误处理和测试方式。
- 保持主流程可读，不为了形式化分层制造抽象。
- 修改工具描述、Schema、路径、认证、命令、浏览器或桌面能力时同步更新测试。
- 修改安装脚本时验证帮助文本、默认值、生成文件和代表性安装路径。
- 不在公开文档中记录真实 Token、私有端点、个人目录或维护者凭据。
- 迁移历史、临时兼容和维护者机器部署细节不进入用户文档。

## 工具结果约定

MCP 协议层错误使用 `isError`。正常工具结果不使用含义模糊的通用 `ok` 或 `tool_ok`：

- 命令使用 `command_ok`、`exit_code` 和 `command_error`。
- 浏览器使用 `browser_ok` 和 `browser_error`。
- 其他工具使用 `valid`、`changed`、`configured` 等明确领域字段。

新增或修改输出 Schema 时，要验证 `structuredContent` 不会泄漏内部 HTTP、WSL 子进程或 Runner 协议中的通用状态字段。

## Skill 开发

第一方 Skill 采用“可移植核心 + 可选 AgentDock 适配”。最小结构：

```text
example-skill/
└── SKILL.md
```

按需增加 `references/`、`scripts/`、入口脚本和测试。要求：

- 包内使用相对路径。
- 脚本只读取当前进程环境。
- 不硬编码用户绝对路径、安装版本或 AgentDock 私有状态文件。
- 不把环境文件、缓存、登录态和设备私有数据打进包。
- 修改正文、引用或脚本后递增语义化版本。
- 先用 `skill-authoring` 检查内容和可移植性，再用 `skill_package validate` 检查包结构。

Skill 使用方式见 [使用 Skill](../concepts/skills.md)。

## 提交与发布

- `main` 是稳定分支。
- 提交信息使用 `type(scope): 中文说明`。
- 提交前确认工作区只包含本次任务改动。
- 推送后检查 GitHub Actions。
- 文档改动上线后实际访问页面。
- Release、签名、生产部署和维护者机器操作应遵循源码仓库当前维护规范，不复制到用户页面。
