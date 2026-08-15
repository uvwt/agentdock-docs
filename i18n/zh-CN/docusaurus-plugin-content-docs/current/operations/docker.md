# Docker 进阶配置

普通用户首次安装只需要完成 [Docker 安装](../getting-started/docker.md)。本页用于修改端口、选择其他镜像、挂载宿主目录、更新版本或迁移旧数据。

AgentDock 只使用一份 `docker-compose.yml`。浏览器镜像和 Cloudflare Tunnel 等可选能力通过环境变量与 Compose profile 启用，不再需要额外的 Compose 叠加文件。

## 镜像类型

AgentDock 发布三种 `linux/amd64` 和 `linux/arm64` 镜像：

| 标签 | 适用场景 |
| --- | --- |
| `latest` / `vX.Y.Z` | 默认运行镜像，包含 Node.js、Python、Git、pnpm 等常用工具 |
| `dev-latest` / `dev-vX.Y.Z` | 额外包含 Go、C、C++ 和 `pkg-config` 构建链 |
| `browser-latest` / `browser-vX.Y.Z` | 额外包含用于 Go 原生 CDP 自动化的 Chromium |

默认 Compose 使用正式运行镜像。需要在容器内编译 Go 或原生扩展时，可以在 `.env` 中增加：

```dotenv
AGENTDOCK_IMAGE=ghcr.io/uvwt/agentdock:dev-vX.Y.Z
```

然后重建容器：

```bash
docker compose up -d --force-recreate
```

`dev` 和 `browser` 是不同用途的镜像；browser 镜像不默认包含 Go 编译器。

## 启用浏览器自动化

在 `.env` 中切换到浏览器镜像并打开浏览器工具：

```dotenv
AGENTDOCK_IMAGE=ghcr.io/uvwt/agentdock:browser-latest
AGENTDOCK_BROWSER_ENABLED=true
```

然后重建：

```bash
docker compose up -d --force-recreate
```

Compose 已为 Chromium 配置 1 GB `shm_size`。浏览器 profile、截图和会话状态仍保存在 AgentDock 数据卷中。

浏览器会话应使用独立 `profile_id`，不要挂载日常浏览器的完整用户目录。

## Cloudflare Tunnel

Tunnel 服务写在同一份 `docker-compose.yml` 中，通过 Compose profile 启用。可选变量可参考仓库中的 [`.env.example`](https://raw.githubusercontent.com/uvwt/agentdock/main/.env.example)。

### Quick Tunnel

```bash
docker compose --profile cloudflare-quick up -d
docker compose logs -f cloudflared-quick
```

日志中的地址是临时地址，重启后会变化。客户端配置时追加 `/mcp`，认证继续使用 `.env` 中的 Bearer Token。

### Named Tunnel

先创建 Cloudflare Named Tunnel 和 Public Hostname。把以下值补充到现有部署 `.env`，不要覆盖当前 AgentDock Token：

```dotenv
AGENTDOCK_SERVER_URL=https://agent.example.com
TUNNEL_TOKEN=replace-with-cloudflare-tunnel-token
```

限制 `.env` 权限后启动 named profile：

```bash
chmod 600 .env
docker compose --profile cloudflare-named up -d
```

Cloudflare Public Hostname 的 Service 设置为 `http://agentdock:8765`。Compose 只把 `TUNNEL_TOKEN` 传给 `cloudflared-named` 容器；AgentDock 容器只接收 `AGENTDOCK_SERVER_URL` 和自身认证 Token，不会接收 Tunnel Token。Token 通过容器环境提供，不会出现在 `cloudflared` 命令参数中。

同一时间只启用一种 Tunnel profile。停止整个部署、移除 Tunnel 容器并保留 AgentDock 数据：

```bash
docker compose \
  --profile cloudflare-quick \
  --profile cloudflare-named \
  down
```

## 修改本机端口

默认 MCP 地址是 `http://127.0.0.1:8765/mcp`（宿主机与容器内都使用 `8765`）。端口冲突时，在 `.env` 中增加：

```dotenv
AGENTDOCK_PUBLISH_PORT=18767
```

然后重新启动：

```bash
docker compose up -d --force-recreate
```

新的 MCP 地址将变为 `http://127.0.0.1:18767/mcp`。

默认只监听本机回环地址。不要为了方便直接改成 `0.0.0.0`；需要局域网或公网访问时，先阅读 [安全模型](./security.md)。

## 数据保存在哪里

默认 Compose 使用两个 Docker named volume：

```text
agentdock_home       -> /home/agentdock/.agentdock
agentdock_workspace  -> /home/agentdock/AgentDock
```

- `agentdock_home`：任务、Skill、动态 MCP、环境配置和运行产物。
- `agentdock_workspace`：文件、命令和 Git 工具的默认工作目录。

查看实际卷名：

```bash
docker compose config --volumes
```

`docker compose down` 不会删除这些数据。

## 挂载宿主项目目录

需要让 AgentDock 直接操作宿主项目时，可以把工作目录改成 bind mount：

```yaml
services:
  agentdock:
    volumes:
      - agentdock_home:/home/agentdock/.agentdock
      - ./AgentDock:/home/agentdock/AgentDock
```

Linux 主机应确保容器用户 UID/GID `10001` 可以写入该目录：

```bash
mkdir -p AgentDock
sudo chown -R 10001:10001 AgentDock
```

只挂载任务需要的目录。AgentDock 不把工作目录当成安全沙箱；容器能访问哪些文件，取决于你实际挂载了什么。

## 固定版本

Compose 维护在仓库中，默认镜像标签为 `latest`。需要可复现部署时，请同时固定 Compose 的 git 修订（tag）和镜像标签。

从指定 git tag 下载 Compose：

```bash
VERSION=vX.Y.Z
curl -fL "https://raw.githubusercontent.com/uvwt/agentdock/$VERSION/docker-compose.yml" \
  -o docker-compose.yml
```

Windows 用户可把 `curl -fL ... -o ...` 换成 `Invoke-WebRequest ... -OutFile ...`。

在 `.env` 中固定镜像标签（runtime 或 browser）：

```dotenv
AGENTDOCK_IMAGE=ghcr.io/uvwt/agentdock:vX.Y.Z
# 浏览器镜像：
# AGENTDOCK_IMAGE=ghcr.io/uvwt/agentdock:browser-vX.Y.Z
# AGENTDOCK_BROWSER_ENABLED=true
```

## 更新 AgentDock

```bash
curl -fL https://raw.githubusercontent.com/uvwt/agentdock/main/docker-compose.yml \
  -o docker-compose.yml
docker compose pull
docker compose up -d --force-recreate
```

浏览器部署保留 `.env` 中的 `AGENTDOCK_IMAGE` 与 `AGENTDOCK_BROWSER_ENABLED`。Tunnel 部署在 `pull` 和 `up` 时继续带上同一 `--profile`。

更新后执行：

```bash
docker compose ps
```

确认状态重新变为 `healthy`。

## 从 v0.4.1 或更早版本迁移

旧版 Compose 默认把 `./AgentDockHome` 和 `./AgentDock` 直接挂载到容器。已有数据时不要直接删除这两个目录。

可以继续使用原目录，但要把容器内路径改成新版位置：

```yaml
services:
  agentdock:
    volumes:
      - ./AgentDockHome:/home/agentdock/.agentdock
      - ./AgentDock:/home/agentdock/AgentDock
```

Linux 主机还需要调整目录所有权：

```bash
sudo chown -R 10001:10001 AgentDockHome AgentDock
```

确认新容器能看到原任务、Skill、MCP 配置和项目文件后，再决定是否迁移到 named volume。不要让两个运行中的 AgentDock 实例同时使用同一份状态目录。

## 查看日志与停止服务

```bash
# 持续查看日志
docker compose logs -f

# 停止并移除容器，保留数据
docker compose down
```

若启用了 Tunnel profile，这些命令也要带上同一 profile，例如：

```bash
docker compose --profile cloudflare-named logs -f
docker compose --profile cloudflare-named down
```

## 删除全部 Docker 数据

只有确认不再需要任务、Skill、MCP 配置和项目文件后，才执行：

```bash
docker compose down -v
```

:::danger
**不可恢复：**`-v` 会删除 Compose 创建的 named volume。执行前先备份需要保留的数据。
:::
