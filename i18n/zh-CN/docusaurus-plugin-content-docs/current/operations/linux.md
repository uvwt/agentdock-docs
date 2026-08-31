# Linux 进阶配置

本页介绍交互式安装、Cloudflare Tunnel、修改目录和端口、服务管理器、NexusDock 和二进制安装。

## Alpine 与极简系统

统一入口 `install.sh` 需要 POSIX Shell、Bash、CA 证书，以及 curl 或 wget。缺少时先安装：

```sh
apk add --no-cache bash curl ca-certificates
```

然后继续运行下方相同的 `install.sh` 命令，不再提供单独的 bootstrap 安装器。

## 交互式安装

不设置 `AGENTDOCK_NONINTERACTIVE` 时，安装器会逐项询问配置：

```bash
curl -fsSL https://github.com/uvwt/agentdock/releases/latest/download/install.sh \
  -o /tmp/install-agentdock.sh
sh /tmp/install-agentdock.sh
```

普通部署保持 `binary` 即可。`source` 和 `auto` 只用于开发或预编译产物不可用的调试场景。

## Cloudflare Tunnel

交互式安装会询问是否有已接入 Cloudflare 的域名：

| 用户回答 | 安装器模式 | 结果 |
| --- | --- | --- |
| 有域名 | 固定（`named`） | 稳定 HTTPS 地址，适合长期客户端和 OAuth |
| 没有域名 | 临时（`quick`） | 自动生成 `trycloudflare.com` 地址，适合立即体验 |

使用固定模式时，先按 [固定域名配置教程](../guides/fixed-domain.md) 完成 Cloudflare 侧设置，再在安装器提示时填写得到的 HTTPS 公网地址和 Tunnel Token。

临时模式会启动 `cloudflared`，从服务日志读取生成的地址，写入 `AGENTDOCK_SERVER_URL`，启用 OAuth，然后重启 AgentDock。两种模式都会生成或复用：

- `AGENTDOCK_AUTH_TOKEN`
- `AGENTDOCK_OAUTH_PASSWORD`
- `AGENTDOCK_OAUTH_TOKEN_SECRET`

完成框会显示公网地址、MCP 地址、Bearer Token 和 OAuth 登录密码。OAuth 签名密钥不会显示。Tunnel Token 只写入 root-only 的 `/etc/agentdock/cloudflared.env`，不会写入 `agentdock.env`、传给 AgentDock，也不会出现在 `cloudflared` 命令行中。

临时地址变化后，重新运行同一个安装脚本即可。现有监听地址、端口、高级配置、Bearer Token、OAuth 密码、签名密钥和 NexusDock 配置都会保留；安装器会自动回写新地址并重启 AgentDock。客户端仍需替换旧 MCP URL，并重新完成 OAuth 授权。

默认 Tunnel 服务名是 `agentdock-cloudflared`：

```bash
# systemd
sudo systemctl status agentdock-cloudflared --no-pager
sudo journalctl -u agentdock-cloudflared -n 100 --no-pager

# OpenRC
sudo rc-service agentdock-cloudflared status
sudo tail -n 100 /var/log/agentdock-cloudflared.log \
  /var/log/agentdock-cloudflared.err
```

非交互安装默认保持本机访问；需要临时 Tunnel 时必须显式指定：

```bash
sudo env \
  AGENTDOCK_NONINTERACTIVE=true \
  AGENTDOCK_TUNNEL_MODE=quick \
  sh /tmp/install-agentdock.sh
```

固定模式设置 `AGENTDOCK_TUNNEL_MODE=named`、`AGENTDOCK_SERVER_URL` 和 `AGENTDOCK_CLOUDFLARE_TUNNEL_TOKEN`。`AGENTDOCK_OAUTH_PASSWORD` 与 `AGENTDOCK_OAUTH_TOKEN_SECRET` 只在需要覆盖首次生成值时提供；否则由安装器自动生成。密钥应来自受保护环境或密钥管理器。

## 默认目录

```text
安装目录      /opt/agentdock
运行数据目录  /srv/agentdock
环境文件      /etc/agentdock/agentdock.env
服务用户      agentdock
监听地址      127.0.0.1:8765
```

典型 systemd 安装会生成：

```text
/opt/agentdock/bin/agentdock
/srv/agentdock/.agentdock
/srv/agentdock/AgentDock
/etc/agentdock/agentdock.env
/etc/systemd/system/agentdock.service
```

OpenRC 会改为创建 `/etc/init.d/agentdock`。

## 非交互配置

自动化部署时可以通过环境变量覆盖默认值：

```bash
sudo env \
  AGENTDOCK_NONINTERACTIVE=true \
  AGENTDOCK_RELEASE_VERSION=latest \
  AGENTDOCK_PORT=8765 \
  sh /tmp/install-agentdock.sh
```

常用变量：

| 变量 | 用途 |
| --- | --- |
| `AGENTDOCK_RELEASE_VERSION` | `latest` 或 `vX.Y.Z` |
| `AGENTDOCK_SOURCE_DIR` | 二进制安装根目录 |
| `AGENTDOCK_DATA_DIR` | 状态和工作目录根目录 |
| `AGENTDOCK_ENV_FILE` | 服务环境文件 |
| `AGENTDOCK_SERVICE_NAME` | systemd/OpenRC 服务名 |
| `AGENTDOCK_SERVICE_USER` | 低权限运行用户 |
| `AGENTDOCK_SERVICE_MANAGER` | `auto`、`systemd`、`openrc` 或 `none` |
| `AGENTDOCK_HOST` | 监听地址 |
| `AGENTDOCK_PORT` | 监听端口 |
| `AGENTDOCK_AUTH_TOKEN` | 自定义 Bearer Token |
| `AGENTDOCK_NEXUS_ENDPOINT` | NexusDock 地址 |
| `AGENTDOCK_NEXUS_TOKEN` | NexusDock Token |
| `AGENTDOCK_TUNNEL_MODE` | `none`、`quick` 或 `named` |
| `AGENTDOCK_SERVER_URL` | Named Tunnel 和 OAuth 使用的固定 HTTPS Origin |
| `AGENTDOCK_CLOUDFLARE_TUNNEL_TOKEN` | Named Tunnel Token，只保存在 `cloudflared.env` |
| `AGENTDOCK_CLOUDFLARED_INSTALL_PATH` | 自定义 `cloudflared` 二进制路径 |

不要把真实 Token 写进仓库。未提供 `AGENTDOCK_AUTH_TOKEN` 时，安装器会自动生成并写入 root-only 环境文件。

## 只安装二进制

不希望注册系统服务时：

```bash
sudo env \
  AGENTDOCK_NONINTERACTIVE=true \
  AGENTDOCK_SERVICE_MANAGER=none \
  sh /tmp/install-agentdock.sh
```

这种模式不会自动启动 AgentDock，需要手动运行 `/opt/agentdock/bin/agentdock`。

## 修改端口或 Token

编辑环境文件：

```bash
sudoedit /etc/agentdock/agentdock.env
```

修改后重启服务：

```bash
sudo systemctl restart agentdock
sudo systemctl status agentdock --no-pager
```

OpenRC 使用：

```sh
sudo rc-service agentdock restart
sudo rc-service agentdock status
```

## 查看日志

systemd：

```bash
sudo journalctl -u agentdock -n 100 --no-pager
sudo journalctl -u agentdock -f
```

OpenRC：

```sh
sudo tail -n 100 /var/log/agentdock.log /var/log/agentdock.err
```

## 更新

重新运行安装器即可替换二进制。运行数据和环境文件会保留。固定版本时设置：

```bash
sudo env \
  AGENTDOCK_NONINTERACTIVE=true \
  AGENTDOCK_RELEASE_VERSION=vX.Y.Z \
  sh /tmp/install-agentdock.sh
```

需要完全自行维护 systemd、环境文件、反向代理和 OAuth 时，阅读 [Linux 手动部署](../getting-started/vps.md)。
