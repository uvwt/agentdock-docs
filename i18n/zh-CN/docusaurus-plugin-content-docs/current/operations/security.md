# 安全模型

AgentDock 是工具运行层，不是完整操作系统沙箱。安全性来自监听地址与认证、运行用户权限、Docker volume、systemd 服务用户、网络策略和每个工具自身的输入校验。

## 普通本机使用

只在自己的电脑上使用时，先遵守这些规则：

- 保持监听地址为 `127.0.0.1`。
- 不以管理员或 root 身份运行。
- 只挂载或授权任务需要的目录。
- 浏览器和桌面自动化使用独立 Profile，并对发送、删除、上传和授权操作进行确认。
- 不把 `.env`、Token、Cookie、截图或私有日志提交到仓库。

需要局域网或公网访问时，再继续阅读认证和反向代理章节。

## 认证

- 只监听回环地址时，可以在受信本机环境中无认证运行。
- 监听非回环地址时，必须配置 `AGENTDOCK_AUTH_TOKEN` 或启用 OAuth。
- 公网入口必须使用 HTTPS，不要直接暴露明文 HTTP `/mcp`。
- `/healthz` 只表示进程存活，不能证明 MCP 鉴权和工具调用正常。
- 日志不应记录 Authorization Header、OAuth Code、工具参数正文或秘密值。

Bearer Token：

```text
AGENTDOCK_AUTH_TOKEN=<random-secret>
```

OAuth：

```text
AGENTDOCK_OAUTH_ENABLED=true
AGENTDOCK_SERVER_URL=https://agentdock.example.com
AGENTDOCK_OAUTH_PASSWORD=<login-password>
AGENTDOCK_OAUTH_TOKEN_SECRET=<random-signing-secret>
```

## 文件与命令边界

相对路径从 `~/AgentDock` 解析，但默认工作目录不是强安全边界：

- 裸机部署受当前操作系统用户权限约束。
- Docker 部署受 volume 和容器用户约束。
- systemd 部署应使用专用低权限用户，并只授予必要项目目录权限。
- Windows 使用受保护 DACL；WSL 运行时受所选发行版默认 Linux 用户权限约束。

不要以管理员或 root 身份运行 AgentDock，除非任务确实需要且环境已隔离。

## Skill 与动态 MCP

- Skill 包不得包含 Token、Cookie、Session、私钥或设备登录态。
- Skill 和 MCP 的秘密应使用各自独立环境管理入口保存。
- `env_list` 只用于检查变量是否已配置，不应返回秘密值。
- 外部 MCP Server 是独立信任边界；注册前应审查来源、传输方式和工具能力。

## 浏览器与桌面

- 浏览器使用独立 Profile，不复用日常主 Profile。
- macOS Desktop Skill 运行在高权限登录会话中，只授予必要的屏幕录制和辅助功能权限。
- 上传、发送、删除和授权等动作需要明确确认和操作后验证。

## 反向代理

只有反代确实位于可信网段并会重写 `X-Forwarded-For` 时，才设置 `AGENTDOCK_TRUSTED_PROXY_CIDRS`。不要信任来自公网客户端自行提供的代理 Header。

## Artifact

截图和发布文件可能包含敏感信息。签名 URL 具有有效期，但在有效期内拿到链接的人仍可访问内容。发布前应检查文件内容，并避免公开浏览器登录态、桌面截图、环境文件和私有日志。
