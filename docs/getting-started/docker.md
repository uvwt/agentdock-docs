# Docker 部署

Docker 是本机体验和受控服务器部署的推荐方式，适合文件、命令、Git、Skill、动态 MCP 和浏览器自动化。容器不能直接控制 macOS 宿主桌面。

普通用户直接拉取已发布镜像，不需要克隆源码或执行 `docker build`。

## 前置条件

- Docker Engine 或 Docker Desktop
- Docker Compose v2

## 快速启动

下载 Release 中的 Compose 文件并启动：

```bash
mkdir -p agentdock && cd agentdock
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/docker-compose.yml \
  -o docker-compose.yml

export AGENTDOCK_AUTH_TOKEN="$(openssl rand -hex 32)"
docker compose pull
docker compose up -d
```

默认入口：

```text
MCP     http://127.0.0.1:18766/mcp
Health  http://127.0.0.1:18766/healthz
```

验证进程：

```bash
curl -fsS http://127.0.0.1:18766/healthz
```

容器内 AgentDock 监听 `0.0.0.0:8765`，因此 Compose 强制要求 `AGENTDOCK_AUTH_TOKEN`。宿主端口只发布到 `127.0.0.1`，不会默认暴露到局域网或公网。

## 数据目录

Compose 配置挂载：

```text
./AgentDockHome  -> /root/.agentdock
./AgentDock      -> /root/AgentDock
```

前者保存 AgentDock 状态，后者是默认工作目录。AgentDock 不把工作目录当成安全沙箱；容器能访问哪些文件，取决于实际 volume 挂载。

## 浏览器镜像

浏览器增强版同样使用已发布镜像：

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/docker-compose.browser.yml \
  -o docker-compose.browser.yml

docker compose \
  -f docker-compose.yml \
  -f docker-compose.browser.yml \
  pull

docker compose \
  -f docker-compose.yml \
  -f docker-compose.browser.yml \
  up -d
```

该配置使用 `ghcr.io/uvwt/agentdock:browser-latest` 并启用 `AGENTDOCK_BROWSER_ENABLED=true`。浏览器会话仍应使用独立 profile，不要挂载日常浏览器的完整用户目录。

## 固定版本

生产环境可以通过环境变量固定镜像版本，避免 `latest` 自动变化：

```bash
export AGENTDOCK_IMAGE=ghcr.io/uvwt/agentdock:vX.Y.Z
export AGENTDOCK_BROWSER_IMAGE=ghcr.io/uvwt/agentdock:browser-vX.Y.Z
```

然后使用同一份 Compose 文件启动。

## 更新

```bash
docker compose pull
docker compose up -d --force-recreate
```

浏览器增强版更新时继续同时传入两份 Compose 文件。

## 日志与停止

```bash
docker compose logs -f
docker compose down
```

## 清理数据

`docker compose down` 不会删除挂载目录。只有确认不再需要其中的任务、Skill 环境、MCP 配置和项目文件后，才手动删除 `AgentDockHome/` 或 `AgentDock/`。

长期或公网部署还应阅读 [安全模型](../operations/security.md)。
