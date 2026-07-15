# Linux 手动 systemd 部署

本页适合需要自己维护运行用户、Release 二进制、环境文件、systemd 和 HTTPS 反代的部署者。普通用户请先使用 [Linux 安装](./linux.md)。

手动部署同样使用预编译 Release，不需要在服务器上安装 Go 或构建源码。

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

需要 NexusDock Recall 或 Workflow 模板时，额外配置：

```bash
AGENTDOCK_NEXUS_ENDPOINT=https://nexus.example.com
AGENTDOCK_NEXUS_TOKEN=<replace-with-a-secret>
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

ChatGPT 等需要浏览器授权的 MCP 客户端推荐使用 OAuth。AgentDock 支持动态客户端注册、Authorization Code、PKCE S256 和 Refresh Token：

```bash
AGENTDOCK_OAUTH_ENABLED=true
AGENTDOCK_SERVER_URL=https://agentdock.example.com
AGENTDOCK_OAUTH_PASSWORD=<至少-12-个字符的授权密码>
AGENTDOCK_OAUTH_TOKEN_SECRET=<至少-32-字节的随机签名密钥>
```

公网 `AGENTDOCK_SERVER_URL` 必须使用 HTTPS，并且只填写 Origin，不附加 `/mcp`。签名密钥应稳定保存，不要在每次服务重启时重新生成。OAuth 与 Bearer Token 可以按客户端需求选择或同时启用，不要把密码或签名密钥提交到仓库。

配置并重启服务后，可先验证：

```bash
curl -fsS https://agentdock.example.com/.well-known/oauth-authorization-server
curl -fsS https://agentdock.example.com/.well-known/oauth-protected-resource/mcp
```

ChatGPT 中实际填写的 MCP 地址为 `https://agentdock.example.com/mcp`。完整操作见 [使用 ChatGPT 连接 AgentDock](../guides/chatgpt.md)。

## 更新

重新下载并校验目标 Release，覆盖 `/opt/agentdock/bin/agentdock`，然后重启：

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
