# MacOS 安装

使用 macOS 图形应用安装和管理 AgentDock。

同一个安装包同时支持 Apple 芯片和 Intel Mac。

## 开始前准备

- 使用 macOS 13 或更高版本。
- 只从官方 [AgentDock 下载入口](https://download.nexusdock.co/latest/macos)下载 AgentDock。
- 固定公网地址需要已经接入 Cloudflare 的域名和对应的 Tunnel Token。没有这些条件时，先选择临时公网地址。
- 需要浏览器自动化时，请先安装 Google Chrome、Chromium 或 Microsoft Edge。

## 1. 下载并安装应用

1. 下载最新的 [AgentDock macOS 安装包](https://download.nexusdock.co/latest/macos)。
2. 双击 `AgentDock-macos-universal.dmg`。
3. 把 `AgentDock.app` 拖到“应用程序”。
4. 复制完成后推出磁盘映像。

Apple 芯片和 Intel Mac 使用同一个 DMG。

## 2. 第一次打开

在 Finder 中打开“应用程序”，启动 `AgentDock.app`。

AgentDock 启动后会出现在菜单栏。点击图标并选择“安装 AgentDock”或“打开 AgentDock”，即可显示主窗口。

如果 macOS 第一次启动时拦截应用，参阅下方的 [macOS 提示无法验证开发者](#macos-提示无法验证开发者)。

## 3. 选择连接方式

### 仅本机

MCP 客户端也在这台 Mac 上时选择。该模式不需要域名或 Cloudflare 账号。

### 临时公网地址

需要从 ChatGPT、手机或其他设备连接，但还没有域名时选择。AgentDock 会自动生成一个 HTTPS 公网地址。

这个地址可能在 Mac 或 Tunnel 重启后变化。地址变化时，从控制面板复制新地址，并替换客户端中的旧地址。

### 固定域名

需要长期使用稳定地址时，先按 [公网访问](../operations/public-access.md) 完成 Cloudflare 侧设置。然后在 AgentDock 中选择“固定域名”，填写该教程得到的 HTTPS 公网地址和 Tunnel Token。公网地址不要添加 `/mcp`。

点击“安装并启动”，保持窗口打开，直到状态显示“运行正常”。安装完成后，可以直接在控制面板切换公网访问方式，不需要重新运行安装器。

## 4. 连接 MCP 客户端

安装完成后，主窗口会显示：

- 服务状态和版本
- 本地 MCP 地址
- 公网 MCP 地址（已开启公网访问时）
- Bearer Token
- OAuth 登录密码（已开启公网访问时）

凭据默认会被遮罩，需要时点击“显示”。长地址和凭据可以直接点击“复制”。

客户端也在这台 Mac 上时，使用本地 MCP 地址；其他设备或云端客户端使用公网 MCP 地址。传输方式选择 **Streamable HTTP**。

不同客户端的添加入口和认证方式略有不同。支持 OAuth 的客户端可以通过浏览器完成授权；支持自定义 HTTP Header 的客户端也可以使用 Bearer Token。

Claude Desktop、ChatGPT、Claude Code、Cursor、VS Code、Codex、TRAE、WorkBuddy 等客户端的连接方式见 [在不同客户端中连接](../guides/mcp-clients.md) 与 [使用 ChatGPT 连接](../guides/chatgpt.md)。

不要把 Bearer Token 或 OAuth 密码放进截图、Issue 或公开聊天。

## 5. 日常使用

点击菜单栏中的 AgentDock 图标可以：

- 查看服务状态和版本
- 打开控制面板
- 启动、停止或重启服务
- 检查更新
- 打开日志和配置目录

控制面板还可以测试公网地址、切换连接方式和重新生成临时地址。

退出菜单栏应用不会自动停止 AgentDock 服务。菜单栏应用和核心服务有各自独立的登录自启设置。

## 可选：启用浏览器工具

1. 如果还没有浏览器，先安装 Google Chrome、Chromium 或 Microsoft Edge。
2. 打开“高级设置”。
3. 勾选“启用浏览器工具”。
4. 确认 AgentDock 已检测到受支持的浏览器。
5. 点击“应用并重启”。

AgentDock 默认使用独立的浏览器会话。登录状态和安全边界见 [浏览器自动化](../guides/browser-control.md)。

## 可选：设置登录后自动启动

高级设置中有两个互不影响的开关：

- 登录后自动启动 AgentDock 服务
- 登录后显示 AgentDock 菜单栏

建议两个都保持开启。也可以只关闭菜单栏开关，让核心服务继续在后台自动运行。

## 更新或修复

直接在主窗口中点击“检查更新”。当前版本会把 AgentDock Core、macOS 图形应用和官方核心 Skill 作为一次完整更新处理，并在需要时恢复托管服务、重新打开应用。

原有配置、Skill、任务和工作目录都会保留。如果你正在从还没有集成桌面更新器的旧版本升级，先用最新 DMG 覆盖安装一次，之后继续使用应用内更新即可。

## 常见问题

### macOS 提示无法验证开发者

在“应用程序”中右键 AgentDock，选择“打开”。第一次不要直接双击。

### 服务状态异常

先点击“重新启动”，再打开日志目录。最新错误通常在 `agentdock.err.log` 中。

### 临时公网地址变化了

从控制面板复制新的公网 MCP 地址，在客户端中替换旧地址；客户端要求时重新完成 OAuth 授权。已有 Bearer Token 和 OAuth 密码不会变化。

### 浏览器工具无法启动

确认已经安装 Google Chrome、Chromium 或 Microsoft Edge，然后关闭再重新启用浏览器工具。

自定义安装目录、手动服务命令和卸载步骤见 [桌面端高级设置](../operations/desktop.md)。
