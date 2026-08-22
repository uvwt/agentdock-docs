# Linux 安装

AgentDock 提供 Linux x64 和 ARM64 预编译版本。普通安装不需要 Go、Git 或源码。

下面的默认流程只允许本机访问，适合第一次安装和服务器部署。

## 1. 安装

在终端运行：

```bash
curl -fsSL https://github.com/uvwt/agentdock/releases/latest/download/install.sh \
  -o /tmp/install-agentdock.sh
sudo env AGENTDOCK_NONINTERACTIVE=true sh /tmp/install-agentdock.sh
```

安装器会自动选择 systemd 或 OpenRC，创建低权限运行用户，生成 Bearer Token，启动服务并完成健康检查。

## 2. 确认服务正常

systemd：

```bash
sudo systemctl status agentdock --no-pager
curl -fsS http://127.0.0.1:8765/healthz
```

OpenRC：

```sh
sudo rc-service agentdock status
curl -fsS http://127.0.0.1:8765/healthz
```

正常响应中会包含 `"ok": true`。

## 3. 查看 Bearer Token

```bash
sudo awk -F= '/^AGENTDOCK_AUTH_TOKEN=/{print $2}' \
  /etc/agentdock/agentdock.env
```

把 Token 保存到密码管理器。不要把它写进 Git、截图或公开聊天。

## 4. 连接 MCP 客户端

客户端也在这台 Linux 机器上时，填写：

```text
传输方式    Streamable HTTP
地址        http://127.0.0.1:8765/mcp
请求头      Authorization: Bearer <你的 Token>
```

AgentDock 运行在远程服务器上时，可以先从自己的电脑建立 SSH 隧道：

```bash
ssh -L 8765:127.0.0.1:8765 <用户名>@<服务器地址>
```

保持 SSH 会话运行，然后让本地客户端连接 `http://127.0.0.1:8765/mcp`。

:::tip
服务正常、健康检查通过，并且客户端已经填写 MCP 地址和 Token 后，安装就完成了。
:::

## 可选：创建公网地址

上面的默认安装只允许本机访问。需要从 ChatGPT、手机或其他设备连接时，重新运行交互安装：

```bash
sudo sh /tmp/install-agentdock.sh
```

安装器会询问是否已有接入 Cloudflare 的域名：

- 没有域名：自动创建临时 `trycloudflare.com` 地址，适合快速使用。
- 已有域名：填写 HTTPS 公网地址和 Cloudflare Tunnel Token，获得稳定地址。如果还没有创建 Tunnel，可以按 [固定域名配置教程](../guides/fixed-domain.md) 完成。

安装完成后，终端会显示公网 MCP 地址和连接凭据。临时地址可能在服务重启后变化；地址变化时重新运行安装器，并替换客户端中的旧地址。已有 Bearer Token 和 OAuth 凭据会保留。

公网访问必须保留认证。详细参数和日志位置见 [Linux 进阶配置](../operations/linux.md#cloudflare-tunnel)。

## 更新

重新下载并运行第 1 步即可。任务、Skill、配置和工作目录会保留。

使用浏览器自动化时，在宿主机安装 Chrome、Chromium 或 Microsoft Edge 并启用浏览器工具；自动检测不到时可设置 `AGENTDOCK_BROWSER_EXECUTABLE_PATH`。只有希望容器直接包含 Chromium 时才需要 Docker browser 镜像。见 [浏览器自动化](../guides/browser-control.md)。

Alpine、自定义目录或端口、手动服务管理和卸载见 [Linux 进阶配置](../operations/linux.md)。需要完全手动维护 systemd、反向代理和 OAuth 时，见 [Linux 手动部署](./vps.md)。
