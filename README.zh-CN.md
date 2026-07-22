# AgentDock Docs

[English](./README.md) | 简体中文

AgentDock 官方公开文档，使用 Docusaurus、TypeScript 和 pnpm 构建。

- 线上站点：<https://uvwt.github.io/agentdock-docs/>
- 简体中文站点：<https://uvwt.github.io/agentdock-docs/zh-CN/>
- AgentDock 源码：<https://github.com/uvwt/agentdock>

安装、配置、概念、运维和排障以本仓库为准；AgentDock 源码仓库 README 只保留项目概览和最短使用入口。

## 本地开发

```bash
pnpm install --frozen-lockfile
pnpm start
```

启动简体中文站点：

```bash
pnpm start -- --locale zh-CN
```

本地开发服务器默认运行在：

```text
http://localhost:3000/agentdock-docs/
```

## 质量检查

```bash
pnpm check
```

该命令会执行 TypeScript 检查，校验英文与简体中文文档的路径和结构一致，并分别完成两种语言的生产构建。

## 文档结构

```text
docs/                                            # 英文源文档
├── getting-started/                             # 普通用户安装与首次连接
├── concepts/                                    # Skill、任务、动态 MCP、NexusDock Recall
├── guides/                                      # 浏览器和桌面自动化
├── reference/                                   # 完整配置与工具参考
├── operations/                                  # 高级部署、安全与排障
└── contributing/                                # 开发者指南

i18n/zh-CN/docusaurus-plugin-content-docs/current/  # 路径一一对应的简体中文文档
```

导航顺序由 `sidebars.ts` 显式维护。`i18n/zh-CN/` 下的 Docusaurus locale 资源负责首页、导航栏、页脚、侧栏和主题文案的中文本地化。

## 本地化规范

- 英文与简体中文文档必须拥有完全一致的相对文件路径。
- 对应页面必须保持相同的标题层级、章节顺序、代码块语言、命令、配置字段和链接目标。
- 翻译可以遵循各自语言的自然表达，但不能新增、删除或改变产品行为。
- 新增、删除或重命名页面时，必须在同一次修改中处理两种语言。
- 共用图片保留在 `static/img/`，不重复存放与语言无关的资源。

## 内容规范

- 普通用户页面先给出可完成的最短路径，内部实现、完整参数和维护者流程进入参考、运维或开发者章节。
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
