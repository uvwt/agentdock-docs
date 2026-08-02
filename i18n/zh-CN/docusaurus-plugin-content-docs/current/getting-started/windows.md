# Windows 安装

AgentDock 支持 Windows 11 x64 和 ARM64。可以直接使用 Windows 文件、PowerShell、Git 和 Skill，不要求安装 WSL，也不需要编译源码。

## 1. 下载并运行安装脚本

打开 PowerShell：

```powershell
$script = Join-Path $env:TEMP 'install-agentdock.ps1'
Invoke-WebRequest `
  https://github.com/uvwt/agentdock/releases/latest/download/install-windows.ps1 `
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

使用登录启动模式，让 AgentDock 与 `cloudflared` 在当前用户登录后一起运行：

```powershell
powershell -ExecutionPolicy Bypass `
  -File $script `
  -RegisterStartup
```

安装器只会询问你是否已有接入 Cloudflare 的域名。有域名时继续输入固定 HTTPS 公网地址和 Tunnel Token；没有域名时自动生成临时 `trycloudflare.com` 地址。

两种方式都会同时启用 Bearer Token 和 OAuth。完成信息会显示公网 MCP 地址、Bearer Token 和 OAuth 登录密码。OAuth 与 Tunnel 密钥使用当前用户 DPAPI 加密保存，也不会写进 `cloudflared` 命令行。

临时地址会在 `cloudflared` 重启后变化。重新运行同一安装命令即可生成并回写新地址；原 Bearer Token 和 OAuth 凭据保持不变。然后在客户端替换 MCP 地址，并重新完成 OAuth 授权。

## 更新

重新下载最新安装脚本并再次运行即可。任务、Skill、配置和工作目录会保留。

## 按需继续

- 登录后自动启动、指定版本、校验脚本、WSL 或卸载：阅读 [Windows 进阶配置](../operations/windows.md)。
- 使用浏览器自动化：当前免构建方案是 Docker browser 镜像，见 [浏览器自动化](../guides/browser-control.md)。
- 启动失败：查看 [故障排查](../operations/troubleshooting.md)。
- 需要局域网或公网访问：先阅读 [安全模型](../operations/security.md)。
