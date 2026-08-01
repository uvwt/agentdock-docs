# Linux 进阶配置

普通用户首次安装只需要完成 [Linux 安装](../getting-started/linux.md)。本页用于交互式安装、修改目录和端口、选择服务管理器、配置 NexusDock 或只安装二进制。

## Alpine 与极简系统

系统缺少 Bash 或 curl 时，先运行引导脚本：

```sh
wget -O /tmp/install-agentdock-bootstrap.sh \
  https://github.com/uvwt/agentdock/releases/latest/download/install-linux-bootstrap.sh
sudo sh /tmp/install-agentdock-bootstrap.sh
```

引导脚本只负责安装最小依赖并下载正式安装器，后续仍使用预编译 AgentDock。

`install-linux-bootstrap.sh` 只是依赖引导器。它的 `AGENTDOCK_INSTALL_URL` 默认指向当前 Release 中的 `install-linux.sh`；下载完成后执行 `exec bash /tmp/agentdock-install.sh "$@"`。因此所有安装问答和 Cloudflare Tunnel 行为都来自 `install-linux.sh`，传给 bootstrap 的参数也会原样转发。

## 交互式安装

不设置 `AGENTDOCK_NONINTERACTIVE` 时，安装器会逐项询问配置：

```bash
curl -fsSL https://github.com/uvwt/agentdock/releases/latest/download/install-linux.sh \
  -o /tmp/install-agentdock.sh
bash /tmp/install-agentdock.sh
```

普通部署保持 `binary` 即可。`source` 和 `auto` 只用于开发或预编译产物不可用的调试场景。

## Cloudflare Tunnel

正式安装器会询问“公网访问：none/quick/named”：

| 模式 | 适用场景 |
| --- | --- |
| `none` | 只保留本机监听，并删除安装器管理的 Tunnel 服务 |
| `quick` | 不需要 Cloudflare 账号或域名，创建临时 `trycloudflare.com` 地址 |
| `named` | 复用 Cloudflare Named Tunnel Token 和固定 HTTPS Public Hostname |

Quick Tunnel 会在安装完成时输出当前公网 MCP 地址。`cloudflared` 重启后地址会变化，不应把它用于 OAuth 回调或长期客户端。

Named Tunnel 应先在 Cloudflare 创建 Tunnel 和 Public Hostname。HTTPS 域名作为公网 Origin，Public Hostname 的 Service 指向安装器输出的本机地址，默认是 `http://127.0.0.1:8765`。Token 只写入 root-only 的 `/etc/agentdock/cloudflared.env`，不会写入 `agentdock.env`、传给 AgentDock 服务，也不会出现在 `cloudflared` 命令行中。

默认 Tunnel 服务名是 `agentdock-cloudflared`。查看状态和日志：

```bash
# systemd
sudo systemctl status agentdock-cloudflared --no-pager
sudo journalctl -u agentdock-cloudflared -n 100 --no-pager

# OpenRC
sudo rc-service agentdock-cloudflared status
sudo tail -n 100 /var/log/agentdock-cloudflared.log \
  /var/log/agentdock-cloudflared.err
```

非交互安装 Quick Tunnel：

```bash
sudo env \
  AGENTDOCK_NONINTERACTIVE=true \
  AGENTDOCK_TUNNEL_MODE=quick \
  bash /tmp/install-agentdock.sh
```

Named 模式还接受 `AGENTDOCK_SERVER_URL` 和 `AGENTDOCK_CLOUDFLARE_TUNNEL_TOKEN`。Token 应由密钥管理器或受保护环境注入，不要写进脚本、Shell 历史或 Git 仓库。

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
  bash /tmp/install-agentdock.sh
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
  bash /tmp/install-agentdock.sh
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
  bash /tmp/install-agentdock.sh
```

需要完全自行维护 systemd、环境文件、反向代理和 OAuth 时，阅读 [Linux 手动部署](../getting-started/vps.md)。
