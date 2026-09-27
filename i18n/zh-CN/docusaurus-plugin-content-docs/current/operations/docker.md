# Docker

首次安装请看 [Docker 安装](../getting-started/docker.md)。本页只保留安装完成后最常修改的配置。

## 镜像

AgentDock 为 `amd64` 和 `arm64` 提供这些 Linux 镜像：

| 镜像 | 用途 |
| --- | --- |
| `latest` / `vX.Y.Z` | 普通运行环境 |
| `dev-latest` / `dev-vX.Y.Z` | 增加 Go 和原生编译工具 |
| `browser-latest` / `browser-vX.Y.Z` | 增加 Chromium 浏览器自动化 |

通过 `.env` 选择其他镜像：

```dotenv
AGENTDOCK_IMAGE=ghcr.io/uvwt/agentdock:browser-latest
AGENTDOCK_BROWSER_ENABLED=true
```

浏览器行为见 [使用浏览器](../guides/browser-control.md)。

## 端口与数据

默认 MCP 地址为 `http://127.0.0.1:8765/mcp`。修改宿主机端口：

```dotenv
AGENTDOCK_PUBLISH_PORT=18767
```

默认 Compose 使用两个持久化卷：

```text
agentdock_home       -> /home/agentdock/.agentdock
agentdock_workspace  -> /home/agentdock/AgentDock
```

`docker compose down` 不会删除这些数据。

## 挂载宿主机项目

需要直接操作宿主机文件时，可以把 workspace volume 换成 bind mount：

```yaml
services:
  agentdock:
    volumes:
      - agentdock_home:/home/agentdock/.agentdock
      - ./AgentDock:/home/agentdock/AgentDock
```

Linux 上要确保容器 UID/GID `10001` 对挂载目录有写权限。只挂载实际需要访问的路径。

## 公网访问

保持普通服务只在本机可访问，需要远程连接时再使用受支持的 Cloudflare Tunnel profile。Tunnel 配置统一见 [公网访问](./public-access.md)。

## 更新与日志

```bash
docker compose pull
docker compose up -d --force-recreate
docker compose ps
```

查看日志：

```bash
docker compose logs -f
```

停止容器但保留数据：

```bash
docker compose down
```

只有明确要同时删除 AgentDock 状态和工作目录数据时才删除 volumes：

```bash
docker compose down -v
```
