# Windows 安装

普通用户推荐使用签名离线安装包。安装过程不需要 PowerShell、WSL、Go 或源码。

AgentDock 支持 Windows 11 x64 和 ARM64。

## 1. 下载安装包

打开 [AgentDock 最新版本](https://github.com/uvwt/agentdock/releases/latest)，根据电脑类型下载：

- 大多数 Intel 或 AMD 电脑：`AgentDockSetup-amd64.exe`
- Windows ARM 电脑：`AgentDockSetup-arm64.exe`

不确定时，通常选择 `amd64`。

安装包已经包含 AgentDock 核心、控制面板、核心 Skill 和 Cloudflare 组件。安装和升级时不会再从 GitHub 下载这些组件。

## 2. 正常双击运行

直接双击安装包，不要右键选择“以管理员身份运行”。

安装程序只在确实需要时弹出 UAC，例如启用管理员增强模式。看到 UAC 提示时，确认发布者和文件名无误后再继续。

## 3. 选择启动方式

普通用户建议保留默认选项：

- 登录 Windows 后自动启动 AgentDock 和托盘
- 以管理员权限运行 AgentDock 核心

管理员增强模式只作用于 AgentDock 核心，控制面板和托盘仍按当前用户运行。当前账号无法提权时，可以取消管理员增强模式，AgentDock 会以普通用户模式运行。

## 4. 选择连接方式

### 仅本机使用

适合 MCP 客户端也在这台电脑上的情况。这是第一次安装最简单、最安全的选择，不需要域名或 Cloudflare 账号。

### 临时公网地址

适合从 ChatGPT、手机或其他设备连接，但暂时没有域名的情况。AgentDock 会自动生成 `trycloudflare.com` 地址。

临时地址可能在 Windows 或 Tunnel 重启后变化。地址变化时，在控制面板中查看新地址，再替换客户端中的旧地址。

### 使用自己的 Cloudflare 域名

适合长期使用稳定地址。需要填写：

- HTTPS 公网地址，例如 `https://mini.example.com`
- 对应的 Cloudflare Tunnel Token

公网地址只填写域名部分，不要添加 `/mcp`。

## 5. 完成安装

“添加桌面快捷方式”默认已勾选。点击“完成”后会打开 AgentDock 控制面板，以后也可以从开始菜单、桌面快捷方式或系统托盘打开。

等待右上角显示“运行正常”，并确认版本、本地 MCP 地址和所选的公网地址已经显示。

:::tip
检测到旧版本时，安装程序默认选择“直接升级并保留当前全部设置”。普通升级保持这个选项即可；只有需要更改启动或连接方式时，才选择“修改设置”。
:::

## 6. 连接 MCP 客户端

在控制面板的“概览”页查看：

- 本地 MCP 地址
- 公网 MCP 地址（已开启公网访问时）
- Bearer Token
- OAuth 密码（已开启公网访问时）

凭据默认会被遮罩，需要时点击“显示”。文本框中的内容可以使用 Windows 的标准复制操作。

同一台电脑上的客户端使用本地 MCP 地址；ChatGPT 或其他远程客户端使用公网 MCP 地址。传输方式选择 **Streamable HTTP**。

不要把 Bearer Token 或 OAuth 密码放进截图、Issue 或公开聊天。

## 日常使用

控制面板可以查看状态和版本、启动或停止服务、测试公网地址、切换连接方式、重新生成临时地址，以及调整端口、日志和开机启动设置。

托盘菜单适合快速查看状态、重启服务、重新生成临时公网地址和打开日志。

## 更新或修复

需要更新完整的 Windows 应用时，重新下载最新安装包并运行。安装程序会识别现有安装，并默认保留任务、Skill、配置、连接方式和工作目录。

控制面板中的“更新”用于更新 AgentDock 核心程序；新版控制面板和安装程序仍通过最新 Setup 更新。

## 卸载

可以从 Windows **设置 > 应用 > 已安装的应用** 中卸载 AgentDock，也可以使用开始菜单中的“卸载 AgentDock”。卸载时会询问是否同时删除任务、Skill、配置和默认工作目录。

PowerShell 自动化、固定版本、WSL 和详细文件位置见 [Windows 进阶配置](../operations/windows.md)。启动失败时查看 [故障排查](../operations/troubleshooting.md)。
