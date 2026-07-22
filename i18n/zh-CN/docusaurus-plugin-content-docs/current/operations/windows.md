# Windows 进阶配置

普通用户首次安装只需要完成 [Windows 安装](../getting-started/windows.md)。本页用于登录后自动启动、固定版本、WSL、浏览器和卸载。

## 登录后自动启动

先按安装页下载 `$script`，再执行：

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -RegisterStartup `
  -Port 8765
```

安装器会生成 Bearer Token、加密保存到当前用户 DPAPI，并立即启动 AgentDock。首次生成时 Token 只显示一次，请保存到你的密码管理器。

连接信息：

```text
传输方式    Streamable HTTP
地址        http://127.0.0.1:8765/mcp
请求头      Authorization: Bearer <安装器显示的 Token>
```

该方式在当前用户登录后启动，不是未登录前运行的系统服务。

## 安装指定版本

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -Version vX.Y.Z
```

再次运行安装器即可升级。已存在的运行数据和启动配置会保留。

## 校验安装脚本

需要在执行前额外校验安装脚本时：

```powershell
$base = 'https://github.com/uvwt/agentdock/releases/latest/download'
$script = Join-Path $env:TEMP 'install-agentdock.ps1'
$checksum = "$script.sha256"

Invoke-WebRequest "$base/install-windows.ps1" -OutFile $script
Invoke-WebRequest "$base/install-windows.ps1.sha256" -OutFile $checksum

$expected = ((Get-Content -LiteralPath $checksum -Raw) -split '\s+')[0].ToLowerInvariant()
$actual = (Get-FileHash -LiteralPath $script -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw 'AgentDock installer checksum mismatch.' }
```

安装器还会校验实际下载的 AgentDock ZIP。

## WSL 运行时

已经安装 WSL 时，命令和文件工具可以显式选择 Linux 运行时：

```json
{
  "runtime": "wsl",
  "wsl_distribution": "Ubuntu"
}
```

`wsl_distribution` 可以省略，此时使用系统默认发行版。WSL 文件工具要求目标发行版安装 `python3`，路径使用 `/home/...`、`/mnt/d/...` 等 Linux 绝对路径。

WSL 写入拒绝软链接、设备文件和 `/proc`、`/sys`、`/dev`、`/run` 等特殊目录。跨文件系统移动和递归删除目录不在当前支持范围内。

## 浏览器能力

Windows Release 不会自动安装 browser runner。原生模式需要另外准备 Node.js、源码仓库中的 runner 和 `playwright-core`；普通用户优先使用已经包含完整依赖的 Docker browser 镜像。具体选择见 [浏览器自动化](../guides/browser-control.md)。

## 命令与 Skill

- `exec_command` 优先使用 PowerShell 7，然后回退到 Windows PowerShell 或 `cmd.exe`。
- `tty=true` 使用 ConPTY。
- Skill 声明的 Python、Node.js 或其他平台依赖需要由用户安装。
- macOS Desktop Skill 不支持 Windows。

## 卸载

下载并运行卸载脚本：

```powershell
$uninstaller = Join-Path $env:TEMP 'uninstall-agentdock.ps1'
Invoke-WebRequest `
  https://github.com/uvwt/agentdock/releases/latest/download/uninstall-windows.ps1 `
  -OutFile $uninstaller
powershell -ExecutionPolicy Bypass -File $uninstaller
```

同时删除 `%USERPROFILE%\.agentdock` 和 `%USERPROFILE%\AgentDock`：

```powershell
powershell -ExecutionPolicy Bypass `
  -File $uninstaller `
  -PurgeState
```

:::danger
`-PurgeState` 会删除任务、Skill 配置、运行数据和默认工作目录。执行前先备份需要保留的内容。
:::
