# Linux 安装

AgentDock 为 Linux x64 和 ARM64 提供预编译版本。普通安装不需要 Go、Git 或源码。

## 1. 安装

在终端执行：

```bash
curl -fsSL https://github.com/uvwt/agentdock/releases/latest/download/install-linux.sh \
  -o /tmp/install-agentdock.sh
sudo env AGENTDOCK_NONINTERACTIVE=true bash /tmp/install-agentdock.sh
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

## 更新

重新下载并运行第 1 步即可。任务、Skill、配置和工作目录会保留。

## 按需继续

- Alpine、交互式安装、修改目录、端口或服务管理器：阅读 [Linux 进阶配置](../operations/linux.md)。
- 使用浏览器自动化：当前免构建方案是 Docker browser 镜像，见 [浏览器自动化](../guides/browser-control.md)。
- 需要完全自行维护 systemd、反向代理和 OAuth：阅读 [Linux 手动部署](./vps.md)。
- 启动失败：查看 [故障排查](../operations/troubleshooting.md)。
- 需要公网访问：先阅读 [安全模型](../operations/security.md)。
