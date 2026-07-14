# 安装 AgentDock

选择你正在使用的系统。普通用户优先使用原生安装；已经在使用 Docker，或希望隔离运行环境时再选择 Docker。

| 当前环境 | 推荐方式 |
| --- | --- |
| macOS | [macOS 安装](./macos.md) |
| Windows 11 | [Windows 安装](./windows.md) |
| Linux 服务器或桌面 | [Linux 安装](./linux.md) |
| 已经安装 Docker | [Docker 安装](./docker.md) |

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
- 希望直接使用浏览器自动化且不手动准备 runner：选 Docker，再[启用 browser 镜像](../operations/docker.md#启用浏览器自动化)。
- 需要 macOS 屏幕和辅助功能自动化：必须使用 macOS 原生安装，Docker 无法控制宿主桌面。
