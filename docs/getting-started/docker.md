# Docker 部署

Docker 是本机体验和受控服务器部署的推荐方式，适合文件、命令、Git、Skill、动态 MCP 和浏览器自动化。容器不能直接控制 macOS 宿主桌面。

普通用户直接拉取已发布镜像，不需要克隆源码或执行 `docker build`。正式镜像默认以非 root 用户 `agentdock`（UID/GID `10001`）运行。

## 前置条件

- Docker Engine 或 Docker Desktop
- Docker Compose v2

## 快速启动

下载最新 Release 中已经固定镜像版本的 Compose 文件并启动：

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

验证容器和应用健康状态：

```bash
docker compose ps
curl -fsS http://127.0.0.1:18766/healthz
```

容器内 AgentDock 监听 `0.0.0.0:8765`，因此 Compose 强制要求 `AGENTDOCK_AUTH_TOKEN`。宿主端口只发布到 `127.0.0.1`，不会默认暴露到局域网或公网。

默认宿主端口是 `18766`。端口冲突时可以在启动前覆盖：

```bash
export AGENTDOCK_PUBLISH_PORT=18767
docker compose up -d
```

只有明确需要绑定其他地址时才设置 `AGENTDOCK_PUBLISH_HOST`，并同时检查认证、网络策略和 HTTPS 反代。

## 数据卷

默认 Compose 使用两个 Docker named volume：

```text
agentdock_home       -> /home/agentdock/.agentdock
agentdock_workspace  -> /home/agentdock/AgentDock
```

前者保存 AgentDock 状态、Skill 环境、任务和 MCP 配置，后者是文件、命令和 Git 工具的默认工作目录。named volume 会继承镜像中的非 root 所有权，避免 Linux 主机上常见的 UID 不匹配问题。

查看 Compose 声明的卷：

```bash
docker compose config --volumes
```

AgentDock 不把工作目录当成安全沙箱；容器能访问哪些文件，取决于实际 volume 挂载。

### 挂载宿主项目目录

需要直接操作宿主项目时，可以把工作目录改成 bind mount：

```yaml
services:
  agentdock:
    volumes:
      - agentdock_home:/home/agentdock/.agentdock
      - ./AgentDock:/home/agentdock/AgentDock
```

Linux 主机应先让 UID/GID `10001` 可以写入该目录：

```bash
mkdir -p AgentDock
sudo chown -R 10001:10001 AgentDock
```

不要挂载超出任务需要的宿主目录。

## 镜像类型

AgentDock 发布三种多架构镜像：

| 标签 | 用途 |
| --- | --- |
| `latest` / `vX.Y.Z` | 正式运行镜像，包含 Node.js、Python、Git、pnpm 等常用工具，不包含 Go 编译器 |
| `dev-latest` / `dev-vX.Y.Z` | 在正式镜像基础上增加 Go、C、C++ 和 `pkg-config` 构建链 |
| `browser-latest` / `browser-vX.Y.Z` | 在正式镜像基础上增加 Chromium 和 browser runner |

需要在容器内构建 Go 或原生扩展时，可以覆盖默认镜像：

```bash
export AGENTDOCK_IMAGE=ghcr.io/uvwt/agentdock:dev-vX.Y.Z
docker compose up -d
```

`dev` 和 `browser` 是不同用途的镜像；browser 镜像不默认包含 Go 编译器。

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

Release 中的 overlay 已固定到同一版本的 `browser-vX.Y.Z` 镜像，并启用 `AGENTDOCK_BROWSER_ENABLED=true`。镜像内置系统 Chromium 和只读 browser runner；浏览器 profile、截图与会话状态仍保存在 `agentdock_home` 卷中。

浏览器会话应使用独立 `profile_id`，不要挂载日常浏览器的完整用户目录。

## 固定版本

下载指定 Release 的 Compose 文件即可固定版本：

```bash
VERSION=vX.Y.Z
curl -fL "https://github.com/uvwt/agentdock/releases/download/$VERSION/docker-compose.yml" \
  -o docker-compose.yml
curl -fL "https://github.com/uvwt/agentdock/releases/download/$VERSION/docker-compose.browser.yml" \
  -o docker-compose.browser.yml
```

也可以显式覆盖镜像：

```bash
export AGENTDOCK_IMAGE=ghcr.io/uvwt/agentdock:vX.Y.Z
export AGENTDOCK_BROWSER_IMAGE=ghcr.io/uvwt/agentdock:browser-vX.Y.Z
# 需要完整构建链时：
export AGENTDOCK_IMAGE=ghcr.io/uvwt/agentdock:dev-vX.Y.Z
```

## 从旧版 Compose 迁移

`v0.4.1` 及更早的 Compose 默认把 `./AgentDockHome` 和 `./AgentDock` 直接挂载到容器。新版默认改用 named volume，避免非 root 用户与宿主 UID 冲突。

已有数据时不要直接删除旧目录。可以继续使用 bind mount，并先调整所有权：

```yaml
services:
  agentdock:
    volumes:
      - ./AgentDockHome:/home/agentdock/.agentdock
      - ./AgentDock:/home/agentdock/AgentDock
```

```bash
sudo chown -R 10001:10001 AgentDockHome AgentDock
```

确认新容器能看到原任务、Skill、MCP 配置和项目文件后，再决定是否迁移到 named volume。不要同时把同一目录挂载到多个运行中的 AgentDock 实例。

## 更新

Release Compose 默认固定版本，因此更新时先重新下载最新文件：

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/docker-compose.yml \
  -o docker-compose.yml

docker compose pull
docker compose up -d --force-recreate
```

浏览器增强版还要重新下载 `docker-compose.browser.yml`，随后继续同时传入两份 Compose 文件。

## 日志与停止

```bash
docker compose logs -f
docker compose down
```

## 清理数据

`docker compose down` 不会删除 named volume。只有确认不再需要其中的任务、Skill 环境、MCP 配置和项目文件后，才执行：

```bash
docker compose down -v
```

这是不可恢复的数据删除操作，执行前先备份需要保留的内容。

长期或公网部署还应阅读 [安全模型](../operations/security.md)。
