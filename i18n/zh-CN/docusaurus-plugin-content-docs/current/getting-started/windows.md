# Windows 安装

AgentDock 支持 Windows 11 x64 和 ARM64。可以直接使用 Windows 文件、PowerShell、Git 和 Skill，不要求安装 WSL，也不需要编译源码。

## 1. 下载并运行安装脚本

打开 PowerShell：

```powershell
$script = Join-Path $env:TEMP 'install-agentdock.ps1'
Invoke-WebRequest `
  https://github.com/uvwt/agentdock/releases/latest/download/install.ps1 `
  -OutFile $script
powershell -ExecutionPolicy Bypass -File $script
```

安装器会下载并校验当前架构的预编译版本，安装到当前用户目录，并把安装目录加入用户 PATH。安装结束后关闭并重新打开 PowerShell，再继续下一步。

## 2. 启动

```powershell
& "$env:LOCALAPPDATA\AgentDock\bin\agentdock.exe" `
  --host 127.0.0.1 `
  --port 8765
```

保持这个 PowerShell 窗口运行。第一次体验时不需要先注册自动启动。新打开的 PowerShell 通常也可以直接使用 `agentdock` 命令。

## 3. 确认启动成功

另开一个 PowerShell 窗口：

```powershell
Invoke-RestMethod http://127.0.0.1:8765/healthz
```

正常结果中会显示 `ok` 为 `True`。

## 4. 连接 MCP 客户端

在同一台电脑上填写：

```text
传输方式    Streamable HTTP
地址        http://127.0.0.1:8765/mcp
认证        不需要
```

:::tip
**安装完成：** 健康检查通过并在客户端连接成功后，就可以开始使用。
:::

## 可选：通过 Cloudflare Tunnel 提供公网入口

安装完成后，打开 AgentDock 控制面板并进入 **公网访问**。这里可以直接在 **仅本机**、**临时地址** 和 **固定域名** 之间切换；仅修改公网访问方式时不需要重新运行安装器。

使用固定域名时，选择 **固定域名**，填写 HTTPS 公网地址和 Cloudflare Tunnel Token，然后点击 **应用访问模式**。同一页面可以直接点击 **测试当前公网地址** 验证配置。如果还没有创建 Tunnel，可以按 [固定域名配置教程](../guides/fixed-domain.md) 完成。

使用临时地址时，选择 **临时地址** 并应用即可。如果后续地址发生变化，可以直接在控制面板点击 **重新生成临时地址**；原 Bearer Token 和 OAuth 凭据会保留。

两种公网模式都会启用 AgentDock 认证。控制面板会显示公网 MCP 地址和 MCP 客户端需要的认证信息。Cloudflare Tunnel Token 只用于建立 Tunnel，不是 MCP 登录凭据，应妥善保管。

## 更新

重新下载最新安装脚本并再次运行即可。任务、Skill、配置和工作目录会保留。

## 按需继续

- 登录后自动启动、指定版本、校验脚本、WSL 或卸载：阅读 [Windows 进阶配置](../operations/windows.md)。
- 使用浏览器自动化：当前免构建方案是 Docker browser 镜像，见 [浏览器自动化](../guides/browser-control.md)。
- 启动失败：查看 [故障排查](../operations/troubleshooting.md)。
- 需要局域网或公网访问：先阅读 [安全模型](../operations/security.md)。
