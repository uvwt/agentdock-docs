# Linux 与服务器

普通 Linux 安装先看 [Linux 安装](../getting-started/linux.md)。本页只保留服务器部署和服务管理相关内容。

## 安装

公开安装脚本会自动识别架构，并可自动注册 systemd 或 OpenRC：

```bash
curl -fsSL https://download.nexusdock.co/latest/install.sh \
  -o /tmp/install-agentdock.sh
sudo sh /tmp/install-agentdock.sh
```

Alpine 等最小系统需要先安装 Bash、CA 证书以及 curl 或 wget。

默认系统安装：

```text
程序             /opt/agentdock/bin/agentdock
运行数据         /srv/agentdock
环境文件         /etc/agentdock/agentdock.env
服务用户         agentdock
监听地址         127.0.0.1:8765
```

## 服务与日志

systemd：

```bash
sudo systemctl status agentdock --no-pager
sudo systemctl restart agentdock
sudo journalctl -u agentdock -f
```

OpenRC：

```sh
sudo rc-service agentdock status
sudo rc-service agentdock restart
```

如果自行维护服务，建议让 AgentDock 只监听 loopback，并使用独立的低权限账号运行。环境配置放在受保护的服务环境文件中，不要直接写进 unit 命令行。

## 公网服务器

远程使用时，建议让 AgentDock 保持监听 `127.0.0.1`，再通过可信反向代理或 Cloudflare Tunnel 提供 HTTPS。不要把明文 `/mcp` 直接暴露到公网。

临时地址和固定域名见 [公网访问](./public-access.md)，认证设置见 [配置参考](../reference/configuration.md)。

## NexusDock

AgentDock 安装完成后再进行 NexusDock 配对。使用默认服务账号时：

```bash
sudo -u agentdock -H /opt/agentdock/bin/agentdock nexus pair \
  --endpoint https://nexus.example.com \
  --code <pairing-code>
sudo systemctl restart agentdock
```

完整配对流程见 [连接 AgentDock](./nexusdock-connect.md)。

## 更新

标准安装可以使用：

```bash
sudo /opt/agentdock/bin/agentdock update --check
sudo /opt/agentdock/bin/agentdock update
```

运行数据和服务环境与程序文件分开保存。更新后服务没有恢复正常时，查看 [故障排查](./troubleshooting.md)。
