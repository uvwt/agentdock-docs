# 桌面端高级设置

普通安装请使用 [MacOS 安装](../getting-started/macos.md) 或 [Windows 安装](../getting-started/windows.md)。本页只保留安装完成后常用的高级设置和维护入口。

## 通用设置

桌面客户端已经可以管理大多数配置。通过 **公网访问** 和 **高级设置** 可以调整：

- 本地端口和日志级别；
- 临时或固定公网访问；
- NexusDock 配对；
- 浏览器连接方式；
- 本地 Coding Agent；
- 聊天卡片显示方式；
- 登录时自动启动。

优先使用客户端提供的更新和日志入口，不要手动修改服务文件。公网地址见 [公网访问](./public-access.md)，浏览器设置见 [使用浏览器](../guides/browser-control.md)。

## macOS

需要自动化或命令行安装时：

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/install.sh \
  -o /tmp/agentdock-install.sh
sh /tmp/agentdock-install.sh --register-service
```

常用覆盖包括 `--version vX.Y.Z` 和 `AGENTDOCK_INSTALL_DIR=<path>`。CLI 默认安装到 `~/.local/bin/agentdock`。

默认用户数据：

```text
~/.agentdock  AgentDock 状态
~/AgentDock   默认工作目录
```

需要屏幕、键盘或鼠标自动化时，只给实际运行 AgentDock 的应用授予 **系统设置 → 隐私与安全性** 中对应的权限。

图形客户端可以直接更新。命令行安装也可以使用：

```bash
agentdock update --check
agentdock update
```

卸载但保留用户数据：

```bash
sh /tmp/agentdock-install.sh --uninstall
```

只有明确要同时删除 AgentDock 状态和默认工作目录时才使用 `--purge-data`。

## Windows

需要自动化或无界面安装时，可以使用 Release 中的 PowerShell 安装脚本：

```powershell
$script = Join-Path $env:TEMP 'install-agentdock.ps1'
Invoke-WebRequest `
  https://github.com/uvwt/agentdock/releases/latest/download/install.ps1 `
  -OutFile $script
powershell -ExecutionPolicy Bypass -File $script -RegisterStartup
```

默认安装和运行目录为 `%LOCALAPPDATA%\AgentDock`。日常更新和配置修改优先使用 AgentDock 控制面板。

安装 WSL 后，文件和命令工具可以通过 `runtime=wsl` 使用 Linux 环境。WSL 文件操作需要目标发行版安装 `python3`。

卸载时使用 **设置 → 应用 → 已安装的应用**，或开始菜单中的 **Uninstall AgentDock**。卸载程序会让你选择是否同时删除保留的 AgentDock 数据。
