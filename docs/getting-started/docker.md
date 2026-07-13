# Docker 部署

Docker 是本机体验和受控服务器部署的推荐方式，适合文件、命令、Git、Skill、动态 MCP 和浏览器自动化。容器不能直接控制 macOS 宿主桌面。

## 前置条件

- Docker Engine 或 Docker Desktop
- Docker Compose v2
- 已克隆的 AgentDock 源码仓库

## 快速启动

```bash
export AGENTDOCK_AUTH_TOKEN="$(openssl rand -hex 32)"
make docker-build
make docker-up
make smoke-docker
```

默认入口：

```text
MCP     http://127.0.0.1:18766/mcp
Health  http://127.0.0.1:18766/healthz
```

容器内 AgentDock 监听 `0.0.0.0:8765`，因此 Compose 强制要求 `AGENTDOCK_AUTH_TOKEN`。宿主端口只发布到 `127.0.0.1`，不会默认暴露到局域网或公网。

## 数据目录

仓库中的 Compose 配置挂载：

```text
./AgentDockHome  -> /root/.agentdock
./AgentDock      -> /root/AgentDock
```

前者保存 AgentDock 状态，后者是默认工作目录。AgentDock 不把工作目录当成安全沙箱；容器能访问哪些文件，取决于实际 volume 挂载。

## 浏览器镜像

构建带浏览器 runner 的镜像：

```bash
make docker-browser-build
```

使用 browser overlay 启动：

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.browser.yml \
  up -d
```

该配置会启用 `AGENTDOCK_BROWSER_ENABLED=true`。浏览器会话仍应使用独立 profile，不要挂载日常浏览器的完整用户目录。

## 日志与停止

```bash
make logs
make docker-down
```

## 清理数据

`docker compose down` 不会删除挂载目录。只有确认不再需要其中的任务、Skill 环境、MCP 配置和项目文件后，才手动删除 `AgentDockHome/` 或 `AgentDock/`。

长期或公网部署还应阅读 [安全模型](../operations/security.md)。
