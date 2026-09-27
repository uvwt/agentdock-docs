# 开发者指南

本页提供 AgentDock、NexusDock 和相关仓库的开发入口。

## 主要仓库

- [`uvwt/agentdock`](https://github.com/uvwt/agentdock)：AgentDock Core、桌面客户端、工具和内置能力。
- [`uvwt/nexusdock`](https://github.com/uvwt/nexusdock)：多设备控制台、统一 MCP、Recall 和 Workflow。
- [`uvwt/agentdock-protocol`](https://github.com/uvwt/agentdock-protocol)：AgentDock 与 NexusDock 的共享协议。
- [`uvwt/agentdock-docs`](https://github.com/uvwt/agentdock-docs)：公开文档。

## 本地检查

### AgentDock

```bash
make check
```

涉及桌面客户端、安装器、浏览器或平台差异时，还应运行对应测试并在真实环境中验证。

### NexusDock

首次开发：

```bash
make web-deps
make build
```

日常检查：

```bash
make check
```

需要完整验证时：

```bash
make ci
```

### 文档

```bash
pnpm install --frozen-lockfile
pnpm check
```

修改导航或页面布局后，再用真实浏览器检查桌面和移动端效果。

## 开发时注意

- 修改前先了解现有目录、接口、错误处理和测试方式。
- 修改用户可见行为时，同步更新测试和公开文档。
- AgentDock 与 NexusDock 的共享接口变化时，同步检查 `agentdock-protocol` 和两端实现。
- 示例、测试、日志和文档不要包含真实 Token、私有地址、个人路径或其他敏感信息。
- 涉及平台、安装、网络或 UI 的改动，应在对应真实环境中验证。

## Skill 开发

Skill 应保持可移植，不依赖维护者机器上的路径、凭据或私有状态。最小结构：

```text
example-skill/
└── SKILL.md
```

按需添加脚本、参考资料和测试。运行时安装使用 `skill_manage`，用户使用方式见 [使用 Skill](../concepts/skills.md)。
