# Linux 手动 systemd 部署

本页介绍如何手动维护运行用户、预编译 Release、环境文件、systemd 和 HTTPS 反向代理。

## 推荐拓扑

```text
MCP client -> HTTPS reverse proxy -> 127.0.0.1:8765 -> AgentDock
```

AgentDock 只监听回环地址，Caddy、Nginx 或其他反代负责 TLS 和公网入口。

## 创建运行用户和目录

```bash
sudo useradd --system --create-home --home-dir /srv/agentdock agentdock
sudo install -d -o agentdock -g agentdock /srv/agentdock/AgentDock
sudo install -d -m 0755 /opt/agentdock/bin
sudo install -d -m 0750 /etc/agentdock
```

## 下载并安装 Release 二进制

```bash
case "$(uname -m)" in
  x86_64|amd64) ARCH=amd64 ;;
  aarch64|arm64) ARCH=arm64 ;;
  *) echo "unsupported architecture: $(uname -m)" >&2; exit 1 ;;
esac

ASSET="agentdock_linux_${ARCH}.tar.gz"
BASE_URL="https://github.com/uvwt/agentdock/releases/latest/download"
TMP_DIR="$(mktemp -d)"

curl -fL "$BASE_URL/$ASSET" -o "$TMP_DIR/$ASSET"
curl -fL "$BASE_URL/$ASSET.sha256" -o "$TMP_DIR/$ASSET.sha256"
(
  cd "$TMP_DIR"
  sha256sum -c "$ASSET.sha256"
  tar -xzf "$ASSET"
)

sudo install -m 0755 "$TMP_DIR/bin/agentdock" /opt/agentdock/bin/agentdock
sudo rm -rf /opt/agentdock/share/agentdock/core-skills
sudo install -d -m 0755 /opt/agentdock/share/agentdock/core-skills
sudo cp -R "$TMP_DIR/share/agentdock/core-skills/." /opt/agentdock/share/agentdock/core-skills/
sudo chown -R root:root /opt/agentdock/share/agentdock/core-skills
sudo -u agentdock -H /opt/agentdock/bin/agentdock skill bootstrap \
  --bundle /opt/agentdock/share/agentdock/core-skills
rm -rf "$TMP_DIR"
```

生产环境可以把 `BASE_URL` 改为指定版本：

```bash
BASE_URL="https://github.com/uvwt/agentdock/releases/download/vX.Y.Z"
```

## 环境文件

创建 `/etc/agentdock/agentdock.env`：

```bash
AGENTDOCK_HOST=127.0.0.1
AGENTDOCK_PORT=8765
AGENTDOCK_LOG_LEVEL=info
AGENTDOCK_AUTH_TOKEN=<replace-with-a-random-secret>
```

然后收紧权限：

```bash
sudo chown root:agentdock /etc/agentdock/agentdock.env
sudo chmod 0640 /etc/agentdock/agentdock.env
```

## systemd unit

创建 `/etc/systemd/system/agentdock.service`：

```ini
[Unit]
Description=AgentDock MCP server
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=agentdock
Group=agentdock
WorkingDirectory=/srv/agentdock/AgentDock
EnvironmentFile=/etc/agentdock/agentdock.env
ExecStart=/opt/agentdock/bin/agentdock \
  --host ${AGENTDOCK_HOST} \
  --port ${AGENTDOCK_PORT} \
  --log-level ${AGENTDOCK_LOG_LEVEL}
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

启动：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now agentdock
```

## 配对 NexusDock（可选）

如果这台设备需要使用 NexusDock Recall/Workflow 或加入 NexusDock fleet，先到 **NexusDock → 设置 → 系统与节点** 生成一次性配对码。使用与 AgentDock 服务相同的用户完成配对，再重启服务：

```bash
sudo -u agentdock -H /opt/agentdock/bin/agentdock nexus pair \
  --endpoint https://nexus.example.com \
  --code <pairing-code>
sudo systemctl restart agentdock
```

不要再把旧 Nexus endpoint/token 凭据写进 `agentdock.env`；当前 AgentDock 只从已配对的设备身份加载 NexusDock 配置。

## HTTPS 反代

Caddy 示例：

```caddyfile
agentdock.example.com {
  reverse_proxy 127.0.0.1:8765
}
```

客户端地址：

```text
https://agentdock.example.com/mcp
```

反代不要记录 Authorization Header。只有反代确实位于可信网段并负责重写 `X-Forwarded-For` 时，才配置 `AGENTDOCK_TRUSTED_PROXY_CIDRS`。

## OAuth（可选）

ChatGPT 等需要浏览器授权的客户端可启用 OAuth：

```bash
AGENTDOCK_OAUTH_ENABLED=true
AGENTDOCK_SERVER_URL=https://agentdock.example.com
AGENTDOCK_OAUTH_PASSWORD=<至少-12-个字符的授权密码>
AGENTDOCK_OAUTH_TOKEN_SECRET=<至少-32-字节的随机签名密钥>
```

`AGENTDOCK_SERVER_URL` 只填写 HTTPS Origin，不附加 `/mcp`。密码和签名密钥不要提交到版本控制。连接与端点检查见 [使用 ChatGPT 连接 AgentDock](../guides/chatgpt.md)。

## 更新

重新下载并校验目标 Release，除了替换二进制，还要按上面的安装步骤刷新并 bootstrap 该 Release 的 `share/agentdock/core-skills` Bundle，然后重启：

```bash
sudo systemctl restart agentdock
sudo systemctl status agentdock --no-pager
```

运行数据和环境文件位于独立目录，不会随二进制替换而删除。

## 验证

```bash
sudo systemctl status agentdock --no-pager
sudo journalctl -u agentdock -n 100 --no-pager
curl -fsS http://127.0.0.1:8765/healthz
```

验证 MCP 时应携带环境文件中的 Bearer Token，并确认公网反代不会丢弃 Authorization Header。源码构建只面向贡献者，见 [开发者指南](../contributing/development.md)。
