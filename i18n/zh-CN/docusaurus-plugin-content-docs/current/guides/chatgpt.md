# 使用 ChatGPT 连接 AgentDock

ChatGPT 可以通过自定义 MCP 插件驱动 AgentDock。连接成功后，网页版 ChatGPT 就能在 AgentDock 所在的电脑上读写文件、执行命令、使用 Skill、接入外部 MCP、控制浏览器，以及通过 AgentDock 调用 Codex、Claude、Grok 等编码工具。

大多数人最快的路径是桌面安装程序：开启公网地址，从控制面板复制 MCP 地址和 OAuth 密码，再在 ChatGPT 中创建插件。不需要手动创建 Client ID 或 Client Secret。

AgentDock 当前支持 OAuth 2.0 Authorization Code、PKCE S256、动态客户端注册和 Refresh Token。

## Windows 快速上手

这一路径使用 Windows 图形安装程序。macOS 应用的思路相同：开启公网地址，复制公网 MCP 地址和 OAuth 密码，再创建 ChatGPT 插件。

### 1. 安装 AgentDock

1. 打开 [AgentDock 最新版本](https://github.com/uvwt/agentdock/releases/latest)。
2. 根据电脑类型下载 Windows 安装包：
   - 大多数 Intel 或 AMD 电脑：`AgentDockSetup-amd64.exe`
   - Windows ARM 电脑：`AgentDockSetup-arm64.exe`
3. 运行安装程序，并按界面提示继续。
4. 选择连接方式时：
   - 还没有域名、想先连通时，选择 **临时公网地址**。
   - 有自己的域名、希望长期稳定使用时，建议选择 **使用自己的 Cloudflare 域名**。

![安装时选择临时公网地址或固定 Cloudflare 域名](/img/guides/chatgpt/01-install-connection-option.png)

完整安装说明见 [Windows 安装](../getting-started/windows.md)。macOS 用户可参考 [macOS 安装](../getting-started/macos.md)。

:::tip
教学和第一次连接时，临时 `trycloudflare.com` 地址就够用。临时地址可能在 Windows 或 Tunnel 重启后变化；变化后请从控制面板复制新的公网地址，并更新 ChatGPT 插件中的旧地址。
:::

### 2. 复制公网地址和 OAuth 密码

打开 AgentDock 控制面板，等待右上角显示运行正常。

在 **概览** 页复制：

- **公网 MCP 地址**，以 `/mcp` 结尾
- **OAuth 密码**

![控制面板概览页中的公网 MCP 地址和 OAuth 密码](/img/guides/chatgpt/02-copy-public-url-oauth.png)

凭据默认会被遮罩，需要时再点击“显示”。不要把密码放进截图、Issue 或公开聊天。

:::warning
不要把只监听本机的 `http://127.0.0.1:8765/mcp` 直接填入 ChatGPT。ChatGPT 无法访问你电脑上的回环地址。
:::

### 3. 在 ChatGPT 中创建插件

1. 在浏览器中打开 ChatGPT。
2. 进入 **设置 > 插件 > 高级设置**，开启 **开发人员模式**。

![ChatGPT 设置 > 插件中开启开发人员模式](/img/guides/chatgpt/03-chatgpt-developer-mode.png)

3. 返回 ChatGPT 首页的插件页面，点击 **➕** / **创建插件**。

![ChatGPT 插件页面并高亮添加按钮](/img/guides/chatgpt/04-plugins-add-button.png)

4. 插件名称填写 `AgentDock`。
5. MCP Server URL 填写刚才复制的公网地址，例如：

   ```text
   https://your-public-host.example/mcp
   ```

![创建插件对话框中填写名称和公网 MCP 地址](/img/guides/chatgpt/05-fill-name-and-url.png)

6. 点击创建并发起连接。
7. 浏览器跳转到 AgentDock 授权页后，填入刚才复制的 OAuth 密码并完成授权。

![AgentDock 授权页输入 OAuth 密码](/img/guides/chatgpt/06-create-enter-password.png)

8. 返回 ChatGPT，确认 AgentDock 插件已经可用。

ChatGPT 会自动发现 AgentDock 的 OAuth 元数据、注册客户端，并通过浏览器完成授权。不需要手工填写 Client ID、Client Secret、授权地址或 Token 地址。

### 4. 完成一次真实验证

在 ChatGPT 中新建对话并尝试：

```text
调用 AgentDock 查看当前设备信息。
```

也可以先做只读验证：

```text
调用 AgentDock 的 agentdock_context，并告诉我 AgentDock 版本、操作系统、路径模型，以及当前可用的 Skill 和动态 MCP 能力索引。
```

连接成功不能只看 OAuth 页面是否跳回，还应确认 ChatGPT 能列出 AgentDock 工具并完成一次真实调用。

连通之后，你就可以让 ChatGPT 安装 Skill、接入外部 MCP、控制浏览器，或通过 AgentDock 驱动本机上的编码工具。

## 远程或手动部署的前提

如果你是在服务器、Docker 主机或反向代理后自行部署 AgentDock，请先确认：

- AgentDock 已部署在 ChatGPT 能访问的公网地址。
- 公网入口使用有效的 HTTPS 证书。
- MCP 地址以 `/mcp` 结尾，例如 `https://agentdock.example.com/mcp`。
- 反向代理会原样转发 `/mcp`、`/register`、`/oauth/*` 和 `/.well-known/*`。

桌面安装程序在选择临时或固定公网地址后，已经满足第一次连接所需条件。

## 手动启用 OAuth

当你不通过桌面安装程序运行 AgentDock，或需要自己设置 OAuth 环境变量时，使用本节。

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

## 验证 OAuth 入口

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

## 常见问题

### 没有跳转到授权页面

依次检查：

- MCP URL 是否准确以 `/mcp` 结尾。
- 是否已开启公网访问，并且 ChatGPT 中填写的是控制面板显示的公网地址。
- 手动部署时，`AGENTDOCK_OAUTH_ENABLED` 是否为 `true`。
- `AGENTDOCK_SERVER_URL` 是否与浏览器实际访问的 HTTPS Origin 完全一致。
- `/.well-known/oauth-authorization-server` 和 `/.well-known/oauth-protected-resource/mcp` 是否能从公网访问。
- 反向代理是否放行 `/register`、`/oauth/authorize` 和 `/oauth/token`。

### 授权后页面一直转圈

OAuth 授权成功时，`POST /oauth/authorize` 会返回 `302` 跳转到 ChatGPT 的回调地址。`302` 本身是正常结果；如果页面没有继续跳转，重点检查反向代理、浏览器控制台和响应中的 `Location` Header 是否被改写或拦截。

### 提示密码错误

输入的是控制面板中的 OAuth 密码，或手动部署时的 `AGENTDOCK_OAUTH_PASSWORD`，不是 Bearer Token，也不是 `AGENTDOCK_OAUTH_TOKEN_SECRET`。连续失败会触发短时限流。

### 修改配置后仍然连接失败

重启 AgentDock 后，先重新验证公网端点。然后在 ChatGPT 中删除旧插件并重新创建，避免客户端继续使用旧的注册信息或授权状态。

如果使用的是临时公网地址，且地址已经变化，请先在 ChatGPT 插件中更新 MCP 地址，再重新连接。

## 安全建议

- 长期使用时优先使用固定域名和有效 HTTPS 证书。
- 授权密码和 Token 签名密钥只保存在权限受限的环境文件或秘密管理系统中。
- 不要在 README、Compose 文件、聊天记录或截图中公开真实密码和签名密钥。
- 反向代理不要记录 Authorization Header、OAuth Code 或请求正文。
- AgentDock 会以其运行用户或容器权限操作真实资源，只授予完成任务所需的目录和命令权限。

完整环境变量说明见 [配置](../reference/configuration.md#oauth-配置)，不使用桌面安装程序时的公网部署见 [Linux 手动部署](../getting-started/vps.md)。
