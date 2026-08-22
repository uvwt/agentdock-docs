# macOS 安装

AgentDock 为 Apple Silicon 和 Intel Mac 提供预编译版本。普通安装不需要 Go、Git 或源码。

原生安装适合使用本机文件，以及需要屏幕录制和辅助功能权限的 macOS 桌面自动化。

## 1. 安装 AgentDock

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/install.sh \
  -o /tmp/install-agentdock.sh
sh /tmp/install-agentdock.sh
```

脚本会识别当前 Mac 架构、校验下载文件，并安装到：

```text
~/.local/bin/agentdock
```

如果脚本提示 PATH 尚未包含该目录，执行：

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zprofile
export PATH="$HOME/.local/bin:$PATH"
```

## 2. 启动

```bash
agentdock --host 127.0.0.1 --port 8765
```

保持这个终端窗口运行。第一次体验时不需要先配置后台服务。

## 3. 确认启动成功

另开一个终端执行：

```bash
curl -fsS http://127.0.0.1:8765/healthz
```

正常结果中会包含 `ok: true`。

## 4. 连接 MCP 客户端

在同一台 Mac 上使用时填写：

```text
传输方式    Streamable HTTP
地址        http://127.0.0.1:8765/mcp
认证        不需要
```

只监听 `127.0.0.1` 时可以无认证运行。需要局域网或公网访问时，必须启用认证并使用 HTTPS。

:::tip
**安装完成：** 健康检查通过并在客户端连接成功后，就可以开始使用文件、命令、Git 和 Skill。
:::

## 可选：通过 Cloudflare Tunnel 提供公网入口

安装后台服务，并让安装器同时配置公网入口：

```bash
sh /tmp/install-agentdock.sh --register-service
```

安装器只询问是否有已接入 Cloudflare 的域名：

- 选择“有”：使用固定地址，输入 HTTPS 公网地址，并在隐藏提示中粘贴 Tunnel Token。如果还没有创建 Tunnel，可以按 [固定域名配置教程](../guides/fixed-domain.md) 完成。
- 选择“没有”：自动生成可立即使用的 `trycloudflare.com` 临时地址；`cloudflared` 重启后地址可能变化。

AgentDock 仍只监听 `127.0.0.1`，`cloudflared` 作为独立的用户级 LaunchAgent 运行。固定和临时两种方式都会自动启用 Bearer Token 与 OAuth。完成框会显示公网地址、MCP 地址、Bearer Token 和 OAuth 登录密码；OAuth 签名密钥与 Tunnel Token 会安全保存，不在终端显示。

临时地址变化后，重新运行同一个命令即可刷新。安装器会保留全部认证凭据；用户只需在客户端替换 MCP URL，并重新完成 OAuth 授权。

自动化仍可把 `--tunnel quick`、`--tunnel named` 或 `--tunnel none` 作为高级覆盖。安装器管理的文件、状态和日志见 [macOS 进阶配置](../operations/macos.md#管理-cloudflare-tunnel)。

## 更新

重新下载并运行最新安装脚本即可。任务、Skill、配置和工作目录不会被删除，旧二进制会先备份。

## 按需继续

- 指定版本、修改安装目录或配置后台运行：阅读 [macOS 进阶配置](../operations/macos.md)。
- 使用屏幕、键盘和鼠标自动化：阅读 [macOS 桌面自动化](../guides/desktop-automation.md)。
- 使用浏览器自动化：当前免构建方案是 Docker browser 镜像，见 [浏览器自动化](../guides/browser-control.md)。
- 启动失败：查看 [故障排查](../operations/troubleshooting.md)。
