# AgentDock Docs

AgentDock 官方公开文档，使用 Docusaurus、TypeScript 和 pnpm 构建。

- 线上站点：<https://uvwt.github.io/agentdock-docs/>
- AgentDock 源码：<https://github.com/uvwt/agentdock>

安装、配置、概念、运维和排障以本仓库为准；AgentDock 源码仓库 README 只保留入口和最短使用说明。

## 本地开发

```bash
pnpm install --frozen-lockfile
pnpm start
```

本地开发服务器默认运行在：

```text
http://localhost:3000/agentdock-docs/
```

## 质量检查

```bash
pnpm check
```

该命令会执行 TypeScript 检查和 Docusaurus 生产构建。

## 文档结构

```text
docs/
├── getting-started/  # 安装与部署
├── concepts/         # Skill、任务、动态 MCP、NexusDock Recall
├── guides/           # 浏览器和桌面自动化
├── operations/       # 安全与排障
└── contributing/     # 开发与贡献
```

导航顺序由 `sidebars.ts` 显式维护。

## 内容规范

- 面向公开用户，不记录个人设备路径、内网端口、私有域名或维护者凭据。
- 不把迁移历史、废弃接口清单和临时兼容方案放进主文档。
- 命令、参数和环境变量必须以当前源码为准。
- 修改用户可见行为时，代码和文档应在同一任务中完成验证。

## 搜索

构建时同时提供以下变量后启用 Algolia DocSearch：

```bash
ALGOLIA_APP_ID=...
ALGOLIA_SEARCH_API_KEY=...
ALGOLIA_INDEX_NAME=...
pnpm build
```

未配置搜索变量时，站点仍可正常构建和部署。

## 部署

`.github/workflows/docs.yml` 会在 Pull Request 中执行检查，并在 `main` 更新后发布 GitHub Pages。

## License

MIT
