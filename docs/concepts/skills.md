# Skill 设计与运行模型

AgentDock 的 Skill 是给模型读取的工作方法和能力契约，不是插件进程或黑盒执行器。模型先读取 `SKILL.md`，理解触发条件、步骤和安全边界，再使用文件、命令、浏览器或 MCP 等真实工具完成工作。

## 核心原则

第一方 Skill 采用：

```text
可移植核心 + 可选 AgentDock 宿主适配
```

可移植核心应满足：

- 包内文件使用相对路径。
- 配置和凭据只从当前进程环境读取。
- 辅助脚本可以从 Skill 包根目录直接运行。
- 输入输出使用普通文本、JSON 或标准协议。
- 不绑定固定用户目录、安装版本或 AgentDock 私有状态文件。

AgentDock 宿主适配负责：

- 通过 `agentdock_context` 发现当前激活 Skill。
- 通过 `read_file` 读取 `skill://<name>/SKILL.md`。
- 通过 `skill_package` 校验、安装、回滚和管理独立环境。
- 通过 `exec_command skill=<name>` 绑定当前激活包目录和环境。

## 包结构

最小 Skill：

```text
example-skill/
└── SKILL.md
```

按需增加：

```text
example-skill/
├── SKILL.md
├── references/
├── scripts/
├── run.py
└── tests/
```

`SKILL.md` Frontmatter：

```yaml
---
name: example-skill
description: 说明何时使用、解决什么问题以及能力边界
version: 1.0.0
---
```

辅助脚本不是统一入口。Skill 文档应说明从包根目录如何运行脚本，例如：

```bash
printf '%s' '{"skill_action":"status"}' | python3 run.py
```

## 安装与环境

校验并安装：

```text
skill_package action=validate source=<path-or-url>
skill_package action=install source=<path-or-url> channel=stable
```

配置环境变量：

```text
skill_package action=env_set skill=example-skill key=EXAMPLE_API_KEY value=...
skill_package action=env_list skill=example-skill
```

`env_list` 只返回变量名和是否已配置。环境文件、Token、Cookie、Session、缓存和设备私有数据不得进入 Skill 包。

## 执行语义

在 AgentDock 中运行当前激活 Skill 的辅助脚本：

```text
exec_command
  skill: example-skill
  cmd: python3 run.py
```

未显式指定 `workdir` 时，命令从当前激活包根目录运行；Skill 独立环境只注入本次命令。显式 `workdir` 和 `env` 的优先级更高，命令结束后不会污染 AgentDock 主进程或系统环境。

## 更新与验证

1. 修改正文、引用、脚本或测试。
2. 递增语义化版本。
3. 运行包内测试和语法检查。
4. 使用 `skill-authoring` 检查可移植性和创作质量。
5. 使用 `skill_package validate` 检查包结构与安装安全。
6. 安装激活后，通过 `agentdock_context`、`skill://` 和代表性只读动作验证。

同名同版本的 Skill 内容应保持不可变；需要修改时发布新版本。
