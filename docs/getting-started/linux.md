# Linux 自动安装

`scripts/install-linux.sh` 用于在 Linux 上交互式安装 AgentDock，支持 systemd、OpenRC，也可以只安装二进制而不注册系统服务。

默认模式会下载 GitHub Release 预编译二进制；只有显式选择 `source` 或 `auto` 回退时才安装 Go 和编译依赖。

## 快速使用

已克隆仓库：

```bash
bash scripts/install-linux.sh
```

远程安装：

```bash
curl -fsSL https://raw.githubusercontent.com/uvwt/agentdock/main/scripts/install-linux.sh \
  -o /tmp/agentdock-install.sh
bash /tmp/agentdock-install.sh
```

Alpine 或极简系统缺少 Bash、curl 时：

```sh
wget -O /tmp/agentdock-bootstrap.sh \
  https://raw.githubusercontent.com/uvwt/agentdock/main/scripts/install-linux-bootstrap.sh
sh /tmp/agentdock-bootstrap.sh
```

## 安装选项

脚本会询问：

- 仓库、分支和安装目录
- 安装方式：`binary`、`source` 或 `auto`
- Release 版本：`latest` 或指定版本
- 服务管理器：`auto`、`systemd`、`openrc` 或 `none`
- 运行用户、监听地址和端口
- Bearer Token
- 可选 NexusDock endpoint 与 token

常用默认值：

```text
安装目录      /opt/agentdock
运行数据目录  /srv/agentdock
环境文件      /etc/agentdock/agentdock.env
服务用户      agentdock
监听地址      127.0.0.1:8765
```

可以用环境变量覆盖默认值：

```bash
AGENTDOCK_INSTALL_MODE=binary \
AGENTDOCK_RELEASE_VERSION=latest \
AGENTDOCK_PORT=8765 \
bash scripts/install-linux.sh
```

完整可配置项包括：

```text
AGENTDOCK_REPO_URL
AGENTDOCK_BRANCH
AGENTDOCK_SOURCE_DIR
AGENTDOCK_DATA_DIR
AGENTDOCK_ENV_FILE
AGENTDOCK_SERVICE_NAME
AGENTDOCK_SERVICE_USER
AGENTDOCK_SERVICE_MANAGER
AGENTDOCK_INSTALL_MODE
AGENTDOCK_RELEASE_VERSION
AGENTDOCK_HOST
AGENTDOCK_PORT
AGENTDOCK_AUTH_TOKEN
AGENTDOCK_NEXUS_ENDPOINT
AGENTDOCK_NEXUS_TOKEN
```

不要把真实 Token 写进仓库文件。留空时，脚本可以生成随机 Bearer Token。

## 安装结果

典型 systemd 安装会生成：

```text
/opt/agentdock/bin/agentdock
/srv/agentdock/.agentdock
/srv/agentdock/AgentDock
/etc/agentdock/agentdock.env
/etc/systemd/system/agentdock.service
```

OpenRC 会改为创建 `/etc/init.d/agentdock`。

## 验证

systemd：

```bash
sudo systemctl status agentdock --no-pager
sudo journalctl -u agentdock -n 100 --no-pager
curl -fsS http://127.0.0.1:8765/healthz
```

OpenRC：

```sh
rc-service agentdock status
tail -n 100 /var/log/agentdock.log /var/log/agentdock.err
curl -fsS http://127.0.0.1:8765/healthz
```

重新运行安装脚本即可升级。源码模式遇到未提交改动时不会自动覆盖本地工作区。

需要自己审查 systemd、环境文件和反代配置时，使用 [Linux 手动 systemd 部署](./vps.md)。
