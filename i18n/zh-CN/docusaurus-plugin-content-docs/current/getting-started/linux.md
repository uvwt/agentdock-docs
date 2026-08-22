# Linux 安装

AgentDock 为 Linux x64 和 ARM64 提供预编译版本。普通安装不需要 Go、Git 或源码。

## 1. 安装

在终端执行：

```bash
curl -fsSL https://github.com/uvwt/agentdock/releases/latest/download/install.sh \
  -o /tmp/install-agentdock.sh
sudo env AGENTDOCK_NONINTERACTIVE=true sh /tmp/install-agentdock.sh
```

安装器会使用安全默认值，自动选择 systemd 或 OpenRC、创建低权限运行用户、生成连接 Token，并完成健康检查。

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

健康接口正常时会返回包含 `ok: true` 的结果。

## 3. 查看连接 Token

```bash
sudo awk -F= '/^AGENTDOCK_AUTH_TOKEN=/{print $2}' \
  /etc/agentdock/agentdock.env
```

把输出保存到密码管理器，不要发到聊天记录或提交到 Git。

## 4. 连接 MCP 客户端

客户端就在这台 Linux 机器上时填写：

```text
传输方式    Streamable HTTP
地址        http://127.0.0.1:8765/mcp
请求头      Authorization: Bearer <你的 Token>
```

AgentDock 在远程服务器上时，从自己的电脑建立 SSH 隧道：

```bash
ssh -L 8765:127.0.0.1:8765 <用户名>@<服务器地址>
```

保持 SSH 窗口打开，再让本机客户端连接同一个 `http://127.0.0.1:8765/mcp` 地址。

:::tip
**安装完成：** 服务状态正常、健康检查通过，并把 MCP 地址与 Token 填入客户端后即可使用。
:::

## 可选：通过 Cloudflare Tunnel 提供公网入口

上面的非交互安装默认不开放公网。需要公网入口时，重新以交互方式运行同一个安装器：

```bash
sudo sh /tmp/install-agentdock.sh
```

安装器只问一个面向用户的问题：**你是否有已接入 Cloudflare 的域名？**

- 选择“有”：使用固定地址，输入 HTTPS 公网地址，并在隐藏提示中粘贴 Tunnel Token。如果还没有创建 Tunnel，可以按 [固定域名配置教程](../guides/fixed-domain.md) 完成。
- 选择“没有”：自动生成可立即使用的 `trycloudflare.com` 临时地址；`cloudflared` 重启后地址可能变化。

两种方式都会自动生成或复用 Bearer Token 与 AgentDock OAuth 配置。完成框会显示公网地址、MCP 地址、Bearer Token 和 OAuth 登录密码；OAuth 签名密钥与 Cloudflare Tunnel Token 只保存在受限配置文件中。

临时地址变化后，重新运行同一个安装脚本即可。安装器会把新地址回写到 AgentDock、重启服务，并保留原 Bearer Token、OAuth 密码和签名密钥。随后只需在客户端替换 MCP URL，并重新完成 OAuth 授权。服务名、自动化变量和密钥存放位置见 [Linux 进阶配置](../operations/linux.md#cloudflare-tunnel)。

## 更新

重新下载并运行第 1 步即可。任务、Skill、配置和工作目录会保留。

## 按需继续

- Alpine、交互式安装、修改目录、端口或服务管理器：阅读 [Linux 进阶配置](../operations/linux.md)。
- 使用浏览器自动化：当前免构建方案是 Docker browser 镜像，见 [浏览器自动化](../guides/browser-control.md)。
- 需要完全自行维护 systemd、反向代理和 OAuth：阅读 [Linux 手动部署](./vps.md)。
- 启动失败：查看 [故障排查](../operations/troubleshooting.md)。
- 需要公网访问：先阅读 [安全模型](../operations/security.md)。
