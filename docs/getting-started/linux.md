# Linux 自动安装

AgentDock 为 Linux x64 和 ARM64 发布预编译二进制。普通安装只需要运行 Release 中的安装脚本，不需要 Go、Git 或源码。

安装脚本支持 systemd、OpenRC，也可以只安装二进制而不注册系统服务。

## 快速使用

```bash
curl -fsSL https://github.com/uvwt/agentdock/releases/latest/download/install-linux.sh \
  -o /tmp/agentdock-install.sh
bash /tmp/agentdock-install.sh
```

安装方式保持默认的 `binary` 即可。脚本会下载与当前架构匹配的 Release 压缩包并校验 SHA-256。

Alpine 或极简系统缺少 Bash、curl 时：

```sh
wget -O /tmp/agentdock-bootstrap.sh \
  https://github.com/uvwt/agentdock/releases/latest/download/install-linux-bootstrap.sh
sh /tmp/agentdock-bootstrap.sh
```

## 安装选项

脚本会询问：

- Release 版本：`latest` 或指定版本
- 安装目录和运行数据目录
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
bash /tmp/agentdock-install.sh
```

面向部署的常用变量包括：

```text
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

## 更新

重新下载并运行最新安装脚本，继续选择 `binary`。脚本会替换已安装二进制并保留运行数据和环境配置。

需要自己审查运行用户、环境文件、systemd 和反代配置时，使用 [Linux 手动 systemd 部署](./vps.md)。源码构建只面向贡献者，见 [开发与质量门禁](../contributing/development.md)。
