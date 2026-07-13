# AgentDock Docs

AgentDock 官方文档站，使用 Docusaurus、TypeScript 和 pnpm 构建。

## 本地开发

```bash
pnpm install
pnpm start
```

本地开发服务器默认运行在 `http://localhost:3000/agentdock-docs/`。

## 质量检查

```bash
pnpm check
```

该命令会依次执行 TypeScript 检查和生产构建。

## 文档结构

```text
docs/
├── getting-started/  # 安装与部署
├── concepts/         # Skill、任务、MCP、RecallDock
├── guides/           # 浏览器和桌面自动化
├── operations/       # 安全与排障
└── contributing/     # 开发约定
```

导航顺序由 `sidebars.ts` 显式维护，避免目录变化意外改变站点结构。

## 搜索

站点预留官方 Algolia DocSearch 配置。构建时同时提供以下环境变量后，搜索框会自动启用：

```bash
ALGOLIA_APP_ID=...
ALGOLIA_SEARCH_API_KEY=...
ALGOLIA_INDEX_NAME=...
pnpm build
```

未配置这些变量时，站点仍可正常构建和部署。

## 部署

`.github/workflows/docs.yml` 会在 Pull Request 中执行检查，并在 `main` 分支更新后构建和发布 GitHub Pages。

默认站点地址：

```text
https://uvwt.github.io/agentdock-docs/
```

## License

MIT
