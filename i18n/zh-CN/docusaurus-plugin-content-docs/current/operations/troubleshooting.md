# 故障排查

## 先做这三步

1. 确认 AgentDock 进程或容器仍在运行。
2. 使用安装指南中的端口访问 `/healthz`。
3. 检查客户端 MCP 地址是否以 `/mcp` 结尾，以及 Token 是否与当前实例一致。

连接仍然失败时，记录以下信息再继续排查：

- 使用的安装方式和操作系统。
- AgentDock 版本。
- 客户端名称和 MCP 地址，隐藏 Token。
- 服务日志中的具体错误。
- 问题发生前最后一次修改。

不要只提供“不能用”的截图，也不要公开环境文件或完整请求头。

## 服务运行，但客户端看不到工具

先确认实际进程和健康状态：

```bash
curl -fsS http://127.0.0.1:8765/healthz
```

然后检查：

1. 客户端 MCP URL 是否指向 `/mcp`。
2. Bearer Token 或 OAuth 是否与服务端一致。
3. 客户端是否仍缓存旧连接；重新连接或新建会话。
4. 实际运行二进制是否是刚安装或刚更新的版本。

`/healthz` 正常只代表进程存活，不能替代一次真实 MCP 初始化和工具调用。

## 返回 401 Unauthorized

- 确认服务是否配置 `AGENTDOCK_AUTH_TOKEN`。
- 确认客户端发送 `Authorization: Bearer <token>`。
- 检查反代是否保留 Authorization Header。
- 不要把 Token 粘贴到公开日志或 Issue。

## Docker 仍运行旧镜像

从 `main` 重新下载最新 Compose 文件，再拉取和重建容器：

```bash
curl -fL https://raw.githubusercontent.com/uvwt/agentdock/main/docker-compose.yml \
  -o docker-compose.yml
docker compose pull
docker compose up -d --force-recreate
```

浏览器部署保留 `.env` 中的 `AGENTDOCK_IMAGE` 与 `AGENTDOCK_BROWSER_ENABLED`。再检查 `docker compose ps`、`docker compose images` 和容器日志，确认镜像标签、摘要和健康状态符合预期。

## 动态 MCP 无法调用

依次检查：

1. `mcp_manage list` 中 Server 是否启用。
2. `mcp_manage env_list` 中所需变量是否已配置。
3. 更新环境后是否执行了 `refresh`。
4. HTTP URL、stdio 命令、工作目录和上游服务是否可达。
5. `mcp_tool_search` 能否列出工具，再用 `mcp_tool_inspect` 检查参数。

不要在错误信息中回显完整 Token、Cookie 或 Header。

## 浏览器会话启动失败

- macOS 优先选择系统 `browser=chrome`。
- Windows 可选择 Chrome 或 Edge。
- 确认 browser runner 和 `playwright-core` 已安装。
- Docker 通过 `AGENTDOCK_IMAGE` 使用 browser 镜像，并设置 `AGENTDOCK_BROWSER_ENABLED=true`。
- CDP 模式确认调试端口只监听回环地址且浏览器已按调试模式启动。

## 桌面操作没有效果

- 确认 AgentDock 在当前 macOS 登录会话中运行。
- 检查屏幕录制和辅助功能权限。
- 重新读取当前激活的 `desktop` Skill 文档。
- 操作前后分别观察应用状态或截图，不要只依赖命令返回成功。
- 坐标可能因窗口位置、缩放或多显示器变化而失效，应优先使用辅助功能元素。

## Git push 失败

```bash
git remote -v
git status --short --branch
git config --show-origin --get credential.helper
```

确认远端地址、当前分支、凭据和仓库权限。不要把访问 Token 写进 remote URL、README 或终端截图。

## Linux 服务启动失败

```bash
sudo systemctl status agentdock --no-pager
sudo journalctl -u agentdock -n 100 --no-pager
```

常见原因包括环境文件权限、二进制路径错误、端口占用、运行用户无权访问工作目录，以及非回环监听但未配置认证。
