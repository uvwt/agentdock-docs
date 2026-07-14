# 开发与质量门禁

AgentDock 源码和公开文档分别维护：

- 代码仓库：[`uvwt/agentdock`](https://github.com/uvwt/agentdock)
- 文档仓库：[`uvwt/agentdock-docs`](https://github.com/uvwt/agentdock-docs)

修改用户可见行为时，应在同一任务中同步更新文档仓库，避免代码和说明长期分叉。

## 源码质量门禁

在 AgentDock 仓库运行：

```bash
make check
```

该命令会执行：

```bash
gofmt -w ./cmd ./internal
go test ./...
go vet ./...
go build -trimpath -o ./bin/agentdock ./cmd/agentdock
```

局部迭代可以先运行包级测试，提交前仍应执行完整门禁。

## 文档质量门禁

在 `agentdock-docs` 仓库运行：

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` 会执行 TypeScript 检查和 Docusaurus 生产构建，并验证内部链接。

## macOS 源码部署

`make install-macos` 面向普通用户：它下载 GitHub Release，并安装到 `~/.local/bin/agentdock`。已有 LaunchAgent 如果固定运行源码仓库内的二进制，不应使用这个目标更新生产实例。

贡献者从源码更新现有 macOS 裸机实例时，使用：

```bash
make check

AGENTDOCK_CODESIGN_IDENTITY="<codesign identity>" \
AGENTDOCK_CODESIGN_KEYCHAIN="<keychain path>" \
AGENTDOCK_CODESIGN_IDENTIFIER="com.local.agentdock" \
make deploy-macos-source

make restart-macos
make smoke-macos
```

`deploy-macos-source` 会重新执行格式、测试和 vet，构建临时二进制，要求稳定代码签名，备份旧二进制，再替换源码仓库内的运行文件。重启后仍需检查 healthz、实际监听 PID、错误日志和签名；不能只因为 healthz 返回成功就认定新进程已经接管端口。

文档职责：

- 源码仓库 README 只保留产品摘要、最短启动方式、开发门禁和在线文档入口。
- 安装、配置、概念、运维和排障统一写入文档仓库。
- 代码内部设计规则保留在源码仓库的开发规范中，不复制成面向普通用户的长篇实现说明。
- 文档不得出现真实 Token、Cookie、OAuth Code、私有端点、个人目录或设备专用凭据。

## 改动要求

- 先检查现有目录、接口、错误处理和测试方式。
- 让主流程保持可读，不为了形式化分层制造抽象。
- 修改工具描述、Schema、路径策略、认证、命令执行、浏览器或桌面自动化时，同步更新测试。
- MCP 工具结果不得使用含义不明确的通用 `ok`。工具调用错误由 MCP `isError` 表达；命令、浏览器和业务状态分别使用 `command_ok`、`browser_ok` 或明确的领域字段。
- 新增或修改输出 Schema 时，验证 `structuredContent` 不会泄漏内部 HTTP、WSL 子进程或 Runner 协议中的通用状态字段。
- 修改安装脚本时，至少验证帮助文本、默认值、生成文件和代表性安装路径。
- 修改文档导航时更新 `sidebars.ts`，不要依赖目录自动排序。

## Skill 开发

第一方 Skill 遵循“可移植核心 + 可选宿主适配”：

- 包内使用相对路径。
- 脚本只读取当前进程环境。
- 不硬编码安装版本、用户绝对路径或 AgentDock 私有状态文件。
- 不把环境文件、缓存、登录态和设备私有数据打进包。
- 修改正文、引用或脚本后递增语义化版本。
- 先用 `skill-authoring` 检查可移植性和创作质量，再用 `skill_package validate` 检查安装合法性。

完整模型见 [Skill 设计与运行模型](../concepts/skills.md)。

## 提交约定

- `main` 是稳定分支。
- 提交信息使用 `type(scope): 中文说明`。
- 提交前确认工作区只包含本次任务改动。
- 推送后检查 GitHub Actions；文档改动还应实际访问线上页面。
