---
sidebar_position: 1
slug: /intro
---

# AgentDock

AgentDock 让支持 MCP 的 AI 客户端可以在你的电脑或服务器上读取文件、执行命令、操作 Git，并按需启用浏览器或连接其他服务。

它不会替你决定权限范围。AgentDock 能访问什么，取决于运行它的系统用户、Docker 挂载目录和你启用的功能。

## 第一次使用

先打开 [安装 AgentDock](./getting-started/install.md)，按当前系统选择原生安装。已经在使用 Docker，或需要隔离运行环境时再选择 Docker。

| 当前环境 | 推荐入口 |
| --- | --- |
| macOS | [macOS 安装](./getting-started/macos.md) |
| Windows 11 | [Windows 安装](./getting-started/windows.md) |
| Linux 服务器或桌面 | [Linux 安装](./getting-started/linux.md) |
| 已经安装 Docker | [Docker 安装](./getting-started/docker.md) |

安装完成后，把页面给出的 MCP 地址和 Token 填入客户端即可。第一次使用不需要先理解完整配置、systemd、WSL、容器数据卷或反向代理。

## 可以让它做什么

连接成功后，可以直接向 Agent 提出任务，例如：

- “检查这个项目为什么启动失败，并修好后验证。”
- “读取这份仓库，修改代码并提交。”
- “打开网页完成查询，并把结果整理成文件。”
- “安装并使用一个 Skill。”
- “接入一个外部 MCP 服务。”
- “把长任务拆成步骤，并持续更新进度。”

Agent 会根据任务选择文件、命令、Git、浏览器、Skill 或外部 MCP 工具。普通用户通常不需要逐个手动调用工具。

## 数据保存在哪里

裸机安装默认使用：

```text
~/.agentdock   AgentDock 状态、任务、Skill 和配置
~/AgentDock    默认工作目录
```

Docker 安装默认把这两类数据保存到 Docker volume。删除程序或容器不一定会删除数据；执行清理命令前请先确认是否需要保留。

## 常用入口

- [使用 Skill](./concepts/skills.md)
- [任务与进度](./concepts/tasks.md)
- [浏览器自动化](./guides/browser-control.md)
- [连接外部 MCP](./concepts/dynamic-mcp.md)
- [完整配置参考](./reference/configuration.md)
- [故障排查](./operations/troubleshooting.md)

需要修改反向代理、系统服务、容器挂载或完整环境变量时，再进入“进阶与运维”。
