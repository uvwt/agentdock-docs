# Windows 进阶配置

推荐通过 [Windows 图形安装](../getting-started/windows.md)安装和管理 AgentDock。本页用于 PowerShell 自动化、固定版本、WSL、浏览器能力和手动卸载。

## 修改现有安装

重新运行最新版 Setup。检测到现有安装后：

- 普通升级或修复：选择“直接升级并保留当前全部设置”。
- 修改开机启动、核心权限或连接方式：选择“修改启动和连接设置”。

控制面板中的“公网访问”和“高级设置”也可以修改大多数日常配置，不需要重新安装。

## PowerShell 自动安装

PowerShell 入口面向自动化和高级用户。

```powershell
$script = Join-Path $env:TEMP 'install-agentdock.ps1'
Invoke-WebRequest `
  https://github.com/uvwt/agentdock/releases/latest/download/install.ps1 `
  -OutFile $script

powershell -ExecutionPolicy Bypass `
  -File $script `
  -RegisterStartup `
  -Port 8765
```

默认安装目录是 `%LOCALAPPDATA%\AgentDock`。`-RegisterStartup` 会在当前用户登录后启动 AgentDock；它不是登录前运行的系统服务。

本地连接信息通常为：

```text
传输方式    Streamable HTTP
地址        http://127.0.0.1:8765/mcp
请求头      Authorization: Bearer <Bearer Token>
```

## Cloudflare Tunnel 自动化

可以使用以下参数跳过交互选择：

```text
-TunnelMode none     仅本机
-TunnelMode quick    临时公网地址
-TunnelMode named    固定 Cloudflare 域名
```

固定域名还需要 `-ServerUrl` 和 Tunnel Token。不要把真实 Token 直接写进 Shell 历史，优先使用受保护的环境变量或 `-TunnelTokenFile`。

示例：

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -RegisterStartup `
  -TunnelMode named `
  -ServerUrl 'https://mini.example.com' `
  -TunnelTokenFile 'C:\secure\cloudflare-token.txt'
```

临时公网地址在 Tunnel 重启后可能变化。可以在控制面板或托盘中重新生成；Bearer Token 和 OAuth 凭据会保留，但客户端需要替换 MCP 地址，并按提示重新授权 OAuth。

## 安装指定版本

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -Version vX.Y.Z `
  -RegisterStartup
```

普通升级直接使用 AgentDock 控制面板中的“更新”。只有需要恢复旧安装或明确安装固定版本时，才重新运行 Setup 或安装脚本。任务、Skill、配置和工作目录默认都会保留。

## 校验安装脚本

```powershell
$base = 'https://github.com/uvwt/agentdock/releases/latest/download'
$script = Join-Path $env:TEMP 'install-agentdock.ps1'
$checksum = "$script.sha256"

Invoke-WebRequest "$base/install.ps1" -OutFile $script
Invoke-WebRequest "$base/install.ps1.sha256" -OutFile $checksum

$expected = ((Get-Content -LiteralPath $checksum -Raw) -split '\s+')[0].ToLowerInvariant()
$actual = (Get-FileHash -LiteralPath $script -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw 'AgentDock installer checksum mismatch.' }
```

安装脚本还会校验下载的 AgentDock Release 包。

## WSL 运行时

已经安装 WSL 时，命令和文件工具可以显式选择 Linux 运行时：

```json
{
  "runtime": "wsl",
  "wsl_distribution": "Ubuntu"
}
```

`wsl_distribution` 可以省略，此时使用系统默认发行版。WSL 文件工具要求目标发行版安装 `python3`，路径使用 `/home/...`、`/mnt/d/...` 等 Linux 绝对路径。

## 浏览器能力

先安装 Google Chrome、Chromium 或 Microsoft Edge，再在 AgentDock 控制面板中启用浏览器工具。Windows 应用会自动检测受支持的浏览器。具体使用方式见 [浏览器自动化](../guides/browser-control.md)。

## 文件与凭据位置

默认运行目录：

```text
%LOCALAPPDATA%\AgentDock
```

Bearer Token、OAuth 密码、OAuth 签名密钥和 Tunnel Token 使用当前用户凭据保护。不要复制或公开这些文件。

## 卸载

使用 Windows **设置 > 应用 > 已安装的应用**，或开始菜单中的“卸载 AgentDock”。已安装的卸载器是受支持入口，并会让用户选择是否同时删除保留的 AgentDock 任务、Skill、配置、浏览器状态和默认工作目录数据。

Release 中的 `install.ps1` 仍是安装/更新入口；AgentDock Release 不再提供单独下载的 `uninstall-windows.ps1`。自动化卸载应调用目标部署实际安装的产品卸载器，不要按仓库内部 helper 名称从 Release 下载脚本。
