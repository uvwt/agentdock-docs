# 使用 ChatGPT 连接 AgentDock

ChatGPT 通过自定义 MCP 插件访问远程 AgentDock 时，推荐使用 OAuth。连接过程中，ChatGPT 会自动发现 AgentDock 的 OAuth 元数据、注册客户端，并通过浏览器完成授权；不需要手动创建 Client ID 或 Client Secret。

AgentDock 当前支持 OAuth 2.0 Authorization Code、PKCE S256、动态客户端注册和 Refresh Token。

## 前提条件

开始前确认：

- AgentDock 已部署在 ChatGPT 能访问的公网地址。
- 公网入口使用有效的 HTTPS 证书。
- MCP 地址以 `/mcp` 结尾，例如 `https://agentdock.example.com/mcp`。
- 反向代理会原样转发 `/mcp`、`/register`、`/oauth/*` 和 `/.well-known/*`。

:::warning
不要把只监听本机的 `http://127.0.0.1:8765/mcp` 直接填入 ChatGPT。ChatGPT 无法访问你电脑或服务器的回环地址。
:::

## 1. 启用 OAuth

在 AgentDock 的环境文件、Docker Compose `environment` 或服务启动环境中加入：

```bash
AGENTDOCK_OAUTH_ENABLED=true
AGENTDOCK_SERVER_URL=https://agentdock.example.com
AGENTDOCK_OAUTH_PASSWORD=<用于连接授权的密码>
AGENTDOCK_OAUTH_TOKEN_SECRET=<至少-32-字节的随机签名密钥>
```

可以使用 OpenSSL 生成随机值：

```bash
openssl rand -base64 24   # 可用作授权密码
openssl rand -hex 32      # 可用作 Token 签名密钥
```

配置要求：

- `AGENTDOCK_SERVER_URL` 只填写 Origin，不包含 `/mcp`、其他路径、查询参数或 Fragment。
- 公网地址必须使用 `https://`。
- `AGENTDOCK_OAUTH_PASSWORD` 至少 12 个字符。
- `AGENTDOCK_OAUTH_TOKEN_SECRET` 至少 32 字节，并且应长期稳定保存；不要在每次重启时重新生成。

只使用 OAuth 时可以不配置 `AGENTDOCK_AUTH_TOKEN`。两种认证也可以同时启用，以兼容不同 MCP 客户端。

修改配置后重启 AgentDock。例如 systemd 部署：

```bash
sudo systemctl restart agentdock
sudo systemctl status agentdock --no-pager
```

Docker Compose 部署：

```bash
docker compose up -d
```

## 2. 验证 OAuth 入口

先确认健康检查和 OAuth 元数据可访问：

```bash
curl -fsS https://agentdock.example.com/healthz
curl -fsS https://agentdock.example.com/.well-known/oauth-authorization-server
curl -fsS https://agentdock.example.com/.well-known/oauth-protected-resource/mcp
```

第二个请求应返回包含以下端点的 JSON：

```text
authorization_endpoint  https://agentdock.example.com/oauth/authorize
token_endpoint          https://agentdock.example.com/oauth/token
registration_endpoint   https://agentdock.example.com/register
```

这里不需要手动访问 `/oauth/authorize`。它需要 ChatGPT 生成的客户端、回调地址和 PKCE 参数，直接打开通常只会得到参数错误。

## 3. 在 ChatGPT 中创建插件

1. 打开 ChatGPT，进入 **设置 > 插件 > 高级设置**。
2. 开启 **开发人员模式**。
3. 点击 **创建插件**。
4. 插件名称填写 `AgentDock`。
5. MCP Server URL 填写：

   ```text
   https://agentdock.example.com/mcp
   ```

6. 保存插件并发起连接。认证方式选择 OAuth，或让 ChatGPT 根据服务端元数据自动发现。
7. 浏览器跳转到 AgentDock 授权页后，确认页面显示的插件名称和回调域名确实来自刚刚发起的 ChatGPT 连接。
8. 输入 `AGENTDOCK_OAUTH_PASSWORD`，点击“验证并连接”。
9. 页面返回 ChatGPT 后，确认插件状态已经变为可用。

ChatGPT 会通过 AgentDock 的动态客户端注册端点自动获取 Client ID，因此不需要手工填写 Client ID、Client Secret、授权地址或 Token 地址。

## 4. 完成一次真实验证

在 ChatGPT 中新建对话并尝试：

```text
调用 AgentDock 查看当前设备信息。
```

也可以先做只读验证：

```text
调用 AgentDock 的 server_info，并告诉我服务版本、操作系统和当前认证方式。
```

连接成功不能只看 OAuth 页面是否跳回，还应确认 ChatGPT 能列出 AgentDock 工具并完成一次真实调用。

## 常见问题

### 没有跳转到授权页面

依次检查：

- MCP URL 是否准确以 `/mcp` 结尾。
- `AGENTDOCK_OAUTH_ENABLED` 是否为 `true`。
- `AGENTDOCK_SERVER_URL` 是否与浏览器实际访问的 HTTPS Origin 完全一致。
- `/.well-known/oauth-authorization-server` 和 `/.well-known/oauth-protected-resource/mcp` 是否能从公网访问。
- 反向代理是否放行 `/register`、`/oauth/authorize` 和 `/oauth/token`。

### 授权后页面一直转圈

OAuth 授权成功时，`POST /oauth/authorize` 会返回 `302` 跳转到 ChatGPT 的回调地址。`302` 本身是正常结果；如果页面没有继续跳转，重点检查反向代理、浏览器控制台和响应中的 `Location` Header 是否被改写或拦截。

### 提示密码错误

输入的是 `AGENTDOCK_OAUTH_PASSWORD`，不是 Bearer Token，也不是 `AGENTDOCK_OAUTH_TOKEN_SECRET`。连续失败会触发短时限流。

### 修改配置后仍然连接失败

重启 AgentDock 后，先重新验证三个公网端点。然后在 ChatGPT 中删除旧插件并重新创建，避免客户端继续使用旧的注册信息或授权状态。

## 安全建议

- 为 AgentDock 使用独立域名和有效 HTTPS 证书。
- 授权密码和 Token 签名密钥只保存在权限受限的环境文件或秘密管理系统中。
- 不要在 README、Compose 文件、聊天记录或截图中公开真实密码和签名密钥。
- 反向代理不要记录 Authorization Header、OAuth Code 或请求正文。
- AgentDock 会以其运行用户或容器权限操作真实资源，只授予完成任务所需的目录和命令权限。

完整环境变量说明见 [配置](../reference/configuration.md#oauth-配置)，公网部署见 [Linux 手动部署](../getting-started/vps.md)。
