# 在 macOS 上安装 AgentDock

普通用户推荐使用 macOS 图形应用安装。整个过程不需要打开终端，也不需要安装 Go、Git 或下载源码。

AgentDock 同时支持 Apple 芯片和 Intel Mac。安装后会常驻菜单栏，并在后台保持 AgentDock 服务可用。

## 开始前准备

- 使用 macOS 13 或更高版本。
- 只从官方 [GitHub Release 页面](https://github.com/uvwt/agentdock/releases/latest)下载 AgentDock。
- 需要浏览器自动化时，请先安装 Google Chrome 或 Chromium。浏览器工具不使用 Safari。
- 固定公网地址需要一个已经接入 Cloudflare 的域名和对应的 Cloudflare Tunnel Token。没有这些条件时，直接选择临时公网地址即可。

## 1. 下载应用

1. 打开 [AgentDock 最新版本](https://github.com/uvwt/agentdock/releases/latest)。
2. 下载 `AgentDock-macos-universal.dmg`。
3. 双击 DMG，打开 AgentDock 磁盘映像。
4. 把 `AgentDock.app` 拖到 DMG 窗口中的“应用程序”快捷入口。
5. 复制完成后推出 AgentDock 磁盘映像。

Apple 芯片和 Intel Mac 使用同一个 DMG，不需要判断自己的处理器型号。macOS Release 只提供这一个 DMG，不需要在 ZIP 和 DMG 之间选择。

:::note
如果 Release 中没有 `AgentDock-macos-universal.dmg`，说明该版本发布时还没有包含图形应用。可以先使用[命令行安装](../operations/macos.md#命令行安装)，或等待下一个包含图形应用的版本。
:::

## 2. 第一次打开

当前免费版本使用 ad-hoc 签名，还没有经过 Apple 公证，因此第一次启动需要手动确认一次：

1. 在 Finder 中打开“应用程序”。
2. 右键点击 `AgentDock.app`，选择“打开”。
3. 在确认窗口中再次点击“打开”。

不需要关闭 Gatekeeper，也不要修改系统全局安全设置。成功打开一次后，以后可以正常双击启动。

AgentDock 启动后会出现在菜单栏。点击图标，选择“安装 AgentDock”或“打开 AgentDock”即可显示主窗口。

## 3. 选择连接方式

第一次安装时，在窗口中选择以下三种方式之一。

### 仅本机

当 MCP 客户端也运行在这台 Mac 上时，选择“仅本机”。

这是最简单、最安全的首次安装方式，不需要域名，也不需要 Cloudflare 账号。

### 临时公网地址

需要从 ChatGPT 或其他远程客户端连接，但还没有准备 Cloudflare 域名时，选择“临时地址”。

AgentDock 会自动生成一个 HTTPS 公网地址。Tunnel 或 Mac 重启后，这个地址可能变化。地址变化时，只需从 AgentDock 窗口复制新的公网 MCP 地址，并在客户端中替换旧地址。

### 固定域名

准备长期使用稳定地址时，选择“固定域名”。

需要填写：

- HTTPS 公网地址，例如 `https://mini.example.com`
- 该地址对应的 Cloudflare Tunnel Token

公网地址只填写域名部分，不要在后面添加 `/mcp`，AgentDock 会自动补上。

还没有 Cloudflare 域名或 Tunnel Token 时，不要卡在这里，先使用“临时地址”即可。

点击“安装并启动”，保持窗口打开，直到状态显示“运行正常”。

## 4. 复制连接信息

安装完成后，主窗口会显示：

- 服务状态和版本
- 本地 MCP 地址
- 公网 MCP 地址（启用公网访问时）
- Bearer Token
- OAuth 登录密码（启用公网访问时）

长地址和凭据建议直接点击“复制”，不要手动框选。凭据默认会被遮罩，只有确实需要查看时再点击“显示”。

客户端也在这台 Mac 上时，使用本地 MCP 地址；客户端在其他设备或云端时，使用公网 MCP 地址。

不要把 Bearer Token 或 OAuth 密码放进截图、Issue 或公开聊天。其他人拿到有效凭据后，可能可以操作你的 AgentDock 服务。

下一步见 [连接 MCP 客户端](./install.md#安装完成后)。

## 5. 日常使用控制面板

以后点击菜单栏中的 AgentDock 图标，就可以：

- 查看服务是否正常
- 复制本地或公网 MCP 地址
- 复制 Bearer Token 或 OAuth 密码
- 启动、停止或重启服务
- 更新 AgentDock 核心程序
- 打开日志目录

退出菜单栏应用不会自动停止 AgentDock 服务。菜单栏应用和核心服务有各自独立的登录自启设置。

## 可选：启用浏览器工具

1. 打开“高级设置”。
2. 勾选“启用浏览器工具”。
3. 等待自动安装完成。
4. 点击“应用并重启”。

第一次启用时，AgentDock 会自动安装并验证 Browser Runner 和兼容的 Node.js 运行环境，不需要用户自己安装 Node.js。取消勾选只会停用浏览器工具，已经下载的文件会保留，下次启用无需重新完整安装。

浏览器自动化建议使用独立 Profile。除非任务确实需要，不要让 Agent 直接使用你的日常浏览器主 Profile。

## 可选：设置登录后自动启动

高级设置中有两个互不影响的开关：

- “登录后自动启动 AgentDock 服务”：让 MCP 服务在后台保持可用。
- “登录后显示 AgentDock 菜单栏”：只负责打开菜单栏应用。

普通用户建议两个都保持开启。也可以只关闭菜单栏开关，同时让核心服务继续在登录后自动运行。

## 更新 AgentDock

在主窗口中点击“检查更新”，可以更新 AgentDock 核心程序和官方核心 Skill。

菜单栏应用需要单独替换。发布新版 macOS 应用后，重新下载最新 ZIP，并用新的 `AgentDock.app` 替换“应用程序”中的旧版本即可。原有配置、Skill、任务和工作目录不会被删除。

## 常见问题

### macOS 提示无法验证开发者

在“应用程序”中右键 AgentDock，选择“打开”。第一次不要直接双击。

### 服务状态异常

先点击“重新启动”，再打开日志目录。最新错误通常在 `agentdock.err.log` 中。

### 临时公网地址变化了

从 AgentDock 窗口复制新的公网 MCP 地址，在客户端中替换旧地址；客户端要求时重新完成 OAuth 授权。已有 Bearer Token 和 OAuth 密码不会变化。

### 浏览器工具无法启动

确认已经安装 Google Chrome 或 Chromium，然后关闭再重新启用浏览器工具。第一次安装如果本机没有兼容的 Node.js，还需要联网下载托管运行环境。

## 进阶与命令行安装

图形应用是普通用户的默认安装方式。指定版本、自定义安装目录、管理文件、手动服务命令和卸载步骤见 [macOS 进阶配置](../operations/macos.md)。

需要控制屏幕、键盘和鼠标时，继续阅读 [macOS 桌面自动化](../guides/desktop-automation.md)。
