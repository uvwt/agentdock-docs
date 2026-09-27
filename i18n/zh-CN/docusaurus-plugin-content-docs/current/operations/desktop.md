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

### 验证桌面自动化是否可用

[Desktop Skill](https://github.com/uvwt/agentdock-skills/tree/main/skills/desktop)
支持 `skill_action=status`，或 `skill_action=observe` 搭配 `action=preflight`。
使用 `agentdock_context` 返回的准确 Skill 引用，通过 AgentDock 的
`exec_command` 执行已安装的 Skill。单独从 SSH 或终端检查通过，不能证明
AgentDock 进程拥有权限。

当已安装的 Skill 返回 `readiness` 时，分别用 `passed`、`failed`、`not_checked`
报告 `screen_capture`、`apple_events` 和 `accessibility`。截图必须产生尺寸
非零的 PNG 文件头；Accessibility 检查实际读取前台应用的窗口属性。仅列出
System Events 进程不能证明 AX 可用。临时检查截图会删除，窗口名称不会返回。

三项默认全部检查。用 `check_screenshot=false`、`check_applescript=false` 或
`check_accessibility=false` 跳过任一项时，该项仍未验证，整体 `ok` 为 `false`。
这些检查只读取状态，不注入输入；通过不代表每个目标应用或输入动作都会成功。
旧 Skill 若没有 `readiness` 或 `accessibility_ok`，应更新 Skill，或将
Accessibility 视为未验证。

Apple Events 通过但真实 AX 读取失败时，检查当前 AgentDock 进程的辅助功能授权
和活动图形会话。升级后系统权限开关可能仍关联旧的代码身份；重新授权当前进程，
再做真实检查。重启 System Events 可能中断其他自动化，应先获得用户确认。
Preflight 不重置 TCC、不修改权限、不重启系统进程。

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
