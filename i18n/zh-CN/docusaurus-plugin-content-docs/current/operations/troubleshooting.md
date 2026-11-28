# 故障排查

## 先检查这些

先确认：

1. AgentDock 进程或容器仍在运行。
2. 本机 `http://127.0.0.1:8765/healthz` 可以访问。
3. MCP 客户端地址以 `/mcp` 结尾。
4. 客户端使用的是当前 Bearer Token，或已经完成 OAuth。
5. 实际运行的 AgentDock 版本就是你预期的版本。

反馈问题时尽量提供安装方式、操作系统、AgentDock 版本、客户端名称和相关错误日志，并隐藏 Token 和私有地址。

## 客户端已连接但看不到工具

刷新或重新连接 MCP，并新开会话清理客户端缓存的旧工具 Schema。确认认证后，再实际完成一次 MCP 连接，不要只根据 `/healthz` 判断。通过 NexusDock 连接时，如果客户端缓存缺少节点最新工具或返回 `TOOL_CONTRACT_MISMATCH`，可使用 `node_tool_search` 和 `node_tool_call` 作为兼容回退。

## NexusDock 配对与远程连接问题

- **配对码无法使用**：配对码为 6 位数字，有效期 5 分钟且仅可使用一次。如果已过期或已提交，请在 NexusDock 中重新生成配对码再配对。
- **设备未出现或显示离线**：确认目标电脑上的 AgentDock 正在运行、设备未休眠，且 NexusDock 服务地址填写为 `https://mcp.nexusdock.co/`（或你的自托管 NexusDock HTTPS 地址），重连后刷新 **设备** 页面。
- **OAuth 授权失败或被取消**：回到 AI 客户端重新发起连接，并确认登录的是正确的 NexusDock 账号；如该客户端曾授权过，可先在 NexusDock 设置中撤销授权再重新连接。
- **MCP 访问令牌失效**：重置 MCP 访问令牌后旧令牌会立即失效，请将新令牌（仅显示一次）更新到所有使用旧令牌的客户端。

如果 NexusDock 在报错中展示了请求 ID，反馈问题时请附上该请求 ID，但严禁发送访问令牌、OAuth 凭据、Cookie、配对码、设备 Token、私钥或敏感 Recall 内容。

## 401 Unauthorized

确认客户端发送的是当前 Bearer Token，或重新完成 OAuth。如果经过反向代理，确认代理没有丢掉 `Authorization` header。

## 公网地址无法访问

使用 Cloudflare Tunnel 时检查：

- Tunnel 是否在线；
- 原生安装通常转发到 `http://127.0.0.1:8765`；
- Docker 转发到 `http://agentdock:8765`；
- AgentDock 公网地址只填写 HTTPS Origin，不带 `/mcp`；
- MCP 客户端地址再追加 `/mcp`。

Cloudflare 返回 `502` 通常说明 Tunnel 本身可达，但无法连接本机 AgentDock。

## Docker 仍在使用旧镜像

```bash
docker compose pull
docker compose up -d --force-recreate
docker compose ps
```

新容器没有恢复 healthy 时查看 `docker compose logs`。

## 动态 MCP 无法连接

确认连接已经启用、所需环境变量已经配置，并且上游 URL 或本地命令可以访问。修改环境后重新刷新 MCP 连接。

## 浏览器无法启动

确认已经安装 Chrome、Chromium 或 Edge。Docker 使用 browser 镜像并启用浏览器工具；原生无界面 Linux 自动识别失败时配置浏览器可执行文件路径。

## macOS 桌面操作没有效果

确认 AgentDock 运行在当前登录会话中，并且实际承载 AgentDock 的应用已经获得屏幕录制和辅助功能权限。执行后重新检查屏幕状态，不要只看命令是否成功。

## Linux 服务无法启动

```bash
sudo systemctl status agentdock --no-pager
sudo journalctl -u agentdock -n 100 --no-pager
```

常见原因包括端口冲突、环境变量错误、文件权限错误，或服务账号无法访问工作目录。
