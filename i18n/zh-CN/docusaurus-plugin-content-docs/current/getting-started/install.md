# 安装 AgentDock

选择你正在使用的系统。普通用户优先使用原生安装；已经在使用 Docker，或希望隔离运行环境时再选择 Docker。

| 当前环境 | 推荐方式 |
| --- | --- |
| macOS | [macOS 图形应用（推荐）](./macos.md) |
| Windows 11 | [Windows 安装](./windows.md) |
| Linux 服务器或桌面 | [Linux 安装](./linux.md) |
| 已经安装 Docker | [Docker 安装](./docker.md) |

以上标准安装方式都会自动安装并激活 AgentDock 官方核心 Skill。用户安装的其他 Skill、已有版本和独立环境仍保存在同一个 Skill Store 中，升级 AgentDock 时不会被清空。

从尚未包含核心 Skill Bundle 的旧版本首次升级时，需要重新运行对应平台的安装脚本；完成这次升级后，后续 `agentdock update` 会同步更新二进制和官方核心 Skill。

不需要下载源码，也不需要安装 Go 或自己构建 AgentDock。

## 安装完成后

每个安装页面都会给出两项信息：

```text
MCP 地址
连接 Token（仅启用认证时需要）
```

把它们填入客户端的 MCP、Tools 或 Connectors 设置即可。传输方式选择 **Streamable HTTP**。

:::tip
第一次使用只需要完成对应系统页面中的编号步骤。页面末尾的进阶链接都可以以后再看。
:::

## 不确定选哪个

- 在自己的 Mac 或 Windows 电脑上使用：选原生安装。
- 在 Linux 服务器上长期运行：选 Linux 安装。
- 只想快速隔离体验，且电脑已经装好 Docker：选 Docker。
- 在 macOS 上使用浏览器自动化：图形应用可以在“高级设置”中自动安装浏览器支持。
- 其他系统不想手动准备原生 Browser Runner：可以使用 Docker。
- 需要控制 macOS 屏幕和辅助功能：使用 macOS 图形应用，Docker 无法控制宿主桌面。
