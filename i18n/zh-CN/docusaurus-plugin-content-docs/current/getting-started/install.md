# 安装 AgentDock

普通用户直接使用对应系统的正式安装包即可，不需要下载源码，也不需要安装 Go。

| 你正在使用的环境 | 推荐方式 |
| --- | --- |
| Windows 11 | [Windows 图形安装](./windows.md) |
| macOS 13 或更高版本 | [macOS 图形安装](./macos.md) |
| Linux 服务器或桌面 | [Linux 自动安装](./linux.md) |
| 已经安装 Docker | [Docker 安装](./docker.md) |

在自己的 Windows 或 Mac 上使用时，优先选择图形安装。只有已经在使用 Docker，或确实需要容器隔离时，才建议选择 Docker。

## 安装时要做的选择

Windows 和 macOS 安装界面会让你选择连接方式：

| 连接方式 | 适合场景 | 需要准备 |
| --- | --- | --- |
| 仅本机 | MCP 客户端和 AgentDock 在同一台电脑上 | 无 |
| 临时公网地址 | 从 ChatGPT、手机或其他设备连接，暂时没有域名 | 可访问互联网 |
| 固定域名 | 长期使用稳定公网地址 | 已接入 Cloudflare 的域名和 Tunnel Token |

第一次使用建议先选 **仅本机**。确认 AgentDock 正常运行后，再按需要开启公网访问。

:::warning
公网地址必须配合 Bearer Token 或 OAuth 使用。不要把连接凭据放进截图、Issue 或公开聊天。
:::

## 安装完成后

安装完成后，需要从控制面板或终端取得：

```text
MCP 地址
Bearer Token 或 OAuth 登录信息
```

把这些信息填入客户端的 MCP、Tools 或 Connectors 设置，并选择 **Streamable HTTP**。

- 客户端和 AgentDock 在同一台设备上：使用本地 MCP 地址。
- 客户端在其他设备或云端：使用公网 MCP 地址。
- 临时公网地址变化后：在客户端中替换旧地址，并按提示重新授权 OAuth。

:::tip
第一次使用只需要完成对应系统页面中的编号步骤。自定义端口、固定版本、自动化参数和手动服务管理都可以以后再看。
:::
