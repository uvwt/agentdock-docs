# Windows 原生安装

AgentDock 支持 Windows 11 x64 和 ARM64，可原生使用 PowerShell、ConPTY、Windows Job Object、受保护 DACL 和当前用户 DPAPI，不要求安装 WSL2，也不需要在本机编译源码。

## 安装

从最新 GitHub Release 下载并校验安装脚本：

```powershell
$base = 'https://github.com/uvwt/agentdock/releases/latest/download'
$script = Join-Path $env:TEMP 'install-agentdock.ps1'
$checksum = "$script.sha256"

Invoke-WebRequest "$base/install-windows.ps1" -OutFile $script
Invoke-WebRequest "$base/install-windows.ps1.sha256" -OutFile $checksum

$expected = ((Get-Content -LiteralPath $checksum -Raw) -split '\s+')[0].ToLowerInvariant()
$actual = (Get-FileHash -LiteralPath $script -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw 'AgentDock installer checksum mismatch.' }

powershell -ExecutionPolicy Bypass -File $script
```

脚本会：

1. 识别 x64 或 ARM64。
2. 下载对应 Release ZIP 和 SHA-256 校验文件。
3. 安装到 `%LOCALAPPDATA%\AgentDock\bin`。
4. 将安装目录加入当前用户 PATH。
5. 创建 `%USERPROFILE%\.agentdock` 和 `%USERPROFILE%\AgentDock`，并收紧 DACL。

## 登录后自动启动

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -RegisterStartup `
  -Port 8765
```

该模式会生成 Bearer Token，并以当前登录用户创建计划任务。它不是未登录前运行的系统服务。

验证：

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8765/healthz
```

## 安装指定版本

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -Version vX.Y.Z
```

重新下载最新安装脚本并再次运行即可升级，运行数据和启动配置会保留。

## 命令与 Skill

- `exec_command` 优先使用 PowerShell 7，然后回退到 Windows PowerShell 或 `cmd.exe`。
- `tty=true` 使用 ConPTY。
- Skill 可以声明 Python、Node.js、PowerShell 或其他平台依赖，AgentDock 不会自动替 Skill 安装这些依赖。
- macOS Desktop Skill 不支持 Windows。

## 可选 WSL 运行时

已安装 WSL 时，Windows 版 AgentDock 的命令和文件工具可以显式选择 Linux 运行时：

```json
{
  "runtime": "wsl",
  "wsl_distribution": "Ubuntu"
}
```

`wsl_distribution` 可省略，此时使用系统默认发行版。WSL 文件工具要求目标发行版安装 `python3`，路径使用 `/home/...`、`/mnt/d/...` 等 Linux 绝对路径；Windows 盘符路径会自动转换。

WSL 写入拒绝软链接、设备文件和 `/proc`、`/sys`、`/dev`、`/run` 等特殊目录。跨文件系统移动和递归删除目录不在当前支持范围内。

## 浏览器

浏览器 runner 可以使用系统 Chrome 或 Edge。启用浏览器能力还需要 Node.js 和 `playwright-core` runner 依赖。

## 卸载

从 Release 下载卸载脚本，不需要克隆源码仓库：

```powershell
$base = 'https://github.com/uvwt/agentdock/releases/latest/download'
$uninstaller = Join-Path $env:TEMP 'uninstall-agentdock.ps1'
$uninstallerChecksum = "$uninstaller.sha256"

Invoke-WebRequest "$base/uninstall-windows.ps1" -OutFile $uninstaller
Invoke-WebRequest "$base/uninstall-windows.ps1.sha256" -OutFile $uninstallerChecksum

$expected = ((Get-Content -LiteralPath $uninstallerChecksum -Raw) -split '\s+')[0].ToLowerInvariant()
$actual = (Get-FileHash -LiteralPath $uninstaller -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw 'AgentDock uninstaller checksum mismatch.' }

powershell -ExecutionPolicy Bypass -File $uninstaller
```

同时删除 `%USERPROFILE%\.agentdock` 和 `%USERPROFILE%\AgentDock`：

```powershell
powershell -ExecutionPolicy Bypass `
  -File $uninstaller `
  -PurgeState
```

执行 `-PurgeState` 前应备份需要保留的项目、Skill 配置和运行数据。源码构建只面向贡献者，见 [开发与质量门禁](../contributing/development.md)。
